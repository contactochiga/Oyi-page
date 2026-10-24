import { NextResponse } from "next/server";
import { sendOyiLeadEmail, type OyiLeadType } from "@/lib/email";
import { postOfficeIntakeEnvelope } from "@/lib/officeIntake";
import { checkRateLimit, getRequestIp, makeRequestId } from "@/lib/rate-limit";
import { submissionKey } from "@/lib/submission";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 8_192;

const LEAD_TYPES: OyiLeadType[] = ["developer", "integrator", "tech_oem", "partner", "general", "certification"];

// business_unit "technology" / inquiry_type prefix "oyi_" match the taxonomy
// Ochiga-website already uses for its OYI_DEPLOYMENT lead type, so Office
// sees one consistent Oyi bucket regardless of which site an enquiry
// came from.
const INQUIRY_TYPES: Record<OyiLeadType, string> = {
  deployment: "oyi_deployment_request",
  developer: "oyi_developer_enquiry",
  integrator: "oyi_integrator_enquiry",
  tech_oem: "oyi_technology_enquiry",
  partner: "oyi_partner_enquiry",
  general: "oyi_general_enquiry",
  certification: "oyi_certification_interest",
};

type LeadRequestPayload = {
  leadType?: string;
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  message?: string;
  pageUrl?: string;
  website?: string; // honeypot
  idempotencyKey?: string; // one per submission attempt, kept by the browser across retries
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeString(value: unknown, limit = 240) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  if (!checkRateLimit(`leads:${ip}`, WINDOW_MS, MAX_REQUESTS)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Request is too large." }, { status: 413 });
  }

  let body: LeadRequestPayload;
  try {
    body = JSON.parse(raw) as LeadRequestPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (normalizeString(body.website)) {
    return NextResponse.json({ ok: false, error: "Request could not be accepted." }, { status: 400 });
  }

  const leadType = normalizeString(body.leadType, 32) as OyiLeadType;
  if (!LEAD_TYPES.includes(leadType)) {
    return NextResponse.json({ ok: false, error: "A valid enquiry type is required." }, { status: 400 });
  }

  const name = normalizeString(body.name, 120);
  const email = normalizeString(body.email, 160).toLowerCase();
  const message = normalizeString(body.message, 2000);

  if (!name) return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  if (!email || !isEmail(email)) return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  if (!message) return NextResponse.json({ ok: false, error: "A short message is required." }, { status: 400 });

  const requestId = makeRequestId();
  const phone = normalizeString(body.phone, 60);
  const organization = normalizeString(body.organization, 160);
  const pageUrl = normalizeString(body.pageUrl, 200);

  const key = submissionKey(body.idempotencyKey, `oyi_${leadType}_enquiry`, requestId);

  // Office first (idempotent on `key`), so the staff email can say whether the enquiry is in the CRM. Both channels are still
  // attempted whatever the other does: an Office outage must not lose the enquiry, and the email flags it for manual filing.
  const office = await postOfficeIntakeEnvelope({
    request_id: requestId,
    idempotency_key: key,
    source_channel: "website",
    source_site: "oyi_website",
    source_page: pageUrl || "/contact",
    source_form: `oyi_${leadType}_enquiry`,
    business_unit: "technology",
    inquiry_type: INQUIRY_TYPES[leadType],
    contact: { name, email, phone },
    organization: { name: organization, location: "" },
    payload: { message },
  }).catch(() => ({ ok: false, skipped: false, duplicate: false, reason: "office_intake_threw" }));
  const officeStatus = office.ok ? (office.duplicate ? "duplicate" : "synced") : office.skipped ? "not_configured" : "failed";

  const emailResult = await sendOyiLeadEmail({
    leadType,
    name,
    email,
    phone: phone || undefined,
    organization: organization || undefined,
    message,
    requestId,
    pageUrl: pageUrl || undefined,
    submissionKey: key,
    officeStatus,
  }).then(() => true, (error) => {
    console.error(`[api/leads] email failed (${requestId}):`, error instanceof Error ? error.message : error);
    return false;
  });

  const emailOk = emailResult;
  if (!emailOk && !office.ok) {
    return NextResponse.json({ ok: false, error: "We could not submit your message right now. Please try again." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    requestId,
    delivery: {
      email: emailOk ? "sent" : "failed",
      office: officeStatus,
    },
  });
}
