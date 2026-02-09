"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

export default function Page() {
  const stats = useMemo(
    () => [
      { k: "Live Ops", v: "Realtime control + alerts" },
      { k: "Digital Twin", v: "Map + 3D view ready" },
      { k: "Devices", v: "Multi-system integration" },
      { k: "Access", v: "Roles, rules, audit trail" },
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
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                <span className="text-sm font-semibold tracking-wide">OY</span>
              </div>
              <div>
                <div className="text-sm font-semibold leading-4">Ochiga</div>
                <div className="text-xs text-white/60">Infrastructure • Operations</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <a href="#platform" className="px-3 py-2 text-sm text-white/70 hover:text-white">Platform</a>
              <a href="#systems" className="px-3 py-2 text-sm text-white/70 hover:text-white">Systems</a>
              <a href="#how" className="px-3 py-2 text-sm text-white/70 hover:text-white">How it works</a>
              <a href="#demo" className="px-3 py-2 text-sm text-white/70 hover:text-white">Demo</a>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href="#demo"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                Request Demo
              </a>
              <a
                href="#demo"
                className="rounded-xl bg-white text-black px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
              >
                Deploy
              </a>
            </div>
          </div>

          {/* small “2026 / OE / …” strip */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill>2026</Pill>
            <Pill>OE</Pill>
            <Pill>Infrastructure</Pill>
            <Pill>Operations</Pill>
            <Pill>Processing</Pill>
            <Pill>Facilities</Pill>
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
                  Ochiga is an infrastructure-grade control system for estates, facilities, and urban assets —
                  dashboards, alerts, roles, devices, and digital twin views in one operating layer.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href="#demo"
                    className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
                  >
                    Request Demo
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

            {/* HERO IMAGE / PLACEHOLDER */}
            <div className="md:col-span-6">
              <Reveal className="md:pl-6">
                <div className="relative rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl overflow-hidden">
                  {/* “cool” dashboard placeholder */}
                  <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
                  <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

                  {/* Replace this with your real screenshot later */}
                  <div className="rounded-2xl border border-white/10 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.22),transparent_45%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.18),transparent_45%),radial-gradient(900px_circle_at_40%_90%,rgba(16,185,129,0.14),transparent_45%)] p-6">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">Command Center</div>
                      <div className="text-xs text-white/60">Live • Secure • Audited</div>
                    </div>

                    <div className="mt-5 grid grid-cols-12 gap-3">
                      <div className="col-span-12 md:col-span-7 rounded-xl border border-white/10 bg-black/30 p-4">
                        <div className="text-xs text-white/60">Map / Site View</div>
                        <div className="mt-3 h-28 rounded-lg border border-white/10 bg-white/5" />
                        <div className="mt-3 flex gap-2">
                          <span className="text-[11px] text-white/70 border border-white/10 bg-white/5 rounded-full px-2 py-1">
                            Assets: 124
                          </span>
                          <span className="text-[11px] text-white/70 border border-white/10 bg-white/5 rounded-full px-2 py-1">
                            Alerts: 3
                          </span>
                          <span className="text-[11px] text-white/70 border border-white/10 bg-white/5 rounded-full px-2 py-1">
                            Uptime: 99.9%
                          </span>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-5 rounded-xl border border-white/10 bg-black/30 p-4">
                        <div className="text-xs text-white/60">Systems</div>
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
                      <div className="text-xs text-white/60">Activity</div>
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
                    <Pill>Map View</Pill>
                    <Pill>3D Twin View</Pill>
                    <Pill>Role-based Ops</Pill>
                    <Pill>Alerts + Audit</Pill>
                  </div>
                </div>

                {/* extra image placeholders (swap later with real screenshots) */}
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                    <div className="text-xs text-white/60">Placeholder Image 1</div>
                    <div className="mt-3 h-28 rounded-xl border border-white/10 bg-white/5" />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                    <div className="text-xs text-white/60">Placeholder Image 2</div>
                    <div className="mt-3 h-28 rounded-xl border border-white/10 bg-white/5" />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* PLATFORM SECTION */}
        <section id="platform" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="text-xs text-white/60">Platform</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                  Built like an operations console — not a brochure
                </h2>
                <p className="mt-3 text-white/70 leading-7 max-w-2xl">
                  Clean spacing, high-signal cards, and visuals that carry the story.
                  This is the layout style you pointed at: premium, structured, and “infrastructure-grade”.
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
                title="Command Center UX"
                desc="Operators see status, alerts, and actions without clutter — everything is legible at a glance."
                icon={<span className="text-sm">⌘</span>}
              />
            </Reveal>
            <Reveal>
              <GlowCard
                title="Digital Twin Ready"
                desc="Map view today, 3D/4D extensions tomorrow — designed to grow without redesigning the whole product."
                icon={<span className="text-sm">◻︎</span>}
              />
            </Reveal>
            <Reveal>
              <GlowCard
                title="Roles + Audit"
                desc="Admin, Manager, Operator, Facility — permissions and activity logs built into the flow."
                icon={<span className="text-sm">✓</span>}
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
                  Power, water, access, security, lighting, maintenance — represented as cards with status,
                  actions, and history.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Power", "Water", "Security", "Access", "Lighting", "Maintenance"].map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="md:col-span-7">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["Power Operations", "Monitor supply, generator, ATS, faults, fuel, runtime."],
                  ["Water Systems", "Tanks, pumps, leaks, pressure, consumption, alarms."],
                  ["Security", "CCTV health, incidents, patrol logs, zones, escalation."],
                  ["Access Control", "Visitors, staff, QR/code, device logs, exceptions."],
                ].map(([t, d]) => (
                  <Reveal key={t}>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                      <div className="text-sm font-semibold">{t}</div>
                      <div className="mt-2 text-sm text-white/70 leading-6">{d}</div>
                      <div className="mt-4 h-20 rounded-xl border border-white/10 bg-white/5" />
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
                  ["1) Model the estate", "Site plan / map, assets, roles, and operational rules."],
                  ["2) Connect devices", "Integrate controllers, sensors, cameras, meters, gateways."],
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

        {/* DEMO */}
        <section id="demo" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <Reveal>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10 backdrop-blur-xl">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <div className="text-xs text-white/60">Demo</div>
                  <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                    Want to see it live?
                  </h2>
                  <p className="mt-3 text-white/70 leading-7 max-w-2xl">
                    Request a demo and we’ll walk you through the command center, systems cards, and the digital twin flow.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Option A: mailto */}
                  <a
                    href="mailto:hello@ochiga.com.ng?subject=Ochiga%20Demo%20Request&body=Hi%20Ochiga,%0A%0AI%20want%20to%20request%20a%20demo.%0A%0AName:%0ACompany/Estate:%0ALocation:%0APhone:%0AUse-case:%0A%0AThanks"
                    className="rounded-xl bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90 transition text-center"
                  >
                    Request Demo
                  </a>

                  {/* Option B: link to your form page */}
                  <a
                    href="/deploy"
                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/85 hover:text-white hover:bg-white/10 transition text-center"
                  >
                    Deployment Request
                  </a>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  ["Fast setup", "We can start with a single estate and expand."],
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

      {/* Footer (will stay at bottom because wrapper is flex-col + main is flex-1) */}
      <footer className="relative z-10 mt-auto">
        <div className="mx-auto w-full max-w-6xl px-5 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-white/10 pt-6">
            <div className="text-sm text-white/70">© {new Date().getFullYear()} Ochiga</div>
            <div className="text-xs text-white/50">
              Infrastructure • Operations • Facilities
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
