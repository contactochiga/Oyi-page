import { ProductPage, SiteFooter, SiteHeader } from "@/components/OyiSite";

export default function EdgePage() {
  return <><SiteHeader /><ProductPage eyebrow="Oyi Edge" title="A local infrastructure bridge for deeper estate operations." body="Oyi Edge is the foundation for local discovery, heartbeats, device readiness, and future offline-aware execution. Capabilities depend on deployed edge nodes and supported providers." points={["Local discovery readiness", "Heartbeat and health foundation", "Provider and device registry bridge"]} /><SiteFooter /></>;
}
