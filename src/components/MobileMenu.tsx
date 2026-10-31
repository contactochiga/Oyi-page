"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { NavItem } from "@/lib/site";

// Small-screen navigation. A native <details> disclosure (works before hydration and without JavaScript); the effect only closes it
// after a client-side navigation, because the header persists across pages.
export function MobileMenu({ items, cta }: { items: NavItem[]; cta: { label: string; href: string } }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);
  return (
    <details ref={ref} className="group lg:hidden">
      <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white transition hover:border-sky-300/60 [&::-webkit-details-marker]:hidden">
        <span className="group-open:hidden">Menu</span>
        <span className="hidden group-open:inline">Close</span>
      </summary>
      <div className="absolute inset-x-0 top-full max-h-[calc(100svh-4.5rem)] overflow-y-auto border-b border-white/10 bg-[#06101d]/98 px-5 pb-8 pt-2 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <nav aria-label="Mobile navigation" className="mx-auto grid max-w-7xl gap-1">
          {items.map((item) => (
            <div key={item.href} className="border-b border-white/5 py-2 last:border-b-0">
              <Link href={item.href} className="block py-2 text-lg font-semibold text-white">
                {item.label}
              </Link>
              {item.children && (
                <div className="grid gap-1 pb-1 pl-3">
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href} className="py-1.5 text-sm text-slate-300 hover:text-white">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <Link href={cta.href} className="mx-auto mt-5 block max-w-7xl rounded-full bg-sky-400 px-6 py-3 text-center font-semibold text-slate-950">
          {cta.label}
        </Link>
      </div>
    </details>
  );
}
