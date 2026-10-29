// Phase 5D: schema.org structured data for a public product. Only Office-published facts are used: an Offer exists only for a
// variant with an approved published price (no price is ever invented), and availability is Office's label. The JSON is escaped
// so product text can never close the surrounding <script> element.
import { imageUrl, type PublicProduct } from "./catalogue";

const AVAILABILITY = { in_stock: "https://schema.org/InStock", available_to_order: "https://schema.org/BackOrder", unavailable: "https://schema.org/OutOfStock" } as const;

export function productLd(product: PublicProduct, siteUrl: string) {
  const abs = (path: string) => (path ? new URL(path, siteUrl).toString() : "");
  const url = abs(`/hardware/${product.slug}`);
  const offers = product.variants
    .filter((v) => v.price && Number.isSafeInteger(v.price.amount_kobo))
    .map((v) => ({
      "@type": "Offer",
      sku: v.sku,
      name: v.name,
      price: (v.price!.amount_kobo / 100).toFixed(2),
      priceCurrency: "NGN",
      availability: AVAILABILITY[v.availability],
      url,
    }));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary || product.description.slice(0, 300),
    ...(product.model ? { model: product.model } : {}),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand.name } } : {}),
    ...(product.category ? { category: product.category.name } : {}),
    image: product.images.map((i) => abs(imageUrl(i.src))).filter(Boolean).slice(0, 6),
    url,
    ...(offers.length ? { offers } : {}),
  };
}

export function productJsonLd(product: PublicProduct, siteUrl: string): string {
  return JSON.stringify(productLd(product, siteUrl)).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
