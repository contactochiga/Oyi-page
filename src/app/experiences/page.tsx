import type { Metadata } from "next";
import Link from "next/link";
import { ConsultationSteps, SiteFooter, SiteHeader } from "@/components/OyiSite";
import { solutionTypes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Experiences",
  description: "Oyi has two experiences on one system: the Facility Experience for the teams who run a building and the Resident Experience for the people who live and work in it.",
  alternates: { canonical: "/experiences" },
};

const experienceDetails = [
  {
    eyebrow: "Facility Experience",
    title: "Run the building from one operational view.",
    body: "For facility managers, operations, security and maintenance teams. Infrastructure, access, visitors, maintenance, community and administration in one place, with Oyi Core surfacing what needs attention.",
    points: ["Infrastructure and MEP operations", "Security, access, visitors and incidents", "Maintenance, community and administration"],
    href: "/facility",
  },
  {
    eyebrow: "Resident Experience",
    title: "A calm way to live and work in the building.",
    body: "For residents, and equally for hotel guests and office occupants. Invite-first activation, rooms and assigned devices, visitors, maintenance requests, community updates and services.",
    points: ["Invite-first activation", "Rooms and assigned device control", "Visitors, requests, community and services"],
    href: "/experience",
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#050b14] text-white">
        <section className="px-5 py-20 md:py-28">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Experiences</p>
            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">Two experiences. One system underneath.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">The people who run a building and the people who use it see different things, but they work on the same spaces, devices and records. When a resident books a visitor, the gate team sees it. When maintenance closes a request, the resident knows.</p>
          </div>
        </section>
        <section className="px-5">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
            {experienceDetails.map((item) => (
              <Link key={item.href} href={item.href} className="group rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-1 hover:border-sky-300/40 hover:bg-white/[0.09] md:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-200">{item.eyebrow}</p>
                <h2 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-white">{item.title}</h2>
                <p className="mt-4 text-slate-300">{item.body}</p>
                <div className="mt-6 grid gap-2 text-sm text-slate-300">
                  {item.points.map((point) => (
                    <span key={point} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-sky-300" />{point}</span>
                  ))}
                </div>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-300">Explore {item.eyebrow} <span className="transition group-hover:translate-x-1">→</span></span>
              </Link>
            ))}
          </div>
        </section>
        <section className="px-5 pt-16">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-slate-950/60 p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">Configured per building</p>
            <p className="mt-3 max-w-2xl text-slate-300">The same two experiences are configured for how each kind of building is used.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {solutionTypes.map((solution) => (
                <Link key={solution.slug} href={`/solutions/${solution.slug}`} className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-sky-300/60 hover:bg-white/10">{solution.label}</Link>
              ))}
            </div>
          </div>
        </section>
        <ConsultationSteps />
      </main>
      <SiteFooter />
    </>
  );
}
