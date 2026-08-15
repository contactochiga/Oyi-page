import type { Metadata } from "next";
import { ProductPage, SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "Hardware",
  description: "Purpose-built hardware for buildings running Oyi — a compute unit and an in-space display, in development.",
};

export default function HardwarePage() {
  return (
    <>
      <SiteHeader />
      <ProductPage
        eyebrow="Oyi Hardware"
        title="Purpose-built hardware for buildings running Oyi."
        body="Oyi is designed to work with the infrastructure a building already has. A small hardware family — a compute unit and an in-space display — is in development to give Oyi a physical presence where it's needed. Specifications and availability will be shared as they're finalised."
        points={["Compute unit for local bridging and edge readiness", "In-space display for Experience and status", "Designed around existing infrastructure, not a replacement for it"]}
        cta={{ label: "Talk to Oyi about hardware", href: "/contact?type=tech_oem" }}
      />
      <SiteFooter />
    </>
  );
}
