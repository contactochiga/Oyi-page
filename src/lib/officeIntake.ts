// Server-only bridge from Oyi-page's enquiry forms into Ochiga Office's
// canonical intake contract — the same contract Ochiga-website uses via
// lib/office/intakeClient.ts (POST /api/office/intake). Office remains the
// CRM source of truth; this module only ever sends data there and never
// reads it back. The credential here is never sent to the browser.
//
// Reliability (Phase 0): every submission carries a stable idempotency key, so retrying is always safe — Office files a key at most once
// and answers "duplicate" afterwards. A submission Office could not finish is retried here (bounded), then in the background after the
// visitor has their answer, and finally can be recovered by staff from the e-mail with a signed recovery code (see recoveryCode()).
import { createHash, createHmac } from "node:crypto";

const DEFAULT_OFFICE_BASE_URL = "https://ochiga-lead-agents.onrender.com";
const DEFAULT_OFFICE_APP_URL = "https://office.ochiga.com.ng";
const ATTEMPT_TIMEOUT_MS = 4_000;
const FOREGROUND_DELAYS_MS = [0, 600, 1_500];
const BACKGROUND_DELAYS_MS = [3_000, 8_000, 15_000];

function officeBaseUrl(): string {
  return (process.env.OCHIGA_OFFICE_BASE_URL || DEFAULT_OFFICE_BASE_URL).replace(/\/$/, "");
}

function officeAppUrl(): string {
  return (process.env.OCHIGA_OFFICE_APP_URL || DEFAULT_OFFICE_APP_URL).replace(/\/$/, "");
}

function officeApiKey(): string {
  return String(process.env.OCHIGA_OFFICE_API_KEY || "").trim();
}

export type OfficeIntakeEnvelope = {
  request_id: string;
  idempotency_key: string;
  source_channel: "website";
  source_site: "oyi_website";
  source_page: string;
  source_form: string;
  business_unit: string;
  inquiry_type: string;
  contact: { name: string; email: string; phone: string };
  organization: { name: string; location: string };
  payload: { message: string };
  metadata?: Record<string, unknown>;
};

// synced: filed with its CRM records · duplicate: already filed earlier · pending: Office has it (or is filing it) but the CRM side is not
// finished yet — safe to retry · failed: not delivered · not_configured: no Office credential on this deployment
export type OfficeDeliveryStatus = "synced" | "duplicate" | "pending" | "failed" | "not_configured";

export type OfficeIntakeResult = {
  ok: boolean;
  skipped: boolean;
  status?: number;
  duplicate?: boolean;
  retryable?: boolean;
  delivery: OfficeDeliveryStatus;
  reason?: string;
};

// One attempt. Never throws — callers decide how a failed/skipped Office sync affects the overall request outcome.
export async function postOfficeIntakeEnvelope(envelope: OfficeIntakeEnvelope, timeoutMs = ATTEMPT_TIMEOUT_MS): Promise<OfficeIntakeResult> {
  const apiKey = officeApiKey();
  if (!apiKey) {
    return { ok: false, skipped: true, delivery: "not_configured", reason: "office_not_configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${officeBaseUrl()}/api/office/intake`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "x-request-id": envelope.request_id,
      },
      body: JSON.stringify(envelope),
      signal: controller.signal,
    });
    const rawText = await response.text();
    let json: Record<string, unknown> | null = null;
    try {
      json = rawText ? JSON.parse(rawText) : null;
    } catch {
      json = null;
    }
    const errorText = typeof json?.error === "string" ? json.error : "";
    if (response.status === 202 || (response.ok && json?.crm_synced === false)) {
      return { ok: false, skipped: false, status: response.status, retryable: true, delivery: "pending", reason: "office_crm_incomplete" };
    }
    if (response.ok) {
      const duplicate = Boolean(json?.duplicate);
      return { ok: true, skipped: false, status: response.status, duplicate, delivery: duplicate ? "duplicate" : "synced" };
    }
    // 409 intake_in_progress / 503 intake_unavailable / 5xx / 429 are worth retrying with the same key; 401/403/400/409-conflict are not
    const retryable = Boolean(json?.retryable) || response.status >= 500 || response.status === 429;
    return { ok: false, skipped: false, status: response.status, retryable, delivery: errorText === "intake_in_progress" ? "pending" : "failed", reason: errorText || `office_http_${response.status}` };
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      retryable: true,
      delivery: "failed",
      reason: error instanceof Error && error.name === "AbortError" ? "office_timeout" : "office_unreachable",
    };
  } finally {
    clearTimeout(timeout);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function attemptAll(envelope: OfficeIntakeEnvelope, delays: number[], label: string): Promise<OfficeIntakeResult> {
  let last: OfficeIntakeResult = { ok: false, skipped: false, delivery: "failed", reason: "not_attempted" };
  for (let i = 0; i < delays.length; i += 1) {
    if (delays[i]) await sleep(delays[i]);
    // a fresh request id per attempt; the idempotency key is what makes the attempts the same submission
    last = await postOfficeIntakeEnvelope({ ...envelope, request_id: `${envelope.request_id}-${label}${i + 1}` });
    if (last.ok || last.skipped || !last.retryable) return last;
  }
  return last;
}

/** Bounded foreground delivery (a few seconds at most). */
export function deliverToOffice(envelope: OfficeIntakeEnvelope): Promise<OfficeIntakeResult> {
  return attemptAll(envelope, FOREGROUND_DELAYS_MS, "f");
}

/** Background continuation after the visitor already has an answer (scheduled with next/server `after`). Logs the outcome only. */
export async function continueOfficeDelivery(envelope: OfficeIntakeEnvelope): Promise<void> {
  const result = await attemptAll(envelope, BACKGROUND_DELAYS_MS, "b");
  const label = result.ok ? "delivered" : "still_not_delivered";
  console.log(`[office-intake] background ${label} (${envelope.request_id}): ${result.delivery}${result.reason ? ` ${result.reason}` : ""}`);
}

// A recovery code lets a signed-in Office staff member file this exact submission later (Office: GET/POST /api/lead-agents/admin/intake/recover).
// "v1.<base64url {envelope, issued_at}>.<base64url HMAC-SHA256>", keyed by the hex SHA-256 digest of this site's scoped Office key — the value
// Office already holds — so no extra secret is needed and a code cannot be forged without the key. Returns null when no key is configured.
export function recoveryCode(envelope: OfficeIntakeEnvelope, issuedAt = new Date()): string | null {
  const apiKey = officeApiKey();
  if (!apiKey) return null;
  const body = Buffer.from(JSON.stringify({ envelope, issued_at: issuedAt.toISOString() })).toString("base64url");
  const keyDigest = createHash("sha256").update(apiKey).digest("hex");
  const signature = createHmac("sha256", keyDigest).update(`v1.${body}`).digest("base64url");
  return `v1.${body}.${signature}`;
}

export function recoveryUrl(envelope: OfficeIntakeEnvelope): string | null {
  const code = recoveryCode(envelope);
  // the code travels in the URL FRAGMENT: browsers never send it to a server, so it is never written to an access log
  return code ? `${officeAppUrl()}/api/lead-agents/admin/intake/recover#code=${encodeURIComponent(code)}` : null;
}
