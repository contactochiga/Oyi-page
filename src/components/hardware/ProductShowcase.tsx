"use client";
// Gallery + variant choice + price for one product. Shared by the public product page and the staff preview, so a preview renders exactly
// like the published page. Images are this site's own image routes (resolved on the server); no ordering or payment happens here.
import { useMemo, useState } from "react";
import Link from "next/link";
import { hardwareEnquiryQuery } from "@/lib/hardwareEnquiry";

export type ShowcaseImage = {
  src: string;
  srcSet: string;
  thumb: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  variantSkus: string[];
};
export type ShowcaseVariant = {
  sku: string;
  name: string;
  options: Record<string, string>;
  price: string;
  availability: string;
  availabilityTone: "ok" | "wait" | "off";
  leadTime: string;
};

const TONE = {
  ok: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
  wait: "border-amber-300/30 bg-amber-400/10 text-amber-200",
  off: "border-white/15 bg-white/5 text-slate-300",
};

export function ProductShowcase({
  name,
  images,
  variants,
  children,
  productSlug,
}: {
  name: string;
  productSlug: string;
  images: ShowcaseImage[];
  variants: ShowcaseVariant[];
  children?: React.ReactNode;
}) {
  const firstAvailable =
    variants.find((v) => v.availabilityTone !== "off") || variants[0];
  const [sku, setSku] = useState(firstAvailable ? firstAvailable.sku : "");
  const [active, setActive] = useState(0);
  const variant = variants.find((v) => v.sku === sku) || firstAvailable;
  // images linked to specific variants show only for those variants; unlinked images show for all
  const shown = useMemo(() => {
    const list = images.filter(
      (image) => !image.variantSkus.length || image.variantSkus.includes(sku),
    );
    return list.length ? list : images;
  }, [images, sku]);
  const current = shown[Math.min(active, shown.length - 1)];

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white">
          {current ? (
            // eslint-disable-next-line @next/next/no-img-element -- Office already serves sized WebP renditions with srcset
            <img
              src={current.src}
              srcSet={current.srcSet}
              sizes="(min-width: 1024px) 50vw, 100vw"
              width={current.width}
              height={current.height}
              alt={current.alt}
              className="aspect-square w-full object-contain"
              data-main-image
            />
          ) : (
            <div className="grid aspect-square place-items-center text-sm text-slate-500">
              No image
            </div>
          )}
        </div>
        {current?.caption ? (
          <p className="mt-3 text-sm text-slate-300">{current.caption}</p>
        ) : null}
        {shown.length > 1 ? (
          <div
            className="mt-4 grid grid-cols-5 gap-3"
            role="list"
            aria-label={`${name} images`}
          >
            {shown.map((image, index) => (
              <div key={image.src} role="listitem">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show image ${index + 1}: ${image.alt}`}
                  aria-current={index === active}
                  className={`overflow-hidden rounded-2xl border bg-white transition ${index === active ? "border-sky-300 ring-2 ring-sky-300/50" : "border-white/10 hover:border-sky-300/50"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.thumb}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full object-contain"
                  />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div>
        {children}
        {variant ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <p className="text-3xl font-semibold text-white" data-price>
              {variant.price || "Price on request"}
            </p>
            {variant.price ? (
              <p className="mt-1 text-sm text-slate-300">
                Including 7.5% VAT where applicable. Delivery and installation
                are arranged separately.
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${TONE[variant.availabilityTone]}`}
                data-availability
              >
                {variant.availability}
              </span>
              {variant.leadTime ? (
                <span className="text-xs text-slate-300">
                  {variant.leadTime}
                </span>
              ) : null}
            </div>
            {variants.length > 1 ? (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                  Options
                </p>
                <div
                  className="mt-3 flex flex-wrap gap-2"
                  role="radiogroup"
                  aria-label="Product options"
                >
                  {variants.map((v) => (
                    <button
                      key={v.sku}
                      type="button"
                      role="radio"
                      aria-checked={v.sku === sku}
                      tabIndex={v.sku === sku ? 0 : -1}
                      onKeyDown={(event) => {
                        const i = variants.indexOf(v);
                        const next =
                          event.key === "ArrowRight" ||
                          event.key === "ArrowDown"
                            ? (i + 1) % variants.length
                            : event.key === "ArrowLeft" ||
                                event.key === "ArrowUp"
                              ? (i + variants.length - 1) % variants.length
                              : event.key === "Home"
                                ? 0
                                : event.key === "End"
                                  ? variants.length - 1
                                  : null;
                        if (next !== null) {
                          event.preventDefault();
                          setSku(variants[next].sku);
                          setActive(0);
                          (
                            event.currentTarget.parentElement?.querySelectorAll(
                              "button",
                            )[next] as HTMLButtonElement
                          )?.focus();
                        }
                      }}
                      onClick={() => {
                        setSku(v.sku);
                        setActive(0);
                      }}
                      className={`rounded-full border px-4 py-2 text-sm transition ${v.sku === sku ? "border-sky-300 bg-sky-400/15 text-white" : "border-white/15 text-slate-300 hover:border-sky-300/50"} ${v.availabilityTone === "off" ? "opacity-60" : ""}`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <p className="mt-6 text-xs text-slate-400">SKU {variant.sku}</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-slate-300">
            This product is currently unavailable.
          </div>
        )}
        <div className="mt-6 grid gap-3">
          <Link
            href={`/contact?${hardwareEnquiryQuery(productSlug, variant?.sku)}`}
            className="inline-flex justify-center rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-300"
            data-enquiry
          >
            {!variant || variant.availabilityTone === "off"
              ? "Ask about availability"
              : variant.price
                ? "Enquire about this product"
                : "Request a price"}
          </Link>
          <p className="text-xs text-slate-400">
            Online ordering is not open yet. The Oyi team confirms
            availability, delivery and installation with you.
          </p>
        </div>
      </div>
    </div>
  );
}
