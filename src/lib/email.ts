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
  requestId: string;
  pageUrl?: string;
};

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
  rows.push(["Message", payload.message], ["Page", payload.pageUrl || "—"], ["Reference", payload.requestId]);
  return rows;
}

function internalNotificationHtml(payload: OyiLeadPayload): string {
  const rows = detailRows(payload)
    .map(([label, value]) => `<tr><td style="padding:6px 12px;color:#64748b;font-size:13px;white-space:nowrap;">${escapeHtml(label)}</td><td style="padding:6px 12px;font-size:14px;">${escapeHtml(value).replace(/\n/g, "<br/>")}</td></tr>`)
    .join("");
  return `<div style="font-family:sans-serif;max-width:640px;"><h2 style="margin:0 0 16px;">New Oyi enquiry — ${escapeHtml(leadTypeLabels[payload.leadType])}</h2><table style="border-collapse:collapse;width:100%;">${rows}</table></div>`;
}

function acknowledgementHtml(payload: OyiLeadPayload): string {
  const copy = acknowledgementCopy[payload.leadType];
  return `<div style="font-family:sans-serif;max-width:520px;"><p>Hi ${escapeHtml(payload.name)},</p><p>${escapeHtml(copy.body)}</p><p style="color:#64748b;font-size:13px;">Reference: ${escapeHtml(payload.requestId)}</p></div>`;
}

export async function sendOyiLeadEmail(payload: OyiLeadPayload): Promise<{ sent: boolean; reason?: string }> {
  const inbox = officeInbox();
  const client = getClient();

  if (!inbox) {
    if (process.env.NODE_ENV === "production") throw new Error("OCHIGA_EMAIL_OFFICE is not configured.");
    console.warn(`[lib/email] OCHIGA_EMAIL_OFFICE not set — skipping email for ${payload.leadType} (${payload.requestId}).`);
    return { sent: false, reason: "office_inbox_not_configured" };
  }

  if (!client) {
    if (process.env.NODE_ENV === "production") throw new Error("RESEND_API_KEY is not configured.");
    console.warn(`[lib/email] RESEND_API_KEY not set — skipping email for ${payload.leadType} (${payload.requestId}).`);
    return { sent: false, reason: "resend_not_configured" };
  }

  const from = process.env.OYI_EMAIL_FROM || "Oyi <notifications@getoyi.com>";
  const copy = acknowledgementCopy[payload.leadType];

  await client.emails.send({
    from,
    to: inbox,
    replyTo: payload.email,
    subject: `[Oyi] ${leadTypeLabels[payload.leadType]} — ${payload.name}`,
    html: internalNotificationHtml(payload),
  });

  await client.emails.send({
    from,
    to: payload.email,
    subject: copy.subject,
    html: acknowledgementHtml(payload),
  });

  return { sent: true };
}
