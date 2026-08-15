// Server-only bridge from Oyi-page's enquiry forms into Ochiga Office's
// canonical intake contract — the same contract Ochiga-website uses via
// lib/office/intakeClient.ts (POST /api/office/intake). Office remains the
// CRM source of truth; this module only ever sends data there and never
// reads it back. The credential here is never sent to the browser.
const DEFAULT_OFFICE_BASE_URL = "https://ochiga-lead-agents.onrender.com";
const OFFICE_INTAKE_TIMEOUT_MS = 12_000;

function officeBaseUrl(): string {
  return (process.env.OCHIGA_OFFICE_BASE_URL || DEFAULT_OFFICE_BASE_URL).replace(/\/$/, "");
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

export type OfficeIntakeResult = {
  ok: boolean;
  skipped: boolean;
  status?: number;
  duplicate?: boolean;
  reason?: string;
};

// Never throws — callers decide how a failed/skipped Office sync affects
// the overall request outcome alongside the separate email channel.
export async function postOfficeIntakeEnvelope(envelope: OfficeIntakeEnvelope): Promise<OfficeIntakeResult> {
  const apiKey = officeApiKey();
  if (!apiKey) {
    return { ok: false, skipped: true, reason: "office_not_configured" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OFFICE_INTAKE_TIMEOUT_MS);
  try {
    const response = await fetch(`${officeBaseUrl()}/api/office/intake`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "x-office-api-key": apiKey,
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
    if (!response.ok) {
      const errorText = typeof json?.error === "string" ? json.error : "";
      return { ok: false, skipped: false, status: response.status, reason: errorText || `office_http_${response.status}` };
    }
    return { ok: true, skipped: false, status: response.status, duplicate: Boolean(json?.duplicate) };
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      reason: error instanceof Error && error.name === "AbortError" ? "office_timeout" : "office_unreachable",
    };
  } finally {
    clearTimeout(timeout);
  }
}
