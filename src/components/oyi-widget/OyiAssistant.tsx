"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

type QuickLink = { label: string; href: string; description: string };

const quickLinks: QuickLink[] = [
  { label: "Oyi Facility", href: "/facility", description: "Operating the physical building" },
  { label: "Oyi Experience", href: "/experience", description: "How people interact with it" },
  { label: "Oyi Core", href: "/core", description: "The intelligence layer" },
  { label: "Solutions", href: "/solutions", description: "Residential, hospitality, commercial…" },
  { label: "Integrations", href: "/technology", description: "What Oyi works with" },
  { label: "Deploy Oyi", href: "/deployments", description: "Start a deployment request" },
  { label: "Partners", href: "/partners", description: "Build, deploy, or integrate with Oyi" },
  { label: "Support", href: "/support", description: "Get help" },
];

export function OyiAssistant() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="oyi-assistant-panel"
        aria-label={open ? "Close Oyi assistant" : "Open Oyi assistant"}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full border border-sky-300/30 bg-[#06101d] text-white shadow-[0_10px_40px_rgba(56,189,248,0.35)] transition hover:border-sky-300/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      >
        <span className="text-lg font-semibold">{open ? "×" : siteConfig.name}</span>
      </button>

      {open && (
        <div
          id="oyi-assistant-panel"
          role="dialog"
          aria-label="Oyi assistant"
          className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-[2rem] border border-white/10 border-b-0 bg-[#06101d] p-5 text-white shadow-[0_-20px_80px_rgba(0,0,0,0.5)] sm:bottom-24 sm:right-5 sm:left-auto sm:w-96 sm:rounded-[1.75rem] sm:border-b"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">Oyi Assistant</p>
              <h2 className="mt-1 text-lg font-semibold">Where do you want to start?</h2>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white">
              ×
            </button>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">Explore what Oyi does, find the right solution for your building, or reach the team directly.</p>
          <div className="mt-4 grid gap-2">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 transition hover:border-sky-300/40 hover:bg-white/[0.08]">
                <span>
                  <span className="block text-sm font-semibold text-white">{link.label}</span>
                  <span className="block text-xs text-slate-400">{link.description}</span>
                </span>
                <span className="text-sky-300 transition group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
          <Link href="/contact" onClick={() => setOpen(false)} className="mt-4 block rounded-full bg-sky-400 px-4 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-sky-300">
            Talk to the Oyi team
          </Link>
        </div>
      )}
    </>
  );
}
