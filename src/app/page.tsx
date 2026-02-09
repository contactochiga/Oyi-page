"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Mode = "light" | "dark";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("oyi-mode") as Mode | null) ?? null;
    if (saved === "light" || saved === "dark") setMode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("oyi-mode", mode);
  }, [mode]);

  const isDark = mode === "dark";

  const palette = useMemo(() => {
    return isDark
      ? {
          page: "bg-[#070A0F] text-white",
          card: "bg-white/[0.03] border-white/[0.10]",
          cardHover: "hover:bg-white/[0.05]",
          soft: "text-white/72",
          faint: "text-white/48",
          hair: "border-white/[0.12]",
          glow:
            "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_24px_80px_rgba(0,0,0,0.65)]",
          btn: "bg-white text-black hover:bg-white/92",
          btn2:
            "bg-white/[0.06] text-white hover:bg-white/[0.10] border border-white/[0.14]",
          chip:
            "bg-white/[0.06] border-white/[0.14] text-white/75 hover:bg-white/[0.09]",
          accent: "text-[#B7C6FF]",
          divider: "border-white/[0.10]",
          gridOpacity: "opacity-[0.22]",
          dot: "bg-white/20",
          link: "text-white hover:text-white/80",
        }
      : {
          page: "bg-[#F6F7FB] text-[#0B1220]",
          card: "bg-white border-black/[0.10]",
          cardHover: "hover:bg-black/[0.02]",
          soft: "text-black/72",
          faint: "text-black/50",
          hair: "border-black/[0.12]",
          glow:
            "shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_24px_80px_rgba(15,23,42,0.10)]",
          btn: "bg-black text-white hover:bg-black/90",
          btn2:
            "bg-black/[0.04] text-black hover:bg-black/[0.06] border border-black/[0.12]",
          chip:
            "bg-black/[0.03] border-black/[0.12] text-black/70 hover:bg-black/[0.05]",
          accent: "text-[#1D4ED8]",
          divider: "border-black/[0.10]",
          gridOpacity: "opacity-[0.18]",
          dot: "bg-black/20",
          link: "text-black hover:text-black/70",
        };
  }, [isDark]);

  return (
    <div className={cn("min-h-screen w-full", palette.page)}>
      {/* Background: infrastructure grid + subtle glow */}
      <div className="pointer-events-none fixed inset-0">
        <div
          className={cn(
            "absolute inset-0",
            palette.gridOpacity,
            "bg-[linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)]"
          )}
          style={{ backgroundSize: "64px 64px" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_16%,rgba(99,102,241,0.18),transparent_48%),radial-gradient(circle_at_86%_74%,rgba(59,130,246,0.12),transparent_55%)]" />
        <div className={cn("absolute inset-0", isDark ? "bg-black/35" : "bg-white/35")} />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn("h-10 w-10 rounded-xl overflow-hidden border", palette.hair, palette.glow)}>
              <Image
                src="/oyi-logo-transparent.png"
                alt="Oyi"
                width={64}
                height={64}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Oyi</div>
              <div className={cn("text-xs", palette.faint)}>Infrastructure Operations</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="#faq"
              className={cn(
                "hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition",
                palette.btn2
              )}
            >
              FAQ
            </a>
            <button
              onClick={() => setMode(isDark ? "light" : "dark")}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
                palette.btn2
              )}
              aria-label="Toggle theme"
            >
              <span className={cn("inline-block h-2 w-2 rounded-full", palette.dot)} />
              {isDark ? "Switch to Light" : "Switch to Dark"}
            </button>
          </div>
        </header>

        {/* HERO */}
        <main className="mt-10 sm:mt-14">
          <section className={cn("rounded-3xl border p-8 sm:p-12 lg:p-14", palette.card, palette.glow)}>
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span className={cn("h-2 w-2 rounded-full", isDark ? "bg-[#9AA9FF]" : "bg-[#1D4ED8]")} />
                  <div className={cn("text-xs font-medium tracking-wide", palette.faint)}>
                    Live systems • Real operations • Estate & facility control
                  </div>
                </div>

                <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                  Operate smarter.
                  <br />
                  See everything.
                  <br />
                  Control in real time.
                </h1>

                <p className={cn("mt-6 max-w-xl text-lg leading-8 sm:text-xl", palette.soft)}>
                  Oyi is an infrastructure-grade suite for estates and facilities — resident access,
                  facility operations, and a control plane that keeps systems reliable, secure, and observable.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="mailto:contactochiga@gmail.com?subject=Oyi%20Deployment%20Request"
                    className={cn("inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition", palette.btn)}
                  >
                    Request Deployment
                  </a>
                  <a
                    href="#suite"
                    className={cn("inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition", palette.btn2)}
                  >
                    See the Suite
                  </a>

                  <div className={cn("text-xs", palette.faint)}>
                    App availability: iOS & Android (store release once packaging is complete).
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  <Chip mode={mode} text="Role-based access" />
                  <Chip mode={mode} text="Audit trails" />
                  <Chip mode={mode} text="Incident response" />
                  <Chip mode={mode} text="Device orchestration" />
                  <Chip mode={mode} text="Observability" />
                </div>
              </div>

              {/* Visual / mock */}
              <div className={cn("rounded-2xl border p-4 sm:p-5", palette.hair, palette.cardHover)}>
                <div className={cn("relative overflow-hidden rounded-xl border", palette.hair)}>
                  <Image
                    src="/oyi-mock.png"
                    alt="Oyi product preview"
                    width={1400}
                    height={900}
                    className="h-auto w-full object-cover"
                    priority
                  />
                </div>
                <div className={cn("mt-4 text-xs", palette.faint)}>
                  Placeholder mock — replace with real system screenshots when ready.
                </div>
              </div>
            </div>
          </section>

          {/* SUITE */}
          <section id="suite" className="mt-10 sm:mt-14">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  The Oyi Suite
                </h2>
                <p className={cn("mt-2 max-w-2xl text-sm leading-6 sm:text-base", palette.soft)}>
                  Three layers: consumer experience, facility operations, and the control plane that makes it infrastructure-grade.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <SuiteCard
                title="Consumer App"
                body="Resident access, requests, approvals, visitor passes, and daily usage — built for speed and clarity."
                mode={mode}
                bullets={[
                  "Visitor QR / access requests",
                  "Service requests & approvals",
                  "Smart living controls (where enabled)",
                ]}
              />
              <SuiteCard
                title="Facility System"
                body="Operations dashboard for security, power, water, lighting, and controls — monitor, respond, enforce."
                mode={mode}
                bullets={[
                  "Security + access operations",
                  "Utilities monitoring (power/water)",
                  "Tasking, logs, and reporting",
                ]}
              />
              <SuiteCard
                title="Control Plane"
                body="Workers + orchestration for events, automation, audits, and reliability — the system behind the system."
                mode={mode}
                bullets={[
                  "Automation rules + workflows",
                  "Audit trails + incident tracking",
                  "Reliability + observability",
                ]}
              />
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section className="mt-10 sm:mt-14">
            <div className={cn("rounded-3xl border p-8 sm:p-12", palette.card, palette.glow)}>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                How deployment works
              </h2>
              <p className={cn("mt-2 max-w-3xl text-sm leading-6 sm:text-base", palette.soft)}>
                We deploy Oyi like real infrastructure: align systems, integrate devices, go live in phases, then operate with monitoring and reporting.
              </p>

              <div className="mt-8 grid gap-4 lg:grid-cols-4">
                <Step
                  mode={mode}
                  n="01"
                  title="Discovery"
                  body="Estate scope, systems map, roles, policies, and operating model."
                />
                <Step
                  mode={mode}
                  n="02"
                  title="Integration"
                  body="Connect devices + subsystems (e.g., access, power, water, security)."
                />
                <Step
                  mode={mode}
                  n="03"
                  title="Go-Live"
                  body="Launch the first 3 systems, onboard operators, and set response playbooks."
                />
                <Step
                  mode={mode}
                  n="04"
                  title="Operations"
                  body="Monitoring, audits, incident handling, reports, continuous improvement."
                />
              </div>
            </div>
          </section>

          {/* INTEGRATIONS + SECURITY */}
          <section className="mt-10 sm:mt-14">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className={cn("rounded-3xl border p-8 sm:p-10", palette.card, palette.glow)}>
                <h3 className="text-xl font-semibold tracking-tight">Integrations</h3>
                <p className={cn("mt-2 text-sm leading-6 sm:text-base", palette.soft)}>
                  Oyi is built to integrate with devices and operational tools — not just “look good”.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Chip mode={mode} text="Tuya (smart devices)" />
                  <Chip mode={mode} text="Access control systems" />
                  <Chip mode={mode} text="CCTV / security workflows" />
                  <Chip mode={mode} text="Utility metering (power/water)" />
                  <Chip mode={mode} text="SMS / Email alerts" />
                  <Chip mode={mode} text="Webhooks / API" />
                </div>
              </div>

              <div className={cn("rounded-3xl border p-8 sm:p-10", palette.card, palette.glow)}>
                <h3 className="text-xl font-semibold tracking-tight">Security & reliability</h3>
                <p className={cn("mt-2 text-sm leading-6 sm:text-base", palette.soft)}>
                  This is operations software. Every action must be visible, traceable, and controllable.
                </p>
                <ul className={cn("mt-6 space-y-3 text-sm sm:text-base", palette.soft)}>
                  <li>• Role-based permissions for residents, staff, operators, and admins</li>
                  <li>• Audit logs for approvals, access, incidents, and changes</li>
                  <li>• Operational reporting (what happened, who did what, when)</li>
                  <li>• Control plane workflows for automation + enforcement</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="mt-10 sm:mt-14">
            <div className={cn("rounded-3xl border p-8 sm:p-12", palette.card, palette.glow)}>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">FAQ</h2>
              <div className={cn("mt-6 divide-y", palette.divider)}>
                <FAQItem
                  mode={mode}
                  q="Is Oyi a smart home app or an estate control system?"
                  a="Oyi is infrastructure operations software. Residents use consumer features, but managers and operators run real estate systems through the facility system + control plane."
                />
                <FAQItem
                  mode={mode}
                  q="Can you integrate hardware and devices?"
                  a="Yes. Oyi is built for integration — access control, utilities, smart devices (e.g., Tuya), and operational workflows."
                />
                <FAQItem
                  mode={mode}
                  q="How do deployments start?"
                  a="We start with discovery, map the estate systems, integrate the first set of live systems, then launch in phases with operations reporting."
                />
                <FAQItem
                  mode={mode}
                  q="What do you need from an estate to go live?"
                  a="Systems list (access/security/utilities), operating rules, and the primary operator/admin contacts. We handle the software deployment and integration plan."
                />
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="mailto:contactochiga@gmail.com?subject=Oyi%20Deployment%20Request"
                  className={cn("inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition", palette.btn)}
                >
                  Request Deployment
                </a>
                <div className={cn("text-xs", palette.faint)}>
                  Built by Ochiga (OGCI Limited). No Ochiga marketing on this page.
                </div>
              </div>
            </div>
          </section>

          <div className="h-14" />
        </main>

        {/* Footer */}
        <footer className={cn("mt-2 pb-10 text-xs", palette.faint)}>
          © {new Date().getFullYear()} Oyi. Infrastructure operations for estates and facilities.
        </footer>
      </div>
    </div>
  );
}

function Chip({ text, mode }: { text: string; mode: Mode }) {
  const isDark = mode === "dark";
  return (
    <div
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        isDark
          ? "bg-white/[0.06] border-white/[0.14] text-white/75 hover:bg-white/[0.09]"
          : "bg-black/[0.03] border-black/[0.12] text-black/70 hover:bg-black/[0.05]"
      )}
    >
      {text}
    </div>
  );
}

function SuiteCard({
  title,
  body,
  bullets,
  mode,
}: {
  title: string;
  body: string;
  bullets: string[];
  mode: Mode;
}) {
  const isDark = mode === "dark";
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 transition",
        isDark
          ? "bg-white/[0.02] border-white/[0.10] hover:bg-white/[0.04]"
          : "bg-white border-black/[0.10] hover:bg-black/[0.02]"
      )}
    >
      <div className={cn("text-sm font-semibold", isDark ? "text-white" : "text-black")}>{title}</div>
      <p className={cn("mt-2 text-sm leading-6", isDark ? "text-white/70" : "text-black/70")}>{body}</p>
      <ul className={cn("mt-4 space-y-2 text-sm", isDark ? "text-white/65" : "text-black/65")}>
        {bullets.map((b) => (
          <li key={b}>• {b}</li>
        ))}
      </ul>
    </div>
  );
}

function Step({ n, title, body, mode }: { n: string; title: string; body: string; mode: Mode }) {
  const isDark = mode === "dark";
  return (
    <div
      className={cn(
        "rounded-2xl border p-6",
        isDark ? "border-white/[0.10] bg-white/[0.02]" : "border-black/[0.10] bg-black/[0.02]"
      )}
    >
      <div className={cn("text-xs font-semibold", isDark ? "text-white/55" : "text-black/55")}>{n}</div>
      <div className={cn("mt-2 text-sm font-semibold", isDark ? "text-white" : "text-black")}>{title}</div>
      <p className={cn("mt-2 text-sm leading-6", isDark ? "text-white/70" : "text-black/70")}>{body}</p>
    </div>
  );
}

function FAQItem({ q, a, mode }: { q: string; a: string; mode: Mode }) {
  const isDark = mode === "dark";
  return (
    <div className="py-5">
      <div className={cn("text-sm font-semibold", isDark ? "text-white" : "text-black")}>{q}</div>
      <div className={cn("mt-2 text-sm leading-6", isDark ? "text-white/70" : "text-black/70")}>{a}</div>
    </div>
  );
}
