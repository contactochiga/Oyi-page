import { NextResponse } from "next/server";

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 16_384;
const buckets = new Map<string, { count: number; resetAt: number }>();

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

function getIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= MAX_REQUESTS) return false;
  current.count += 1;
  return true;
}

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

async function forwardLead(payload: Record<string, string>, requestId: string) {
  const explicitEndpoint = process.env.OYI_DEPLOYMENT_LEAD_ENDPOINT;
  const base = process.env.OYI_DEPLOYMENT_AGENT_BASE || process.env.NEXT_PUBLIC_OYI_WIDGET_API_BASE;
  const endpoint = explicitEndpoint || (base ? `${base.replace(/\/$/, "")}/api/lead-agents/public/chat` : "");
  const token = process.env.OYI_DEPLOYMENT_LEAD_TOKEN;

  if (!endpoint) return { status: "not_configured" as const };

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Oyi-Request-Id": requestId,
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const message = [
    "New Oyi deployment request",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || "Not provided"}`,
    `Organization/Estate: ${payload.organization}`,
    `Role: ${payload.role || "Not provided"}`,
    `Project type: ${payload.projectType}`,
    `Homes/units: ${payload.homes || "Not provided"}`,
    `Interest: ${payload.deploymentInterest}`,
    `Notes: ${payload.notes || "Not provided"}`,
    `Reference: ${requestId}`,
  ].join("\n");

  const response = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({
      source: "getoyi.com",
      channel: "oyi_deployment_request",
      requestId,
      name: payload.name,
      email: payload.email,
      message,
      metadata: payload,
    }),
    cache: "no-store",
  });

  if (!response.ok) return { status: "failed" as const };
  return { status: "sent" as const };
}

export async function POST(request: Request) {
  const ip = getIp(request);
  if (!checkRateLimit(ip)) {
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

  const requestId = `OYI-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const payload = {
    name: normalizeString(body.name, 120),
    email: normalizeString(body.email, 160).toLowerCase(),
    phone: normalizeString(body.phone, 60),
    organization: normalizeString(body.organization, 160),
    role: normalizeString(body.role, 120),
    projectType: normalizeString(body.projectType, 120),
    homes: normalizeString(body.homes, 80),
    deploymentInterest: normalizeString(body.deploymentInterest, 180),
    notes: normalizeString(body.notes, 1200),
  };

  try {
    const delivery = await forwardLead(payload, requestId);
    return NextResponse.json({ ok: true, requestId, delivery: delivery.status });
  } catch {
    return NextResponse.json({ ok: false, error: "We could not submit the request right now. Please try again." }, { status: 502 });
  }
}
