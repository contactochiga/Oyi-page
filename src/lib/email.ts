// Oyi lead-notification email (Resend).
//
// Every enquiry type on getoyi.com resolves to one office inbox
// (OCHIGA_EMAIL_OFFICE) so the recipient never needs to be changed in more
// than one place. Mirrors the pattern used by the Ochiga corporate website's
// lib/email.ts for the same inbox.
//
// Two emails per submission:
//   1. Internal notification -> the office inbox, reply-to the submitter.
//   2. Acknowledgement -> the submitter, confirming receipt only.
//
// Fails clearly in production if RESEND_API_KEY is missing; in development,
// sending is skipped with a console warning so local work doesn't need real
// credentials.
//
// Idempotency: each email carries a provider Idempotency-Key derived from the submission key, and its content depends ONLY on the
// submission (key + form content) and the kind of email -- never on the per-request id or a transient Office answer -- so an identical
// retry sends a byte-identical request and Resend returns the original email instead of sending a second one. The staff email has one
// key per kind: a confirmed notice (`:staff`) and one warning per unconfirmed Office state (`:staff:<status>`), so a submission whose CRM
// state changed between attempts gets a new, different notice under a new key instead of a conflicting one under the old key.
import { createHash } from "node:crypto";
import { Resend } from "resend";

export type OyiLeadType = "deployment" | "developer" | "integrator" | "tech_oem" | "partner" | "general" | "certification";

export type OyiLeadPayload = {
  leadType: OyiLeadType;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  message: string;
  metadata?: Record<string, string>;
  // per-request id: logs only, never in the email content (it changes on every retry)
  requestId: string;
  // stable per-submission reference shown in both emails and to the visitor (see submissionReference)
  reference: string;
  pageUrl?: string;
  // stable per-submission key: makes both emails idempotent at the provider (a retried submission sends nothing twice)
  submissionKey?: string;
  // whether the same submission reached the Office CRM; anything else flags the staff email
  officeStatus?: "synced" | "duplicate" | "pending" | "failed" | "not_configured";
  // signed link that lets a signed-in Office staff member file exactly this submission (only when Office did not confirm it)
  recoveryUrl?: string | null;
};

// Outcome of one email at the provider. "unconfirmed": Resend refused the request because the same Idempotency-Key was used before
// (invalid_idempotent_request: a different payload; concurrent_idempotent_requests: still in flight) -- an earlier email for this key
// may have been sent, but that is not evidence it was, so it is never reported as sent.
export type EmailOutcome = "sent" | "unconfirmed" | "failed" | "skipped";

export type OyiLeadEmailResult = { staff: EmailOutcome; acknowledgement: EmailOutcome; reason?: string };

const IDEMPOTENCY_CONFLICTS = new Set(["invalid_idempotent_request", "concurrent_idempotent_requests"]);

function outcomeOf(result: { error?: { name?: string } | null }): EmailOutcome {
  if (!result.error) return "sent";
  return IDEMPOTENCY_CONFLICTS.has(String(result.error.name || "")) ? "unconfirmed" : "failed";
}

/** Stable, human-readable reference for one submission (same for every retry of it). */
export function submissionReference(submissionKey: string): string {
  return `OYI-${createHash("sha256").update(submissionKey).digest("hex").slice(0, 10).toUpperCase()}`;
}

// Single source of truth for the internal notification destination.
function officeInbox(): string | undefined {
  return process.env.OCHIGA_EMAIL_OFFICE || undefined;
}

function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const leadTypeLabels: Record<OyiLeadType, string> = {
  deployment: "Deploy Oyi",
  developer: "Developer / Building Enquiry",
  integrator: "Integrator Enquiry",
  tech_oem: "Technology / OEM Integration Enquiry",
  partner: "Partner Enquiry",
  general: "General Contact",
  certification: "Certification Interest",
};

const acknowledgementCopy: Record<OyiLeadType, { subject: string; body: string }> = {
  deployment: {
    subject: "We've received your Oyi deployment request",
    body: "Thank you. Our team will review your deployment request and contact you with the appropriate next step.",
  },
  developer: {
    subject: "We've received your Oyi developer enquiry",
    body: "Thank you. Our team will review your enquiry and follow up.",
  },
  integrator: {
    subject: "We've received your Oyi integrator enquiry",
    body: "Thank you. Our team will review your enquiry and follow up.",
  },
  tech_oem: {
    subject: "We've received your Oyi technology / OEM enquiry",
    body: "Thank you. Our team will review your enquiry and follow up.",
  },
  partner: {
    subject: "We've received your Oyi partner enquiry",
    body: "Thank you. Our team will review your enquiry and follow up.",
  },
  general: {
    subject: "We've received your message — Oyi",
    body: "Thank you for contacting Oyi. Our team will review your message and respond as soon as possible.",
  },
  certification: {
    subject: "We've received your Oyi certification interest",
    body: "Thank you. Certification is not yet live — we'll be in touch when the programme opens.",
  },
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] as string);
}

function detailRows(payload: OyiLeadPayload): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["Enquiry type", leadTypeLabels[payload.leadType]],
    ["Name", payload.name],
    ["Email", payload.email],
    ["Phone", payload.phone || "—"],
    ["Organization", payload.organization || "—"],
  ];
  if (payload.metadata) {
    for (const [key, value] of Object.entries(payload.metadata)) {
      if (value) rows.push([key, value]);
    }
  }
  rows.push(["Message", payload.message], ["Page", payload.pageUrl || "—"], ["Reference", payload.reference]);
  if (payload.submissionKey) rows.push(["Submission key", payload.submissionKey]);
  return rows;
}

function recoveryBlock(payload: OyiLeadPayload): string {
  if (payload.officeStatus === "synced" || payload.officeStatus === "duplicate" || !payload.officeStatus) return "";
  const why = payload.officeStatus === "pending"
    ? "Office received this enquiry but could not finish its CRM records yet. It keeps retrying automatically."
    : payload.officeStatus === "not_configured"
      ? "This website is not connected to Office, so the enquiry was NOT filed in the CRM."
      : "Office could not be reached, so the enquiry was NOT filed in the CRM yet. The website keeps retrying for a short while.";
  const action = payload.recoveryUrl
    ? `<p style="margin:12px 0;"><a href="${escapeHtml(payload.recoveryUrl)}" style="display:inline-block;padding:10px 16px;background:#0ea5e9;color:#020617;border-radius:8px;text-decoration:none;font-weight:600;">File this enquiry in Office</a></p><p style="color:#64748b;font-size:12px;">Sign in to Office first. The link is safe to use more than once and does nothing if the enquiry already reached Office. Valid for 30 days.</p>`
    : `<p style="color:#64748b;font-size:12px;">File it manually in Office from the details above.</p>`;
  return `<div style="margin-top:20px;padding:12px 16px;border:1px solid #f59e0b;border-radius:10px;background:#fffbeb;"><p style="margin:0;font-weight:600;">${escapeHtml(why)}</p>${action}</div>`;
}

function internalNotificationHtml(payload: OyiLeadPayload): string {
  const rows = detailRows(payload)
    .map(([label, value]) => `<tr><td style="padding:6px 12px;color:#64748b;font-size:13px;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 12px;font-size:14px;">${escapeHtml(value).replace(/\n/g, "<br/>")}</td></tr>`)
    .join("");
  return `<div style="font-family:sans-serif;max-width:640px;"><h2 style="margin:0 0 16px;">New Oyi enquiry — ${escapeHtml(leadTypeLabels[payload.leadType])}</h2><table style="border-collapse:collapse;width:100%;">${rows}</table>${recoveryBlock(payload)}</div>`;
}

function acknowledgementHtml(payload: OyiLeadPayload): string {
  const copy = acknowledgementCopy[payload.leadType];
  return `<div style="font-family:sans-serif;max-width:520px;"><p>Hi ${escapeHtml(payload.name)},</p><p>${escapeHtml(copy.body)}</p><p style="color:#64748b;font-size:13px;">Reference: ${escapeHtml(payload.reference)}</p></div>`;
}

const confirmedInCrm = (status: OyiLeadPayload["officeStatus"]) => status === "synced" || status === "duplicate" || !status;

/** Sends the staff notification and the acknowledgement; reports each at the provider separately. Throws only on missing production
 *  configuration. */
export async function sendOyiLeadEmail(payload: OyiLeadPayload): Promise<OyiLeadEmailResult> {
  const inbox = officeInbox();
  const client = getClient();

  if (!inbox) {
    if (process.env.NODE_ENV === "production") throw new Error("OCHIGA_EMAIL_OFFICE is not configured.");
    console.warn(`[lib/email] OCHIGA_EMAIL_OFFICE not set — skipping email for ${payload.leadType} (${payload.requestId}).`);
    return { staff: "skipped", acknowledgement: "skipped", reason: "office_inbox_not_configured" };
  }

  if (!client) {
    if (process.env.NODE_ENV === "production") throw new Error("RESEND_API_KEY is not configured.");
    console.warn(`[lib/email] RESEND_API_KEY not set — skipping email for ${payload.leadType} (${payload.requestId}).`);
    return { staff: "skipped", acknowledgement: "skipped", reason: "resend_not_configured" };
  }

  const from = process.env.OYI_EMAIL_FROM || "Oyi <notifications@getoyi.com>";
  const copy = acknowledgementCopy[payload.leadType];

  const notInCrm = payload.officeStatus === "failed" || payload.officeStatus === "not_configured";
  const crmIncomplete = payload.officeStatus === "pending";
  // a confirmed notice and each kind of warning are different emails, each with its own stable key
  const staffKind = confirmedInCrm(payload.officeStatus) ? "staff" : `staff:${payload.officeStatus}`;
  const reasons: string[] = [];
  // Resend reports a rejected email in the returned `error` (it does not throw), so both results are checked explicitly.
  const staffResult = await client.emails.send(
    {
      from,
      to: inbox,
      replyTo: payload.email,
      subject: `${notInCrm ? "[NOT IN OFFICE CRM] " : crmIncomplete ? "[OFFICE CRM INCOMPLETE] " : ""}[Oyi] ${leadTypeLabels[payload.leadType]} — ${payload.name}`,
      html: internalNotificationHtml(payload),
    },
    payload.submissionKey ? { idempotencyKey: `${payload.submissionKey}:${staffKind}` } : undefined,
  );
  const staff = outcomeOf(staffResult);
  if (staffResult.error) reasons.push(`staff:${staffResult.error.name}`);

  const ackResult = await client.emails.send(
    {
      from,
      to: payload.email,
      subject: copy.subject,
      html: acknowledgementHtml(payload),
    },
    payload.submissionKey ? { idempotencyKey: `${payload.submissionKey}:ack` } : undefined,
  );
  const acknowledgement = outcomeOf(ackResult);
  if (ackResult.error) reasons.push(`acknowledgement:${ackResult.error.name}`);

  return { staff, acknowledgement, ...(reasons.length ? { reason: reasons.join(",") } : {}) };
}
