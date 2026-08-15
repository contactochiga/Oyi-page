import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/OyiSite";

export default function SupportPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#050b14] px-5 py-16 text-white">
        <section className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Support</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em]">Get help with Oyi.</h1>
          <p className="mt-5 max-w-2xl leading-7 text-slate-300">For deployment support, include the building name, role, device, app surface, and what you were trying to do. Do not send passwords, access codes, QR tokens, or private occupant information.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              ["Deployment help", "Use the deployment form for new building rollouts."],
              ["Occupant issues", "Contact your facility operator first for access and space assignment issues."],
              ["Technical support", "Share sanitized context and request a support review."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/deployments" className="rounded-full bg-sky-400 px-5 py-3 text-center font-semibold text-slate-950">Request deployment</Link>
            <Link href="/contact" className="rounded-full border border-white/15 px-5 py-3 text-center font-semibold text-white">Contact</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
