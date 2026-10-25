import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductPage, SiteFooter, SiteHeader } from "@/components/OyiSite";
import { HardwareCatalogue, HardwareLoading } from "@/components/hardware/HardwareCatalogue";
import { catalogueEnabled, listCategories, listProducts, getMerchandising, validSlug } from "@/lib/catalogue";

// With the catalogue on, the page reads searchParams and renders per request from the tagged data cache; with it off it is the static page.

export const metadata: Metadata = {
  title: "Hardware",
  description: "Hardware for buildings running Oyi — devices selected and supported by the Oyi team.",
  alternates: { canonical: "/hardware" },
};

export default async function HardwarePage({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  // Until the catalogue is switched on (HARDWARE_CATALOGUE_ENABLED=true) this page is exactly the previous static page.
  if (!catalogueEnabled()) {
    return (
      <>
        <SiteHeader />
        <ProductPage
          eyebrow="Oyi Hardware"
          title="Purpose-built hardware for buildings running Oyi."
          body="Oyi is designed to work with the infrastructure a building already has. A small hardware family — a compute unit and an in-space display — is in development to give Oyi a physical presence where it's needed. Specifications and availability will be shared as they're finalised."
          points={["Compute unit for local bridging and edge readiness", "In-space display for Experience and status", "Designed around existing infrastructure, not a replacement for it"]}
          cta={{ label: "Talk to Oyi about hardware", href: "/contact?type=tech_oem" }}
        />
        <SiteFooter />
      </>
    );
  }
  return (
    <>
      <SiteHeader />
      {/* loading state lives here (not in a route-level loading.tsx) so product pages below keep real 404 / 308 status codes */}
      <Suspense fallback={<HardwareLoading />}>
        <CatalogueSection searchParams={searchParams} />
      </Suspense>
      <SiteFooter />
    </>
  );
}

async function CatalogueSection({ searchParams }: { searchParams: Promise<{ category?: string | string[] }> }) {
  const raw = (await searchParams).category;
  const category = typeof raw === "string" && validSlug(raw) ? raw : "";
  const [products, categories, merchandising] = await Promise.all([listProducts(), listCategories(), getMerchandising()]);
  return <HardwareCatalogue products={products} categories={categories} activeCategory={category} merchandising={merchandising} />;
}
