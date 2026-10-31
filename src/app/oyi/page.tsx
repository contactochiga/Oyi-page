import type { Metadata } from "next";
import Link from "next/link";
import { ConsultationSteps, SiteFooter, SiteHeader, SystemDiagram } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "What is Oyi",
  description: "Oyi is one intelligent operating system for buildings, with a Facility experience for operators and a Resident experience for the people who live and work there.",
  alternates: { canonical: "/oyi" },
};

const principles = [
  ["One system, not a bundle", "Facility and Resident experiences share the same buildings, spaces, people and devices, so nothing has to be reconciled between separate products."],
  ["Works with what is there", "Oyi connects to the infrastructure a building already has. New hardware is added only where it is needed, from the approved Store."],
  ["Intelligence you can supervise", "Oyi Core gives context, guidance and supervised automation. It assists operators; it does not take unsupervised control."],
];

export default function OyiPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#050b14] text-white">
        <section className="px-5 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">What is Oyi</p>
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">One intelligent operating system for buildings.</h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">Oyi brings a building&apos;s infrastructure, operations and people onto one system. Operators run it through the Facility Experience. Residents, guests and occupants use it through the Resident Experience. Oyi Core is the intelligence connecting both.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/experiences" className="inline-flex justify-center rounded-full bg-sky-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-sky-300">Explore the experiences</Link>
                <Link href="/deployments" className="inline-flex justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-white transition hover:border-sky-300/60 hover:bg-white/10">Book a consultation</Link>
              </div>
            </div>
            <SystemDiagram />
          </div>
        </section>
        <section className="px-5 pb-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {principles.map(([title, body]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </section>
        <ConsultationSteps heading="Bring Oyi to your building." />
      </main>
      <SiteFooter />
    </>
  );
}
