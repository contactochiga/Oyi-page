// One product, as GetOyi shows it. Used by /hardware/[slug] (published version) and /hardware/preview/[token] (a staff preview of any
// version), so the preview is the real page. Ordering is by conversation only: there is no cart, checkout or payment.
import Link from "next/link";
import "./hardware.css";
import {
  ProductShowcase,
  type ShowcaseImage,
  type ShowcaseVariant,
} from "@/components/hardware/ProductShowcase";
import {
  AVAILABILITY_LABEL,
  imageUrl,
  naira,
  type PublicProduct,
} from "@/lib/catalogue";

const COMPATIBILITY: [
  keyof Omit<PublicProduct["compatibility"], "notes">,
  string,
][] = [
  ["facility", "Oyi Facility"],
  ["experience", "Oyi Experience"],
  ["core", "Oyi Core"],
  ["edge", "Oyi Edge"],
];

export function ProductDetail({
  product,
  previewToken,
}: {
  product: PublicProduct;
  previewToken?: string;
}) {
  const images: ShowcaseImage[] = product.images
    .map((image) => ({
      src: imageUrl(image.src, previewToken),
      srcSet: image.srcset
        .map((s) => `${imageUrl(s.src, previewToken)} ${s.width}w`)
        .join(", "),
      thumb: imageUrl(image.thumb, previewToken),
      width: image.width,
      height: image.height,
      alt: image.alt,
      caption: image.caption,
      variantSkus: image.variant_skus,
    }))
    .filter((image) => image.src);
  const variants: ShowcaseVariant[] = product.variants.map((v) => ({
    sku: v.sku,
    name: v.name,
    options: v.options,
    price: v.price ? naira(v.price.amount_kobo) : "",
    availability: AVAILABILITY_LABEL[v.availability],
    availabilityTone:
      v.availability === "in_stock"
        ? "ok"
        : v.availability === "available_to_order"
          ? "wait"
          : "off",
    leadTime: v.lead_time_days
      ? `Usually ${v.lead_time_days.min === v.lead_time_days.max ? v.lead_time_days.min : `${v.lead_time_days.min}–${v.lead_time_days.max}`} days`
      : "",
  }));
  const compatible = COMPATIBILITY.filter(
    ([key]) => product.compatibility[key],
  );

  return (
    <main className="hw-store">
      <section className="px-5 pb-16 pt-10 md:pt-14">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-8 text-sm text-slate-600" aria-label="Breadcrumb">
            <Link href="/hardware" className="hover:text-[#07154b]">
              Hardware
            </Link>
            {product.category ? (
              <>
                <span className="mx-2">/</span>
                <Link
                  href={`/hardware?category=${product.category.slug}`}
                  className="hover:text-[#07154b]"
                >
                  {product.category.name}
                </Link>
              </>
            ) : null}
          </nav>
          <ProductShowcase
            name={product.name}
            images={images}
            variants={variants}
            productSlug={product.slug}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
              {[product.brand?.name, product.model]
                .filter(Boolean)
                .join(" · ") || "Oyi Hardware"}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
              {product.name}
            </h1>
            {product.summary ? (
              <p className="mt-4 text-lg leading-8 text-slate-600">
                {product.summary}
              </p>
            ) : null}
            <div className="mt-6" />
          </ProductShowcase>
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">About this product</h2>
            <div className="mt-4 whitespace-pre-line text-slate-600">
              {product.description || product.summary}
            </div>
            {compatible.length ? (
              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                  Works with
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {compatible.map(([key, label]) => (
                    <span
                      key={key}
                      className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-sm text-blue-700"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                {product.compatibility.notes ? (
                  <p className="mt-3 text-sm text-slate-600">
                    {product.compatibility.notes}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
          {product.specifications.length ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8">
              <h2 className="text-xl font-semibold">Specifications</h2>
              <dl className="mt-4 divide-y divide-white/10">
                {product.specifications.map((spec) => (
                  <div
                    key={spec.key}
                    className="grid grid-cols-[1fr_1.2fr] gap-4 py-3 text-sm"
                  >
                    <dt className="text-slate-600">{spec.key}</dt>
                    <dd className="text-[#07154b]">
                      {spec.value}
                      {spec.unit ? ` ${spec.unit}` : ""}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
