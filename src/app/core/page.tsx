import type { Metadata } from "next";
import { ProductPage, ProductVisual, SiteFooter, SiteHeader } from "@/components/OyiSite";

export const metadata: Metadata = {
  title: "Oyi Core",
  description: "The awareness, context, and reasoning layer running through Facility and Experience — contextual guidance and operator insight, not unsupported autonomy.",
  alternates: { canonical: "/core" },
};

export default function CorePage() {
  return (
    <>
      <SiteHeader />
      <ProductPage
        eyebrow="Oyi Core"
        title="The intelligence running through Oyi."
        body="Oyi Core is the awareness, context, and reasoning layer connecting Facility and Experience. It supports contextual guidance, operator insight, safe commands, and automation reasoning — positioned as assistance and context, not unsupported autonomous control. Core capability grows by version."
        points={["Contextual guidance and operator insight", "Safe commands and automation reasoning", "Versioned capability, not overclaimed autonomy"]}
        visual={<ProductVisual compact />}
      />
      <SiteFooter />
    </>
  );
}
