// Images of a staff preview (may include images that are not public yet). Valid only with a live preview token; never cached.
import { catalogueEnabled, fetchImage, validAsset, validPreviewToken } from "@/lib/catalogue";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string; asset: string }> }) {
  const { token, asset } = await params;
  const headers = { "cache-control": "private, no-store", "x-robots-tag": "noindex", "referrer-policy": "no-referrer" };
  if (!catalogueEnabled() || !validPreviewToken(token) || !validAsset(asset)) return new Response("Not found", { status: 404, headers });
  const image = await fetchImage(`/preview/${token}/media/${asset}`);
  if (image.status !== 200 || !image.body) return new Response("Not found", { status: 404, headers });
  return new Response(image.body, { status: 200, headers: { ...headers, "content-type": "image/webp", "x-content-type-options": "nosniff", "content-security-policy": "default-src 'none'; sandbox" } });
}
