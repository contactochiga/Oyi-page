import type { Metadata } from "next";
import { CapabilityVisual, ProductPage, SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "Oyi Watch",
  description: "Quick residential awareness and notifications from the wrist.",
  alternates: { canonical: "/watch" },
};

export default function WatchPage() {
  const points = ["Visitor and security alert categories", "Sync lifecycle and diagnostics", "No token or secret display"];
  return <><SiteHeader /><ProductPage eyebrow="Oyi Watch" title="Quick residential awareness from the wrist." body="The Watch companion supports durable phone-to-watch sync, calm notification states, diagnostics, quick awareness, and safe offline language when the watch sleeps or reconnects." points={points} visual={<CapabilityVisual eyebrow="Oyi Watch" points={points} />} /><SiteFooter /></>;
}
