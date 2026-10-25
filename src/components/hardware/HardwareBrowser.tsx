/* eslint-disable @next/next/no-img-element -- Office supplies validated, processed WebP renditions. */
"use client";
import { useState } from "react";
import Link from "next/link";
import type { PublicCard } from "@/lib/catalogue";
export type StoreCard = PublicCard & {
  image: string;
  priceLabel: string;
  availabilityLabel: string;
};
export function ProductCard({ product }: { product: StoreCard }) {
  return (
    <article className="hw-card" data-product-card={product.slug}>
      <Link href={`/hardware/${product.slug}`} className="hw-card-image">
        {product.image ? (
          <img
            src={product.image}
            alt={product.cover?.alt || product.name}
            loading="lazy"
          />
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
        <p className="hw-price">{product.priceLabel || "Price on request"}</p>
        <p className={`hw-availability hw-${product.availability}`}>
          {product.availabilityLabel}
        </p>
        <Link
          className="hw-quote"
          href={`/contact?type=tech_oem&product=${encodeURIComponent(product.slug)}`}
        >
          {product.availability === "unavailable"
            ? "Ask about availability"
            : "Request quote"}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
export function HardwareBrowser({
  products,
  initialCategory,
}: {
  products: StoreCard[];
  initialCategory: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [stock, setStock] = useState("");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const categories = [
    ...new Map(
      products
        .filter((p) => p.category)
        .map((p) => [p.category!.slug, p.category!]),
    ).values(),
  ];
  const filtered = products
    .filter(
      (p) =>
        (!category || p.category?.slug === category) &&
        (!stock || p.availability === stock) &&
        `${p.name} ${p.model} ${p.brand?.name || ""} ${p.summary}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
    )
    .sort((a, b) =>
      sort === "price"
        ? (a.price_from_kobo ?? Infinity) - (b.price_from_kobo ?? Infinity) ||
          a.name.localeCompare(b.name)
        : a.name.localeCompare(b.name),
    );
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const current = Math.min(page, pages);
  return (
    <section id="browse" className="hw-section">
      <div className="hw-section-head">
        <h2>Browse hardware</h2>
        <span aria-live="polite">{filtered.length} products</span>
      </div>
      <div className="hw-filters">
        <label className="hw-search">
          Search hardware
          <input
            type="search"
            placeholder="Search products, brands or solutions"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Availability
          <select
            value={stock}
            onChange={(e) => {
              setStock(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Any availability</option>
            <option value="in_stock">In stock</option>
            <option value="available_to_order">Available to order</option>
            <option value="unavailable">Currently unavailable</option>
          </select>
        </label>
        <label>
          Sort by
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="name">Name</option>
            <option value="price">Price: low to high</option>
          </select>
        </label>
      </div>
      {filtered.length ? (
        <div className="hw-products" data-product-grid>
          {filtered.slice((current - 1) * 12, current * 12).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      ) : (
        <div className="hw-empty" data-state="empty">
          <h3>
            {products.length
              ? "No matching products"
              : "Our hardware catalogue is on its way."}
          </h3>
          <p>
            {products.length
              ? "Try another search or category."
              : "Approved products will appear here when released by the Oyi team. Tell us what you need in the meantime."}
          </p>
          <Link href="/contact?type=tech_oem">Contact sales →</Link>
        </div>
      )}
      {pages > 1 && (
        <nav className="hw-pagination" aria-label="Product pages">
          <button disabled={current === 1} onClick={() => setPage(current - 1)}>
            Previous
          </button>
          <span>
            Page {current} of {pages}
          </span>
          <button
            disabled={current === pages}
            onClick={() => setPage(current + 1)}
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}
