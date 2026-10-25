"use client";
import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ProductCard, type StoreCard } from "./HardwareBrowser";

export function FeaturedProducts({
  featured,
  arrivals,
}: {
  featured: StoreCard[];
  arrivals: StoreCard[];
}) {
  const groups = [
    { name: "Featured", items: featured },
    { name: "New Arrivals", items: arrivals },
  ].filter((g) => g.items.length);
  const [selected, setSelected] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  if (!groups.length) return null;
  const active = Math.min(selected, groups.length - 1);
  return (
    <section className="hw-section hw-featured">
      <div className="hw-section-head">
        <h2>Featured Products</h2>
        <div
          className="hw-feature-tabs"
          role="tablist"
          aria-label="Product collections"
        >
          {groups.map((g, i) => (
            <button
              key={g.name}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${id}-tab-${i}`}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-controls={`${id}-panel`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setSelected(i)}
              onKeyDown={(e) => {
                const next =
                  e.key === "ArrowRight"
                    ? (i + 1) % groups.length
                    : e.key === "ArrowLeft"
                      ? (i + groups.length - 1) % groups.length
                      : e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? groups.length - 1
                          : null;
                if (next !== null) {
                  e.preventDefault();
                  setSelected(next);
                  refs.current[next]?.focus();
                }
              }}
            >
              {g.name}
            </button>
          ))}
        </div>
        <Link href="#browse">View all products →</Link>
      </div>
      <div
        id={`${id}-panel`}
        role="tabpanel"
        aria-labelledby={`${id}-tab-${active}`}
        tabIndex={0}
        className="hw-products"
      >
        {groups[active].items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
