import { resolvePackageEnquiry } from "@/lib/packageEnquiryServer";
import { NextResponse, after } from "next/server";
import { sendOyiLeadEmail, submissionReference, type OyiLeadEmailResult, type OyiLeadType } from "@/lib/email";
import { leadResponse } from "@/lib/leadResponse";
import { continueOfficeDelivery, deliverToOffice, recoveryUrl, type OfficeIntakeEnvelope } from "@/lib/officeIntake";
import { checkRateLimit, getRequestIp, makeRequestId } from "@/lib/rate-limit";
import { catalogueEnabled, getProductForEnquiry, AVAILABILITY_LABEL } from "@/lib/catalogue";
import { hardwareEnquiryContext, hardwareEnquiryQuery } from "@/lib/hardwareEnquiry";
import { submissionKey } from "@/lib/submission";


// bounded foreground retries plus a short background continuation (next/server `after`) fit well inside this budget
export const maxDuration = 60;
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
  packageSelection?: unknown;
  hardware?: { product?: unknown; sku?: unknown };
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
  // deadlines of the Office delivery (foreground and background) are measured from here, the start of this invocation
  const startedAt = Date.now();
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
  let message = normalizeString(body.message, 2000);

  if (!name) return NextResponse.json({ ok: false, error: "Name is required." }, { status: 400 });
  if (!email || !isEmail(email)) return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  if (!message) return NextResponse.json({ ok: false, error: "A short message is required." }, { status: 400 });

  const requestId = makeRequestId();
  const phone = normalizeString(body.phone, 60);
  const organization = normalizeString(body.organization, 160);
  let pageUrl = normalizeString(body.pageUrl, 200);
  // Treat submitted identifiers as untrusted; never accept client prices, names or availability.
  if (body.hardware !== undefined) {
    const context = hardwareEnquiryContext(body.hardware?.product, body.hardware?.sku);
    if (!catalogueEnabled() || !context.product || (body.hardware?.sku != null && body.hardware.sku !== "" && !context.sku))
      return NextResponse.json({ ok: false, error: "Invalid hardware enquiry context." }, { status: 400 });
    const result = await getProductForEnquiry(context.product);
    if (result.state !== "ok") return NextResponse.json({ ok: false, error: "This product cannot be verified right now. Please contact sales without a product selection." }, { status: result.state === "unavailable" ? 503 : 400 });
    const product = result.data.product;
    const variant = context.sku ? product.variants.find(v => v.sku === context.sku) : undefined;
    if (context.sku && !variant) return NextResponse.json({ ok: false, error: "This product option is no longer available. Please choose it again." }, { status: 400 });
    message += `\n\nHardware enquiry: ${product.name} (${product.slug})${variant ? `; ${variant.name}; SKU ${variant.sku}` : ""}. Published availability: ${AVAILABILITY_LABEL[variant?.availability || product.availability]}. Enquiry only (online ordering is not open); price, availability and delivery to be confirmed by the Oyi team.`;
    pageUrl = `/contact?${hardwareEnquiryQuery(product.slug, variant?.sku)}`;
  }

  const packageResult = body.packageSelection === undefined ? null : await resolvePackageEnquiry(body.packageSelection);
  if (packageResult && !packageResult.ok) return NextResponse.json({ok:false,error:packageResult.error},{status:packageResult.status});
  if (packageResult?.ok) { message += `\n\n${packageResult.message}`; pageUrl = `/solutions/packages/${packageResult.context.slug}`; }

  const key = submissionKey(body.idempotencyKey, `oyi_${leadType}_enquiry`, requestId);

  // Office first (idempotent on `key`), so the staff email can say whether the enquiry is in the CRM. Both channels are still
  // attempted whatever the other does: an Office outage must not lose the enquiry, and the email flags it for manual filing.
  const envelope: OfficeIntakeEnvelope = {
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
    ...(packageResult?.ok ? {metadata:{package:packageResult.context}} : {}),
  };
  const office = await deliverToOffice(envelope, startedAt);
  const officeStatus = office.delivery;
  // not confirmed yet: keep trying after the visitor has their answer, and give staff a signed way to file it themselves
  const recovery = office.ok || office.skipped ? null : recoveryUrl(envelope);
  if (!office.ok && !office.skipped && office.retryable) after(() => continueOfficeDelivery(envelope, startedAt));

  const reference = submissionReference(key);
  const emailResult = await sendOyiLeadEmail({
    leadType,
    name,
    email,
    phone: phone || undefined,
    organization: organization || undefined,
    message,
    requestId,
    reference,
    pageUrl: pageUrl || undefined,
    submissionKey: key,
    officeStatus,
    recoveryUrl: recovery,
  }).catch((error): OyiLeadEmailResult => {
    console.error(`[api/leads] email not attempted (${requestId}):`, error instanceof Error ? error.message : error);
    return { staff: "failed", acknowledgement: "failed", reason: "email_not_configured" };
  });
  if (emailResult.staff !== "sent" || emailResult.acknowledgement !== "sent") {
    console.warn(`[api/leads] email (${requestId}): staff=${emailResult.staff} acknowledgement=${emailResult.acknowledgement}${emailResult.reason ? ` ${emailResult.reason}` : ""}`);
  }
  return leadResponse({ office, officeStatus, email: emailResult, requestId, reference, failure: "We could not submit your message right now. Please try again." });
}
