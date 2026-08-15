import { NextResponse } from "next/server";
import { sendOyiLeadEmail } from "@/lib/email";
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

  try {
    await sendOyiLeadEmail({
      leadType: "deployment",
      name,
      email,
      phone: normalizeString(body.phone, 60) || undefined,
      organization,
      message,
      requestId,
      metadata: {
        "Project type": projectType,
        "Homes / units": homes || "Not provided",
      },
    });
    return NextResponse.json({ ok: true, requestId });
  } catch {
    return NextResponse.json({ ok: false, error: "We could not submit the request right now. Please try again." }, { status: 502 });
  }
}
