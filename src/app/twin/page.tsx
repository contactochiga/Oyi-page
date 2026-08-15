import type { Metadata } from "next";
import { ProductPage, SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "Digital Twin",
  description: "A living representation of the building — model, placement, devices, cameras, and utility layers.",
};

export default function TwinPage() {
  return <><SiteHeader /><ProductPage eyebrow="Oyi Twin" title="Digital infrastructure mapping for estates." body="Oyi Twin is the foundation for model registration, spatial placement, device and camera location, utility layers, incidents, and operational context. Live results depend on configured estate data sources." points={["Model and placement foundation", "Device, camera, and incident layers", "Honest states when no source is configured"]} /><SiteFooter /></>;
}
