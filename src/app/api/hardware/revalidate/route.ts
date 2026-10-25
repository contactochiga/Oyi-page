// Office -> GetOyi refresh hook. Office signs every request: x-getoyi-signature: t=<unix>,v1=<hex HMAC-SHA256(secret, `${t}.${body}`)>.
// Only fresh (5-minute window), correctly signed requests expire the Hardware catalogue cache; nothing else is accepted. Expiring a cache
// entry is idempotent, so a replay inside the window can do no harm.
import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CATALOGUE_TAG, validSlug } from "@/lib/catalogue";

const MAX_BODY = 4_096;
const WINDOW_S = 300;

function verify(secret: string, header: string, body: string): boolean {
  const t = /(?:^|,)t=(\d{1,12})(?:,|$)/.exec(header)?.[1];
  const v1 = /(?:^|,)v1=([0-9a-f]{64})(?:,|$)/.exec(header)?.[1];
  if (!t || !v1 || Math.abs(Date.now() / 1000 - Number(t)) > WINDOW_S) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${body}`).digest();
  const given = Buffer.from(v1, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request: Request) {
  const secret = String(process.env.GETOYI_REVALIDATE_SECRET || "");
  if (secret.length < 32) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const body = await request.text();
  if (body.length > MAX_BODY) return NextResponse.json({ error: "too_large" }, { status: 413 });
  if (!verify(secret, request.headers.get("x-getoyi-signature") || "", body)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  let payload: { slug?: unknown; previous_slugs?: unknown } = {};
  try { payload = JSON.parse(body); } catch { return NextResponse.json({ error: "invalid" }, { status: 400 }); }
  const slugs = [payload.slug, ...(Array.isArray(payload.previous_slugs) ? payload.previous_slugs : [])].filter((s): s is string => typeof s === "string" && validSlug(s)).slice(0, 20);
  // expire immediately (not stale-while-revalidate): a withdrawn product must not be served from cache again
  revalidateTag(CATALOGUE_TAG, { expire: 0 });
  revalidatePath("/hardware");
  for (const slug of slugs) revalidatePath(`/hardware/${slug}`);
  return NextResponse.json({ revalidated: true, paths: 1 + slugs.length });
}
