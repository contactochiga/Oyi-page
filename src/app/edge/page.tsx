import type { Metadata } from "next";
import { ProductPage, SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "Oyi Edge",
  description: "A local infrastructure bridge for discovery, device readiness, and offline-aware operation.",
};

export default function EdgePage() {
  return <><SiteHeader /><ProductPage eyebrow="Oyi Edge" title="A local infrastructure bridge for deeper estate operations." body="Oyi Edge is the foundation for local discovery, heartbeats, device readiness, and future offline-aware execution. Capabilities depend on deployed edge nodes and supported providers." points={["Local discovery readiness", "Heartbeat and health foundation", "Provider and device registry bridge"]} /><SiteFooter /></>;
}
