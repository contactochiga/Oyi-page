import { ProductPage, SiteFooter, SiteHeader } from "@/components/OyiSite";

export default function OyiHomePage() {
  return <><SiteHeader /><ProductPage eyebrow="Oyi Home" title="A calm resident app for connected living." body="Oyi Home gives residents invite-first activation, home context, spaces, devices, visitors, maintenance, community updates, services, profile verification, and Watch companion support." points={["Invite-first activation", "Rooms and assigned device control", "Visitors, maintenance, community, and services"]} /><SiteFooter /></>;
}
