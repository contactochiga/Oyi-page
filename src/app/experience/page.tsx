import type { Metadata } from "next";
import { ProductPage, ProductVisual, SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "Resident Experience",
  description: "How people interact with the building: rooms, assigned devices, visitors, maintenance requests, and services in one calm interface.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <>
      <SiteHeader />
      <ProductPage
        eyebrow="Resident Experience"
        title="A calm way to live and work in the building."
        body="The Resident Experience connects people to the building they live, stay or work in. For a residence, it is the home experience. For an office, the workspace experience. For a hotel, the guest experience. Invite-first activation, spaces, assigned devices, visitors, maintenance requests, community updates, and services in one calm interface."
        points={["Invite-first activation", "Rooms and assigned device control", "Visitors, maintenance, community, and services"]}
        visual={<ProductVisual compact />}
        cta={{ label: "Book a consultation", href: "/deployments" }}
        secondaryCta={{ label: "Facility Experience", href: "/facility" }}
      />
      <SiteFooter />
    </>
  );
}
