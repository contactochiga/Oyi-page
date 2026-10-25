// Server-only reader of Ochiga Office's public catalogue projection (GET /api/public/catalogue/*). Office is the authority for every
// product, price, availability label and image shown on the Hardware pages; this site only presents what Office publishes.
// The credential is a dedicated read-only key (scope catalogue.public.read), separate from the enquiry key, and never reaches the browser.
// Caching: responses are cached for at most 5 minutes and tagged; Office calls /api/hardware/revalidate after every public change, which
// expires the tags at once. Withdrawn products therefore disappear on the next request after Office's call (or within 5 minutes if that
// call failed and has not been retried yet).
// Imported only by server components and route handlers (no "use client" module imports it).

const DEFAULT_OFFICE_BASE_URL = "https://ochiga-lead-agents.onrender.com";
export const CATALOGUE_TAG = "hardware-catalogue";
export const CATALOGUE_REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 8_000;

export type PublicImage = {
  src: string;
  thumb: string;
  srcset: { src: string; width: number }[];
  width: number;
  height: number;
  alt: string;
  caption: string;
  cover: boolean;
  variant_skus: string[];
};
export type Availability = "in_stock" | "available_to_order" | "unavailable";
export type PublicVariant = {
  sku: string;
  name: string;
  options: Record<string, string>;
  price: { amount_kobo: number; currency: "NGN"; vat_inclusive: true; vat_treatment: string } | null;
  availability: Availability;
  lead_time_days: { min: number; max: number } | null;
};
export type PublicProduct = {
  slug: string;
  name: string;
  model: string;
  summary: string;
  description: string;
  category: { slug: string; name: string } | null;
  brand: { slug: string; name: string } | null;
  specifications: { key: string; value: string; unit: string }[];
  compatibility: { facility: boolean; experience: boolean; core: boolean; edge: boolean; notes: string };
  variants: PublicVariant[];
  price_from_kobo: number | null;
  price_to_kobo: number | null;
  availability: Availability;
  images: PublicImage[];
  cover: PublicImage | null;
  updated_at: string | null;
};
export type PublicCard = Pick<PublicProduct, "slug" | "name" | "model" | "summary" | "category" | "brand" | "price_from_kobo" | "price_to_kobo" | "availability" | "cover" | "updated_at">;
export type PublicCategory = { slug: string; name: string; product_count: number };

// ok: data · not_found: Office says there is no such public product · unavailable: Office unreachable / misconfigured / erroring
export type CatalogueResult<T> = { state: "ok"; data: T } | { state: "not_found" } | { state: "redirect"; to: string } | { state: "unavailable"; reason: string };

export function catalogueEnabled(): boolean {
  return process.env.HARDWARE_CATALOGUE_ENABLED === "true";
}

// Staff previews only (HARDWARE_PREVIEW_ENABLED=true): /hardware/preview/<signed token> works while the public catalogue stays off, so
// visitors keep the existing static Hardware page and no product is listed, linked or indexed. Implied by the full catalogue switch.
export function previewEnabled(): boolean {
  return catalogueEnabled() || process.env.HARDWARE_PREVIEW_ENABLED === "true";
}

function baseUrl(): string {
  return (process.env.OCHIGA_OFFICE_BASE_URL || DEFAULT_OFFICE_BASE_URL).replace(/\/$/, "");
}

function catalogueKey(): string {
  return String(process.env.OCHIGA_OFFICE_CATALOGUE_KEY || "").trim();
}

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const ASSET = /^[0-9a-f]{64}\.webp$/;
const TOKEN = /^pv1\.[0-9a-f-]{36}\.[A-Za-z0-9_-]{43}$/;

export const validSlug = (value: string) => SLUG.test(value) && value.length <= 80;
export const validAsset = (value: string) => ASSET.test(value);
export const validPreviewToken = (value: string) => TOKEN.test(value);

type FetchMode = { cache: "public"; tags: string[] } | { cache: "none" };

async function officeJson<T>(path: string, mode: FetchMode): Promise<CatalogueResult<T>> {
  const key = catalogueKey();
  if (!key) return { state: "unavailable", reason: "not_configured" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${baseUrl()}/api/public/catalogue${path}`, {
      headers: { "x-api-key": key, accept: "application/json" },
      signal: controller.signal,
      ...(mode.cache === "public" ? { next: { revalidate: CATALOGUE_REVALIDATE_SECONDS, tags: mode.tags } } : { cache: "no-store" as const }),
    });
    if (response.status === 404) return { state: "not_found" };
    if (response.status === 410) return { state: "unavailable", reason: "expired" };
    if (!response.ok) return { state: "unavailable", reason: `office_http_${response.status}` };
    const data = (await response.json()) as T & { redirect_to?: string };
    if (data && typeof data.redirect_to === "string" && validSlug(data.redirect_to)) return { state: "redirect", to: data.redirect_to };
    return { state: "ok", data };
  } catch (error) {
    return { state: "unavailable", reason: error instanceof Error && error.name === "AbortError" ? "timeout" : "unreachable" };
  } finally {
    clearTimeout(timer);
  }
}

export function listProducts(category?: string) {
  const query = category && validSlug(category) ? `?category=${category}` : "";
  return officeJson<{ products: PublicCard[]; total: number }>(`/products${query}`, { cache: "public", tags: [CATALOGUE_TAG] });
}

export function listCategories() {
  return officeJson<{ categories: PublicCategory[] }>("/categories", { cache: "public", tags: [CATALOGUE_TAG] });
}

export function getProduct(slug: string) {
  if (!validSlug(slug)) return Promise.resolve<CatalogueResult<{ product: PublicProduct }>>({ state: "not_found" });
  return officeJson<{ product: PublicProduct }>(`/products/${slug}`, { cache: "public", tags: [CATALOGUE_TAG, `${CATALOGUE_TAG}:${slug}`] });
}

export function getPreview(token: string) {
  if (!validPreviewToken(token)) return Promise.resolve<CatalogueResult<{ preview: { version: number; expires_at: string; status: string }; product: PublicProduct }>>({ state: "not_found" });
  return officeJson<{ preview: { version: number; expires_at: string; status: string }; product: PublicProduct }>(`/preview/${token}`, { cache: "none" });
}

// Raw image bytes from Office (validated path segments only). The caller sets the response caching.
export async function fetchImage(path: string): Promise<{ status: number; body: ArrayBuffer | null }> {
  const key = catalogueKey();
  if (!key) return { status: 404, body: null };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${baseUrl()}/api/public/catalogue${path}`, { headers: { "x-api-key": key }, cache: "no-store", signal: controller.signal });
    if (!response.ok || response.headers.get("content-type") !== "image/webp") return { status: response.status === 404 || response.status === 410 ? 404 : 502, body: null };
    return { status: 200, body: await response.arrayBuffer() };
  } catch {
    return { status: 502, body: null };
  } finally {
    clearTimeout(timer);
  }
}

// "media/<sha>.webp" from Office -> this site's image route (public) or the preview's image route
export function imageUrl(src: string, previewToken?: string): string {
  const asset = src.replace(/^media\//, "");
  if (!validAsset(asset)) return "";
  return previewToken ? `/hardware/preview/${previewToken}/media/${asset}` : `/hardware/media/${asset}`;
}

export function naira(kobo: number | null | undefined): string {
  if (kobo === null || kobo === undefined || !Number.isSafeInteger(kobo)) return "";
  const whole = Math.trunc(kobo / 100);
  const fraction = kobo % 100;
  return `₦${whole.toLocaleString("en-NG")}${fraction ? `.${String(fraction).padStart(2, "0")}` : ""}`;
}

export const AVAILABILITY_LABEL: Record<Availability, string> = { in_stock: "In stock", available_to_order: "Available to order", unavailable: "Currently unavailable" };
