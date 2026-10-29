import {
  createHmac,
  randomBytes,
  timingSafeEqual,
  createHash,
} from "node:crypto";
export const COOKIE = "getoyi_checkout_guest";
export const enabled = () =>
  process.env.HARDWARE_CATALOGUE_ENABLED === "true" &&
  process.env.HARDWARE_CHECKOUT_ENABLED === "true";
export const isolatedStatusOnly = () =>
  process.env.ISOLATED_SERVICE === "getoyi" &&
  process.env.HARDWARE_TEST_STATUS_ONLY === "true" &&
  process.env.GETOYI_CHECKOUT_ORIGIN === "https://localhost:18443" &&
  process.env.OCHIGA_OFFICE_CHECKOUT_URL === "https://office.hardware.test" &&
  process.env.HARDWARE_PAYMENTS_ENABLED === "false";
function secret() {
  const s = process.env.HARDWARE_CHECKOUT_SESSION_SECRET;
  if (!s || s.length < 32) throw Error("checkout_unavailable");
  return s;
}
export function sign(value: unknown) {
  const body = Buffer.from(JSON.stringify(value)).toString("base64url");
  return (
    body + "." + createHmac("sha256", secret()).update(body).digest("base64url")
  );
}
export function verify(token: string): Record<string, unknown> | null {
  try {
    if (token.length > 24000) return null;
    const [b, s, ...rest] = token.split(".");
    const expected = createHmac("sha256", secret()).update(b).digest();
    const sig = Buffer.from(s || "", "base64url");
    if (
      rest.length ||
      sig.length !== expected.length ||
      !timingSafeEqual(expected, sig)
    )
      return null;
    const data = JSON.parse(Buffer.from(b, "base64url").toString());
    return typeof data.exp === "number" && data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}
export function newGuest() {
  return sign({
    kind: "guest",
    id: randomBytes(32).toString("hex"),
    exp: Date.now() + 7 * 86400000,
  });
}
export const hash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export const csrf = (id: string) =>
  sign({ kind: "csrf", id, exp: Date.now() + 3600000 });
export async function office(action: string, body: unknown) {
  const base = process.env.OCHIGA_OFFICE_CHECKOUT_URL,
    key = process.env.OCHIGA_OFFICE_CHECKOUT_KEY;
  if (!base || !key) throw Error("checkout_unavailable");
  const u = new URL(base);
  if (
    u.protocol !== "https:" &&
    !(u.protocol === "http:" && ["127.0.0.1", "localhost"].includes(u.hostname))
  )
    throw Error("checkout_unavailable");
  const response = await fetch(
    base.replace(/\/$/, "") + "/api/commerce/checkout/" + action,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
      redirect: "error",
    },
  );
  return { status: response.status, data: await response.json() };
}
