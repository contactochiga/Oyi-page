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
  return (
    <span className="inline-flex items-center gap-2 text-[11px] text-white/60">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
      realtime
    </span>
  );
}

/**
 * Compact preview strip (small, not bulky):
 * - tiny label row ("Last 60 mins" + realtime)
 * - tiny sparkline bar (inside a slim height)
 * - 2-3 tiny metric chips (short)
 */
function CompactPreview({
  timeframe = "Last 60 mins",
  metrics,
}: {
  timeframe?: string;
  metrics: string[];
}) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-white/55">{timeframe}</span>
        <LiveDot />
      </div>

      {/* slim sparkline */}
      <div className="mt-2 h-10 rounded-lg border border-white/10 bg-white/5 overflow-hidden relative">
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(420px_circle_at_20%_60%,rgba(59,130,246,0.20),transparent_55%),radial-gradient(360px_circle_at_80%_40%,rgba(168,85,247,0.14),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:22px_22px]" />
        {/* faux line segments */}
        <div className="absolute left-3 right-3 top-5 h-[2px] bg-white/20 rounded-full" />
        <div className="absolute left-3 top-6 h-[2px] w-1/3 bg-white/28 rounded-full" />
        <div className="absolute right-3 top-4 h-[2px] w-1/4 bg-white/16 rounded-full" />
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {metrics.slice(0, 3).map((m) => (
          <span
            key={m}
            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/65"
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

function SystemTile({
  title,
  oneLiner,
  metrics,
}: {
  title: string;
  oneLiner: string;
  metrics: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="mt-1 text-sm text-white/70 leading-6">{oneLiner}</div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/65">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
          Live
        </span>
      </div>

      <CompactPreview metrics={metrics} />
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
            {/* Logo + Brand */}
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
              <a href="#how" className="px-3 py-2 text-sm text-white/70 hover:text-white">
                How it works
              </a>
              <a href="#walkthrough" className="px-3 py-2 text-sm text-white/70 hover:text-white">
                Walkthrough
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#walkthrough"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                Request Walkthrough
              </a>
              <a
                href="#walkthrough"
                className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
              >
                Deploy
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
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
                    href="#walkthrough"
                    className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
                  >
                    Request Walkthrough
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

            {/* HERO VISUAL */}
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
                          <span className="text-[11px] text-white/60">realtime</span>
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
                          <span className="text-[11px] text-white/60">realtime</span>
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
                  Clear views, controlled actions, fast response — and every activity recorded.
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
                desc="Live status, alerts, actions, and reporting — legible at a glance."
                icon={<span className="text-sm">⌘</span>}
              />
            </Reveal>
            <Reveal>
              <GlowCard
                title="Digital Twin Ready"
                desc="Map view now, 3D/4D later — designed to expand without redesign."
                icon={<span className="text-sm">◻︎</span>}
              />
            </Reveal>
            <Reveal>
              <GlowCard
                title="Controls + Audit"
                desc="Permissions, approvals, logs — infrastructure-grade accountability."
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
                desc="Home control (lights, AC, TV), scenes/automations, visitor access, requests — traceable."
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

        {/* SYSTEMS (compact) */}
        <section id="systems" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-12 items-start">
            <div className="md:col-span-5">
              <Reveal>
                <div className="text-xs text-white/60">Systems</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                  One operating layer for estate infrastructure
                </h2>
                <p className="mt-3 text-white/70 leading-7">
                  Live cards that show status, actions, and history — without clutter.
                </p>
              </Reveal>
            </div>

            <div className="md:col-span-7">
              <div className="grid gap-4 md:grid-cols-2">
                <Reveal>
                  <SystemTile
                    title="Power Operations"
                    oneLiner="Supply health and backup readiness."
                    metrics={["Voltage (V)", "Load (kW)", "Runtime (hrs)"]}
                  />
                </Reveal>

                <Reveal>
                  <SystemTile
                    title="Water Systems"
                    oneLiner="Levels, pressure, and flow visibility."
                    metrics={["Tank (%)", "Flow (L/min)", "Pressure (bar)"]}
                  />
                </Reveal>

                <Reveal>
                  <SystemTile
                    title="Security"
                    oneLiner="Incidents and coverage health."
                    metrics={["Incidents", "CCTV Uptime", "Zones Active"]}
                  />
                </Reveal>

                <Reveal>
                  <SystemTile
                    title="Access Control"
                    oneLiner="Entry flow and verification."
                    metrics={["Entries", "Denied", "Visitor Passes"]}
                  />
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <Reveal>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10 backdrop-blur-xl">
              <div className="text-xs text-white/60">How it works</div>
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                Deploy, connect systems, operate in realtime
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  ["1) Model the estate", "Site plan / map, assets, roles, and operating rules."],
                  ["2) Connect devices", "Controllers, sensors, cameras, meters, gateways, and home devices."],
                  ["3) Run operations", "Dashboards, alerts, escalation, maintenance, reporting."],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-2xl border border-white/10 bg-black/30 p-6">
                    <div className="text-sm font-semibold">{t}</div>
                    <div className="mt-2 text-sm text-white/70 leading-6">{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* WALKTHROUGH */}
        <section id="walkthrough" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <Reveal>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                    Request a walkthrough
                  </h2>
                  <p className="mt-3 text-white/70 leading-7 max-w-2xl">
                    We’ll show the resident controls, the facility console, and the command center view — including alerts,
                    logs, and automations.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="mailto:contactochiga@gmail.com?subject=Oyi%20Walkthrough%20Request&body=Hi%20Oyi,%0A%0AI%20want%20to%20request%20a%20walkthrough.%0A%0AName:%0AEstate/Company:%0ALocation:%0APhone:%0AUse-case:%0A%0AThanks"
                    className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90 transition text-center"
                  >
                    Request Walkthrough
                  </a>

                  <a
                    href="mailto:contactochiga@gmail.com?subject=Oyi%20Deployment%20Request"
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/85 hover:text-white hover:bg-white/10 transition text-center"
                  >
                    Deployment Request
                  </a>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  ["Home + Estate", "Residents control devices; operators run infrastructure."],
                  ["Hardware + Software", "Full integration contracts supported."],
                  ["Operations-grade", "Logs, roles, escalation, reporting."],
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

      {/* Footer */}
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
