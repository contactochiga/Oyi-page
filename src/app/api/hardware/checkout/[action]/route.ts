import { NextRequest, NextResponse } from "next/server";
import {
  COOKIE,
  enabled,
  sign,
  verify,
  newGuest,
  hash,
  csrf,
  office,
} from "@/lib/checkout/server";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { validCart } from "@/lib/checkout/cart";
export const runtime = "nodejs";
const reply = (status: number, data: unknown) =>
  NextResponse.json(data, {
    status,
    headers: {
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
async function body(req: NextRequest) {
  const reader = req.body?.getReader();
  if (!reader) throw Error("invalid_checkout");
  let n = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    n += value.length;
    if (n > 32768) {
      await reader.cancel();
      throw Error("invalid_checkout");
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  if (!enabled()) return reply(404, { error: "not_found" });
  if ((await params).action !== "session")
    return reply(405, { error: "method_not_allowed" });
  try {
    let token = req.cookies.get(COOKIE)?.value || "";
    let guest = verify(token);
    if (guest?.kind !== "guest") {
      token = newGuest();
      guest = verify(token);
    }
    const r = reply(200, { csrf: csrf(String(guest!.id)) });
    r.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure: req.nextUrl.protocol === "https:",
      sameSite: "strict",
      path: "/api/hardware/checkout",
      maxAge: 7 * 86400,
    });
    return r;
  } catch {
    return reply(503, { error: "checkout_unavailable" });
  }
}
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> },
) {
  if (!enabled()) return reply(404, { error: "not_found" });
  if (!checkRateLimit("checkout:" + getRequestIp(req), 60000, 60))
    return reply(429, { error: "too_many_requests" });
  const origin = process.env.GETOYI_CHECKOUT_ORIGIN;
  if (
    !origin ||
    req.headers.get("origin") !== origin ||
    req.headers.get("sec-fetch-site") === "cross-site"
  )
    return reply(403, { error: "origin_not_allowed" });
  const guest = verify(req.cookies.get(COOKIE)?.value || ""),
    token = verify(req.headers.get("x-checkout-csrf") || "");
  if (
    guest?.kind !== "guest" ||
    token?.kind !== "csrf" ||
    guest.id !== token.id
  )
    return reply(403, { error: "session_expired" });
  try {
    const action = (await params).action,
      b = await body(req),
      guestHash = hash(String(guest.id));
    if (["payment-quote", "payment-start"].includes(action)) {
      if (process.env.HARDWARE_PAYMENTS_ENABLED !== "true")
        return reply(404, { error: "not_found" });
      if (
        Object.keys(b).some(
          (k) => !["id", "accepted_total_kobo"].includes(k),
        ) ||
        typeof b.id !== "string" ||
        !/^[0-9a-f-]{36}$/.test(b.id)
      )
        return reply(400, { error: "invalid_checkout" });
      const r = await office(action, {
        id: b.id,
        guest_hash: guestHash,
        ...(action === "payment-start"
          ? { accepted_total_kobo: b.accepted_total_kobo }
          : {}),
      });
      return reply(r.status, r.data);
    }
    if (action === "status") {
      if (Object.keys(b).some((k) => !["id", "idempotency_key"].includes(k)))
        return reply(400, { error: "invalid_checkout" });
      const r = await office("status", {
        id: b.id,
        idempotency_key: b.idempotency_key,
        guest_hash: guestHash,
      });
      return reply(r.status, r.data);
    }
    if (
      !["quote", "submit"].includes(action) ||
      !validCart(b.lines) ||
      b.lines.length === 0
    )
      return reply(400, { error: "invalid_order_lines" });
    if (
      Object.keys(b).some(
        (k) =>
          !(
            action === "quote"
              ? ["lines"]
              : [
                  "lines",
                  "customer",
                  "delivery",
                  "installation_requested",
                  "idempotency_key",
                  "quote_token",
                ]
          ).includes(k),
      )
    )
      return reply(400, { error: "invalid_checkout" });
    if (action === "quote") {
      const r = await office("quote", { lines: b.lines });
      if (r.status !== 200) return reply(r.status, r.data);
      const { quote_hash, ...quote } = r.data.quote;
      return reply(200, {
        quote,
        quote_token: sign({
          kind: "quote",
          id: guest.id,
          lines: hash(JSON.stringify(b.lines)),
          quote_hash,
          exp: Date.now() + 600000,
        }),
      });
    }
    const q = verify(b.quote_token || "");
    if (
      q?.kind !== "quote" ||
      q.id !== guest.id ||
      q.lines !== hash(JSON.stringify(b.lines))
    )
      return reply(409, { error: "quote_expired" });
    const r = await office("submit", {
      guest_hash: guestHash,
      idempotency_key: b.idempotency_key,
      quote_hash: q.quote_hash,
      order: {
        lines: b.lines,
        customer: b.customer,
        delivery: b.delivery,
        installation_requested: b.installation_requested,
      },
    });
    return reply(r.status, r.data);
  } catch (e) {
    return reply(
      e instanceof SyntaxError ||
        (e instanceof Error && e.message === "invalid_checkout")
        ? 400
        : 503,
      { error: "checkout_unavailable" },
    );
  }
}
