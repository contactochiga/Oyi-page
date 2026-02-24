// src/app/page.tsx
"use client";

import Image from "next/image";
import React, { useMemo, useRef, useState, useEffect } from "react";

type Mode = "dark" | "light";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

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

function IconWrap({ children, mode }: { children: React.ReactNode; mode: Mode }) {
  const isDark = mode === "dark";
  return (
    <div
      className={cn(
        "h-10 w-10 rounded-xl border flex items-center justify-center",
        isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.03]"
      )}
    >
      {children}
    </div>
  );
}

/** Consistent “line” icons (stroke uses currentColor) */
function LineIcon({ children, mode }: { children: React.ReactNode; mode: Mode }) {
  const isDark = mode === "dark";
  return <div className={cn(isDark ? "text-white/80" : "text-black/70")}>{children}</div>;
}

function IHome({ mode }: { mode: Mode }) {
  return (
    <LineIcon mode={mode}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </LineIcon>
  );
}
function ISliders({ mode }: { mode: Mode }) {
  return (
    <LineIcon mode={mode}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 21v-7m0-4V3m10 18v-9m0-4V3m6 18v-5m0-4V3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M4 14h4m6-2h6m-6 4h6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </LineIcon>
  );
}
function IBolt({ mode }: { mode: Mode }) {
  return (
    <LineIcon mode={mode}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M13 2 4 14h7l-1 8 10-12h-7l0-8Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </LineIcon>
  );
}
function IDoor({ mode }: { mode: Mode }) {
  return (
    <LineIcon mode={mode}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M8 21V4a1 1 0 0 1 1-1h9v19"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M6 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14.5 12h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </LineIcon>
  );
}
function IShield({ mode }: { mode: Mode }) {
  return (
    <LineIcon mode={mode}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2 20 6v7c0 5-3.5 9-8 9s-8-4-8-9V6l8-4Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9 12l2 2 4-5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </LineIcon>
  );
}
function IPlug({ mode }: { mode: Mode }) {
  return (
    <LineIcon mode={mode}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M9 2v6m6-6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          d="M7 8h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V8Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M12 17v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </LineIcon>
  );
}
function ICredit({ mode }: { mode: Mode }) {
  return (
    <LineIcon mode={mode}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 15h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </LineIcon>
  );
}
function IFile({ mode }: { mode: Mode }) {
  return (
    <LineIcon mode={mode}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-5-5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M14 2v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 13h8M8 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </LineIcon>
  );
}
function IGear({ mode }: { mode: Mode }) {
  return (
    <LineIcon mode={mode}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M19.4 15a7.9 7.9 0 0 0 .1-2l2-1.2-2-3.4-2.3.6a7.7 7.7 0 0 0-1.7-1l-.3-2.4H11l-.3 2.4a7.7 7.7 0 0 0-1.7 1l-2.3-.6-2 3.4 2 1.2a7.9 7.9 0 0 0 .1 2l-2 1.2 2 3.4 2.3-.6c.5.4 1.1.7 1.7 1l.3 2.4h4l.3-2.4c.6-.3 1.2-.6 1.7-1l2.3.6 2-3.4-2-1.2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </LineIcon>
  );
}

function GlowCard({
  title,
  desc,
  icon,
  mode,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  mode: Mode;
}) {
  const isDark = mode === "dark";
  return (
    <div
      className={cn(
        "group relative rounded-2xl border p-6 backdrop-blur-xl transition",
        isDark
          ? "border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] hover:bg-white/[0.07]"
          : "border-black/10 bg-black/[0.02] shadow-[0_0_0_1px_rgba(0,0,0,0.04)] hover:bg-black/[0.04]"
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          isDark
            ? "bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(59,130,246,0.22),transparent_45%),radial-gradient(900px_circle_at_80%_30%,rgba(168,85,247,0.16),transparent_40%),radial-gradient(900px_circle_at_40%_90%,rgba(16,185,129,0.14),transparent_45%)]"
            : "bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(59,130,246,0.10),transparent_45%),radial-gradient(900px_circle_at_80%_30%,rgba(168,85,247,0.08),transparent_40%),radial-gradient(900px_circle_at_40%_90%,rgba(16,185,129,0.08),transparent_45%)]"
        )}
      />
      <div className="relative">
        <div className="flex items-center gap-3">
          <IconWrap mode={mode}>{icon}</IconWrap>
          <h3 className={cn("text-base font-semibold", isDark ? "text-white" : "text-black")}>{title}</h3>
        </div>
        <p className={cn("mt-3 text-sm leading-6", isDark ? "text-white/70" : "text-black/70")}>{desc}</p>
      </div>
    </div>
  );
}

function Pill({ children, mode }: { children: React.ReactNode; mode: Mode }) {
  const isDark = mode === "dark";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs",
        isDark ? "border-white/10 bg-white/5 text-white/70" : "border-black/10 bg-black/[0.03] text-black/70"
      )}
    >
      {children}
    </span>
  );
}

function LiveDot({ mode }: { mode: Mode }) {
  const isDark = mode === "dark";
  return <span className={cn("h-1.5 w-1.5 rounded-full", isDark ? "bg-emerald-400/80" : "bg-emerald-600")} />;
}

/** Different mini spark lines per system */
function Sparkline({ variant, mode }: { variant: "power" | "water" | "security" | "access"; mode: Mode }) {
  const paths: Record<string, string> = {
    power: "M2 26 L14 22 L26 24 L38 18 L50 20 L62 14 L74 16 L86 10 L98 12 L110 8 L122 10",
    water: "M2 10 L14 12 L26 14 L38 16 L50 18 L62 22 L74 20 L86 18 L98 16 L110 14 L122 12",
    security: "M2 24 L14 24 L26 12 L38 24 L50 22 L62 8 L74 26 L86 14 L98 26 L110 18 L122 24",
    access: "M2 26 L14 26 L26 18 L38 18 L50 22 L62 22 L74 12 L86 12 L98 16 L110 10 L122 10",
  };

  const isDark = mode === "dark";
  return (
    <svg viewBox="0 0 124 32" className="h-full w-full">
      <path
        d={paths[variant]}
        fill="none"
        stroke={isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2 28 H122" fill="none" stroke={isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"} strokeWidth="1" />
    </svg>
  );
}

function CompactPreview({
  label,
  kpi1,
  kpi2,
  variant,
  mode,
}: {
  label: string;
  kpi1: string;
  kpi2: string;
  variant: "power" | "water" | "security" | "access";
  mode: Mode;
}) {
  const isDark = mode === "dark";
  return (
    <div className={cn("mt-3 rounded-xl border p-3", isDark ? "border-white/10 bg-black/25" : "border-black/10 bg-white/60")}>
      <div className="flex items-center justify-between">
        <div className={cn("text-[11px]", isDark ? "text-white/60" : "text-black/55")}>{label}</div>
        <div className={cn("flex items-center gap-2 text-[11px]", isDark ? "text-white/55" : "text-black/55")}>
          <LiveDot mode={mode} />
          Realtime
        </div>
      </div>

      <div
        className={cn(
          "mt-2 h-10 rounded-lg border relative overflow-hidden",
          isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.03]"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 opacity-70",
            isDark
              ? "bg-[radial-gradient(500px_circle_at_20%_40%,rgba(59,130,246,0.18),transparent_45%),radial-gradient(420px_circle_at_75%_60%,rgba(168,85,247,0.14),transparent_50%)]"
              : "bg-[radial-gradient(500px_circle_at_20%_40%,rgba(59,130,246,0.10),transparent_45%),radial-gradient(420px_circle_at_75%_60%,rgba(168,85,247,0.08),transparent_50%)]"
          )}
        />
        <div
          className={cn(
            "absolute inset-0 opacity-[0.12]",
            isDark
              ? "[background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px)]"
              : "[background-image:linear-gradient(to_right,rgba(0,0,0,0.18)_1px,transparent_1px)]"
          )}
          style={{ backgroundSize: "22px 22px" }}
        />
        <div className="absolute inset-0 px-2 py-1">
          <Sparkline variant={variant} mode={mode} />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className={cn("text-[11px]", isDark ? "text-white/70" : "text-black/70")}>{kpi1}</div>
        <div className={cn("text-[11px]", isDark ? "text-white/70" : "text-black/70")}>{kpi2}</div>
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
  mode,
}: {
  title: string;
  oneLine: string;
  previewLabel: string;
  kpi1: string;
  kpi2: string;
  variant: "power" | "water" | "security" | "access";
  mode: Mode;
}) {
  const isDark = mode === "dark";
  return (
    <div className={cn("rounded-2xl border p-4 backdrop-blur-xl", isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.02]")}>
      <div className="flex items-start justify-between gap-3">
        <div className={cn("text-sm font-semibold", isDark ? "text-white" : "text-black")}>{title}</div>
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-2 py-1 text-[11px]",
            isDark ? "border-white/10 bg-white/5 text-white/60" : "border-black/10 bg-black/[0.03] text-black/60"
          )}
        >
          <LiveDot mode={mode} />
          Live
        </span>
      </div>

      <div className={cn("mt-2 text-sm leading-6", isDark ? "text-white/70" : "text-black/70")}>{oneLine}</div>

      <CompactPreview label={previewLabel} kpi1={kpi1} kpi2={kpi2} variant={variant} mode={mode} />
    </div>
  );
}

function FeatureTile({
  title,
  desc,
  icon,
  mode,
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  mode: Mode;
}) {
  const isDark = mode === "dark";
  return (
    <div
      className={cn(
        "group rounded-2xl border p-5 backdrop-blur-xl transition",
        isDark ? "border-white/10 bg-white/5 hover:bg-white/[0.07]" : "border-black/10 bg-black/[0.02] hover:bg-black/[0.04]"
      )}
    >
      <div className="flex flex-col items-center text-center">
        <div className={cn("mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border", isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.03]")}>
          {icon}
        </div>
        <div className={cn("text-sm font-semibold", isDark ? "text-white" : "text-black")}>{title}</div>
        <div className={cn("mt-2 text-sm leading-6 max-w-[28ch]", isDark ? "text-white/65" : "text-black/65")}>{desc}</div>
      </div>
    </div>
  );
}

function ThemeSwitch({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const isDark = mode === "dark";
  return (
    <button
      onClick={() => setMode(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition",
        isDark
          ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
          : "border-black/10 bg-black/[0.03] text-black/70 hover:bg-black/[0.06]"
      )}
      aria-label="Toggle theme"
    >
      <span className={cn("inline-block h-2 w-2 rounded-full", isDark ? "bg-white/70" : "bg-black/60")} />
      {isDark ? "Dark" : "Light"}
    </button>
  );
}

/**
 * Option A: auto region pricing (client heuristic).
 * Later we can make this perfect with a small /api/geo that reads Vercel headers.
 */
type Currency = "NGN" | "GBP" | "USD";

function detectCurrencyClient(): Currency {
  try {
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();
    const lang = (navigator.language || "").toUpperCase();

    const isNG = tz.includes("lagos") || tz.includes("africa/lagos") || lang.endsWith("-NG");
    if (isNG) return "NGN";

    const isGB = tz.includes("london") || tz.includes("europe/london") || lang.endsWith("-GB");
    if (isGB) return "GBP";

    const isUS =
      tz.includes("america/") ||
      tz.includes("new_york") ||
      tz.includes("los_angeles") ||
      tz.includes("chicago") ||
      tz.includes("denver") ||
      lang.endsWith("-US");
    if (isUS) return "USD";

    return "USD";
  } catch {
    return "USD";
  }
}

function formatMoney(amount: number, currency: Currency) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "NGN" ? 0 : 0,
    }).format(amount);
  } catch {
    const symbol = currency === "NGN" ? "₦" : currency === "GBP" ? "£" : "$";
    return `${symbol}${amount}`;
  }
}

function PriceCard({
  mode,
  name,
  subtitle,
  priceByCurrency,
  highlight,
  bullets,
  ctaText,
  ctaHref,
  badge,
}: {
  mode: Mode;
  name: string;
  subtitle: string;
  priceByCurrency: Record<Currency, number>;
  highlight?: boolean;
  bullets: string[];
  ctaText: string;
  ctaHref: string;
  badge?: string;
}) {
  const isDark = mode === "dark";
  const [currency, setCurrency] = useState<Currency>("USD");

  useEffect(() => {
    setCurrency(detectCurrencyClient());
  }, []);

  const price = priceByCurrency[currency] ?? priceByCurrency.USD;

  return (
    <div
      className={cn(
        "relative rounded-3xl border p-6 backdrop-blur-xl overflow-hidden",
        highlight
          ? isDark
            ? "border-white/15 bg-white/7 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_80px_rgba(0,0,0,0.40)]"
            : "border-black/15 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_30px_80px_rgba(0,0,0,0.10)]"
          : isDark
          ? "border-white/10 bg-white/5"
          : "border-black/10 bg-black/[0.02]"
      )}
    >
      <div
        className={cn(
          "absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl",
          highlight ? (isDark ? "bg-emerald-400/10" : "bg-emerald-500/10") : isDark ? "bg-white/8" : "bg-black/5"
        )}
      />

      {badge ? (
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px]",
            isDark ? "border-white/10 bg-white/5 text-white/70" : "border-black/10 bg-black/[0.03] text-black/70"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", isDark ? "bg-emerald-400/80" : "bg-emerald-600")} />
          {badge}
        </div>
      ) : null}

      <div className="mt-3">
        <div className={cn("text-lg font-semibold", isDark ? "text-white" : "text-black")}>{name}</div>
        <div className={cn("mt-1 text-sm", isDark ? "text-white/65" : "text-black/65")}>{subtitle}</div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <div className={cn("text-3xl font-semibold tracking-tight", isDark ? "text-white" : "text-black")}>
            {formatMoney(price, currency)}
          </div>
          <div className={cn("mt-1 text-[11px]", isDark ? "text-white/55" : "text-black/55")}>per month • auto region pricing</div>
        </div>

        <div
          className={cn(
            "rounded-2xl border px-3 py-2 text-[11px] text-right",
            isDark ? "border-white/10 bg-black/25 text-white/60" : "border-black/10 bg-white/70 text-black/60"
          )}
        >
          Includes AI + core systems
          <div className={cn("mt-0.5", isDark ? "text-white/45" : "text-black/45")}>No add-ons list</div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {bullets.map((b) => (
          <div
            key={b}
            className={cn(
              "rounded-2xl border px-3 py-2 text-sm",
              isDark ? "border-white/10 bg-black/25 text-white/75" : "border-black/10 bg-white/70 text-black/75"
            )}
          >
            {b}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <a
          href={ctaHref}
          className={cn(
            "block text-center rounded-xl px-5 py-3 text-sm font-semibold transition",
            highlight
              ? isDark
                ? "bg-white text-black hover:opacity-90"
                : "bg-black text-white hover:bg-black/90"
              : isDark
              ? "border border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
              : "border border-black/10 bg-black/[0.03] text-black/80 hover:bg-black/[0.06]"
          )}
        >
          {ctaText}
        </a>
      </div>

      <div className={cn("mt-3 text-[11px]", isDark ? "text-white/45" : "text-black/45")}>
        Billing starts after trial (Founders offer applies automatically).
      </div>
    </div>
  );
}

/** NEW: Systems visual card (uses /public/Energy-page.png) */
function SystemsVisual({ mode }: { mode: Mode }) {
  const isDark = mode === "dark";
  return (
    <div
      className={cn(
        "mt-6 rounded-3xl border p-3 md:p-4 backdrop-blur-xl overflow-hidden",
        isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.02]"
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-2xl border",
          isDark ? "border-white/10 bg-black/30" : "border-black/10 bg-white/60"
        )}
      >
        {/* Glow */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl",
            isDark ? "bg-emerald-400/10" : "bg-emerald-500/10"
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl",
            isDark ? "bg-blue-400/10" : "bg-blue-500/10"
          )}
        />

        {/* Image */}
        <div className="relative aspect-[16/10] w-full">
          <Image
            src="/Energy-page.png"
            alt="Oyi energy operations view"
            fill
            priority={false}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 520px"
          />
        </div>

        {/* Caption row */}
        <div
          className={cn(
            "relative flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t",
            isDark ? "border-white/10" : "border-black/10"
          )}
        >
          <div className={cn("text-sm font-semibold", isDark ? "text-white" : "text-black")}>Energy & Utilities View</div>
          <div className={cn("text-[11px]", isDark ? "text-white/60" : "text-black/55")}>
            Live signals • alerts • audit trails
          </div>
        </div>
      </div>

      {/* Micro badges */}
      <div className="mt-3 flex flex-wrap gap-2">
        {["Generator ops", "Diesel tracking", "Voltage signals", "Alert routing"].map((t) => (
          <Pill key={t} mode={mode}>
            {t}
          </Pill>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const [mode, setMode] = useState<Mode>("dark");
  const isDark = mode === "dark";

  useEffect(() => {
    const saved = (localStorage.getItem("oyi-mode") as Mode | null) ?? null;
    if (saved === "light" || saved === "dark") setMode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("oyi-mode", mode);
  }, [mode]);

  const stats = useMemo(
    () => [
      { k: "Facility Console", v: "Ops dashboards + roles" },
      { k: "Full Stack", v: "Security • Utilities • Access" },
      { k: "AI Built-in", v: "Commands • insights • routing" },
      { k: "Audit Logs", v: "Every action tracked" },
    ],
    []
  );

  const deployMailto =
    "mailto:contactochiga@gmail.com?subject=Oyi%20Deployment%20Request&body=Hi%20Oyi,%0A%0AI%20want%20to%20request%20a%20deployment.%0A%0AName:%0AEstate/Company:%0ALocation:%0APhone:%0AUnits%20(count):%0AScope%20(what%20to%20integrate):%0A%0AThanks";

  return (
    <div className={cn("min-h-screen flex flex-col overflow-x-hidden", isDark ? "bg-[#070A12] text-white" : "bg-[#F6F7FB] text-black")}>
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div
          className={cn(
            "absolute inset-0",
            isDark
              ? "bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.12),transparent_50%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.10),transparent_55%),radial-gradient(900px_circle_at_50%_90%,rgba(16,185,129,0.08),transparent_55%)]"
              : "bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.10),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.08),transparent_60%),radial-gradient(900px_circle_at_50%_90%,rgba(16,185,129,0.06),transparent_60%)]"
          )}
        />
        <div
          className={cn(
            "absolute inset-0 opacity-[0.20]",
            isDark
              ? "[background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]"
              : "[background-image:linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)]"
          )}
          style={{ backgroundSize: "64px 64px" }}
        />
        <div className={cn("absolute inset-0", isDark ? "bg-gradient-to-b from-black/30 via-transparent to-black/60" : "bg-gradient-to-b from-white/40 via-transparent to-white/70")} />
      </div>

      {/* Top nav */}
      <header className="relative z-10">
        <div className="mx-auto w-full max-w-6xl px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-xl overflow-hidden border", isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.03]")}>
                <Image src="/oyi-logo-transparent.png" alt="Oyi" width={64} height={64} className="h-full w-full object-cover" priority />
              </div>
              <div>
                <div className="text-sm font-semibold leading-4">Oyi</div>
                <div className={cn("text-xs", isDark ? "text-white/60" : "text-black/55")}>Estate Operations Console</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <a href="#platform" className={cn("px-3 py-2 text-sm", isDark ? "text-white/70 hover:text-white" : "text-black/70 hover:text-black")}>
                Platform
              </a>
              <a href="#stack" className={cn("px-3 py-2 text-sm", isDark ? "text-white/70 hover:text-white" : "text-black/70 hover:text-black")}>
                Stack
              </a>
              <a href="#systems" className={cn("px-3 py-2 text-sm", isDark ? "text-white/70 hover:text-white" : "text-black/70 hover:text-black")}>
                Systems
              </a>
              <a href="#pricing" className={cn("px-3 py-2 text-sm", isDark ? "text-white/70 hover:text-white" : "text-black/70 hover:text-black")}>
                Pricing
              </a>
              <a href="#deployments" className={cn("px-3 py-2 text-sm", isDark ? "text-white/70 hover:text-white" : "text-black/70 hover:text-black")}>
                Deployments
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <ThemeSwitch mode={mode} setMode={setMode} />
              <a
                href="#pricing"
                className={cn(
                  "rounded-xl border px-4 py-2 text-sm transition",
                  isDark ? "border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10" : "border-black/10 bg-black/[0.03] text-black/70 hover:bg-black/[0.06]"
                )}
              >
                View Pricing
              </a>
              <a href={deployMailto} className={cn("rounded-xl px-4 py-2 text-sm font-semibold transition", isDark ? "bg-white text-black hover:opacity-90" : "bg-black text-white hover:bg-black/90")}>
                Request Deployment
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
                <div className="flex flex-wrap items-center gap-2">
                  <Pill mode={mode}>Facility Ops</Pill>
                  <Pill mode={mode}>Home Control</Pill>
                  <Pill mode={mode}>AI Included</Pill>
                </div>

                <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05]">
                  Run your estate <br />
                  like infrastructure.
                </h1>

                <p className={cn("mt-5 leading-7", isDark ? "text-white/70" : "text-black/70")}>
                  Oyi is a control layer for estates — operators manage access, utilities, security, maintenance and reporting,
                  while residents control devices and requests. Everything is live, permissioned, and audited.
                </p>

                {/* Founders offer */}
                <div className={cn("mt-6 rounded-2xl border px-4 py-3", isDark ? "border-emerald-400/20 bg-emerald-400/10" : "border-emerald-700/15 bg-emerald-700/5")}>
                  <div className={cn("text-sm font-semibold", isDark ? "text-white" : "text-black")}>Founders Offer</div>
                  <div className={cn("mt-1 text-sm", isDark ? "text-white/70" : "text-black/70")}>
                    First <span className={cn("font-semibold", isDark ? "text-white" : "text-black")}>100 deployments</span> get{" "}
                    <span className={cn("font-semibold", isDark ? "text-white" : "text-black")}>1 month free</span>. Billing starts after trial.
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#pricing" className={cn("rounded-xl px-5 py-3 text-sm font-semibold transition", isDark ? "bg-white text-black hover:opacity-90" : "bg-black text-white hover:bg-black/90")}>
                    See Pricing
                  </a>
                  <a href={deployMailto} className={cn("rounded-xl border px-5 py-3 text-sm transition", isDark ? "border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10" : "border-black/10 bg-black/[0.03] text-black/70 hover:bg-black/[0.06]")}>
                    Request Deployment
                  </a>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {stats.map((s) => (
                    <div
                      key={s.k}
                      className={cn("rounded-2xl border p-4 backdrop-blur-xl", isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.02]")}
                    >
                      <div className={cn("text-xs", isDark ? "text-white/60" : "text-black/55")}>{s.k}</div>
                      <div className={cn("mt-1 text-sm", isDark ? "text-white/85" : "text-black/80")}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Hero visual */}
            <div className="md:col-span-6">
              <Reveal className="md:pl-6">
                <div className={cn("relative rounded-3xl border p-4 backdrop-blur-xl overflow-hidden", isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.02]")}>
                  <div className={cn("absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl", isDark ? "bg-white/10" : "bg-black/10")} />
                  <div className={cn("absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl", isDark ? "bg-white/10" : "bg-black/10")} />

                  <div
                    className={cn(
                      "rounded-2xl border p-6",
                      isDark
                        ? "border-white/10 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.22),transparent_45%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.18),transparent_45%),radial-gradient(900px_circle_at_40%_90%,rgba(16,185,129,0.14),transparent_45%)]"
                        : "border-black/10 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(59,130,246,0.14),transparent_45%),radial-gradient(900px_circle_at_80%_20%,rgba(168,85,247,0.12),transparent_45%),radial-gradient(900px_circle_at_40%_90%,rgba(16,185,129,0.10),transparent_45%)]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold">Command Center</div>
                      <div className={cn("text-xs", isDark ? "text-white/60" : "text-black/55")}>Live • Secure • Audited</div>
                    </div>

                    <div className="mt-5 grid grid-cols-12 gap-3">
                      <div className={cn("col-span-12 md:col-span-7 rounded-xl border p-4", isDark ? "border-white/10 bg-black/30" : "border-black/10 bg-white/60")}>
                        <div className="flex items-center justify-between">
                          <div className={cn("text-xs", isDark ? "text-white/60" : "text-black/55")}>Map / Site View</div>
                          <span className={cn("inline-flex items-center gap-2 text-[11px]", isDark ? "text-white/55" : "text-black/55")}>
                            <LiveDot mode={mode} />
                            Realtime
                          </span>
                        </div>
                        <div className={cn("mt-3 h-28 rounded-lg border", isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.03]")} />
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {["Assets: 124", "Alerts: 3", "Uptime: 99.9%"].map((t) => (
                            <span
                              key={t}
                              className={cn(
                                "text-[11px] border rounded-full px-2 py-1",
                                isDark ? "text-white/70 border-white/10 bg-white/5" : "text-black/70 border-black/10 bg-black/[0.03]"
                              )}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className={cn("col-span-12 md:col-span-5 rounded-xl border p-4", isDark ? "border-white/10 bg-black/30" : "border-black/10 bg-white/60")}>
                        <div className="flex items-center justify-between">
                          <div className={cn("text-xs", isDark ? "text-white/60" : "text-black/55")}>Systems</div>
                          <span className={cn("inline-flex items-center gap-2 text-[11px]", isDark ? "text-white/55" : "text-black/55")}>
                            <LiveDot mode={mode} />
                            Realtime
                          </span>
                        </div>
                        <div className="mt-3 space-y-2">
                          {[
                            ["Access", "Active"],
                            ["Power", "Stable"],
                            ["Water", "Normal"],
                            ["Security", "Armed"],
                          ].map(([a, b]) => (
                            <div key={a} className={cn("flex items-center justify-between rounded-lg border px-3 py-2", isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.03]")}>
                              <span className={cn("text-xs", isDark ? "text-white/80" : "text-black/80")}>{a}</span>
                              <span className={cn("text-[11px]", isDark ? "text-white/60" : "text-black/60")}>{b}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={cn("mt-4 rounded-xl border p-4", isDark ? "border-white/10 bg-black/30" : "border-black/10 bg-white/60")}>
                      <div className="flex items-center justify-between">
                        <div className={cn("text-xs", isDark ? "text-white/60" : "text-black/55")}>AI Actions</div>
                        <span className={cn("text-[11px]", isDark ? "text-white/60" : "text-black/60")}>Last 5 mins</span>
                      </div>
                      <div className="mt-3 grid md:grid-cols-3 gap-2">
                        {["Gate pass approved — Admin", "Generator auto-switch — Ops", "Leak alert routed — Facility"].map((t) => (
                          <div
                            key={t}
                            className={cn(
                              "rounded-lg border px-3 py-2 text-[11px]",
                              isDark ? "border-white/10 bg-white/5 text-white/70" : "border-black/10 bg-black/[0.03] text-black/70"
                            )}
                          >
                            {t}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Live Ops", "Access Control", "Utilities", "AI Routing", "Audit Logs"].map((t) => (
                      <Pill key={t} mode={mode}>
                        {t}
                      </Pill>
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
                <div className={cn("text-xs", isDark ? "text-white/60" : "text-black/55")}>Platform</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">One console for estate operations</h2>
                <p className={cn("mt-3 leading-7 max-w-2xl", isDark ? "text-white/70" : "text-black/70")}>
                  Built for operators: live dashboards, controlled actions, fast response, and everything recorded.
                </p>
              </div>
              <div className="flex gap-2">
                <Pill mode={mode}>Realtime</Pill>
                <Pill mode={mode}>Secure</Pill>
                <Pill mode={mode}>Audited</Pill>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Reveal>
              <GlowCard mode={mode} title="Operations UX" desc="Clear dashboards, alerts, actions, reporting — legible at a glance." icon={<IGear mode={mode} />} />
            </Reveal>
            <Reveal>
              <GlowCard mode={mode} title="Digital Twin Ready" desc="Map view now, 3D/4D later — built to expand." icon={<IFile mode={mode} />} />
            </Reveal>
            <Reveal>
              <GlowCard mode={mode} title="Controls + Audit" desc="Permissions, approvals, logs — accountability built-in." icon={<IShield mode={mode} />} />
            </Reveal>
          </div>
        </section>

        {/* STACK */}
        <section id="stack" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <Reveal>
            <div className={cn("text-xs", isDark ? "text-white/60" : "text-black/55")}>Stack</div>
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">What Oyi delivers</h2>
            <p className={cn("mt-3 leading-7 max-w-2xl", isDark ? "text-white/70" : "text-black/70")}>
              Clean modules — facility operations + resident experience — in one platform.
            </p>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal><FeatureTile mode={mode} title="Resident App" desc="Requests, passes, approvals." icon={<IHome mode={mode} />} /></Reveal>
            <Reveal><FeatureTile mode={mode} title="Device Control" desc="Lights, AC, TV, sockets." icon={<ISliders mode={mode} />} /></Reveal>
            <Reveal><FeatureTile mode={mode} title="Automations" desc="Scenes, schedules, rules." icon={<IBolt mode={mode} />} /></Reveal>
            <Reveal><FeatureTile mode={mode} title="Access Control" desc="QR/code entry + logs." icon={<IDoor mode={mode} />} /></Reveal>
            <Reveal><FeatureTile mode={mode} title="Security Ops" desc="Incidents + escalation." icon={<IShield mode={mode} />} /></Reveal>
            <Reveal><FeatureTile mode={mode} title="Utilities Ops" desc="Power + water monitoring." icon={<IPlug mode={mode} />} /></Reveal>
            <Reveal><FeatureTile mode={mode} title="Billing & Wallet" desc="Payments + receipts." icon={<ICredit mode={mode} />} /></Reveal>
            <Reveal><FeatureTile mode={mode} title="Reports & Audit" desc="Traceable operations." icon={<IFile mode={mode} />} /></Reveal>
            <Reveal><FeatureTile mode={mode} title="Control Plane" desc="Events + reliability layer." icon={<IGear mode={mode} />} /></Reveal>
          </div>
        </section>

        {/* SYSTEMS */}
        <section id="systems" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-12 items-start">
            <div className="md:col-span-5">
              <Reveal>
                <div className={cn("text-xs", isDark ? "text-white/60" : "text-black/55")}>Systems</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Core infrastructure systems</h2>
                <p className={cn("mt-3 leading-7", isDark ? "text-white/70" : "text-black/70")}>
                  Access, security, utilities, maintenance, reporting — with AI support for commands, insights, and routing.
                </p>

                {/* NEW IMAGE */}
                <SystemsVisual mode={mode} />
              </Reveal>
            </div>

            <div className="md:col-span-7">
              <div className="grid gap-4 md:grid-cols-2">
                <Reveal>
                  <SystemCard mode={mode} title="Power Operations" oneLine="Generator readiness, switching, diesel tracking and uptime." previewLabel="Last 60 minutes" kpi1="Voltage (V)" kpi2="Load (kW)" variant="power" />
                </Reveal>
                <Reveal>
                  <SystemCard mode={mode} title="Water Systems" oneLine="Tank levels, flow signals, and leak detection routing." previewLabel="Last 60 minutes" kpi1="Tank (%)" kpi2="Flow (L/min)" variant="water" />
                </Reveal>
                <Reveal>
                  <SystemCard mode={mode} title="Security" oneLine="CCTV integration, incident logging, escalation and status." previewLabel="Last 60 minutes" kpi1="Incidents" kpi2="Coverage" variant="security" />
                </Reveal>
                <Reveal>
                  <SystemCard mode={mode} title="Access Control" oneLine="Visitor passes, entries, denials and audit trails." previewLabel="Last 60 minutes" kpi1="Entries" kpi2="Denied" variant="access" />
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className={cn("text-xs", isDark ? "text-white/60" : "text-black/55")}>Pricing</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Tier model (AI included)</h2>
                <p className={cn("mt-3 leading-7 max-w-2xl", isDark ? "text-white/70" : "text-black/70")}>
                  One package per tier — includes AI + the full facility stack. Pricing auto-adjusts by region.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Pill mode={mode}>First 100 = 1 month free</Pill>
                <Pill mode={mode}>Monthly billing</Pill>
                <Pill mode={mode}>Deployment required</Pill>
              </div>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Reveal>
              <PriceCard
                mode={mode}
                name="Starter Estate"
                subtitle="For small estates going live fast"
                priceByCurrency={{ NGN: 499000, GBP: 349, USD: 399 }}
                bullets={[
                  "Up to 100 units (homes/users)",
                  "Access control + visitor passes + logs",
                  "Utilities monitoring (power + water) + alerts",
                  "Maintenance tickets + notifications",
                  "AI assistant (commands + routing)",
                  "Standard support (business hours)",
                ]}
                ctaText="Request Starter Deployment"
                ctaHref={deployMailto}
                badge="Recommended entry"
              />
            </Reveal>

            <Reveal>
              <PriceCard
                mode={mode}
                name="Growth Estate"
                subtitle="For fully operated estates with teams"
                priceByCurrency={{ NGN: 1250000, GBP: 850, USD: 950 }}
                highlight
                bullets={[
                  "Up to 300 units",
                  "Full access + security workflows (incidents + escalation)",
                  "Power ops (generator switching + diesel tracking signals)",
                  "Water + leak routing + structured alerts",
                  "AI assistant + analytics summaries",
                  "Priority support + faster response",
                ]}
                ctaText="Request Growth Deployment"
                ctaHref={deployMailto}
                badge="Most chosen"
              />
            </Reveal>

            <Reveal>
              <PriceCard
                mode={mode}
                name="Critical Infrastructure"
                subtitle="For large estates & infrastructure-grade operations"
                priceByCurrency={{ NGN: 2750000, GBP: 1950, USD: 2100 }}
                bullets={[
                  "Up to 1,000 units",
                  "Multi-operator workflows + governance",
                  "High-availability monitoring + reporting",
                  "Security ops: CCTV uptime + incident protocols",
                  "AI operations intelligence + audit readiness",
                  "Dedicated support channel + SLA",
                ]}
                ctaText="Request Critical Deployment"
                ctaHref={deployMailto}
                badge="Enterprise"
              />
            </Reveal>
          </div>

          <Reveal className="mt-6">
            <div className={cn("rounded-3xl border p-6 md:p-8 backdrop-blur-xl", isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.02]")}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className={cn("text-sm font-semibold", isDark ? "text-white" : "text-black")}>What’s included in every tier</div>
                  <div className={cn("mt-2 text-sm leading-7", isDark ? "text-white/70" : "text-black/70")}>
                    AI assistant • access control • visitor management • notifications • maintenance • utilities monitoring • roles & audit logs.
                    Deployment onboarding maps your estate and connects your existing infrastructure.
                  </div>
                </div>

                <a
                  href={deployMailto}
                  className={cn(
                    "shrink-0 rounded-xl px-5 py-3 text-sm font-semibold transition text-center",
                    isDark ? "bg-white text-black hover:opacity-90" : "bg-black text-white hover:bg-black/90"
                  )}
                >
                  Request Deployment
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* DEPLOYMENTS */}
        <section id="deployments" className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
          <Reveal>
            <div className={cn("rounded-3xl border p-6 md:p-10 backdrop-blur-xl", isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.02]")}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <div className={cn("text-xs", isDark ? "text-white/60" : "text-black/55")}>Deployments</div>
                  <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">Request deployment</h2>
                  <p className={cn("mt-3 leading-7 max-w-2xl", isDark ? "text-white/70" : "text-black/70")}>
                    We deploy in phases: map the estate, connect systems, go live with core workflows, then expand with automations,
                    reporting, and digital twin views.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a href={deployMailto} className={cn("rounded-xl px-5 py-3 text-sm font-semibold transition text-center", isDark ? "bg-white text-black hover:opacity-90" : "bg-black text-white hover:bg-black/90")}>
                    Request Deployment
                  </a>
                  <a
                    href="#pricing"
                    className={cn(
                      "rounded-xl border px-5 py-3 text-sm transition text-center",
                      isDark ? "border-white/10 bg-white/5 text-white/85 hover:text-white hover:bg-white/10" : "border-black/10 bg-black/[0.03] text-black/75 hover:bg-black/[0.06]"
                    )}
                  >
                    View Pricing
                  </a>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {[
                  ["Estate-ready", "Facilities, access, utilities, security."],
                  ["Home-ready", "Resident device control + automations."],
                  ["Operations-grade", "Roles, logs, routing, reporting."],
                ].map(([a, b]) => (
                  <div key={a} className={cn("rounded-2xl border p-5", isDark ? "border-white/10 bg-black/30" : "border-black/10 bg-white/60")}>
                    <div className="text-sm font-semibold">{a}</div>
                    <div className={cn("mt-2 text-sm", isDark ? "text-white/70" : "text-black/70")}>{b}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="relative z-10 mt-auto">
        <div className="mx-auto w-full max-w-6xl px-5 py-10">
          <div className={cn("flex flex-col gap-6 border-t pt-6", isDark ? "border-white/10" : "border-black/10")}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className={cn("text-sm", isDark ? "text-white/70" : "text-black/70")}>© {new Date().getFullYear()} Oyi</div>

              <div className="flex flex-wrap items-center gap-3">
                <a href="/privacy" className={cn("text-sm underline-offset-4 hover:underline transition", isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black")}>
                  Privacy Policy
                </a>
                <span className={cn("text-sm", isDark ? "text-white/30" : "text-black/30")}>•</span>
                <a href="/terms" className={cn("text-sm underline-offset-4 hover:underline transition", isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black")}>
                  Terms
                </a>
                <span className={cn("text-sm", isDark ? "text-white/30" : "text-black/30")}>•</span>
                <a href="/support" className={cn("text-sm underline-offset-4 hover:underline transition", isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black")}>
                  Support
                </a>
              </div>
            </div>

            <div className={cn("text-xs", isDark ? "text-white/50" : "text-black/50")}>
              Estate Operations Console • Facility ops + resident experience • Secure, audited operations
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
