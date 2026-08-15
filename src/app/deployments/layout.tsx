import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deploy Oyi",
  description: "Bring Oyi to your building. Tell us about your property or operations environment — deployments are reviewed for fit before setup begins.",
  alternates: { canonical: "/deployments" },
};

export default function DeploymentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
