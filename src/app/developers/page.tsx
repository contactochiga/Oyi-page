import type { Metadata } from "next";
import { ProductPage, SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "Developers",
  description: "Documentation, APIs, and integration tools for building with Oyi.",
  alternates: { canonical: "/developers" },
};

export default function DevelopersPage() {
  return (
    <>
      <SiteHeader />
      <ProductPage
        eyebrow="Oyi Developers"
        title="Documentation, APIs, and integration tools — in progress."
        body="Oyi's developer surface — APIs, SDKs, webhooks, protocols, and schemas — is being built out alongside the platform. Documentation will be published as each surface is ready, rather than described ahead of time."
        points={["APIs and authentication (coming soon)", "Webhooks and protocols (coming soon)", "Sandbox environment (coming soon)"]}
        cta={{ label: "Build with Oyi", href: "/contact?type=developer" }}
      />
      <SiteFooter />
    </>
  );
}
