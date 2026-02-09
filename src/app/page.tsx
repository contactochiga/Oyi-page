"use client";

import Image from "next/image";
import { useMemo, useRef, useState, useEffect } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
};

function useInViewOnce(threshold = 0.15) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [seen, threshold]);

  return { ref, seen };
}

function Reveal({ children, className }: RevealProps) {
  const { ref, seen } = useInViewOnce(0.18);
  return (
    <div
      ref={ref}
      className={[
        "transition-all duration-700 ease-out will-change-transform",
        seen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function GlowCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(59,130,246,0.25),transparent_45%),radial-gradient(900px_circle_at_80%_30%,rgba(168,85,247,0.18),transparent_40%),radial-gradient(900px_circle_at_40%_90%,rgba(16,185,129,0.16),transparent_45%)]" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/70">{desc}</p>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
      {children}
    </span>
  );
}

function LiveDot() {
  return <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />;
}

/** Different mini spark lines per system */
function Sparkline({ variant }: { variant: "power" | "water" | "security" | "access" }) {
  const paths: Record<string, string> = {
    power: "M2 26 L14 22 L26 24 L38 18 L50 20 L62 14 L74 16 L86 10 L98 12 L110 8 L122 10",
    water: "M2 10 L14 12 L26 14 L38 16 L50 18 L62 22 L74 20 L86 18 L98 16 L110 14 L122 12",
    security: "M2 24 L14 24 L26 12 L38 24 L50 22 L62 8 L74 26 L86 14 L98 26 L110 18 L122 24",
    access: "M2 26 L14 26 L26 18 L38 18 L50 22 L62 22 L74 12 L86 12 L98 16 L110 10 L122 10",
  };

  return (
    <svg viewBox="0 0 124 32" className="h-full w-full">
      <path
        d={paths[variant]}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2 28 H122" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    </svg>
  );
}

function CompactPreview({
  label,
  kpi1,
  kpi2,
  variant,
}: {
  label: string;
  kpi1: string;
  kpi2: string;
  variant: "power" | "water" | "security" | "access";
}) {
  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-black/25 p-3">
      <div className="flex items-center justify-between">
        <div className="text-[11px] text-white/60">{label}</div>
        <div className="flex items-center gap-2 text-[11px] text-white/55">
          <LiveDot />
          Realtime
        </div>
      </div>

      <div className="mt-2 h-10 rounded-lg border border-white/10 bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(500px_circle_at_20%_40%,rgba(59,130,246,0.18),transparent_45%),radial-gradient(420px_circle_at_75%_60%,rgba(168,85,247,0.14),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="absolute inset-0 px-2 py-1">
          <Sparkline variant={variant} />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="text-[11px] text-white/70">{kpi1}</div>
        <div className="text-[11px] text-white/70">{kpi2}</div>
      </div>
    </div>
  );
}

function SystemCard({
  title,
  oneLine,
  previewLabel,
  kpi1,
  kpi2,
  variant,
}: {
  title: string;
  oneLine: string;
  previewLabel: string;
  kpi1: string;
  kpi2: string;
  variant: "power" | "water" | "security" | "access";
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm font-semibold">{title}</div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/60">
          <LiveDot />
          Live
        </span>
      </div>

      <div className="mt-2 text-sm text-white/70 leading-6">{oneLine}</div>

      <CompactPreview label={previewLabel} kpi1={kpi1} kpi2={kpi2} variant={variant} />
    </div>
  );
}

export default function Page() {
  const stats = useMemo(
    () => [
      { k: "Home Control", v: "Devices + automations" },
      { k: "Estate Ops", v: "Realtime monitoring + response" },
      { k: "Digital Twin", v: "Map + 3D view ready" },
      { k: "Audit", v: "Roles, rules, activity logs" },
    ],
    []
  );

  const deployMailto =
    "mailto:contactochiga@gmail.com?subject=Oyi%20Deployment%20Request&body=Hi%20Oyi,%0A%0AI%20want%20to%20request%20a%20deployment.%0A%0AName:%0AEstate/Company:%0ALocation:%0APhone:%0AScope%20(what%20to%20integrate):%0A%0AThanks";

  return (
    <div className="min-h-screen flex flex-col bg-[#070A12] text-white overflow-x-hidden">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.12),transparent_50%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.10),transparent_55%),radial-gradient(900px_circle_at_50%_90%,rgba(16,185,129,0.08),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>

      {/* Top nav */}
      <header className="relative z-10">
        <div className="mx-auto w-full max-w-6xl px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl overflow-hidden border border-white/10 bg-white/5">
                <Image
                  src="/oyi-logo-transparent.png"
                  alt="Oyi"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              <div>
                <div className="text-sm font-semibold leading-4">Oyi</div>
                <div className="text-xs text-white/60">Estate Operations Console</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <a href="#platform" className="px-3 py-2 text-sm text-white/70 hover:text-white">
                Platform
              </a>
              <a href="#stack" className="px-3 py-2 text-sm text-white/70 hover:text-white">
                Stack
              </a>
              <a href="#systems" className="px-3 py-2 text-sm text-white/70 hover:text-white">
                Systems
              </a>
              <a href="#deployments" className="px-3 py-2 text-sm text-white/70 hover:text-white">
                Deployments
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={deployMailto}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                Request Deployment
              </a>
              <a
                href={deployMailto}
                className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
              >
                Deploy
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1">
        {/* HERO */}
        <section className="mx-auto w-full max-w-6xl px-5 pt-8 pb-12 md:pt-14">
          <div className="grid gap-10 md:grid-cols-12 items-center">
            <div className="md:col-span-6">
              <Reveal>
                <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
                  Operate smarter. <br />
                  See everything. <br />
                  Control in real time.
                </h1>

                <p className="mt-5 text-white/70 leading-7">
                  Oyi is a two-way operating layer for estates — residents control in-home devices and automations,
                  while operators run facility infrastructure with live dashboards, alerts, and audited actions.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={deployMailto}
                    className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
                  >
                    Request Deployment
                  </a>
                  <a
                    href="#platform"
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
                  >
                    Explore Platform
                  </a>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {stats.map((s) => (
                    <div
                      key={s.k}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                    >
                      <div className="text-xs text-white/60">{s.k}</div>
                      <div className="mt-1 text-sm text-white/85">{s.v}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Hero visual */}
            <div className="md:col-span-6">
              <Reveal className="md:pl-6">
                <div className="relative rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl overflow-hidden">
                  <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

                  <div className="rounded-2xl border border-white/10 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.22),transparent_45%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.18),transparent_45%),radial-gradient(900px_circle_at_40%_90%,rgba(16,185,129,0.14),transparent_45%)] p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">Command Center</div>
                      <div className="text-xs text-white/60">Live • Secure • Audited</div>
                    </div>

                    <div className="mt-5 grid grid-cols-12 gap-3">
                      <div className="col-span-12 md:col-span-7 rounded-xl border border-white/10 bg-black/30 p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-white/60">Map / Site View</div>
                          <span className="inline-flex items-center gap-2 text-[11px] text-white/55">
                            <LiveDot />
                            Realtime
                          </span>
                        </div>
                        <div className="mt-3 h-28 rounded-lg border border-white/10 bg-white/5" />
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {["Assets: 124", "Alerts: 3", "Uptime: 99.9%"].map((t) => (
                            <span
                              key={t}
                              className="text-[11px] text-white/70 border border-white/10 bg-white/5 rounded-full px-2 py-1"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-5 rounded-xl border border-white/10 bg-black/30 p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-white/60">Systems</div>
                          <span className="inline-flex items-center gap-2 text-[11px] text-white/55">
                            <LiveDot />
                            Realtime
                          </span>
                        </div>
                        <div className="mt-3 space-y-2">
                          {[
                            ["Power", "Stable"],
                            ["Water", "Normal"],
                            ["Security", "Active"],
                            ["Lighting", "Auto"],
                          ].map(([a, b]) => (
                            <div
                              key={a}
                              className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                            >
                              <span className="text-xs text-white/80">{a}</span>
                              <span className="text-[11px] text-white/60">{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-white/60">Activity</div>
                        <span className="text-[11px] text-white/60">Last 5 mins</span>
                      </div>
                      <div className="mt-3 grid md:grid-cols-3 gap-2">
                        {[
                          "Gate access granted — Admin",
                          "Generator auto-switch — Ops",
                          "Leak alert resolved — Facility",
                        ].map((t) => (
                          <div
                            key={t}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/70"
                          >
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Map View", "3D Twin View", "Home Automations", "Alerts + Audit"].map((t) => (
                      <Pill key={t}>{t}</Pill>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* PLATFORM */}
        <section id="platform" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="text-xs text-white/60">Platform</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                  One console for home + estate operations
                </h2>
                <p className="mt-3 text-white/70 leading-7 max-w-2xl">
                  Designed for real operators and real residents — clear views, controlled actions, fast response,
                  and every activity recorded.
                </p>
              </div>
              <div className="flex gap-2">
                <Pill>Realtime</Pill>
                <Pill>Secure</Pill>
                <Pill>Scalable</Pill>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Reveal>
              <GlowCard
                title="Operations UX"
                desc="Live status, alerts, actions, reporting — legible at a glance."
                icon={<span className="text-sm">⌘</span>}
              />
            </Reveal>
            <Reveal>
              <GlowCard
                title="Digital Twin Ready"
                desc="Map view now, 3D/4D later — built to expand."
                icon={<span className="text-sm">◻︎</span>}
              />
            </Reveal>
            <Reveal>
              <GlowCard
                title="Controls + Audit"
                desc="Permissions, approvals, logs — accountability built-in."
                icon={<span className="text-sm">✓</span>}
              />
            </Reveal>
          </div>
        </section>

        {/* STACK */}
        <section id="stack" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <Reveal>
            <div className="text-xs text-white/60">Stack</div>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
              Three layers. One operating system.
            </h2>
            <p className="mt-3 text-white/70 leading-7 max-w-2xl">
              Residents control devices and interact with services. Operators run infrastructure. The control plane ties
              everything together with events, rules, and audit.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Reveal>
              <GlowCard
                title="Resident App"
                desc="Home control (lights, AC, TV), scenes/automations, visitor access, requests — structured and traceable."
                icon={<span className="text-sm">🏠</span>}
              />
            </Reveal>
            <Reveal>
              <GlowCard
                title="Facility Console"
                desc="Access control, street lighting, utilities, CCTV health, incidents, reporting."
                icon={<span className="text-sm">🏢</span>}
              />
            </Reveal>
            <Reveal>
              <GlowCard
                title="Control Plane"
                desc="Rules, event processing, alert routing, audit trails, observability."
                icon={<span className="text-sm">⚙️</span>}
              />
            </Reveal>
          </div>
        </section>

        {/* SYSTEMS */}
        <section id="systems" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-12 items-start">
            <div className="md:col-span-5">
              <Reveal>
                <div className="text-xs text-white/60">Systems</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                  One operating layer for estate infrastructure
                </h2>
                <p className="mt-3 text-white/70 leading-7">
                  Oyi connects estate infrastructure and in-home controls into one system — so actions, alerts,
                  automations, and approvals flow through a single control layer. Operators run facilities. Residents
                  control devices. Everything stays visible, governed, and auditable.
                </p>
              </Reveal>
            </div>

            <div className="md:col-span-7">
              <div className="grid gap-4 md:grid-cols-2">
                <Reveal>
                  <SystemCard
                    title="Power Operations"
                    oneLine="Supply health and backup readiness."
                    previewLabel="Last 60 minutes"
                    kpi1="Voltage (V)"
                    kpi2="Load (kW)"
                    variant="power"
                  />
                </Reveal>

                <Reveal>
                  <SystemCard
                    title="Water Systems"
                    oneLine="Supply stability and consumption."
                    previewLabel="Last 60 minutes"
                    kpi1="Tank (%)"
                    kpi2="Flow (L/min)"
                    variant="water"
                  />
                </Reveal>

                <Reveal>
                  <SystemCard
                    title="Security"
                    oneLine="Incidents and coverage health."
                    previewLabel="Last 60 minutes"
                    kpi1="Incidents"
                    kpi2="CCTV Uptime"
                    variant="security"
                  />
                </Reveal>

                <Reveal>
                  <SystemCard
                    title="Access Control"
                    oneLine="Entry flow and verification."
                    previewLabel="Last 60 minutes"
                    kpi1="Entries"
                    kpi2="Denied"
                    variant="access"
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* DEPLOYMENTS */}
        <section id="deployments" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <Reveal>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <div className="text-xs text-white/60">Deployments</div>
                  <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                    Request deployment
                  </h2>
                  <p className="mt-3 text-white/70 leading-7 max-w-2xl">
                    We deploy in phases: map the estate, connect systems, go live with the first core workflows, then
                    expand with automations, reporting, and digital twin views.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={deployMailto}
                    className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90 transition text-center"
                  >
                    Request Deployment
                  </a>
                  <a
                    href={deployMailto}
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/85 hover:text-white hover:bg-white/10 transition text-center"
                  >
                    Deployment Scope
                  </a>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  ["Estate-ready", "Facilities, access, utilities, security, and monitoring."],
                  ["Home-ready", "Resident device control + automations where enabled."],
                  ["Operations-grade", "Roles, logs, approvals, alert routing, reporting."],
                ].map(([a, b]) => (
                  <div key={a} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                    <div className="text-sm font-semibold">{a}</div>
                    <div className="mt-2 text-sm text-white/70">{b}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="relative z-10 mt-auto">
        <div className="mx-auto w-full max-w-6xl px-5 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-white/10 pt-6">
            <div className="text-sm text-white/70">© {new Date().getFullYear()} Oyi</div>
            <div className="text-xs text-white/50">Estate Operations Console</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
