// Presentation only. Every product/image/price comes from Office's public projection.
import Link from "next/link";
import {
  AVAILABILITY_LABEL,
  imageUrl,
  naira,
  type CatalogueResult,
  type PublicCard,
  type PublicCategory,
  type Merchandising,
} from "@/lib/catalogue";
import StoryCarousel, { type StorySlide } from "./StoryCarousel";
import {
  HardwareBrowser,
  ProductCard,
  type StoreCard,
} from "./HardwareBrowser";
import { applyQuery, isComplete, priceLabel, type CatalogueQuery } from "@/lib/catalogueQuery";
import "./hardware.css";
import { FeaturedProducts } from "./FeaturedProducts";
const categoryCaption: Record<string, string> = {
  "smart-locks": "Secure and convenient access",
  "security-cameras": "Indoor and outdoor cameras",
  "smart-lighting": "Control your space",
  "home-automation": "Smarter connected living",
  "sensors-accessories": "Complete your setup",
};
const fallback: StorySlide[] = [
  {
    key: "hardware",
    eyebrow: "OYI HARDWARE",
    title: "Smarter Spaces, Safer Living",
    description:
      "Explore hardware for homes, offices and buildings across Nigeria. Speak to Oyi about the right products for your space.",
    ctaLabel: "Explore hardware",
    ctaHref: "#browse",
    durationMs: 8000,
  },
];
export function HardwareHero() {
  return (
    <StoryCarousel slides={fallback} ariaLabel="Oyi hardware highlights" />
  );
}
function card(p: PublicCard): StoreCard {
  return {
    ...p,
    image: p.cover ? imageUrl(p.cover.src) : "",
    priceLabel: priceLabel(p, naira),
    availabilityLabel: AVAILABILITY_LABEL[p.availability],
  };
}
export function HardwareCatalogue({
  products,
  categories,
  query,
  merchandising,
}: {
  products: CatalogueResult<{ products: PublicCard[]; total: number }>;
  categories: CatalogueResult<{ categories: PublicCategory[] }>;
  query: CatalogueQuery;
  merchandising?: CatalogueResult<Merchandising>;
}) {
  // Only complete products are shown anywhere on the page (defence in depth over Office's publication rules).
  const raw = products.state === "ok" ? products.data.products : [];
  const list = raw.filter(isComplete).map(card);
  const cats =
    categories.state === "ok"
      ? categories.data.categories.filter((c) => c.product_count > 0)
      : [];
  const merch = merchandising?.state === "ok" ? merchandising.data : null;
  const result = applyQuery(raw, query, merch?.featured || []);
  const shown = result.items.map(card);
  const slides: StorySlide[] =
    merch?.slides.map((s) => ({
      ...s,
      image: s.image ? { ...s.image, src: imageUrl(s.image.src) } : undefined,
    })) || [];
  const bySlug = new Map(list.map((p) => [p.slug, p]));
  const featured = (merch?.featured || [])
    .map((slug) => bySlug.get(slug))
    .filter((p): p is StoreCard => !!p);
  const arrivals = (merch?.new_arrivals || [])
    .map((slug) => bySlug.get(slug))
    .filter((p): p is StoreCard => !!p);
  return (
    <main className="hw-store">
      <StoryCarousel
        slides={slides.length ? slides : fallback}
        ariaLabel="Oyi hardware highlights"
      />
      <div className="hw-service-strip">
        {[
          [
            "◇",
            "Office-managed catalogue",
            "Product details from the Oyi team",
          ],
          [
            "↗",
            "Nationwide hardware supply",
            "Discuss delivery to your location",
          ],
          ["◎", "Product guidance", "Find the right hardware for your space"],
          ["⌘", "Installation options", "Available by separate quotation"],
        ].map(([icon, title, body]) => (
          <div key={title}>
            <span aria-hidden="true">{icon}</span>
            <div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="hw-container">
        <section className="hw-section" id="categories">
          <div className="hw-section-head">
            <h2>Shop by Category</h2>
            <Link href="#browse">View all products →</Link>
          </div>
          {cats.length ? (
            <div className="hw-categories">
              {cats.map((c) => {
                const cover = list.find(
                  (p) => p.category?.slug === c.slug && p.image,
                );
                return (
                  <Link
                    key={c.slug}
                    href={`/hardware?category=${c.slug}#browse`}
                    className="hw-category"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- published Office imagery only */}
                    {cover && <img src={cover.image} alt="" loading="lazy" />}
                    <span>
                      <span>
                        <strong>{c.name}</strong>
                        <small>
                          {categoryCaption[c.slug] ||
                            `Explore ${c.name.toLowerCase()}`}
                        </small>
                      </span>
                      <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="hw-muted">
              Categories will appear with released products.
            </p>
          )}
        </section>
        <FeaturedProducts featured={featured} arrivals={arrivals} />
        {merch?.collections.map((c) => {
          const items = c.products
            .map((slug) => bySlug.get(slug))
            .filter((p): p is StoreCard => !!p);
          return items.length ? (
            <section className="hw-section" key={c.key}>
              <div className="hw-section-head">
                <div>
                  <h2>{c.title}</h2>
                  <p className="hw-muted">{c.description}</p>
                </div>
              </div>
              <div className="hw-products">
                {items.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          ) : null;
        })}
        {products.state === "unavailable" ? (
          <section className="hw-empty" data-state="unavailable">
            <h2>The hardware catalogue is temporarily unavailable.</h2>
            <p>Please try again shortly or speak to the Oyi team.</p>
            <Link href="/contact?type=tech_oem">Contact sales →</Link>
          </section>
        ) : (
          <HardwareBrowser
            items={shown}
            total={result.total}
            page={result.page}
            pages={result.pages}
            query={query}
            facets={result.facets}
            catalogueEmpty={list.length === 0}
          />
        )}
        <section className="hw-advice">
          <div>
            <p className="hw-eyebrow">LET’S FIND THE RIGHT FIT</p>
            <h2>
              Hardware for your space.
              <br />
              Guidance for your next step.
            </h2>
            <p>
              Tell us what you need. We’ll help with product selection and a
              quotation, with delivery and installation discussed separately.
            </p>
          </div>
          <Link href="/contact?type=tech_oem" className="hw-primary">
            Contact sales <span aria-hidden="true">→</span>
          </Link>
        </section>
        <p className="hw-footnote">
          Prices include VAT where applicable. Availability is confirmed with
          your quotation.{" "}
          Online ordering is not available.
        </p>
      </div>
    </main>
  );
}
export function HardwareLoading() {
  return (
    <main className="hw-store" aria-busy="true">
      <HardwareHero />
      <p className="hw-container hw-section" role="status">
        Loading hardware…
      </p>
    </main>
  );
}
