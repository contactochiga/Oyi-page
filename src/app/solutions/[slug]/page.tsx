import { PackageCollection } from "@/components/packages/PackageCollection";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage, SiteFooter, SiteHeader } from "@/components/OyiSite";
import { solutionContent } from "../content";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return solutionContent.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const solution = solutionContent.find((item) => item.slug === slug);
  if (!solution) return {};
  return { title: `${solution.label} Solutions`, description: solution.summary, alternates: { canonical: `/solutions/${solution.slug}` } };
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = solutionContent.find((item) => item.slug === slug);
  if (!solution) notFound();

  return (
    <>
      <SiteHeader />
      <ProductPage eyebrow={`Solutions · ${solution.label}`} title={solution.title} body={solution.body} points={solution.points} />
      <PackageCollection solution={slug} />
      <SiteFooter />
    </>
  );
}
