import Image from "next/image";
import Link from "next/link";
import { CinematicOpening } from "@/components/CinematicOpening";
import { pillars, primaryCta, primaryNav, siteConfig } from "@/lib/site";

const sections = [
  {
    eyebrow: "Oyi Facility",
    title: "Operate the environment.",
    body: "Facility teams manage infrastructure, operations, homes, residents, invitations, devices, visitors, maintenance, community, security posture, and administration from one operational control surface.",
    href: "/facility",
    points: ["Infrastructure and MEP operations", "Security and access operations", "Maintenance and operational workflows"],
  },
  {
    eyebrow: "Oyi Experience",
    title: "Interact with the environment.",
    body: "Experience connects the person to the building — the home experience, the workspace experience, the guest experience. Invite-first activation, spaces, assigned devices, visitors, maintenance requests, and services.",
    href: "/experience",
    points: ["Invite-first activation", "Rooms and device controls", "Visitors, maintenance, community"],
  },
  {
    eyebrow: "Oyi Core",
    title: "Intelligence across both.",
    body: "Core is the awareness, context, and reasoning layer running through Facility and Experience — contextual guidance, operator insight, safe commands, and automation reasoning.",
    href: "/core",
    points: ["Contextual awareness", "Operator insight", "Safe automation reasoning"],
  },
];

const visualLabels = ["Facility", "Devices", "Visitors", "Maintenance", "Community", "Security"];

// Capability storytelling: each entry gets a full section, alternating
// text/visual sides, rather than being compressed into a feature-card grid.
const capabilitySections = [
  {
    eyebrow: "Digital Twin",
    title: "See your building.",
    body: "A living representation of the building — model, placement, devices, cameras, and utility layers — gives Facility teams a way to see the building the way they operate it, not just a floor plan. The interface can become the building.",
    stat: "Model · Placement · Layers",
    href: "/twin",
  },
  {
    eyebrow: "Facility",
    title: "Know what's happening.",
    body: "Facility gives operations teams visibility into power, water, security, and maintenance status without stitching together separate systems — one operational picture instead of several disconnected ones.",
    stat: "Infrastructure · Security · Maintenance",
    href: "/facility",
  },
  {
    eyebrow: "Experience",
    title: "Control your environment.",
    body: "Rooms, assigned devices, visitors, maintenance requests, and services — the Experience layer gives the person in the building a calm, invite-first way to interact with the space around them.",
    stat: "Rooms · Devices · Visitors",
    href: "/experience",
  },
  {
    eyebrow: "Core",
    title: "Ask Oyi.",
    body: "Oyi Core is built to answer real operational questions — which units haven't confirmed maintenance access this week, whether backup power is ready, who's expected at the gate this afternoon — with context, not just data.",
    stat: "Contextual guidance · Operator insight",
    href: "/core",
  },
  {
    eyebrow: "Automation",
    title: "Automate what happens next.",
    body: "Scenes, schedules, and workflows let routine responses happen without manual intervention, with supervised actions kept in view rather than handed off to unsupervised autonomy.",
    stat: "Scenes · Schedules · Supervised actions",
    href: "/technology#automation",
  },
];

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
          {primaryNav.slice(1).map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href={primaryCta.href} className="rounded-full bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
          {primaryCta.label}
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#03070d]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-3 text-white">
            <Image src={siteConfig.logo} width={30} height={30} alt="Oyi" />
            <span className="text-lg font-semibold">Oyi</span>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-400">
            The operating system for buildings.
          </p>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Product</h2>
          <div className="grid gap-2 text-sm text-slate-400">
            {pillars.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
            <Link href="/technology" className="hover:text-white">Technology</Link>
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Ecosystem</h2>
          <div className="grid gap-2 text-sm text-slate-400">
            <Link href="/solutions" className="hover:text-white">Solutions</Link>
            <Link href="/hardware" className="hover:text-white">Hardware</Link>
            <Link href="/partners" className="hover:text-white">Partners</Link>
            <Link href="/developers" className="hover:text-white">Developers</Link>
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">Trust</h2>
          <div className="grid gap-2 text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/support" className="hover:text-white">Support</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
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
            <p className="text-xs uppercase tracking-[0.24em] text-sky-200">Oyi Demo Building</p>
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
  return <CinematicOpening />;
}

export function HomePage() {
  return (
    <main className="bg-[#050b14] text-white">
      <Hero />
      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Meet Oyi</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">Operate it. Experience it. Understand it.</h2>
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
      <section className="border-y border-white/10 bg-slate-950/70">
        {capabilitySections.map((capability, index) => (
          <div key={capability.href} className="border-b border-white/5 px-5 py-16 last:border-b-0 md:py-20">
            <div
              className={`mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.9fr] ${
                index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">{capability.eyebrow}</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">{capability.title}</h2>
                <p className="mt-5 max-w-xl text-slate-300">{capability.body}</p>
                <Link href={capability.href} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-300">
                  Explore
                  <span>→</span>
                </Link>
              </div>
              <div className="relative overflow-hidden rounded-[2rem] border border-sky-300/20 bg-slate-950/70 p-8 shadow-[0_30px_120px_rgba(14,165,233,0.15)]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.08)_1px,transparent_1px)] bg-[size:34px_34px]" />
                <p className="relative text-xs uppercase tracking-[0.24em] text-sky-200">{capability.stat}</p>
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-sky-300/20 bg-sky-400/10 p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Deployment</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">Bring Oyi to your building.</h2>
            <p className="mt-4 max-w-2xl text-slate-300">Create homes or spaces, invite people, connect supported systems, assign devices, and move from setup into day-to-day operations.</p>
          </div>
          <Link href={primaryCta.href} className="rounded-full bg-white px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-sky-100">
            {primaryCta.label}
          </Link>
        </div>
      </section>
    </main>
  );
}

export function ProductPage({
  eyebrow,
  title,
  body,
  points,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  cta?: { label: string; href: string };
}) {
  return (
    <main className="bg-[#050b14] text-white">
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">{eyebrow}</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">{body}</p>
            {cta && (
              <Link href={cta.href} className="mt-8 inline-flex rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-300">
                {cta.label}
              </Link>
            )}
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

// Index/hub pattern for sections with multiple sub-pages (Technology,
// Solutions) — a title/body lead-in plus a card grid linking to each
// sub-page, rather than trying to force everything into ProductPage's
// single-topic shape.
export function HubPage({
  eyebrow,
  title,
  body,
  items,
}: {
  eyebrow: string;
  title: string;
  body: string;
  items: { label: string; description: string; href: string }[];
}) {
  return (
    <main className="bg-[#050b14] text-white">
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">{eyebrow}</p>
          <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{body}</p>
        </div>
      </section>
      <section className="px-5 pb-24">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className="group rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:border-sky-300/40 hover:bg-white/[0.09]">
              <h2 className="text-xl font-semibold text-white">{item.label}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-sky-300">
                Explore
                <span className="transition group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
