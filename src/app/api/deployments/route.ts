import { NextResponse } from "next/server";
import { sendOyiLeadEmail } from "@/lib/email";
import { postOfficeIntakeEnvelope } from "@/lib/officeIntake";
import { checkRateLimit, getRequestIp, makeRequestId } from "@/lib/rate-limit";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 16_384;

type DeploymentPayload = {
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  role?: string;
  projectType?: string;
  homes?: string;
  deploymentInterest?: string;
  notes?: string;
  website?: string;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeString(value: unknown, limit = 240) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function validate(payload: DeploymentPayload) {
  const name = normalizeString(payload.name, 120);
  const email = normalizeString(payload.email, 160).toLowerCase();
  const organization = normalizeString(payload.organization, 160);
  const projectType = normalizeString(payload.projectType, 120);
  const deploymentInterest = normalizeString(payload.deploymentInterest, 180);
  const honeypot = normalizeString(payload.website, 120);

  if (honeypot) return { ok: false, reason: "Request could not be accepted." };
  if (!name) return { ok: false, reason: "Name is required." };
  if (!email || !isEmail(email)) return { ok: false, reason: "A valid email is required." };
  if (!organization) return { ok: false, reason: "Organization or estate is required." };
  if (!projectType) return { ok: false, reason: "Project type is required." };
  if (!deploymentInterest) return { ok: false, reason: "Deployment interest is required." };
  return { ok: true, reason: "" };
}

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  if (!checkRateLimit(`deployments:${ip}`, WINDOW_MS, MAX_REQUESTS)) {
    return NextResponse.json({ ok: false, error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Request is too large." }, { status: 413 });
  }

  let body: DeploymentPayload;
  try {
    body = JSON.parse(raw) as DeploymentPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const validation = validate(body);
  if (!validation.ok) {
    return NextResponse.json({ ok: false, error: validation.reason }, { status: 400 });
  }

  const requestId = makeRequestId();
  const name = normalizeString(body.name, 120);
  const email = normalizeString(body.email, 160).toLowerCase();
  const organization = normalizeString(body.organization, 160);
  const role = normalizeString(body.role, 120);
  const projectType = normalizeString(body.projectType, 120);
  const homes = normalizeString(body.homes, 80);
  const deploymentInterest = normalizeString(body.deploymentInterest, 180);
  const notes = normalizeString(body.notes, 1200);

  const message = [
    `Role: ${role || "Not provided"}`,
    `Deployment interest: ${deploymentInterest}`,
    `Project context: ${notes || "Not provided"}`,
  ].join("\n");

  const phone = normalizeString(body.phone, 60);

  // Email and Office CRM intake are independent channels — one failing
  // must not suppress or be masked by the other's result.
  const [emailResult, officeResult] = await Promise.allSettled([
    sendOyiLeadEmail({
      leadType: "deployment",
      name,
      email,
      phone: phone || undefined,
      organization,
      message,
      requestId,
      metadata: {
        "Project type": projectType,
        "Homes / units": homes || "Not provided",
      },
    }),
    postOfficeIntakeEnvelope({
      request_id: requestId,
      idempotency_key: requestId,
      source_channel: "website",
      source_site: "oyi_website",
      source_page: "/deployments",
      source_form: "oyi_deployment_request",
      business_unit: "technology",
      inquiry_type: "oyi_deployment_request",
      contact: { name, email, phone },
      organization: { name: organization, location: "" },
      payload: {
        message: [`Role: ${role || "Not provided"}`, `Project type: ${projectType}`, `Homes/units: ${homes || "Not provided"}`, `Interest: ${deploymentInterest}`, notes].filter(Boolean).join(" "),
      },
    }),
  ]);

  const emailOk = emailResult.status === "fulfilled";
  const office = officeResult.status === "fulfilled" ? officeResult.value : { ok: false, skipped: false, reason: "office_intake_threw" };

  if (!emailOk && !office.ok) {
    return NextResponse.json({ ok: false, error: "We could not submit the request right now. Please try again." }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    requestId,
    delivery: {
      email: emailOk ? "sent" : "failed",
      office: office.ok ? (office.duplicate ? "duplicate" : "synced") : office.skipped ? "not_configured" : "failed",
    },
  });
}
