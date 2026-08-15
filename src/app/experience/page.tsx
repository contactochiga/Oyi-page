import type { Metadata } from "next";
import { ProductPage, ProductVisual, SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "Oyi Experience",
  description: "How people interact with the building: rooms, assigned devices, visitors, maintenance requests, and services in one calm interface.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <>
      <SiteHeader />
      <ProductPage
        eyebrow="Oyi Experience"
        title="How people interact with the environment."
        body="Oyi Experience connects the person to the building. For a residence, it becomes the home experience. For an office, the workspace experience. For a hotel, the guest experience. Invite-first activation, spaces, assigned devices, visitors, maintenance requests, community updates, and services in one calm interface."
        points={["Invite-first activation", "Rooms and assigned device control", "Visitors, maintenance, community, and services"]}
        visual={<ProductVisual compact />}
      />
      <SiteFooter />
    </>
  );
}
