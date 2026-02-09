// src/app/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Mode = "light" | "dark";

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("light");

  // Persist theme locally
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
          card: "bg-white/[0.03] border-white/[0.08]",
          soft: "text-white/70",
          faint: "text-white/45",
          hair: "border-white/[0.10]",
          glow: "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_60px_rgba(0,0,0,0.65)]",
          btn: "bg-white text-black hover:bg-white/90",
          btn2: "bg-white/[0.06] text-white hover:bg-white/[0.10] border border-white/[0.12]",
          grid: "opacity-[0.22]",
          dot: "bg-white/20",
          accent: "text-[#B7C6FF]",
          chip: "bg-white/[0.06] border-white/[0.12] text-white/75",
        }
      : {
          page: "bg-[#F6F7FB] text-[#0B1220]",
          card: "bg-white border-black/[0.08]",
          soft: "text-black/70",
          faint: "text-black/45",
          hair: "border-black/[0.10]",
          glow: "shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_18px_60px_rgba(15,23,42,0.10)]",
          btn: "bg-black text-white hover:bg-black/90",
          btn2: "bg-black/[0.04] text-black hover:bg-black/[0.06] border border-black/[0.10]",
          grid: "opacity-[0.18]",
          dot: "bg-black/20",
          accent: "text-[#1D4ED8]",
          chip: "bg-black/[0.03] border-black/[0.10] text-black/65",
        };
  }, [isDark]);

  return (
    <div className={cn("min-h-screen w-full", palette.page)}>
      {/* Subtle infrastructure grid background */}
      <div className="pointer-events-none fixed inset-0">
        {/* grid */}
        <div
          className={cn(
            "absolute inset-0",
            palette.grid,
            "bg-[linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)]",
            "dark:block"
          )}
          style={{ backgroundSize: "64px 64px" }}
        />
        <div
          className={cn(
            "absolute inset-0",
            palette.grid,
            "bg-[linear-gradient(to_right,rgba(0,0,0,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.10)_1px,transparent_1px)]",
            "block"
          )}
          style={{ backgroundSize: "64px 64px" }}
        />
        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.18),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.12),transparent_50%)]" />
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
        </header>

        {/* Hero */}
        <main className="mt-10 sm:mt-14">
          <section
            className={cn(
              "rounded-3xl border p-8 sm:p-12 lg:p-14",
              palette.card,
              palette.glow
            )}
          >
            <div className="flex flex-col gap-10">
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <span className={cn("h-2 w-2 rounded-full", isDark ? "bg-[#9AA9FF]" : "bg-[#1D4ED8]")} />
                <div className={cn("text-xs font-medium tracking-wide", palette.faint)}>
                  Live systems • Real operations • Estate & facility control
                </div>
              </div>

              {/* Big statement */}
              <div className="max-w-4xl">
                <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                  Operate smarter.
                  <br />
                  See everything.
                  <br />
                  Control in real time.
                </h1>

                <p className={cn("mt-6 max-w-3xl text-lg leading-8 sm:text-xl", palette.soft)}>
                  Oyi is an infrastructure-grade software suite for estates and facilities —{" "}
                  <span className={cn("font-medium", palette.accent)}>consumer access</span>,{" "}
                  <span className={cn("font-medium", palette.accent)}>facility operations</span>,{" "}
                  and a{" "}
                  <span className={cn("font-medium", palette.accent)}>control plane</span> that keeps systems
                  reliable, secure, and observable.
                </p>

                {/* CTAs */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="mailto:contactochiga@gmail.com?subject=Oyi%20Deployment%20Request"
                    className={cn(
                      "inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition",
                      palette.btn
                    )}
                  >
                    Request Deployment
                  </a>

                  <a
                    href="#systems"
                    className={cn(
                      "inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition",
                      palette.btn2
                    )}
                  >
                    View the Suite
                  </a>

                  <div className={cn("text-xs", palette.faint)}>
                    App availability: iOS & Android (store release once packaging is complete).
                  </div>
                </div>
              </div>

              {/* Suite cards */}
              <div id="systems" className="grid gap-4 md:grid-cols-3">
                <SuiteCard
                  title="Consumer App"
                  body="Resident access, requests, approvals, and day-to-day usage — built for speed and clarity."
                  mode={mode}
                />
                <SuiteCard
                  title="Facility System"
                  body="Operations dashboards for security, power, water, lighting and controls — monitor, respond, enforce."
                  mode={mode}
                />
                <SuiteCard
                  title="Control Plane"
                  body="Workers + orchestration for events, automation, audits, and reliability — the system behind the system."
                  mode={mode}
                />
              </div>

              {/* Infra chips */}
              <div className="flex flex-wrap gap-2">
                <Chip mode={mode} text="Audit trails" />
                <Chip mode={mode} text="Role-based access" />
                <Chip mode={mode} text="Incident response" />
                <Chip mode={mode} text="Device orchestration" />
                <Chip mode={mode} text="Observability" />
                <Chip mode={mode} text="Secure operations" />
              </div>

              {/* Footer note */}
              <div className={cn("pt-2 text-xs", palette.faint)}>
                Built by Ochiga (OGCI Limited). No Ochiga marketing on this page.
              </div>
            </div>
          </section>

          {/* Bottom spacing */}
          <div className="h-10" />
        </main>
      </div>
    </div>
  );
}

function SuiteCard({
  title,
  body,
  mode,
}: {
  title: string;
  body: string;
  mode: Mode;
}) {
  const isDark = mode === "dark";
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 transition",
        isDark ? "bg-white/[0.02] border-white/[0.10] hover:bg-white/[0.04]" : "bg-white border-black/[0.08] hover:bg-black/[0.02]"
      )}
    >
      <div className={cn("text-sm font-semibold", isDark ? "text-white" : "text-black")}>
        {title}
      </div>
      <p className={cn("mt-2 text-sm leading-6", isDark ? "text-white/70" : "text-black/70")}>
        {body}
      </p>
    </div>
  );
}

function Chip({ text, mode }: { text: string; mode: Mode }) {
  const isDark = mode === "dark";
  return (
    <div
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium",
        isDark ? "bg-white/[0.06] border-white/[0.12] text-white/75" : "bg-black/[0.03] border-black/[0.10] text-black/65"
      )}
    >
      {text}
    </div>
  );
}
