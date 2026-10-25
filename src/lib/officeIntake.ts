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
// Delivery budget (both routes: maxDuration = 60 s, and the `after()` continuation runs inside that same invocation).
// Office files a website enquiry in about 4 s in production (measured 4.14 s on 2026-10-25: several sequential CRM writes), more for
// richer forms, so the FIRST attempt is given 20 s; the retries that follow are short because by then Office either has the receipt
// (answers duplicate / in_progress at once) or is unreachable. Every attempt is clipped to an absolute deadline:
//   foreground  <= 36 s after the delivery started (worst case 20 + 1 + 6 + 2 + 6 = 35 s), leaving room for the two emails;
//   background  <= 55 s after the delivery started (5 s margin under maxDuration).
type AttemptStep = { delayMs: number; timeoutMs: number };
const ATTEMPT_TIMEOUT_MS = 20_000;
const FOREGROUND_PLAN: AttemptStep[] = [
  { delayMs: 0, timeoutMs: ATTEMPT_TIMEOUT_MS },
  { delayMs: 1_000, timeoutMs: 6_000 },
  { delayMs: 2_000, timeoutMs: 6_000 },
];
const BACKGROUND_PLAN: AttemptStep[] = [
  { delayMs: 3_000, timeoutMs: 6_000 },
  { delayMs: 6_000, timeoutMs: 6_000 },
  { delayMs: 10_000, timeoutMs: 6_000 },
];
const FOREGROUND_DEADLINE_MS = 36_000;
const BACKGROUND_DEADLINE_MS = 55_000;
const MIN_ATTEMPT_MS = 2_000;

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

// What Office itself answered on one attempt, kept for logs and diagnostics (the `delivery` classification can differ: a duplicate that
// follows this delivery's own unanswered attempt is reported as synced).
export type OfficeOutcome =
  | "filed" | "duplicate" | "crm_incomplete" | "in_progress" | "unavailable" | "key_reused" | "unauthorized" | "rejected"
  | "http_error" | "timeout" | "unreachable" | "deadline";

export type OfficeIntakeResult = {
  ok: boolean;
  skipped: boolean;
  status?: number;
  duplicate?: boolean;
  retryable?: boolean;
  delivery: OfficeDeliveryStatus;
  reason?: string;
  officeOutcome?: OfficeOutcome;
  attempts?: OfficeOutcome[];
  startedAt?: number;
};

function outcomeOf(status: number, errorText: string): OfficeOutcome {
  if (errorText === "intake_in_progress") return "in_progress";
  if (errorText === "idempotency_key_reused") return "key_reused";
  if (errorText === "intake_unavailable" || status === 503) return "unavailable";
  if (status === 401 || status === 403) return "unauthorized";
  if (status >= 400 && status < 500) return "rejected";
  return "http_error";
}

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
      return { ok: false, skipped: false, status: response.status, retryable: true, delivery: "pending", reason: "office_crm_incomplete", officeOutcome: "crm_incomplete" };
    }
    if (response.ok) {
      const duplicate = Boolean(json?.duplicate);
      return { ok: true, skipped: false, status: response.status, duplicate, delivery: duplicate ? "duplicate" : "synced", officeOutcome: duplicate ? "duplicate" : "filed" };
    }
    // 409 intake_in_progress / 503 intake_unavailable / 5xx / 429 are worth retrying with the same key; 401/403/400/409-conflict are not
    const retryable = Boolean(json?.retryable) || response.status >= 500 || response.status === 429;
    return { ok: false, skipped: false, status: response.status, retryable, delivery: errorText === "intake_in_progress" ? "pending" : "failed", reason: errorText || `office_http_${response.status}`, officeOutcome: outcomeOf(response.status, errorText) };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "AbortError";
    return {
      ok: false,
      skipped: false,
      retryable: true,
      delivery: "failed",
      reason: timedOut ? "office_timeout" : "office_unreachable",
      officeOutcome: timedOut ? "timeout" : "unreachable",
    };
  } finally {
    clearTimeout(timeout);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Runs the plan until Office gives a definite answer or the absolute deadline would be passed. Every attempt after the first follows an
// UNANSWERED attempt of this same delivery (timeout, unreachable, 5xx/429, in_progress, CRM incomplete); Office answering "duplicate" to
// it means the receipt for this exact submission (same key, same content: a different content answers key_reused) is COMPLETED, i.e.
// this delivery's own earlier attempt recorded it, so it is reported as synced. A duplicate on the very first attempt of a request is a
// genuine resubmission and stays "duplicate". `retried` marks a continuation whose first attempt already follows such an attempt.
async function attemptAll(envelope: OfficeIntakeEnvelope, plan: AttemptStep[], label: string, deadlineAt: number, retried = false): Promise<OfficeIntakeResult> {
  let last: OfficeIntakeResult = { ok: false, skipped: false, retryable: true, delivery: "failed", reason: "office_deadline", officeOutcome: "deadline" };
  const attempts: OfficeOutcome[] = [];
  for (let i = 0; i < plan.length; i += 1) {
    const step = plan[i];
    if (Date.now() + step.delayMs + MIN_ATTEMPT_MS > deadlineAt) break;
    if (step.delayMs) await sleep(step.delayMs);
    const timeoutMs = Math.min(step.timeoutMs, deadlineAt - Date.now());
    if (timeoutMs < MIN_ATTEMPT_MS) break;
    // a fresh request id per attempt; the idempotency key is what makes the attempts the same submission
    last = await postOfficeIntakeEnvelope({ ...envelope, request_id: `${envelope.request_id}-${label}${i + 1}` }, timeoutMs);
    if (last.officeOutcome) attempts.push(last.officeOutcome);
    if (last.ok && last.duplicate && (retried || i > 0)) last = { ...last, delivery: "synced" };
    if (last.ok || last.skipped || !last.retryable) break;
  }
  return { ...last, attempts };
}

// request id and outcome categories only: never contact data
function describe(result: OfficeIntakeResult): string {
  return `delivery=${result.delivery} office=${result.officeOutcome || "none"} attempts=${(result.attempts || []).join(",") || "none"}`;
}

/** Bounded foreground delivery: the first attempt may take up to 20 s, every attempt ends within 36 s of `startedAt`. */
export async function deliverToOffice(envelope: OfficeIntakeEnvelope, startedAt = Date.now()): Promise<OfficeIntakeResult> {
  const result = await attemptAll(envelope, FOREGROUND_PLAN, "f", startedAt + FOREGROUND_DEADLINE_MS);
  if (!result.skipped) console.log(`[office-intake] foreground (${envelope.request_id}): ${describe(result)}`);
  return { ...result, startedAt };
}

/** Background continuation after the visitor already has an answer (scheduled with next/server `after`). It ends within 55 s of
 *  `startedAt` (the foreground delivery's start), so it always fits the function's 60 s budget. Logs the outcome only. */
export async function continueOfficeDelivery(envelope: OfficeIntakeEnvelope, startedAt = Date.now()): Promise<void> {
  const result = await attemptAll(envelope, BACKGROUND_PLAN, "b", startedAt + BACKGROUND_DEADLINE_MS, true);
  const label = result.ok ? "delivered" : "still_not_delivered";
  console.log(`[office-intake] background ${label} (${envelope.request_id}): ${describe(result)}${result.reason ? ` ${result.reason}` : ""}`);
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
