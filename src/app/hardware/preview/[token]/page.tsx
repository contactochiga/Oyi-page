// Staff preview of a product version, rendered with the same components as the public page. The signed link comes from Office (Preview
// button), lasts 10 minutes, is bound to one version and one staff member, and dies when revoked or the product is archived.
// Never cached, never indexed, never linked from the site.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/OyiSite";
import { ProductDetail } from "@/components/hardware/ProductDetail";
import { catalogueEnabled, getPreview } from "@/lib/catalogue";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false, nocache: true }, referrer: "no-referrer" };

export default async function HardwarePreviewPage({ params }: { params: Promise<{ token: string }> }) {
  if (!catalogueEnabled()) notFound();
  const { token } = await params;
  const result = await getPreview(token);
  if (result.state !== "ok") {
    const expired = result.state === "unavailable" && result.reason === "expired";
    return (
      <>
        <SiteHeader />
        <main className="bg-[#050b14] px-5 py-28 text-white">
          <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8" data-state="preview-invalid">
            <h1 className="text-3xl font-semibold">{expired ? "This preview link has expired." : "This preview link is not valid."}</h1>
            <p className="mt-3 text-slate-300">Preview links last 10 minutes and stop working when they are revoked. Open a new preview from Ochiga Office.</p>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }
  const { preview, product } = result.data;
  const expires = new Date(preview.expires_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" });
  return (
    <>
      <div className="sticky top-0 z-[60] border-b border-amber-300/40 bg-amber-400 px-5 py-2 text-center text-sm font-semibold text-slate-950" role="status" data-preview-banner>
        Preview — {preview.status === "published_internally" ? "approved version, not necessarily public" : "not published"} · version {preview.version} · link expires {expires} (Lagos)
      </div>
      <SiteHeader />
      <ProductDetail product={product} previewToken={token} />
      <SiteFooter />
    </>
  );
}
