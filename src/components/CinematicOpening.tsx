"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { primaryCta, siteConfig } from "@/lib/site";

// Frame durations for stages 0-3 (ms before auto-advancing to the next
// frame). Stage 4 is the resting state and never auto-advances further.
const FRAME_DURATIONS = [2600, 2400, 2600, 3400];
const FRAME_LABELS = ["Systems", "Disconnected", "Question", "Verbs", "Oyi"];
const ACTION_FRAGMENTS = ["Operate it.", "Experience it.", "Ask it.", "Automate it."];

export function CinematicOpening() {
  const [stage, setStage] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Reading a browser-only media query after mount, not deriving state
    // from a React value — the SSR-rendered stage=0 must stay the first
    // client render too, or hydration mismatches.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStage(4);
      setAutoplay(false);
    }
  }, []);

  useEffect(() => {
    if (!autoplay || stage >= 4) return;
    timerRef.current = setTimeout(() => setStage((current) => Math.min(current + 1, 4)), FRAME_DURATIONS[stage]);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage, autoplay]);

  function goTo(next: number) {
    setAutoplay(false);
    setStage(next);
  }

  return (
    <section className="relative flex min-h-[92svh] flex-col justify-center overflow-hidden bg-[#040910] px-5 py-16 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.16),transparent_35%),radial-gradient(circle_at_80%_75%,rgba(14,165,233,0.12),transparent_40%)]" />

      {stage < 4 && (
        <button
          type="button"
          onClick={() => goTo(4)}
          className="absolute right-5 top-6 z-20 text-xs font-medium uppercase tracking-[0.2em] text-slate-400 transition hover:text-white motion-reduce:hidden"
        >
          Skip
        </button>
      )}

      <div className="relative mx-auto min-h-[48vh] w-full max-w-5xl">
        <Frame active={stage === 0}>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">Buildings already have systems.</h1>
        </Frame>
        <Frame active={stage === 1}>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">They just don&apos;t operate as one.</h1>
        </Frame>
        <Frame active={stage === 2}>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">What if the building could operate as one?</h1>
        </Frame>
        <Frame active={stage === 3}>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
            {ACTION_FRAGMENTS.map((fragment, index) => (
              <span
                key={fragment}
                className="text-3xl font-semibold tracking-[-0.03em] opacity-0 md:text-5xl motion-safe:animate-[oyi-fragment-in_0.6s_ease_forwards]"
                style={{ animationDelay: `${index * 420}ms` }}
              >
                {fragment}
              </span>
            ))}
          </div>
        </Frame>
        <Frame active={stage === 4}>
          <div className="flex flex-col items-center gap-6">
            <span className="grid h-16 w-16 place-items-center rounded-3xl border border-sky-300/30 bg-sky-400/10 shadow-[0_0_40px_rgba(56,189,248,0.3)]">
              <Image src={siteConfig.logo} width={34} height={34} alt="Oyi" priority />
            </span>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">One intelligent operating system for buildings.</h1>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Link href="/oyi" className="rounded-full bg-sky-400 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-sky-300">
                Explore Oyi
              </Link>
              <Link href={primaryCta.href} className="rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-white transition hover:border-sky-300/60 hover:bg-white/10">
                {primaryCta.label}
              </Link>
            </div>
          </div>
        </Frame>
      </div>

      <div className="relative z-10 mx-auto mt-10 flex items-center gap-2">
        {FRAME_LABELS.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-label={`Go to frame ${index + 1}: ${label}`}
            aria-current={stage === index}
            onClick={() => goTo(index)}
            className={`h-1.5 rounded-full transition-all ${stage === index ? "w-8 bg-sky-300" : "w-3 bg-white/20 hover:bg-white/40"}`}
          />
        ))}
      </div>
    </section>
  );
}

function Frame({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <div
      aria-hidden={!active}
      className={`absolute inset-0 flex items-center justify-center px-4 text-center transition-all duration-700 ease-out ${
        active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
