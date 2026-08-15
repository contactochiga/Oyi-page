import type { Metadata } from "next";
import { HubPage, SiteFooter, SiteHeader } from "@/components/OyiSite";
import { solutionContent } from "./content";

export const metadata: Metadata = {
  title: "Solutions",
  description: "One operating system, adapted for residential, hospitality, commercial, mixed-use, and healthcare buildings.",
};

const items = solutionContent.map((solution) => ({
  label: solution.label,
  description: solution.summary,
  href: `/solutions/${solution.slug}`,
}));

export default function SolutionsPage() {
  return (
    <>
      <SiteHeader />
      <HubPage
        eyebrow="Solutions"
        title="One operating system, adapted to how a building is used."
        body="Facility, Experience, and Core stay the same. What changes is how they're configured for the kind of building they run."
        items={items}
      />
      <SiteFooter />
    </>
  );
}
