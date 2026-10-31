/* eslint-disable @next/next/no-img-element -- Office supplies validated, processed WebP renditions. */
// Phase 5D: server-rendered browsing. The filter form is a plain GET form and pagination is links, so every view has its own URL,
// works without JavaScript and can be indexed. Presentation only: products, prices and availability come from Office.
import Link from "next/link";
import type { PublicCard } from "@/lib/catalogue";
import { queryHref, type CatalogueQuery } from "@/lib/catalogueQuery";
export type StoreCard = PublicCard & {
  image: string;
  priceLabel: string;
  availabilityLabel: string;
};
export function ProductCard({ product }: { product: StoreCard }) {
  return (
    <article className="hw-card" data-product-card={product.slug}>
      <Link href={`/hardware/${product.slug}`} className="hw-card-image" tabIndex={-1} aria-hidden="true">
        {product.image ? (
          <img src={product.image} alt="" loading="lazy" width={480} height={360} />
        ) : (
          <span>Image unavailable</span>
        )}
      </Link>
      <div className="hw-card-body">
        <p className="hw-card-category">{product.category?.name}</p>
        <h3>
          <Link href={`/hardware/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="hw-card-summary">{product.summary}</p>
        <p className="hw-price" data-price>{product.priceLabel || "Price on request"}</p>
        <p className={`hw-availability hw-${product.availability}`}>{product.availabilityLabel}</p>
        <Link className="hw-quote" href={`/contact?type=tech_oem&product=${encodeURIComponent(product.slug)}`}>
          {product.availability === "unavailable" ? "Ask about availability" : product.price_from_kobo != null ? "Enquire" : "Request a price"}
          <span className="sr-only"> for {product.name}</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}

type Facet = { slug: string; name: string };
export function HardwareBrowser({
  items,
  total,
  page,
  pages,
  query,
  facets,
  catalogueEmpty,
}: {
  items: StoreCard[];
  total: number;
  page: number;
  pages: number;
  query: CatalogueQuery;
  facets: { categories: Facet[]; brands: Facet[] };
  catalogueEmpty: boolean;
}) {
  const filtered = Boolean(query.q || query.category || query.brand || query.availability);
  return (
    <section id="browse" className="hw-section" aria-labelledby="browse-heading">
      <div className="hw-section-head">
        <h2 id="browse-heading">Browse the Store</h2>
        <span role="status" data-result-count>
          {total} {total === 1 ? "product" : "products"}
        </span>
      </div>
      <form className="hw-filters" method="get" action="/hardware#browse" role="search" aria-label="Filter products">
        <label className="hw-search">
          Search the Store
          <input type="search" name="q" defaultValue={query.q} maxLength={80} placeholder="Search products or brands" />
        </label>
        <label>
          Category
          <select name="category" defaultValue={query.category}>
            <option value="">All categories</option>
            {facets.categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </label>
        <label>
          Brand
          <select name="brand" defaultValue={query.brand}>
            <option value="">All brands</option>
            {facets.brands.map((b) => (
              <option key={b.slug} value={b.slug}>{b.name}</option>
            ))}
          </select>
        </label>
        <label>
          Availability
          <select name="availability" defaultValue={query.availability}>
            <option value="">Any availability</option>
            <option value="in_stock">In stock</option>
            <option value="available_to_order">Available to order</option>
            <option value="unavailable">Currently unavailable</option>
          </select>
        </label>
        <label>
          Sort by
          <select name="sort" defaultValue={query.sort}>
            <option value="featured">Featured</option>
            <option value="name">Name</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="newest">Newest</option>
          </select>
        </label>
        <button type="submit" className="hw-apply">Apply</button>
        {filtered ? <Link href="/hardware#browse" className="hw-clear">Clear filters</Link> : null}
      </form>
      {items.length ? (
        <div className="hw-products" data-product-grid>
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="hw-empty" data-state="empty">
          <h3>{catalogueEmpty ? "Approved products are on their way." : "No matching products"}</h3>
          <p>
            {catalogueEmpty
              ? "Products appear here as the Oyi team reviews and releases them. Tell us what you need in the meantime."
              : "Try another search or clear the filters."}
          </p>
          <Link href="/contact?type=tech_oem">Ask about hardware →</Link>
        </div>
      )}
      {pages > 1 && (
        <nav className="hw-pagination" aria-label="Product pages">
          {page > 1 ? <Link href={queryHref({ ...query, page: page - 1 })} rel="prev">Previous</Link> : <span aria-disabled="true">Previous</span>}
          <ol>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                <Link href={queryHref({ ...query, page: n })} aria-current={n === page ? "page" : undefined} aria-label={`Page ${n}`}>{n}</Link>
              </li>
            ))}
          </ol>
          {page < pages ? <Link href={queryHref({ ...query, page: page + 1 })} rel="next">Next</Link> : <span aria-disabled="true">Next</span>}
        </nav>
      )}
    </section>
  );
}
