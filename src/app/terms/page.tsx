import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#050b14] px-5 py-16 text-white">
        <article className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Terms</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Terms of Service</h1>
          <p className="mt-4 text-sm text-slate-400">Last updated: June 4, 2026</p>
          <p className="mt-8 leading-7 text-slate-300">These terms govern use of Oyi. Features may vary by building deployment, permissions, configured services, connected systems, and supported devices.</p>
          <h2 className="mt-8 text-xl font-semibold">Access and accounts</h2>
          <p className="mt-3 leading-7 text-slate-300">Occupants and operators are responsible for using their accounts securely. Facility administrators may manage roles, permissions, occupant access, invitations, and space assignments.</p>
          <h2 className="mt-8 text-xl font-semibold">Integrations</h2>
          <p className="mt-3 leading-7 text-slate-300">Device, camera, visitor, utility, and service integrations depend on each deployment. Oyi does not guarantee availability of third-party systems.</p>
          <h2 className="mt-8 text-xl font-semibold">Support</h2>
          <p className="mt-3 leading-7 text-slate-300">For deployment or support questions, use the contact and support pages.</p>
          <div className="mt-5 flex gap-3">
            <Link href="/contact" className="rounded-full bg-sky-400 px-5 py-3 font-semibold text-slate-950">Contact</Link>
            <Link href="/support" className="rounded-full border border-white/15 px-5 py-3 font-semibold text-white">Support</Link>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
