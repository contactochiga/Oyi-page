import type { Metadata } from "next";
import { HubPage, SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "Technology",
  description: "Facility, Experience, and Core are the operating system. Digital Twin, Edge, and Watch carry it into the building and onto the wrist.",
  alternates: { canonical: "/technology" },
};

const items = [
  { label: "Facility", description: "Infrastructure, security, maintenance, and operations for the people who run the building.", href: "/facility" },
  { label: "Experience", description: "Rooms, devices, visitors, requests, and services for the people who live and work in the building.", href: "/experience" },
  { label: "Core", description: "The contextual awareness and reasoning layer running through Facility and Experience.", href: "/core" },
  { label: "Digital Twin", description: "A living representation of the building — model, placement, devices, cameras, and utility layers.", href: "/twin" },
  { label: "Edge", description: "A local infrastructure bridge for discovery, device readiness, and offline-aware operation.", href: "/edge" },
  { label: "Watch", description: "Quick residential awareness and notifications from the wrist.", href: "/watch" },
];

export default function TechnologyPage() {
  return (
    <>
      <SiteHeader />
      <HubPage
        eyebrow="Technology"
        title="One system. Several capabilities."
        body="Facility, Experience, and Core are the operating system. Digital Twin, Edge, and Watch are the technology that carries it into the building and onto the wrist."
        items={items}
      />
      <SiteFooter />
    </>
  );
}
