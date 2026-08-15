import type { Metadata } from "next";
import { ProductPage, ProductVisual, SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "Oyi Facility",
  description: "Facility operates the shared physical environment of a building — power, security, maintenance, and administration — from one operational control surface.",
  alternates: { canonical: "/facility" },
};

export default function FacilityPage() {
  return (
    <>
      <SiteHeader />
      <ProductPage
        eyebrow="Oyi Facility"
        title="Operate the shared physical environment."
        body="Facility teams use Oyi to manage infrastructure, security, visitors, maintenance, community, messages, administration, and operational intelligence — across residential estates, hotels, offices, mixed-use developments, and healthcare facilities."
        points={["Infrastructure and MEP operations", "Security, visitors, cameras, and incidents", "Maintenance, community, and administration"]}
        visual={<ProductVisual compact />}
      />
      <SiteFooter />
    </>
  );
}
