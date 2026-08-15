import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#050b14] px-5 py-16 text-white">
        <article className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Privacy</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Privacy Policy</h1>
          <p className="mt-4 text-sm text-slate-400">Last updated: June 4, 2026</p>
          <p className="mt-8 leading-7 text-slate-300">Oyi is the operating system for buildings. Occupants and facility operators use Oyi for invite-based access, space context, requests, visitors, devices, community notices, services, and operational workflows.</p>
          <h2 className="mt-8 text-xl font-semibold">Information we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-slate-300">
            <li>Account and role information needed to connect an occupant or operator to a building.</li>
            <li>Operational records such as requests, visitor activity, device assignments, service events, and audit logs.</li>
            <li>Device and app diagnostics needed for reliability, security, and support.</li>
          </ul>
          <h2 className="mt-8 text-xl font-semibold">How information is used</h2>
          <p className="mt-3 leading-7 text-slate-300">Information is used to provide facility operations, protect access, support occupant services, troubleshoot issues, and maintain auditability. Oyi does not sell personal data.</p>
          <h2 className="mt-8 text-xl font-semibold">Contact</h2>
          <p className="mt-3 leading-7 text-slate-300">For privacy or support requests, use the contact page so the request can be routed without exposing private information in a public page.</p>
          <Link href="/contact" className="mt-5 inline-flex rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950">Contact Oyi</Link>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
