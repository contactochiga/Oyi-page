import type { Metadata } from "next";
import { CapabilityVisual, ProductPage, SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "Oyi Edge",
  description: "A local infrastructure bridge for discovery, device readiness, and offline-aware operation.",
  alternates: { canonical: "/edge" },
};

export default function EdgePage() {
  const points = ["Local discovery readiness", "Heartbeat and health foundation", "Provider and device registry bridge"];
  return <><SiteHeader /><ProductPage eyebrow="Oyi Edge" title="A local infrastructure bridge for deeper building operations." body="Oyi Edge is the foundation for local discovery, heartbeats, device readiness, and future offline-aware execution. Capabilities depend on deployed edge nodes and supported providers." points={points} visual={<CapabilityVisual eyebrow="Oyi Edge" points={points} />} /><SiteFooter /></>;
}
