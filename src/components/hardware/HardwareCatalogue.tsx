// The Hardware section, fed by Office's published catalogue. Office decides what is public; this page shows real approved products,
// categories, images, VAT-inclusive prices and availability labels, with honest empty and unavailable states. No cart or checkout.
import Link from "next/link";
import { AVAILABILITY_LABEL, imageUrl, naira, type CatalogueResult, type PublicCard, type PublicCategory } from "@/lib/catalogue";

const TONE = { in_stock: "text-emerald-200 border-emerald-300/30 bg-emerald-400/10", available_to_order: "text-amber-100 border-amber-300/30 bg-amber-400/10", unavailable: "text-slate-300 border-white/15 bg-white/5" };
const CONTACT = "/contact?type=tech_oem";

function priceLabel(card: PublicCard): string {
  if (card.price_from_kobo == null) return "";
  return card.price_to_kobo != null && card.price_to_kobo !== card.price_from_kobo ? `From ${naira(card.price_from_kobo)}` : naira(card.price_from_kobo);
}

export function HardwareHero() {
  return (
    <section className="px-5 pb-10 pt-20 md:pt-28">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Oyi Hardware</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Hardware for buildings running Oyi.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Devices selected and supported by the Oyi team, designed to work with the infrastructure a building already has.</p>
      </div>
    </section>
  );
}

function StateCard({ title, body, testId }: { title: string; body: string; testId: string }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 md:p-10" data-state={testId}>
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 max-w-2xl text-slate-300">{body}</p>
      <Link href={CONTACT} className="mt-6 inline-flex rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-300">Talk to Oyi about hardware</Link>
    </div>
  );
}

export function HardwareCatalogue({ products, categories, activeCategory }: { products: CatalogueResult<{ products: PublicCard[]; total: number }>; categories: CatalogueResult<{ categories: PublicCategory[] }>; activeCategory: string }) {
  const cats = categories.state === "ok" ? categories.data.categories.filter((c) => c.product_count > 0) : [];
  const list = products.state === "ok" ? products.data.products : [];
  return (
    <main className="bg-[#050b14] text-white">
      <HardwareHero />
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-7xl">
          {products.state === "unavailable" ? (
            <StateCard testId="unavailable" title="The hardware catalogue is temporarily unavailable." body="We could not load the catalogue just now. Please try again in a few minutes, or talk to the Oyi team about the hardware you need." />
          ) : (
            <>
              {cats.length > 1 ? (
                <nav className="mb-8 flex flex-wrap gap-2" aria-label="Hardware categories">
                  <Link href="/hardware" aria-current={!activeCategory ? "page" : undefined} className={`rounded-full border px-4 py-2 text-sm transition ${!activeCategory ? "border-sky-300 bg-sky-400/15 text-white" : "border-white/15 text-slate-300 hover:border-sky-300/50"}`}>All</Link>
                  {cats.map((c) => (
                    <Link key={c.slug} href={`/hardware?category=${c.slug}`} aria-current={activeCategory === c.slug ? "page" : undefined}
                      className={`rounded-full border px-4 py-2 text-sm transition ${activeCategory === c.slug ? "border-sky-300 bg-sky-400/15 text-white" : "border-white/15 text-slate-300 hover:border-sky-300/50"}`}>{c.name}</Link>
                  ))}
                </nav>
              ) : null}
              {list.length ? (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-product-grid>
                  {list.map((card) => (
                    <Link key={card.slug} href={`/hardware/${card.slug}`} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] transition hover:-translate-y-1 hover:border-sky-300/40" data-product-card={card.slug}>
                      <div className="bg-white">
                        {card.cover ? (
                          // eslint-disable-next-line @next/next/no-img-element -- Office serves sized WebP renditions
                          <img src={imageUrl(card.cover.src)} srcSet={card.cover.srcset.map((s) => `${imageUrl(s.src)} ${s.width}w`).join(", ")} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" alt={card.cover.alt} loading="lazy" className="aspect-[4/3] w-full object-contain" />
                        ) : <div className="aspect-[4/3]" />}
                      </div>
                      <div className="p-6">
                        {card.category ? <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">{card.category.name}</p> : null}
                        <h2 className="mt-2 text-xl font-semibold text-white">{card.name}</h2>
                        {card.summary ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">{card.summary}</p> : null}
                        <div className="mt-5 flex items-center justify-between gap-3">
                          <span className="text-lg font-semibold text-white">{priceLabel(card) || "Price on request"}</span>
                          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${TONE[card.availability]}`}>{AVAILABILITY_LABEL[card.availability]}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <StateCard testId="empty" title={activeCategory ? "No products in this category yet." : "Our hardware catalogue is on its way."} body="Products appear here as soon as the Oyi team publishes them. In the meantime, talk to us about the hardware your building needs." />
              )}
              {list.length ? <p className="mt-10 text-sm text-slate-500">Prices include VAT where applicable. Delivery and installation are quoted separately. Online ordering is not available yet — <Link href={CONTACT} className="text-sky-300 hover:text-sky-200">talk to the Oyi team</Link> to order.</p> : null}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export function HardwareLoading() {
  return (
    <main className="bg-[#050b14] text-white" aria-busy="true">
      <HardwareHero />
      <section className="px-5 pb-24">
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04]">
              <div className="aspect-[4/3] animate-pulse bg-white/10" />
              <div className="space-y-3 p-6"><div className="h-4 w-1/3 animate-pulse rounded bg-white/10" /><div className="h-6 w-2/3 animate-pulse rounded bg-white/10" /><div className="h-4 w-full animate-pulse rounded bg-white/10" /></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
