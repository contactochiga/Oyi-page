import type { MetadataRoute } from "next";
import { catalogueEnabled, listProducts } from "@/lib/catalogue";
import { publicRoutes, siteConfig } from "@/lib/site";

// per request from the same tagged data cache, so a withdrawn product leaves the sitemap with the catalogue refresh
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = publicRoutes.map((route) => ({
    url: new URL(route, siteConfig.url).toString(),
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
  // published hardware products (only while the catalogue is switched on and Office answers)
  if (catalogueEnabled()) {
    const result = await listProducts();
    if (result.state === "ok") {
      for (const card of result.data.products) {
        pages.push({ url: new URL(`/hardware/${card.slug}`, siteConfig.url).toString(), lastModified: card.updated_at ? new Date(card.updated_at) : now, changeFrequency: "weekly", priority: 0.6 });
      }
    }
  }
  return pages;
}
