// Public product images: a same-origin proxy for Office's published WebP renditions (content-addressed, so a URL never changes meaning).
// Office answers only for images of currently public products; this route adds the public cache policy. After a withdrawal, Office stops
// serving at once; copies already in a shared cache may be served until max-age (5 minutes) passes — the documented withdrawal delay.
import { catalogueEnabled, fetchImage, validAsset } from "@/lib/catalogue";

export async function GET(_request: Request, { params }: { params: Promise<{ asset: string }> }) {
  const { asset } = await params;
  if (!catalogueEnabled() || !validAsset(asset)) return new Response("Not found", { status: 404, headers: { "cache-control": "no-store" } });
  const image = await fetchImage(`/media/${asset}`);
  if (image.status !== 200 || !image.body) return new Response("Not found", { status: image.status === 404 ? 404 : 502, headers: { "cache-control": "no-store" } });
  return new Response(image.body, {
    status: 200,
    headers: { "content-type": "image/webp", "cache-control": "public, max-age=300, s-maxage=300", "x-content-type-options": "nosniff", "content-security-policy": "default-src 'none'; sandbox" },
  });
}
