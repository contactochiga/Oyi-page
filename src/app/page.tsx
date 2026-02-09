"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light";

export default function Home() {
  const [theme, setTheme] = useState<Theme>("dark");

  // apply theme to <html>
  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === "light") root.classList.add("theme-light");
    else root.classList.remove("theme-light");
    localStorage.setItem("oyi_theme", t);
    setTheme(t);
  };

  useEffect(() => {
    const saved = (localStorage.getItem("oyi_theme") as Theme | null) ?? null;

    // default = dark (command-center). If user chose light before, respect it.
    if (saved === "light") applyTheme("light");
    else applyTheme("dark");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleLabel = useMemo(
    () => (theme === "dark" ? "Switch to Light" : "Switch to Dark"),
    [theme]
  );

  return (
    <div className="oyi-surface">
      <main className="oyi-layer mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="oyi-pill flex items-center gap-3 rounded-2xl px-3 py-2">
              <Image
                src="/oyi-logo-transparent.png"
                alt="Oyi"
                width={34}
                height={34}
                priority
              />
              <div className="leading-tight">
                <div className="text-sm font-semibold tracking-tight">Oyi</div>
                <div className="text-xs text-[rgb(var(--muted))]">
                  Infrastructure Operations
                </div>
              </div>
            </div>
          </div>

          <button
            className="oyi-btn rounded-full px-4 py-2 text-sm"
            onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
            aria-label={toggleLabel}
          >
            {toggleLabel}
          </button>
        </div>

        {/* Hero */}
        <section className="mt-10 oyi-card rounded-3xl p-7 sm:mt-14 sm:p-10">
          <div className="flex flex-col gap-8">
            <div className="space-y-4">
              <div className="oyi-pill inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))]" />
                Live systems • Real operations • Estate & facility control
              </div>

              <h1 className="max-w-3xl text-3xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
                Operate smarter. See everything. Control in real time.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-[rgb(var(--muted))] sm:text-lg">
                Oyi is an infrastructure-grade software suite for estates and
                facilities — consumer access, facility operations, and a control
                plane that keeps systems reliable, secure, and observable.
              </p>
            </div>

            {/* 3 pillars */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="oyi-pill rounded-2xl p-5">
                <div className="text-sm font-semibold">Consumer App</div>
                <div className="mt-2 text-sm text-[rgb(var(--muted))]">
                  Resident access, requests, approvals, and day-to-day usage —
                  built for speed and clarity.
                </div>
              </div>

              <div className="oyi-pill rounded-2xl p-5">
                <div className="text-sm font-semibold">Facility System</div>
                <div className="mt-2 text-sm text-[rgb(var(--muted))]">
                  Operations dashboards for security, power, water, lighting and
                  controls — monitor, respond, enforce.
                </div>
              </div>

              <div className="oyi-pill rounded-2xl p-5">
                <div className="text-sm font-semibold">Control Plane</div>
                <div className="mt-2 text-sm text-[rgb(var(--muted))]">
                  Workers + orchestration for events, automation, audits, and
                  reliability — the system behind the system.
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-[rgb(var(--muted))]">
              <div>
                App availability: <span className="text-[rgb(var(--text))]">iOS & Android</span>{" "}
                (store release once packaging is complete).
              </div>
              <div className="text-xs">
                Built by Ochiga (OGCI Limited). No Ochiga marketing on this page.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
