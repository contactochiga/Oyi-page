import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/OyiSite";

export default function ContactPage() {
  return <><SiteHeader /><main className="min-h-screen bg-[#050b14] px-5 py-20 text-white"><section className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 md:p-12"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Contact</p><h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Talk to the Oyi team.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">For deployment interest, use the deployment request form so the team receives the estate context needed for review.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/deployments" className="rounded-full bg-sky-400 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-sky-300">Request deployment</Link><Link href="/support" className="rounded-full border border-white/15 px-6 py-3 text-center font-semibold text-white transition hover:bg-white/10">Support</Link></div></section></main><SiteFooter /></>;
}
