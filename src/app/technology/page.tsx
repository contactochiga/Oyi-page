import type { Metadata } from "next";
import { HubPage, SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "Technology",
  description: "The technology behind Oyi: Oyi Core intelligence, Digital Twin, Edge, Automation and Watch.",
  alternates: { canonical: "/technology" },
};

const items = [
  { label: "Oyi Core", description: "The contextual awareness and reasoning layer running through the Facility and Resident experiences.", href: "/core" },
  { label: "Digital Twin", description: "A living representation of the building — model, placement, devices, cameras, and utility layers.", href: "/twin" },
  { label: "Edge", description: "A local infrastructure bridge for discovery, device readiness, and offline-aware operation.", href: "/edge" },
  { label: "Watch", description: "Quick residential awareness and notifications from the wrist.", href: "/watch" },
  { label: "Developers", description: "APIs, webhooks and integration tools, published as each surface is ready.", href: "/developers" },
];

export default function TechnologyPage() {
  return (
    <>
      <SiteHeader />
      <HubPage
        eyebrow="Technology"
        title="The technology behind Oyi."
        body="Oyi is one operating system. These are the capabilities that give it intelligence, a model of the building, a local presence on site and a place on the wrist."
        items={items}
      />
      <SiteFooter />
    </>
  );
}
