import Image from "next/image";
import Link from "next/link";
import { CinematicOpening } from "@/components/CinematicOpening";
import { MobileMenu } from "@/components/MobileMenu";
import { experiences, primaryCta, primaryNav, siteConfig, solutionTypes } from "@/lib/site";

const visualLabels = ["Facility", "Devices", "Visitors", "Maintenance", "Community", "Security"];

const experienceCards = [
  {
    eyebrow: "Facility Experience",
    title: "For the people who run the building.",
    body: "Operations teams manage infrastructure, security, visitors, maintenance, community and administration from one operational view, instead of a different system for each.",
    href: "/facility",
    points: ["Infrastructure and MEP operations", "Security, access and visitors", "Maintenance and administration"],
  },
  {
    eyebrow: "Resident Experience",
    title: "For the people who live and work in it.",
    body: "Residents, guests and occupants get one calm, invite-first way to use the space around them: rooms and devices, visitors, requests and community updates.",
    href: "/experience",
    points: ["Invite-first activation", "Rooms and assigned devices", "Visitors, requests and community"],
  },
];

// Capability storytelling: each entry gets a full section, alternating
// text/visual sides, rather than being compressed into a feature-card grid.
const capabilitySections = [
  {
    eyebrow: "Digital Twin",
    title: "See your building.",
    body: "A living representation of the building — model, placement, devices, cameras, and utility layers — gives Facility teams a way to see the building the way they operate it, not just a floor plan.",
    stat: "Model · Placement · Layers",
    href: "/twin",
  },
  {
    eyebrow: "Facility Experience",
    title: "Know what's happening.",
    body: "Operations teams see power, water, security, and maintenance status without stitching together separate systems — one operational picture instead of several disconnected ones.",
    stat: "Infrastructure · Security · Maintenance",
    href: "/facility",
  },
  {
    eyebrow: "Resident Experience",
    title: "Control your environment.",
    body: "Rooms, assigned devices, visitors, maintenance requests, and services — residents and occupants get a calm, invite-first way to interact with the space around them.",
    stat: "Rooms · Devices · Visitors",
    href: "/experience",
  },
  {
    eyebrow: "Oyi Core",
    title: "Ask Oyi.",
    body: "Oyi Core is built to answer real operational questions — which units haven't confirmed maintenance access this week, what this week's utility usage looks like, which visitors are expected today — with context, not just data.",
    stat: "Contextual guidance · Operator insight",
    href: "/core",
  },
];

const consultationSteps = [
  ["Consultation", "We learn how the building is run and who lives or works in it."],
  ["Fit and design", "We confirm the deployment fit and plan spaces, people, devices and operations."],
  ["Deployment", "Oyi is configured with your team, alongside the infrastructure you already have."],
  ["Operation", "Controlled onboarding for operators and residents, then day-to-day operation."],
];

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">{children}</p>;
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#06101d]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="flex items-center gap-3" aria-label="Oyi home">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-sky-300/30 bg-sky-400/10 shadow-[0_0_30px_rgba(56,189,248,0.25)]">
            <Image src={siteConfig.logo} width={26} height={26} alt="Oyi" priority />
          </span>
          <span className="text-lg font-semibold tracking-tight text-white">Oyi</span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm text-slate-300 lg:flex" aria-label="Primary navigation">
          {primaryNav.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <Link href={item.href} className="flex items-center gap-1 rounded-full px-3 py-2 transition hover:text-white group-focus-within:text-white">
                  {item.label}
                  <span aria-hidden className="text-[10px] text-slate-500 transition group-hover:rotate-180">▾</span>
                </Link>
                <div className="invisible absolute left-0 top-full w-80 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="grid gap-1 rounded-3xl border border-white/10 bg-[#081423]/95 p-2 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="rounded-2xl px-4 py-3 transition hover:bg-white/[0.07] focus:bg-white/[0.07]">
                        <span className="block font-semibold text-white">{child.label}</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-400">{child.description}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 transition hover:text-white">
                {item.label}
              </Link>
            )
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Link href={primaryCta.href} className="hidden rounded-full bg-sky-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 sm:inline-flex">
            {primaryCta.label}
          </Link>
          <MobileMenu items={primaryNav} cta={primaryCta} />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const columns: { title: string; links: { label: string; href: string }[] }[] = [
    { title: "Oyi", links: [{ label: "What is Oyi", href: "/oyi" }, { label: "Oyi Core", href: "/core" }, { label: "Technology", href: "/technology" }, { label: "Developers", href: "/developers" }] },
    { title: "Experiences", links: [...experiences, { label: "Solutions", href: "/solutions" }] },
    { title: "Store and partners", links: [{ label: "Store", href: "/hardware" }, { label: "Partners", href: "/partners" }, { label: "Request a consultation", href: "/deployments" }] },
    { title: "Company", links: [{ label: "Support", href: "/support" }, { label: "Contact", href: "/contact" }, { label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
  ];
  return (
    <footer className="border-t border-white/10 bg-[#03070d]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="mb-3 flex items-center gap-3 text-white">
            <Image src={siteConfig.logo} width={30} height={30} alt="Oyi" />
            <span className="text-lg font-semibold">Oyi</span>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-400">One intelligent operating system for buildings, with Facility and Resident experiences.</p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">{column.title}</h2>
            <div className="grid gap-2 text-sm text-slate-400">
              {column.links.map((link) => (
                <Link key={link.href + link.label} href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}

// One system, two experiences, intelligence across both: the core positioning, drawn with real page labels only.
export function SystemDiagram() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-sky-300/20 bg-slate-950/70 p-6 shadow-[0_30px_120px_rgba(14,165,233,0.18)] md:p-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.07)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="relative grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {experienceCards.map((card) => (
            <Link key={card.href} href={card.href} className="rounded-3xl border border-white/10 bg-white/[0.07] p-5 transition hover:border-sky-300/40">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">{card.eyebrow}</p>
              <p className="mt-2 text-sm text-slate-300">{card.points.join(" · ")}</p>
            </Link>
          ))}
        </div>
        <Link href="/core" className="flex items-center justify-between gap-4 rounded-3xl border border-sky-300/30 bg-gradient-to-r from-sky-400/20 to-cyan-300/10 p-5 transition hover:border-sky-300/60">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">Oyi Core</p>
            <p className="mt-2 text-sm text-slate-200">Intelligence across both experiences: context, guidance and supervised automation.</p>
          </div>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-sky-300/40 bg-sky-400/20 text-sm font-semibold text-white shadow-[0_0_40px_rgba(56,189,248,0.35)]">Oyi</span>
        </Link>
        <div className="grid grid-cols-2 gap-2 text-center text-xs text-slate-300 sm:grid-cols-4">
          {[["Digital Twin", "/twin"], ["Edge", "/edge"], ["Automation", "/core"], ["Watch", "/watch"]].map(([label, href]) => (
            <Link key={href} href={href} className="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-3 transition hover:border-sky-300/40 hover:text-white">{label}</Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ConsultationSteps({ heading = "Software deployments start with a conversation." }: { heading?: string }) {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-sky-300/20 bg-sky-400/10 p-6 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Kicker>How deployment works</Kicker>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.03em] md:text-5xl">{heading}</h2>
            <p className="mt-4 max-w-2xl text-slate-300">Oyi is deployed with your team, not bought off a shelf. Every building starts with a consultation so the system fits how it is actually run.</p>
          </div>
          <Link href={primaryCta.href} className="rounded-full bg-white px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-sky-100">
            {primaryCta.label}
          </Link>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-4">
          {consultationSteps.map(([title, body], index) => (
            <li key={title} className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-sky-400 text-sm font-semibold text-slate-950">{index + 1}</span>
              <h3 className="mt-4 font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// Store introduction without products: the catalogue and checkout are switched off, so nothing here lists, prices or sells anything.
export function StoreIntro() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <Kicker>Oyi Store</Kicker>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] md:text-5xl">Hardware that is approved to work with Oyi.</h2>
          <p className="mt-5 max-w-xl text-slate-300">The Store offers only hardware our team has reviewed and approved for buildings running Oyi, with integrated Ochiga packages to follow. Approved products may be offered at a fixed price, while custom solutions and Oyi deployments are planned through a consultation. Online ordering is not open yet.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/hardware" className="rounded-full bg-sky-400 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-sky-300">Visit the Store</Link>
            <Link href="/contact?type=tech_oem" className="rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-white transition hover:border-sky-300/60 hover:bg-white/10">Ask about hardware</Link>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {[["Approved hardware", "Only devices reviewed and approved by the Oyi team."], ["Ochiga packages", "Integrated packages for common building needs, coming later."], ["Fixed price or consultation", "Approved products may carry fixed prices; custom solutions are planned with you."]].map(([title, body]) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
              <h3 className="font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
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

// Abstract capability panel for pages that have no honest product
// screenshot yet — shows the page's own real point labels, not a
// fabricated dashboard mockup or invented building/unit name.
export function CapabilityVisual({ eyebrow, points }: { eyebrow: string; points: string[] }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-sky-300/20 bg-slate-950/70 p-6 shadow-[0_30px_120px_rgba(14,165,233,0.2)]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.08)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="relative grid gap-3">
        <p className="text-xs uppercase tracking-[0.24em] text-sky-200">{eyebrow}</p>
        <div className="grid gap-2">
          {points.map((point) => (
            <div key={point} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-white">
              {point}
            </div>
          ))}
        </div>
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
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1fr] lg:items-center">
          <div>
            <Kicker>Meet Oyi</Kicker>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">One operating system. Two experiences.</h2>
            <p className="mt-5 max-w-xl text-slate-300">Oyi connects the infrastructure that runs a building with the people who operate it and the people who live and work in it. Oyi Core brings intelligence to both.</p>
            <Link href="/oyi" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-300">What is Oyi <span>→</span></Link>
          </div>
          <SystemDiagram />
        </div>
        <div className="mx-auto mt-14 grid max-w-7xl gap-5 lg:grid-cols-2">
          {experienceCards.map((card) => (
            <Link key={card.href} href={card.href} className="group rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:border-sky-300/40 hover:bg-white/[0.09] md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">{card.eyebrow}</p>
              <h3 className="mt-5 text-2xl font-semibold text-white md:text-3xl">{card.title}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-300">{card.body}</p>
              <div className="mt-6 grid gap-2 text-sm text-slate-300">
                {card.points.map((point) => (
                  <span key={point} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-300" />{point}</span>
                ))}
              </div>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-300">Explore <span className="transition group-hover:translate-x-1">→</span></span>
            </Link>
          ))}
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
                <Kicker>{capability.eyebrow}</Kicker>
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
      <section className="px-5 pt-20">
        <div className="mx-auto max-w-7xl">
          <Kicker>Solutions</Kicker>
          <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.03em] md:text-5xl">Configured for the building you run.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {solutionTypes.map((solution) => (
              <Link key={solution.slug} href={`/solutions/${solution.slug}`} className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-sky-300/60 hover:bg-white/10">
                {solution.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <StoreIntro />
      <ConsultationSteps />
    </main>
  );
}

export function ProductPage({
  eyebrow,
  title,
  body,
  points,
  cta,
  secondaryCta,
  visual,
  after,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  cta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  visual?: React.ReactNode;
  after?: React.ReactNode;
}) {
  return (
    <main className="bg-[#050b14] text-white">
      <section className="px-5 py-20 md:py-28">
        <div className={`mx-auto grid max-w-7xl items-center gap-12 ${visual ? "lg:grid-cols-[0.9fr_1fr]" : "max-w-4xl"}`}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">{eyebrow}</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{title}</h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">{body}</p>
            {(cta || secondaryCta) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {cta && (
                  <Link href={cta.href} className="inline-flex justify-center rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-300">
                    {cta.label}
                  </Link>
                )}
                {secondaryCta && (
                  <Link href={secondaryCta.href} className="inline-flex justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-sky-300/60 hover:bg-white/10">
                    {secondaryCta.label}
                  </Link>
                )}
              </div>
            )}
          </div>
          {visual}
        </div>
      </section>
      <section className="px-5 pb-20">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          {points.map((point, index) => (
            <div key={point} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
              <span className="mb-5 grid h-10 w-10 place-items-center rounded-2xl bg-sky-400/20 text-sm font-semibold text-sky-100 shadow-[0_0_40px_rgba(56,189,248,0.2)]">{String(index + 1).padStart(2, "0")}</span>
              <h2 className="text-xl font-semibold text-white">{point}</h2>
            </div>
          ))}
        </div>
      </section>
      {after}
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
