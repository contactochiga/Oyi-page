import { PackageCollection } from "@/components/packages/PackageCollection";
import type { Metadata } from "next";
import { Suspense } from "react";
import { ConsultationSteps, ProductPage, SiteFooter, SiteHeader } from "@/components/OyiSite";
import { HardwareCatalogue, HardwareLoading } from "@/components/hardware/HardwareCatalogue";
import { catalogueEnabled, listCategories, listProducts, getMerchandising } from "@/lib/catalogue";
import { parseQuery } from "@/lib/catalogueQuery";

// With the catalogue on, the page reads searchParams and renders per request from the tagged data cache; with it off it is the static page.
// Browsing state (search, filters, sort, page) lives in the URL. Category views are indexable; search, filter, sort and later pages
// are noindex,follow with the canonical pointing at the base view, so search engines see one page per category.

// Rendered per request so the catalogue switch is read at runtime (never baked into a build-time static page).
export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const base: Metadata = {
    title: "Store",
    description: "The Oyi Store: hardware reviewed and approved for buildings running Oyi, with integrated Ochiga packages to follow. Custom solutions and Oyi deployments are consultation-led.",
    alternates: { canonical: "/hardware" },
  };
  if (!catalogueEnabled()) return base;
  const q = parseQuery(await searchParams);
  const narrowed = Boolean(q.q || q.brand || q.availability || q.sort !== "featured" || q.page > 1);
  return {
    ...base,
    alternates: { canonical: q.category ? `/hardware?category=${q.category}` : "/hardware" },
    robots: narrowed ? { index: false, follow: true } : undefined,
  };
}

export default async function HardwarePage({ searchParams }: { searchParams: SearchParams }) {
  // Until the catalogue is switched on (HARDWARE_CATALOGUE_ENABLED=true) this page is exactly the previous static page.
  if (!catalogueEnabled()) {
    return (
      <>
        <SiteHeader />
        <ProductPage
          eyebrow="Oyi Store"
          title="Hardware approved to work with Oyi."
          body="Oyi works with the infrastructure a building already has. Where new hardware is needed, the Store offers only devices our team has reviewed and approved for buildings running Oyi, with integrated Ochiga packages to follow. Approved products may be offered at a fixed price; custom solutions, installation and Oyi deployments are planned with you through a consultation. Online ordering is not open yet."
          points={["Approved hardware only, reviewed by the Oyi team", "Integrated Ochiga packages, coming later", "Custom solutions and deployments planned through a consultation"]}
          cta={{ label: "Ask about hardware", href: "/contact?type=tech_oem" }}
          secondaryCta={{ label: "Request a consultation", href: "/deployments" }}
          after={<ConsultationSteps heading="Custom solutions are planned with you." />}
        />
        <PackageCollection />
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
      <PackageCollection />
      <SiteFooter />
    </>
  );
}

async function CatalogueSection({ searchParams }: { searchParams: SearchParams }) {
  const query = parseQuery(await searchParams);
  const [products, categories, merchandising] = await Promise.all([listProducts(), listCategories(), getMerchandising()]);
  return <HardwareCatalogue products={products} categories={categories} query={query} merchandising={merchandising} />;
}
