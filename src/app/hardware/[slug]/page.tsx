import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/OyiSite";
import { HardwareCatalogue } from "@/components/hardware/HardwareCatalogue";
import { ProductDetail } from "@/components/hardware/ProductDetail";
import { catalogueEnabled, getProduct, imageUrl } from "@/lib/catalogue";
import { siteConfig } from "@/lib/site";
import { parseQuery } from "@/lib/catalogueQuery";
import { productJsonLd } from "@/lib/catalogueSeo";

// Rendered per request from the tagged 5-minute data cache (lib/catalogue.ts). Office's refresh call expires that cache immediately, so a
// withdrawn, renamed or unpublished product is gone on the very next request (a route-level ISR cache would serve one stale page first).
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!catalogueEnabled()) return {};
  const { slug } = await params;
  const result = await getProduct(slug);
  // an outage or missing product is never indexed
  if (result.state !== "ok") return { title: "Store", robots: { index: false, follow: true } };
  const p = result.data.product;
  const cover = p.cover ? new URL(imageUrl(p.cover.srcset[p.cover.srcset.length - 1].src), siteConfig.url).toString() : undefined;
  return {
    title: p.name,
    description: p.summary || `${p.name} — Oyi Store`,
    alternates: { canonical: `/hardware/${p.slug}` },
    openGraph: { title: p.name, description: p.summary, url: `/hardware/${p.slug}`, images: cover ? [{ url: cover, alt: p.cover?.alt || p.name }] : undefined },
  };
}

export default async function HardwareProductPage({ params }: Props) {
  if (!catalogueEnabled()) notFound();
  const { slug } = await params;
  const result = await getProduct(slug);
  if (result.state === "redirect") permanentRedirect(`/hardware/${result.to}`);
  if (result.state === "not_found") notFound();
  if (result.state === "unavailable") {
    return (
      <>
        <SiteHeader />
        <HardwareCatalogue products={{ state: "unavailable", reason: result.reason }} categories={{ state: "unavailable", reason: result.reason }} query={parseQuery({})} />
        <SiteFooter />
      </>
    );
  }
  return (
    <>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productJsonLd(result.data.product, siteConfig.url) }} />
      <ProductDetail product={result.data.product} />
      <SiteFooter />
    </>
  );
}
