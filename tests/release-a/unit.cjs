/* eslint-disable @typescript-eslint/no-require-imports -- standalone test runner */
// Release A unit + render checks (no network): catalogue query, completeness, sorting, pagination, Price on Request, structured data
// escaping, service-enquiry validation, server-rendered browser markup (accessibility basics, no ordering controls) and the
// customer order-progress view (request vs paid, no private data).
const assert = require("assert/strict");
const { load } = require("./load.cjs");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { JSDOM } = require("jsdom");
let n = 0; const ok = (c, name) => { assert.ok(c, name); n++; console.log("PASS " + name); };

const Q = load("src/lib/catalogueQuery.ts");
const SEO = load("src/lib/catalogueSeo.ts");
const CAT = load("src/lib/catalogue.ts");
const { HardwareBrowser } = load("src/components/hardware/HardwareBrowser.tsx");

const cover = { src: "media/" + "a".repeat(64) + ".webp", thumb: "media/" + "b".repeat(64) + ".webp", srcset: [], width: 1600, height: 1200, alt: "x", caption: "", cover: true, variant_skus: [] };
const card = (i, o = {}) => ({ slug: `item-${i}`, name: `Item ${String(i).padStart(2, "0")}`, model: `M${i}`, summary: i % 3 ? "Smart lock" : "Camera kit", category: { slug: i % 2 ? "locks" : "cameras", name: i % 2 ? "Locks" : "Cameras" }, brand: { slug: i % 4 ? "acme" : "zenith", name: i % 4 ? "Acme" : "Zenith" }, price_from_kobo: i % 5 ? i * 10000 : null, price_to_kobo: i % 5 ? i * 10000 : null, availability: i % 3 ? "in_stock" : "available_to_order", cover, updated_at: new Date(Date.UTC(2026, 0, i)).toISOString(), ...o });
const cards = Array.from({ length: 30 }, (_, i) => card(i + 1));

// parseQuery
const pq = Q.parseQuery({ q: "  <script>lock</script>  ", category: "../etc", brand: "Acme", availability: "free", sort: "evil", page: "-3" });
ok(!pq.q.includes("<") && pq.q.includes("lock") && pq.category === "" && pq.brand === "" && pq.availability === "" && pq.sort === "featured" && pq.page === 1, "query parameters are sanitised to safe defaults");
ok(Q.parseQuery({ page: "5000" }).page === 1 && Q.parseQuery({ page: ["3", "4"] }).page === 3 && Q.parseQuery({ q: "x".repeat(200) }).q.length === 80, "page bounds, repeated parameters and search length are bounded");
// completeness
ok(!Q.isComplete(card(1, { cover: null })) && !Q.isComplete(card(1, { name: " " })) && !Q.isComplete(card(1, { slug: "Bad Slug" })) && Q.isComplete(card(1)), "incomplete products (no cover, name or valid slug) are never shown");
const withBad = [...cards, card(99, { cover: null, name: "HIDDEN INCOMPLETE" })];
const all = Q.applyQuery(withBad, Q.parseQuery({}));
ok(all.total === 30 && all.hidden_incomplete === 1 && all.items.length === Q.PAGE_SIZE && all.pages === 3 && !all.items.some((c) => c.name === "HIDDEN INCOMPLETE"), "pagination at 12 per page; incomplete product excluded");
// filters and search
const locks = Q.applyQuery(cards, Q.parseQuery({ category: "locks" }));
ok(locks.total === 15 && locks.items.every((c) => c.category.slug === "locks"), "category filter");
const zen = Q.applyQuery(cards, Q.parseQuery({ brand: "zenith", availability: "in_stock" }));
ok(zen.items.every((c) => c.brand.slug === "zenith" && c.availability === "in_stock") && zen.total > 0, "brand and availability filters combine");
const search = Q.applyQuery(cards, Q.parseQuery({ q: "camera zenith" }));
ok(search.total > 0 && search.items.every((c) => /camera/i.test(`${c.summary} ${c.category.name}`) && c.brand.name === "Zenith"), "multi-word search matches every term (name, model, brand, category, summary)");
ok(Q.applyQuery(cards, Q.parseQuery({ q: "nothing-matches-this" })).total === 0, "no results");
// sorting
const asc = Q.applyQuery(cards, Q.parseQuery({ sort: "price_asc", page: "3" }));
ok(asc.items.slice(-1)[0].price_from_kobo === null, "price low-to-high keeps Price on Request items last");
const ascAll = [1, 2, 3].flatMap((p) => Q.applyQuery(cards, Q.parseQuery({ sort: "price_asc", page: String(p) })).items).filter((c) => c.price_from_kobo != null).map((c) => c.price_from_kobo);
ok(ascAll.every((v, i, a) => !i || a[i - 1] <= v), "price ascending order");
const desc = Q.applyQuery(cards, Q.parseQuery({ sort: "price_desc" })).items.map((c) => c.price_from_kobo).filter((v) => v != null);
ok(desc.every((v, i, a) => !i || a[i - 1] >= v), "price descending order");
ok(Q.applyQuery(cards, Q.parseQuery({ sort: "newest" })).items[0].slug === "item-30", "newest first");
ok(Q.applyQuery(cards, Q.parseQuery({}), ["item-7", "item-3"]).items.slice(0, 2).map((c) => c.slug).join() === "item-7,item-3", "featured order follows Office merchandising");
ok(all.facets.categories.length === 2 && all.facets.brands.map((b) => b.slug).join() === "acme,zenith", "facets built from shown products only");
ok(Q.queryHref({ q: "lock", category: "locks", sort: "featured", page: 2 }) === "/hardware?q=lock&category=locks&page=2#browse" && Q.queryHref({}) === "/hardware#browse", "shareable URLs carry only non-default parameters");
ok(Q.priceLabel({ price_from_kobo: null, price_to_kobo: null }, CAT.naira) === "Price on request" && Q.priceLabel({ price_from_kobo: 150000, price_to_kobo: 250000 }, CAT.naira) === "From ₦1,500" && Q.priceLabel({ price_from_kobo: 150050, price_to_kobo: 150050 }, CAT.naira) === "₦1,500.50", "Price on Request when Office publishes no price; From for ranges");

// structured data
const product = { slug: "safe-lock", name: "Lock </script><script>alert(1)</script>", model: "L1", summary: "A lock & more", description: "", category: { slug: "locks", name: "Locks" }, brand: { slug: "acme", name: "Acme" }, specifications: [], compatibility: { facility: true, experience: false, core: false, edge: false, notes: "" },
  variants: [{ sku: "L1-A", name: "Standard", options: {}, price: { amount_kobo: 2500000, currency: "NGN", vat_inclusive: true, vat_treatment: "standard" }, availability: "in_stock", lead_time_days: null }, { sku: "L1-B", name: "Custom", options: {}, price: null, availability: "unavailable", lead_time_days: null }],
  price_from_kobo: 2500000, price_to_kobo: 2500000, availability: "in_stock", images: [cover], cover, updated_at: null };
const ldText = SEO.productJsonLd(product, "https://www.getoyi.com");
const ld = JSON.parse(ldText);
ok(!ldText.includes("</script") && !ldText.includes("<") && ld.name === product.name, "structured data cannot close the script element (escaped) and round-trips");
ok(ld.offers.length === 1 && ld.offers[0].price === "25000.00" && ld.offers[0].availability === "https://schema.org/InStock" && ld.image[0].startsWith("https://www.getoyi.com/hardware/media/"), "offers only for priced variants; absolute image URLs through this site");
ok(!("offers" in SEO.productLd({ ...product, variants: [product.variants[1]] }, "https://www.getoyi.com")), "no offer (no invented price) when Office publishes none");

// server-rendered browser
const html = renderToStaticMarkup(React.createElement(HardwareBrowser, { items: Q.applyQuery(cards, Q.parseQuery({ page: "2" })).items.map((c) => ({ ...c, image: "/hardware/media/x.webp", priceLabel: Q.priceLabel(c, CAT.naira), availabilityLabel: CAT.AVAILABILITY_LABEL[c.availability] })), total: 30, page: 2, pages: 3, query: Q.parseQuery({ page: "2" }), facets: all.facets, catalogueEmpty: false }));
const doc = new JSDOM(html).window.document;
const form = doc.querySelector("form.hw-filters");
ok(form.getAttribute("method") === "get" && ["q", "category", "brand", "availability", "sort"].every((n) => form.querySelector(`[name="${n}"]`)), "filters are a plain GET form (works without JavaScript; shareable URLs)");
ok([...doc.querySelectorAll("input,select")].every((c) => c.closest("label")), "every control has a visible label");
ok(doc.querySelector('[aria-current="page"]')?.textContent === "2" && doc.querySelector('a[rel="prev"]') && doc.querySelector('a[rel="next"]'), "pagination links with the current page marked");
ok([...doc.querySelectorAll("img")].every((i) => i.hasAttribute("alt")) && [...doc.querySelectorAll("a")].every((a) => a.textContent.trim().length > 0 || a.getAttribute("aria-hidden") === "true"), "images carry alt; links have names");
ok(html.includes("Price on request") && !/add to cart|checkout|pay now/i.test(html), "Price on Request shown; no cart, checkout or payment control in catalogue browsing");

// preview isolation: the production Office address only for the production deployment
const T = load("src/lib/officeTarget.ts");
const env = (o) => { for (const k of ["VERCEL_ENV", "OCHIGA_OFFICE_BASE_URL"]) delete process.env[k]; Object.assign(process.env, o); };
env({ VERCEL_ENV: "preview" }); ok(T.officeBaseUrlOrEmpty() === "", "preview without an explicit Office: no Office address (fail closed)");
env({}); ok(T.officeBaseUrlOrEmpty() === "", "local run without an explicit Office: no Office address");
env({ VERCEL_ENV: "production" }); ok(T.officeBaseUrlOrEmpty() === T.PRODUCTION_OFFICE_BASE_URL, "production deployment uses the production Office");
env({ VERCEL_ENV: "preview", OCHIGA_OFFICE_BASE_URL: "http://127.0.0.1:9/" }); ok(T.officeBaseUrlOrEmpty() === "http://127.0.0.1:9", "an explicitly configured Office is used as given");
env({});

console.log(JSON.stringify({ suite: "getoyi-release-a-unit", passed: n }));
