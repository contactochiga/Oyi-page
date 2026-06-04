import Image from "next/image";
import Link from "next/link";
import { primaryNav, siteConfig } from "@/lib/site";

const sections = [
  {
    eyebrow: "Oyi Home",
    title: "Resident living, connected from the first invitation.",
    body: "Residents activate by invite, see their home context, manage spaces, control assigned devices, request maintenance, receive notices, and verify visitors from one calm mobile experience.",
    href: "/home",
    points: ["Invite-first onboarding", "Rooms and device controls", "Visitors, maintenance, community"],
  },
  {
    eyebrow: "Oyi Facility",
    title: "Estate operations without scattered tools.",
    body: "Facility teams manage homes, residents, invitations, devices, visitors, maintenance, community, security posture, and administration from an operational control surface.",
    href: "/facility",
    points: ["Homes and resident lifecycle", "Security and visitor operations", "Maintenance and moderation workflows"],
  },
  {
    eyebrow: "Oyi Watch",
    title: "A companion layer for quick awareness.",
    body: "The Watch companion keeps important residential events close, with sync status, safe notification fallbacks, and quick awareness for residents on the move.",
    href: "/watch",
    points: ["Visitor and security alerts", "Durable sync lifecycle", "Diagnostics without secrets"],
  },
];

const platformCards = [
  ["Connected Systems", "Provider sync, assigned devices, rooms, and controls live behind one resident-safe experience."],
  ["Security & Access", "Visitor lifecycle, camera readiness, gate verification, and facility security workflows stay connected."],
  ["Maintenance & Community", "Service requests, operational updates, estate notices, resident messages, and moderation are organized."],
  ["Infrastructure Layer", "Oyi Edge, Twin foundations, device registry, camera readiness, and utility telemetry are prepared for estate operations."],
  ["Oyi Intelligence", "Contextual help, safe commands, resident guidance, operator insight, and automation reasoning without overclaiming autonomy."],
  ["Deployment", "Create homes, invite residents, connect supported systems, assign devices, and move from setup into day-to-day estate operations."],
];

const visualLabels = ["Home", "Visitors", "Devices", "Maintenance", "Community", "Facility"];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06101d]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Oyi home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-sky-300/30 bg-sky-400/10 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
            <Image src={siteConfig.logo} width={26} height={26} alt="Oyi" priority />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">Oyi</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex" aria-label="Primary navigation">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/deployments" className="rounded-full bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
          Request Deployment
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#03070d]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-3 text-white">
            <Image src={siteConfig.logo} width={30} height={30} alt="Oyi" />
            <span className="text-lg font-semibold">Oyi</span>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-400">
            The operating platform for modern residential communities.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Product</h2>
          <div className="grid gap-2 text-sm text-slate-400">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Trust</h2>
          <div className="grid gap-2 text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/support" className="hover:text-white">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function ProductVisual({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-sky-300/20 bg-slate-950/70 p-5 shadow-[0_30px_120px_rgba(14,165,233,0.2)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.28),transparent_32%),linear-gradient(rgba(125,211,252,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.08)_1px,transparent_1px)] bg-[size:auto,34px_34px,34px_34px]" />
      <div className="relative grid gap-4">
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-200">Oyi Demo Estate</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Villa A1</h3>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-full border border-sky-300/30 bg-sky-400/20 text-white shadow-[0_0_40px_rgba(56,189,248,0.35)]">Oyi</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {visualLabels.map((label, index) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="mb-3 h-1.5 w-12 rounded-full bg-sky-300/70" />
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="mt-1 text-xs text-slate-400">{index % 2 === 0 ? "Ready" : "Synced"}</p>
            </div>
          ))}
        </div>
        {!compact && (
          <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-sky-400/15 to-cyan-300/10 p-4 text-sm text-slate-200">
            Demo visuals use sanitized labels only. Replace with approved screenshots after demo data is captured and reviewed.
          </div>
        )}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#06101d] px-5 py-20 text-white md:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.25),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_30%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="mb-6 inline-flex rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
            Residential operating platform
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
            One platform for connected residential living.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            Oyi brings homes, residents, visitors, smart devices, maintenance, community, and estate operations into one intelligent experience.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/deployments" className="rounded-full bg-sky-400 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-sky-300">
              Request Deployment
            </Link>
            <Link href="/home" className="rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-white transition hover:border-sky-300/60 hover:bg-white/10">
              Explore Oyi Home
            </Link>
          </div>
        </div>
        <ProductVisual />
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <main className="bg-[#050b14] text-white">
      <Hero />
      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Product ecosystem</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Built around the resident, operated by the estate.</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {sections.map((section) => (
              <Link key={section.href} href={section.href} className="group rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:border-sky-300/40 hover:bg-white/[0.09]">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">{section.eyebrow}</p>
                <h3 className="mt-5 text-2xl font-semibold text-white">{section.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-300">{section.body}</p>
                <div className="mt-6 grid gap-2 text-sm text-slate-300">
                  {section.points.map((point) => (
                    <span key={point} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-300" />{point}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-white/10 bg-slate-950/70 px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Connected operations</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Everything that matters to a modern estate, connected without noise.</h2>
            <p className="mt-5 text-slate-300">Oyi keeps the public story simple: residents get a calm home app, while facility teams get the operational tools needed to run the community.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {platformCards.map(([title, body]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-sky-300/20 bg-sky-400/10 p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Deployment</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">Launch Oyi with controlled onboarding.</h2>
            <p className="mt-4 max-w-2xl text-slate-300">Create homes, invite residents, connect supported systems, assign devices, and move from setup into day-to-day estate operations.</p>
          </div>
          <Link href="/deployments" className="rounded-full bg-white px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-sky-100">
            Request deployment
          </Link>
        </div>
      </section>
    </main>
  );
}

export function ProductPage({ eyebrow, title, body, points }: { eyebrow: string; title: string; body: string; points: string[] }) {
  return (
    <main className="bg-[#050b14] text-white">
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">{eyebrow}</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">{body}</p>
          </div>
          <ProductVisual compact />
        </div>
      </section>
      <section className="px-5 pb-20">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {points.map((point) => (
            <div key={point} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <div className="mb-5 h-10 w-10 rounded-2xl bg-sky-400/20 shadow-[0_0_40px_rgba(56,189,248,0.2)]" />
              <h2 className="text-xl font-semibold text-white">{point}</h2>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
