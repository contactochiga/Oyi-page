import { NextResponse } from "next/server";
import { sendOyiLeadEmail, type OyiLeadType } from "@/lib/email";
import { checkRateLimit, getRequestIp, makeRequestId } from "@/lib/rate-limit";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 8_192;

const LEAD_TYPES: OyiLeadType[] = ["developer", "integrator", "tech_oem", "partner", "general", "certification"];

type LeadRequestPayload = {
  leadType?: string;
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  message?: string;
  pageUrl?: string;
  website?: string; // honeypot
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

  try {
    await sendOyiLeadEmail({
      leadType,
      name,
      email,
      phone: normalizeString(body.phone, 60) || undefined,
      organization: normalizeString(body.organization, 160) || undefined,
      message,
      requestId,
      pageUrl: normalizeString(body.pageUrl, 200) || undefined,
    });
    return NextResponse.json({ ok: true, requestId });
  } catch {
    return NextResponse.json({ ok: false, error: "We could not submit your message right now. Please try again." }, { status: 502 });
  }
}
