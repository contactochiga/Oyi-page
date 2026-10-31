// Phase 5D: server-side browsing over Office's public catalogue projection (pure; no I/O). Search, filters, sorting and pagination
// are URL parameters, so every view is shareable, crawlable and works without JavaScript. Office stays the authority: this only
// narrows and orders what Office published, and defensively drops any card that is not complete enough to show.
import type { Availability, PublicCard } from "./catalogue";

export const PAGE_SIZE = 12;
export const SORTS = ["featured", "name", "price_asc", "price_desc", "newest"] as const;
export type Sort = (typeof SORTS)[number];
const AVAILABILITIES: Availability[] = ["in_stock", "available_to_order", "unavailable"];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export type CatalogueQuery = { q: string; category: string; brand: string; availability: Availability | ""; sort: Sort; page: number };
type Raw = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || "";

export function parseQuery(raw: Raw): CatalogueQuery {
  const q = first(raw.q).replace(/[\u0000-\u001f<>]/g, " ").trim().slice(0, 80);
  const category = first(raw.category);
  const brand = first(raw.brand);
  const availability = first(raw.availability) as Availability;
  const sort = first(raw.sort) as Sort;
  const page = Number.parseInt(first(raw.page), 10);
  return {
    q,
    category: SLUG.test(category) && category.length <= 80 ? category : "",
    brand: SLUG.test(brand) && brand.length <= 80 ? brand : "",
    availability: AVAILABILITIES.includes(availability) ? availability : "",
    sort: SORTS.includes(sort) ? sort : "featured",
    page: Number.isSafeInteger(page) && page >= 1 && page <= 1000 ? page : 1,
  };
}

// Complete enough to show publicly: a valid slug, a name and a cover image. (Office already requires approval, publication,
// images with alt text and approved prices before a product can go public; this is defence in depth.)
export function isComplete(card: PublicCard): boolean {
  return SLUG.test(card.slug || "") && typeof card.name === "string" && card.name.trim().length > 0 && !!card.cover && typeof card.cover.src === "string" && card.cover.src.length > 0;
}

const norm = (s: string) => s.toLocaleLowerCase("en").normalize("NFKD").replace(/[̀-ͯ]/g, "");

export function applyQuery(cards: PublicCard[], query: CatalogueQuery, featured: string[] = []) {
  const complete = cards.filter(isComplete);
  const terms = norm(query.q).split(/\s+/).filter(Boolean);
  const matches = complete.filter((c) => {
    if (query.category && c.category?.slug !== query.category) return false;
    if (query.brand && c.brand?.slug !== query.brand) return false;
    if (query.availability && c.availability !== query.availability) return false;
    if (!terms.length) return true;
    const hay = norm([c.name, c.model, c.brand?.name, c.category?.name, c.summary].filter(Boolean).join(" "));
    return terms.every((t) => hay.includes(t));
  });
  const rank = new Map(featured.map((slug, i) => [slug, i]));
  const byName = (a: PublicCard, b: PublicCard) => a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  const price = (c: PublicCard, dir: 1 | -1) => (c.price_from_kobo == null ? Infinity : dir * c.price_from_kobo); // Price on request last
  const sorted = [...matches].sort((a, b) => {
    switch (query.sort) {
      case "name": return byName(a, b);
      case "price_asc": return price(a, 1) - price(b, 1) || byName(a, b);
      case "price_desc": return price(a, -1) - price(b, -1) || byName(a, b);
      case "newest": return (Date.parse(b.updated_at || "") || 0) - (Date.parse(a.updated_at || "") || 0) || byName(a, b);
      default: return (rank.get(a.slug) ?? 1e6) - (rank.get(b.slug) ?? 1e6) || byName(a, b);
    }
  });
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(query.page, pages);
  const facet = (pick: (c: PublicCard) => { slug: string; name: string } | null) =>
    [...new Map(complete.map(pick).filter((x): x is { slug: string; name: string } => !!x).map((x) => [x.slug, x])).values()].sort((a, b) => a.name.localeCompare(b.name, "en"));
  return {
    items: sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: sorted.length,
    page,
    pages,
    hidden_incomplete: cards.length - complete.length,
    facets: { categories: facet((c) => c.category), brands: facet((c) => c.brand) },
  };
}

// The URL for a query (only non-default parameters), for links, pagination and canonical tags.
export function queryHref(query: Partial<CatalogueQuery>, base = "/hardware"): string {
  const p = new URLSearchParams();
  if (query.q) p.set("q", query.q);
  if (query.category) p.set("category", query.category);
  if (query.brand) p.set("brand", query.brand);
  if (query.availability) p.set("availability", query.availability);
  if (query.sort && query.sort !== "featured") p.set("sort", query.sort);
  if (query.page && query.page > 1) p.set("page", String(query.page));
  const s = p.toString();
  return s ? `${base}?${s}#browse` : `${base}#browse`;
}

export function priceLabel(card: Pick<PublicCard, "price_from_kobo" | "price_to_kobo">, naira: (k: number) => string): string {
  if (card.price_from_kobo == null) return "Price on request";
  return `${card.price_to_kobo != null && card.price_to_kobo !== card.price_from_kobo ? "From " : ""}${naira(card.price_from_kobo)}`;
}
