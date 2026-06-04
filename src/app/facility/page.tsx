import { ProductPage, SiteFooter, SiteHeader } from "@/components/OyiSite";

export default function FacilityPage() {
  return <><SiteHeader /><ProductPage eyebrow="Oyi Facility" title="The operational console for residential estates." body="Facility teams use Oyi to manage homes, residents, invitations, hardware registry, visitors, cameras, maintenance, community, messages, administration, and digital infrastructure readiness." points={["Resident and invitation lifecycle", "Security, visitors, cameras, and incidents", "Devices, maintenance, services, and administration"]} /><SiteFooter /></>;
}
