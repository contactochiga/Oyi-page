/* eslint-disable @typescript-eslint/no-require-imports -- standalone test runner */
// Release A (catalogue-only) against the BUILT site with a recording fake Office and an egress guard that logs and blocks every
// non-loopback request. Proves: the catalogue switch works at runtime; only GET /api/public/catalogue/* is ever called, only with
// the catalogue key; no checkout, payment, order, progress or booking route exists; previews and local runs never fall back to
// the production Office; existing product enquiries still reach the intake (and nothing else). Run after `next build`.
const { spawn } = require("child_process"), http = require("http"), path = require("path"), fs = require("fs"), os = require("os"), crypto = require("crypto");
const { JSDOM } = require("jsdom");
let n = 0; const fails = [];
const check = (c, name) => { n++; if (!c) fails.push(name); console.log((c ? "PASS " : "FAIL ") + name); };
const KEYS = { catalogue: "cat-" + crypto.randomUUID(), intake: "in-" + crypto.randomUUID() };
const SHA = (c) => c.repeat(64);
const cover = { src: `media/${SHA("a")}.webp`, thumb: `media/${SHA("b")}.webp`, srcset: [{ src: `media/${SHA("c")}.webp`, width: 480 }], width: 1600, height: 1200, alt: "Synthetic lock", caption: "", cover: true, variant_skus: [] };
const mk = (i, o = {}) => ({ slug: `synthetic-${i}`, name: `SYNTHETIC Device ${String(i).padStart(2, "0")}`, model: `SD-${i}`, summary: "Test-only product", description: "Test-only", category: { slug: i % 2 ? "locks" : "cameras", name: i % 2 ? "Locks" : "Cameras" }, brand: { slug: "acme", name: "Acme" },
  specifications: [{ key: "Power", value: String(i), unit: "W" }], compatibility: { facility: true, experience: false, core: false, edge: false, notes: "" },
  variants: [{ sku: `SD-${i}-STD`, name: "Standard", options: {}, price: i === 14 ? null : { amount_kobo: 1000000 + i * 1000, currency: "NGN", vat_inclusive: true, vat_treatment: "standard" }, availability: i === 14 ? "unavailable" : "in_stock", lead_time_days: null }],
  price_from_kobo: i === 14 ? null : 1000000 + i * 1000, price_to_kobo: i === 14 ? null : 1000000 + i * 1000, availability: i === 14 ? "unavailable" : "in_stock", images: [cover], cover, updated_at: "2026-10-01T00:00:00Z", ...o });
const products = Array.from({ length: 14 }, (_, i) => mk(i + 1));
const card = (p) => ({ slug: p.slug, name: p.name, model: p.model, summary: p.summary, category: p.category, brand: p.brand, price_from_kobo: p.price_from_kobo, price_to_kobo: p.price_to_kobo, availability: p.availability, cover: p.cover, updated_at: p.updated_at });

let log = [];
const office = http.createServer((req, res) => {
  let body = ""; req.on("data", (c) => (body += c)); req.on("end", () => {
    const key = req.headers["x-api-key"] || ""; const u = new URL(req.url, "http://x");
    log.push({ method: req.method, path: u.pathname, key });
    const send = (s, j, type = "application/json") => { res.writeHead(s, { "content-type": type }); res.end(type === "application/json" ? JSON.stringify(j) : j); };
    if (u.pathname.startsWith("/api/public/catalogue/")) {
      if (key !== KEYS.catalogue || req.method !== "GET") return send(403, { error: "forbidden" });
      const sub = u.pathname.slice("/api/public/catalogue".length);
      if (sub === "/products") return send(200, { products: products.map(card), total: products.length });
      if (sub === "/categories") return send(200, { categories: [{ slug: "locks", name: "Locks", product_count: 7 }, { slug: "cameras", name: "Cameras", product_count: 7 }] });
      if (sub === "/merchandising") return send(200, { slides: [], featured: [], new_arrivals: [], collections: [] });
      const m = sub.match(/^\/products\/(.+)$/); if (m) { const p = products.find((x) => x.slug === m[1]); return p ? send(200, { product: p }) : send(404, { error: "not_found" }); }
      if (sub.startsWith("/media/")) return send(200, Buffer.from("RIFF0000WEBP"), "image/webp");
      return send(404, { error: "not_found" });
    }
    if (u.pathname === "/api/office/intake") return key === KEYS.intake ? send(201, { ok: true, crm_synced: true, duplicate: false }) : send(403, { error: "forbidden" });
    return send(404, { error: "not_found" });
  });
});
const PORT = 4392, site = `http://127.0.0.1:${PORT}`;
const egressLog = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "release-a-egress-")), "egress.log");
let officeUrl;
function start(env) {
  fs.writeFileSync(egressLog, "");
  return spawn(process.execPath, [path.resolve("node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", String(PORT)], {
    stdio: "ignore",
    env: { PATH: process.env.PATH, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1", NODE_OPTIONS: `--require ${path.resolve(__dirname, "egress-guard.cjs")}`, EGRESS_LOG: egressLog,
      OCHIGA_OFFICE_CATALOGUE_KEY: KEYS.catalogue, OCHIGA_OFFICE_API_KEY: KEYS.intake, ...env },
  });
}
async function ready(p) { for (let i = 0; i < 150; i++) { if (p.exitCode !== null) throw Error("site failed"); try { if ((await fetch(site + "/robots.txt")).ok) return; } catch {} await new Promise((r) => setTimeout(r, 100)); } throw Error("not ready"); }
const stop = (p) => new Promise((r) => { if (p.exitCode !== null) return r(); p.once("exit", r); p.kill("SIGTERM"); });
const get = async (p) => { const r = await fetch(site + p, { redirect: "manual" }); return { status: r.status, text: (await r.text()).replace(/<!-- -->/g, "") }; };
const post = async (p, b) => { const r = await fetch(site + p, { method: "POST", headers: { "content-type": "application/json", origin: site }, body: JSON.stringify(b) }); let j = null; try { j = await r.json(); } catch {} return { status: r.status, json: j }; };
const egress = () => fs.readFileSync(egressLog, "utf8").split("\n").filter(Boolean);
const FORBIDDEN_ROUTES = ["/hardware/cart", "/hardware/checkout", "/hardware/orders/11111111-2222-4333-8444-555555555555", "/hardware/services"];

(async () => {
  await new Promise((r) => office.listen(0, "127.0.0.1", r));
  officeUrl = `http://127.0.0.1:${office.address().port}`;
  try {
    // 1. Catalogue OFF (production default today): static page, Office never contacted.
    log = []; let p = start({ OCHIGA_OFFICE_BASE_URL: officeUrl, HARDWARE_CATALOGUE_ENABLED: "false" });
    try {
      await ready(p);
      const pg = await get("/hardware");
      check(pg.status === 200 && !pg.text.includes("data-product-card") && pg.text.includes("Purpose-built hardware"), "catalogue off: the existing static Hardware page");
      check((await get("/hardware/synthetic-1")).status === 404, "catalogue off: product pages not found");
      check(log.length === 0, "catalogue off: Office never contacted");
    } finally { await stop(p); }

    // 2. Catalogue ON (Release A).
    log = []; p = start({ OCHIGA_OFFICE_BASE_URL: officeUrl, HARDWARE_CATALOGUE_ENABLED: "true", NEXT_PUBLIC_SITE_URL: "https://www.getoyi.com" });
    try {
      await ready(p);
      const list = await get("/hardware");
      const d = new JSDOM(list.text).window.document;
      check(d.querySelectorAll("[data-product-card]").length === 12 && list.text.includes("14 products"), "listing: 12 cards on page 1 of 14 products");
      check((await get("/hardware?page=2")).text.includes('aria-current="page"') && new JSDOM((await get("/hardware?page=2")).text).window.document.querySelectorAll("[data-product-card]").length === 2, "pagination");
      check(new JSDOM((await get("/hardware?category=locks")).text).window.document.querySelectorAll("[data-product-card]").length === 7, "category filter");
      check((await get("/hardware?q=device+03")).text.includes("1 product"), "search");
      check((await get("/hardware?availability=unavailable")).text.includes("1 product"), "availability filter");
      const asc = (await get("/hardware?sort=price_asc")).text;
      check(asc.indexOf("synthetic-1\"") < asc.indexOf("synthetic-2\"") || asc.indexOf("/hardware/synthetic-1") < asc.indexOf("/hardware/synthetic-2"), "sorting");
      const pd = await get("/hardware/synthetic-3");
      const ld = JSON.parse(new JSDOM(pd.text).window.document.querySelector('script[type="application/ld+json"]').textContent);
      check(pd.status === 200 && ld.offers[0].price === "10030.00" && pd.text.includes("Specifications") && pd.text.includes("Power"), "product details, specifications and structured data");
      const por = await get("/hardware/synthetic-14");
      check(por.text.includes("Price on request") && !por.text.includes('"offers"'), "Price on Request without an invented offer");
      check(/<link rel="canonical" href="https:\/\/www\.getoyi\.com\/hardware"/.test(list.text) && /noindex/.test((await get("/hardware?q=x")).text), "canonical and noindex rules");
      check(!/Add to Cart|\/hardware\/cart|checkout|Pay now|Follow your order/i.test(list.text + pd.text), "no cart, checkout, payment or order-progress controls anywhere");
      for (const r of FORBIDDEN_ROUTES) check((await get(r)).status === 404, `route absent: ${r}`);
      for (const a of ["quote", "submit", "status", "payment-quote", "payment-start", "progress", "session"]) {
        const r = await post(`/api/hardware/checkout/${a}`, {});
        check(r.status === 404, `API absent: /api/hardware/checkout/${a}`);
      }
      const svc = await post("/api/leads", { leadType: "site_inspection", name: "LOCAL", email: "local@example.invalid", message: "x" });
      check(svc.status === 400, "booking-style service enquiry types are not accepted in Release A");
      const enq = await post("/api/leads", { leadType: "tech_oem", name: "LOCAL Test", email: "local@example.invalid", message: "Quote please", idempotencyKey: crypto.randomUUID(), hardware: { product: "synthetic-3", sku: "SD-3-STD" } });
      check(enq.status === 200 && log.some((e) => e.path === "/api/office/intake" && e.key === KEYS.intake), "existing product quotation enquiry still filed through the intake");
      const officeCalls = log.filter((e) => e.path !== "/api/office/intake");
      check(officeCalls.length > 0 && officeCalls.every((e) => e.method === "GET" && e.path.startsWith("/api/public/catalogue/") && e.key === KEYS.catalogue), "only read-only GET /api/public/catalogue/* calls, only with the catalogue key");
      // (a request for /hardware/checkout is just a catalogue lookup of the slug "checkout": read-only GET, answered 404)
      const badRoutes = log.filter((e) => !e.path.startsWith("/api/public/catalogue/") && /\/api\/commerce\/|\/api\/public\/orders|payment|checkout|lead-agents\/admin/.test(e.path)).map((e) => e.path);
      check(badRoutes.length === 0, "never any commerce, payment, order, progress or staff route" + (badRoutes.length ? " " + JSON.stringify(badRoutes) : ""));
      check(egress().every((u) => u.startsWith(officeUrl)), "no request to any other host");
    } finally { await stop(p); }

    // 3. Preview isolation: preview / local runs without an explicit Office never contact the production Office.
    for (const [label, env] of [["preview deployment", { VERCEL_ENV: "preview" }], ["local run", {}]]) {
      log = []; p = start({ HARDWARE_CATALOGUE_ENABLED: "true", ...env });
      try {
        await ready(p);
        const pg = await get("/hardware");
        await get("/hardware/synthetic-3");
        await post("/api/leads", { leadType: "tech_oem", name: "LOCAL Test", email: "local@example.invalid", message: "Quote please", idempotencyKey: crypto.randomUUID() });
        const out = egress();
        check(pg.text.includes("temporarily unavailable") && out.length === 0, `${label} without an explicit Office: no Office request at all (production never contacted; catalogue shows unavailable)`);
      } finally { await stop(p); }
    }
    // 4. The production deployment (and only it) targets the production Office; here the guard blocks the attempt.
    log = []; p = start({ HARDWARE_CATALOGUE_ENABLED: "true", VERCEL_ENV: "production" });
    try {
      await ready(p); await get("/hardware");
      const out = egress();
      check(out.length > 0 && out.every((u) => u.startsWith("https://ochiga-lead-agents.onrender.com/api/public/catalogue/")), "production deployment: only the production Office catalogue (attempt blocked locally by the guard)");
    } finally { await stop(p); }

    // 5. Built output contains no commerce client code.
    const built = [];
    const walk = (d) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const x = path.join(d, f.name); if (f.isDirectory()) walk(x); else if (/\.(js|html|json)$/.test(f.name)) built.push(x); } };
    walk(path.resolve(".next/static")); walk(path.resolve(".next/server/app"));
    const hits = built.filter((f) => /\/api\/commerce\/|payment-start|payment-quote|\/api\/public\/orders|getoyi_checkout_guest|paystack/i.test(fs.readFileSync(f, "utf8")));
    check(hits.length === 0, "built output has no checkout, payment, order or progress code", hits.slice(0, 5));
  } finally { office.close(); }
  console.log(JSON.stringify({ suite: "getoyi-release-a-http", checks: n, failed: fails.length }));
  process.exit(fails.length ? 1 : 0);
})().catch((e) => { console.error("FAIL", e); process.exit(1); });
