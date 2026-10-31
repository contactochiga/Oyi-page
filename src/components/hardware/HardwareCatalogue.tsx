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
    key: "store",
    eyebrow: "OYI STORE",
    title: "Hardware approved to work with Oyi",
    description:
      "Devices our team has reviewed and approved for buildings running Oyi, with integrated Ochiga packages to follow.",
    ctaLabel: "Browse the Store",
    ctaHref: "#browse",
    durationMs: 8000,
  },
];
export function HardwareHero() {
  return (
    <StoryCarousel slides={fallback} ariaLabel="Oyi Store highlights" />
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
        ariaLabel="Oyi Store highlights"
      />
      <div className="hw-service-strip">
        {[
          ["◇", "Approved by the Oyi team", "Every product is reviewed before it appears"],
          ["◈", "Clear pricing", "Fixed prices where approved, otherwise on request"],
          ["◎", "Product guidance", "Help choosing hardware for your building"],
          ["⌘", "Installation", "Planned with you through a consultation"],
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
        {products.state === "ok" && list.length === 0 ? (
          <StoreOpening />
        ) : (
        <>
        <section className="hw-section" id="categories">
          <div className="hw-section-head">
            <h2>Shop by category</h2>
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
            <h2>The Store is temporarily unavailable.</h2>
            <p>Please try again shortly, or ask the Oyi team about hardware directly.</p>
            <Link href="/contact?type=tech_oem">Ask about hardware →</Link>
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
        </>
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
              Tell us what you need and we’ll help you choose. Approved products
              show their price where it is fixed; custom solutions, delivery and
              installation are planned with you through a consultation.
            </p>
          </div>
          <div className="hw-advice-actions">
            <Link href="/contact?type=tech_oem" className="hw-primary">
              Ask about hardware <span aria-hidden="true">→</span>
            </Link>
            <Link href="/deployments" className="hw-secondary">
              Request a consultation
            </Link>
          </div>
        </section>
        <p className="hw-footnote">
          Prices include VAT where applicable. Delivery and installation are
          arranged separately. Online ordering is not open yet.
        </p>
      </div>
    </main>
  );
}
// Zero released products: a finished page with no listings, prices, filters or counts -- only what the Store is and how to get help now.
function StoreOpening() {
  return (
    <section className="hw-section hw-opening" data-state="empty" aria-labelledby="store-opening">
      <p className="hw-eyebrow">THE OYI STORE</p>
      <h2 id="store-opening">Approved products are on their way.</h2>
      <p className="hw-muted">
        Products appear here as the Oyi team reviews and releases them. Until
        then, we can help you choose hardware for your building.
      </p>
      <div className="hw-opening-actions">
        <Link href="/contact?type=tech_oem" className="hw-primary">
          Ask about hardware <span aria-hidden="true">→</span>
        </Link>
        <Link href="/deployments" className="hw-secondary">
          Request a consultation
        </Link>
      </div>
      <ul className="hw-opening-points">
        <li><strong>Approved hardware only</strong><span>Reviewed by the Oyi team for buildings running Oyi.</span></li>
        <li><strong>Integrated Ochiga packages</strong><span>Coming later, for common building needs.</span></li>
        <li><strong>Fixed price or consultation</strong><span>Clear prices for approved products; custom solutions planned with you.</span></li>
      </ul>
    </section>
  );
}

export function HardwareLoading() {
  return (
    <main className="hw-store" aria-busy="true">
      <HardwareHero />
      <p className="hw-container hw-section" role="status">
        Loading the Store…
      </p>
    </main>
  );
}
