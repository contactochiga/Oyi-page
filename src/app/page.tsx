"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("oyi-theme");
    const prefersDark =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial = stored ? stored === "dark" : prefersDark;
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("oyi-theme", next ? "dark" : "light");
      return next;
    });
  };

  return { dark, toggle };
}

const SuiteCard = ({
  title,
  desc,
  bullets,
}: {
  title: string;
  desc: string;
  bullets: string[];
}) => {
  return (
    <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--card),0.7)] p-5 shadow-sm backdrop-blur">
      <div className="text-sm font-semibold">{title}</div>
      <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">{desc}</p>

      <ul className="mt-4 space-y-2 text-sm text-[rgb(var(--muted))]">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[rgb(var(--accent))]" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Home() {
  const { dark, toggle } = useTheme();

  const themeLabel = useMemo(() => (dark ? "Switch to Light" : "Switch to Dark"), [dark]);

  return (
    <div className="oyi-bg oyi-noise">
      <div className="oyi-container">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/oyi-logo-transparent.png"
              alt="Oyi"
              width={36}
              height={36}
              className="rounded-lg"
              priority
            />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Oyi</div>
              <div className="text-xs text-[rgb(var(--muted))]">Infrastructure Operations</div>
            </div>
          </div>

          <button onClick={toggle} className="oyi-btn text-sm">
            {themeLabel}
          </button>
        </div>

        {/* Hero panel */}
        <section className="oyi-panel mt-7 p-7 sm:p-10">
          <div className="oyi-kicker">
            <span className="oyi-dot" />
            <span>Live systems • Real operations • Estate and facility control</span>
          </div>

          <div className="mt-5 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h1 className="oyi-h1 text-4xl sm:text-5xl">
                Operate smarter.
                <br />
                See everything.
                <br />
                Control in real time.
              </h1>

              <p className="oyi-p mt-4 max-w-xl text-base leading-7">
                Oyi is an infrastructure-grade software suite for estates and facilities —
                consumer access, facility operations, and a control plane that keeps systems reliable,
                secure, and observable.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a className="oyi-btn oyi-btn-primary" href="#request">
                  Request deployment
                  <span aria-hidden>→</span>
                </a>

                <a className="oyi-btn" href="#suite">
                  Explore the suite
                </a>

                <a className="oyi-btn" href="#apps">
                  App availability
                </a>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-[rgb(var(--muted))]">
                <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--card),0.55)] p-3">
                  <div className="font-semibold text-[rgb(var(--fg))]">Secure</div>
                  <div className="mt-1">Access, audit, control</div>
                </div>
                <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--card),0.55)] p-3">
                  <div className="font-semibold text-[rgb(var(--fg))]">Reliable</div>
                  <div className="mt-1">Events and workers</div>
                </div>
                <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--card),0.55)] p-3">
                  <div className="font-semibold text-[rgb(var(--fg))]">Observable</div>
                  <div className="mt-1">Logs, metrics, traces</div>
                </div>
              </div>
            </div>

            {/* Right: “blueprint” callout */}
            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--card),0.55)] p-6">
              <div className="text-xs uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                Control plane view
              </div>

              <div className="mt-4 grid gap-3">
                <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--card),0.65)] p-4">
                  <div className="text-sm font-semibold">Events</div>
                  <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                    A single stream for device, user, and operational activity.
                  </div>
                </div>

                <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--card),0.65)] p-4">
                  <div className="text-sm font-semibold">Workers</div>
                  <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                    Automated processing: approvals, alerts, retries, and jobs.
                  </div>
                </div>

                <div className="rounded-xl border border-[rgb(var(--border))] bg-[rgba(var(--card),0.65)] p-4">
                  <div className="text-sm font-semibold">Reliability</div>
                  <div className="mt-1 text-sm text-[rgb(var(--muted))]">
                    Audits, idempotency, and orchestration — the system behind the system.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Suite */}
        <section id="suite" className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                The suite
              </div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">Three surfaces, one system.</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgb(var(--muted))]">
                Oyi is designed like infrastructure: separate operating surfaces, one shared control plane.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <SuiteCard
              title="Consumer App"
              desc="Resident access, requests, approvals, and everyday usage — built for clarity and speed."
              bullets={[
                "Access control, codes, approvals",
                "Requests: power, water, security",
                "Notifications and history",
              ]}
            />
            <SuiteCard
              title="Facility System"
              desc="Operations dashboards for security, power, water, lighting and controls — monitor, respond, enforce."
              bullets={[
                "Live monitoring and response",
                "Operators and roles",
                "Operational reporting",
              ]}
            />
            <SuiteCard
              title="Control Plane"
              desc="Workers and orchestration for events, automation, audits, and reliability — the system behind the system."
              bullets={[
                "Job queues and automations",
                "Audit and compliance trail",
                "Reliability patterns (retries, idempotency)",
              ]}
            />
          </div>
        </section>

        {/* Apps */}
        <section id="apps" className="mt-10 oyi-panel p-7 sm:p-9">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                Commercial access
              </div>
              <h3 className="mt-2 text-xl font-semibold">Available as an app.</h3>
              <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                The consumer surface ships as iOS and Android apps — while deployments are tailored per estate/facility.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <a className="oyi-btn" href="#">
                iOS (coming soon)
              </a>
              <a className="oyi-btn" href="#">
                Android (coming soon)
              </a>
            </div>
          </div>
        </section>

        {/* Request */}
        <section id="request" className="mt-10">
          <div className="oyi-panel p-7 sm:p-10">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-[rgb(var(--muted))]">
                  Deployment
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  Bring Oyi to your estate or facility.
                </h3>
                <p className="mt-2 text-sm leading-6 text-[rgb(var(--muted))]">
                  We deploy Oyi as a full operational system: setup, integrations, roles, and live monitoring.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                <a className="oyi-btn oyi-btn-primary" href="mailto:contactochiga@gmail.com">
                  Email for deployment
                </a>
                <a className="oyi-btn" href="#suite">
                  Review suite
                </a>
              </div>
            </div>

            <div className="mt-8 border-t border-[rgb(var(--border))] pt-6 text-xs text-[rgb(var(--muted))]">
              Built by Ochiga (OGCI Limited). No Ochiga marketing on this page.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
