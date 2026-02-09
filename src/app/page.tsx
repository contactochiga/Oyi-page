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

function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
      Live
    </span>
  );
}

/* -------------------------------------------------------
   Mini dashboard preview inside each Systems card
   - small metrics chips
   - tiny “sparkline” style chart using pure divs (no libs)
   - status rows
-------------------------------------------------------- */
function MiniPreview({
  metrics,
  rows,
}: {
  metrics: Array<{ k: string; v: string }>;
  rows: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
      {/* Metrics */}
      <div className="flex flex-wrap gap-2">
        {metrics.map((m) => (
          <span
            key={m.k}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70"
          >
            <span className="text-white/55">{m.k}:</span>
            <span className="text-white/80">{m.v}</span>
          </span>
        ))}
      </div>

      {/* Tiny chart */}
      <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex items-end gap-1 h-10">
          {/* fixed bars for “sparkline” vibe */}
          {[
            "h-2",
            "h-4",
            "h-6",
            "h-5",
            "h-7",
            "h-4",
            "h-8",
            "h-6",
            "h-9",
            "h-7",
            "h-10",
            "h-8",
          ].map((h, i) => (
            <div
              key={i}
              className={`w-2 ${h} rounded-sm bg-white/25`}
              aria-hidden
            />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-white/55">
          <span>Last 60 mins</span>
          <span>Realtime</span>
        </div>
      </div>

      {/* Status rows */}
      <div className="mt-4 grid gap-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
          >
            <span className="text-[11px] text-white/70">{r.label}</span>
            <span className="text-[11px] text-white/60">{r.value}</span>
          </div>
        ))}
      </div>
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

  const systemCards = useMemo(
    () => [
      {
        title: "Power Operations",
        summary: "Monitor supply and switching reliability.",
        metrics: [
          { k: "Uptime", v: "99.9%" },
          { k: "Load", v: "62%" },
          { k: "Fuel", v: "74%" },
        ],
        rows: [
          { label: "Grid Status", value: "Stable" },
          { label: "Generator", value: "Standby" },
          { label: "ATS", value: "Auto" },
        ],
      },
      {
        title: "Water Systems",
        summary: "Track pressure, storage and flow performance.",
        metrics: [
          { k: "Pressure", v: "2.4 bar" },
          { k: "Tank", v: "68%" },
          { k: "Flow", v: "Normal" },
        ],
        rows: [
          { label: "Main Pump", value: "Running" },
          { label: "Leak Alerts", value: "0" },
          { label: "Consumption", value: "Normal" },
        ],
      },
      {
        title: "Security",
        summary: "Incidents, zones and CCTV health in one view.",
        metrics: [
          { k: "Zones", v: "12" },
          { k: "CCTV", v: "Online" },
          { k: "Incidents", v: "1" },
        ],
        rows: [
          { label: "Perimeter", value: "Active" },
          { label: "Patrol Log", value: "Updated" },
          { label: "Escalations", value: "0" },
        ],
      },
      {
        title: "Access Control",
        summary: "Gate rules, visitor passes and audit logs.",
        metrics: [
          { k: "Entries", v: "214" },
          { k: "Exceptions", v: "2" },
          { k: "Approvals", v: "Live" },
        ],
        rows: [
          { label: "Gate Status", value: "Operational" },
          { label: "Visitor Passes", value: "Active" },
          { label: "Device Logs", value: "Synced" },
        ],
      },
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
              <a href="#video" className="px-3 py-2 text-sm text-white/70 hover:text-white">
                Video
              </a>
            </nav>

            <div className="flex items-center gap-2">
              {/* Request Demo -> Watch Video */}
              <a
                href="#video"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                Watch Video
              </a>
              <a
                href="mailto:contactochiga@gmail.com?subject=Oyi%20Deployment%20Request"
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
                  Oyi is a two-way operating layer for estates —
                  residents control in-home devices and automations, while operators run facility infrastructure
                  with live dashboards, alerts, and audited actions.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="#video"
                    className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
                  >
                    Watch Video
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
                          <LiveBadge />
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
                          <LiveBadge />
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
                  Clear views, controlled actions, fast response, and every activity recorded — built for real operators and real residents.
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
                desc="Live status, alerts, actions, and reporting — clean and legible at a glance."
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
                desc="Permissions, approvals, logs, and traceability — infrastructure-grade accountability."
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
              Residents control devices and interact with services. Operators run infrastructure. The control plane ties everything together with events, rules, and audit.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Reveal>
              <GlowCard
                title="Resident App"
                desc="Control devices (lights, AC, TV), run scenes/automations, access requests, visitors, and services — all tracked."
                icon={<span className="text-sm">🏠</span>}
              />
            </Reveal>
            <Reveal>
              <GlowCard
                title="Facility Console"
                desc="Run estate systems: access control, street lighting, utilities, CCTV health, incidents, and reporting."
                icon={<span className="text-sm">🏢</span>}
              />
            </Reveal>
            <Reveal>
              <GlowCard
                title="Control Plane"
                desc="Automation rules, event processing, alert routing, audit trails, and observability — reliability behind everything."
                icon={<span className="text-sm">⚙️</span>}
              />
            </Reveal>
          </div>
        </section>

        {/* SYSTEMS (updated: short summary + mini previews) */}
        <section id="systems" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-12 items-start">
            <div className="md:col-span-5">
              <Reveal>
                <div className="text-xs text-white/60">Systems</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                  One operating layer for estate infrastructure
                </h2>
                <p className="mt-3 text-white/70 leading-7">
                  Power, water, access, security — represented as live cards with status, actions, and logs.
                </p>
              </Reveal>
            </div>

            <div className="md:col-span-7">
              <div className="grid gap-4 md:grid-cols-2">
                {systemCards.map((c) => (
                  <Reveal key={c.title}>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-semibold">{c.title}</div>
                          <div className="mt-2 text-sm text-white/70 leading-6">{c.summary}</div>
                        </div>
                        <LiveBadge />
                      </div>

                      {/* The “details” are now the preview (metrics + chart + status rows) */}
                      <MiniPreview metrics={c.metrics} rows={c.rows} />
                    </div>
                  </Reveal>
                ))}
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

        {/* VIDEO (replaces demo section) */}
        <section id="video" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <Reveal>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <div className="text-xs text-white/60">Walkthrough</div>
                  <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                    Watch the walkthrough
                  </h2>
                  <p className="mt-3 text-white/70 leading-7 max-w-2xl">
                    A quick view of the resident controls, facility console, and command center —
                    including alerts, logs, automations, and digital twin views.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="mailto:contactochiga@gmail.com?subject=Oyi%20Deployment%20Request"
                    className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90 transition text-center"
                  >
                    Deployment Request
                  </a>

                  <a
                    href="mailto:contactochiga@gmail.com?subject=Oyi%20Video%20Request"
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/85 hover:text-white hover:bg-white/10 transition text-center"
                  >
                    Request Video Link
                  </a>
                </div>
              </div>

              {/* placeholder video frame (swap with embed later) */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="h-56 md:h-72 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                  <div className="text-sm text-white/60">
                    Video placeholder — paste your embed here later.
                  </div>
                </div>
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
