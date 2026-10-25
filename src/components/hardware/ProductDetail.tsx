// One product, as GetOyi shows it. Used by /hardware/[slug] (published version) and /hardware/preview/[token] (a staff preview of any
// version), so the preview is the real page. Ordering is by conversation only: there is no cart, checkout or payment.
import Link from "next/link";
import { ProductShowcase, type ShowcaseImage, type ShowcaseVariant } from "@/components/hardware/ProductShowcase";
import { AVAILABILITY_LABEL, imageUrl, naira, type PublicProduct } from "@/lib/catalogue";

const COMPATIBILITY: [keyof Omit<PublicProduct["compatibility"], "notes">, string][] = [["facility", "Oyi Facility"], ["experience", "Oyi Experience"], ["core", "Oyi Core"], ["edge", "Oyi Edge"]];

export function ProductDetail({ product, previewToken }: { product: PublicProduct; previewToken?: string }) {
  const images: ShowcaseImage[] = product.images.map((image) => ({
    src: imageUrl(image.src, previewToken),
    srcSet: image.srcset.map((s) => `${imageUrl(s.src, previewToken)} ${s.width}w`).join(", "),
    thumb: imageUrl(image.thumb, previewToken),
    width: image.width,
    height: image.height,
    alt: image.alt,
    caption: image.caption,
    variantSkus: image.variant_skus,
  })).filter((image) => image.src);
  const variants: ShowcaseVariant[] = product.variants.map((v) => ({
    sku: v.sku,
    name: v.name,
    options: v.options,
    price: v.price ? naira(v.price.amount_kobo) : "",
    availability: AVAILABILITY_LABEL[v.availability],
    availabilityTone: v.availability === "in_stock" ? "ok" : v.availability === "available_to_order" ? "wait" : "off",
    leadTime: v.lead_time_days ? `Usually ${v.lead_time_days.min === v.lead_time_days.max ? v.lead_time_days.min : `${v.lead_time_days.min}–${v.lead_time_days.max}`} days` : "",
  }));
  const compatible = COMPATIBILITY.filter(([key]) => product.compatibility[key]);
  const enquiry = `/contact?type=tech_oem&product=${encodeURIComponent(product.slug)}`;

  return (
    <main className="bg-[#050b14] text-white">
      <section className="px-5 pb-16 pt-10 md:pt-14">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-8 text-sm text-slate-400" aria-label="Breadcrumb">
            <Link href="/hardware" className="hover:text-white">Hardware</Link>
            {product.category ? (<><span className="mx-2">/</span><Link href={`/hardware?category=${product.category.slug}`} className="hover:text-white">{product.category.name}</Link></>) : null}
          </nav>
          <ProductShowcase
            name={product.name}
            images={images}
            variants={variants}
            footer={
              <div className="mt-6 grid gap-3">
                <Link href={enquiry} className="inline-flex justify-center rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-300" data-enquiry>
                  Talk to Oyi about this product
                </Link>
                <p className="text-xs text-slate-500">Online ordering is not available yet — the Oyi team confirms availability, delivery and installation with you.</p>
              </div>
            }
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">{[product.brand?.name, product.model].filter(Boolean).join(" · ") || "Oyi Hardware"}</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">{product.name}</h1>
            {product.summary ? <p className="mt-4 text-lg leading-8 text-slate-300">{product.summary}</p> : null}
            <div className="mt-6" />
          </ProductShowcase>
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
            <h2 className="text-xl font-semibold">About this product</h2>
            <div className="mt-4 whitespace-pre-line text-slate-300">{product.description || product.summary}</div>
            {compatible.length ? (
              <div className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Works with</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {compatible.map(([key, label]) => <span key={key} className="rounded-full border border-sky-300/30 bg-sky-400/10 px-3 py-1 text-sm text-sky-100">{label}</span>)}
                </div>
                {product.compatibility.notes ? <p className="mt-3 text-sm text-slate-400">{product.compatibility.notes}</p> : null}
              </div>
            ) : null}
          </div>
          {product.specifications.length ? (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 md:p-8">
              <h2 className="text-xl font-semibold">Specifications</h2>
              <dl className="mt-4 divide-y divide-white/10">
                {product.specifications.map((spec) => (
                  <div key={spec.key} className="grid grid-cols-[1fr_1.2fr] gap-4 py-3 text-sm">
                    <dt className="text-slate-400">{spec.key}</dt>
                    <dd className="text-white">{spec.value}{spec.unit ? ` ${spec.unit}` : ""}</dd>
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
