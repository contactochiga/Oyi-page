import type { Metadata } from "next";
import { ProductPage, SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "Partners",
  description: "Build, deploy, integrate, or become an Oyi Partner — for developers, integrators, contractors, and service companies.",
  alternates: { canonical: "/partners" },
};

export default function PartnersPage() {
  return (
    <>
      <SiteHeader />
      <ProductPage
        eyebrow="Oyi Partners"
        title="Built for the people who deploy and integrate buildings."
        body="Oyi Partners works with developers, facility-management companies, system integrators, electrical and MEP contractors, security and CCTV integrators, automation installers, IoT integrators, and technology companies. A structured certification programme is planned; today, partnership starts with a conversation."
        points={["Build with Oyi — developers and OEMs", "Deploy or integrate Oyi — installers and integrators", "Become an Oyi Partner — facility and service companies"]}
        cta={{ label: "Become an Oyi Partner", href: "/contact?type=partner" }}
      />
      <SiteFooter />
    </>
  );
}
