import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { OyiAssistant } from "@/components/oyi-widget/OyiAssistant";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: "%s | Oyi" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Oyi" }],
  },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description, images: [siteConfig.ogImage] },
  icons: { icon: [{ url: "/oyi-logo-transparent.png" }], apple: [{ url: "/oyi-logo-transparent.png" }] },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Oyi",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "iOS, Android, Web, watchOS",
  url: siteConfig.url,
  description: siteConfig.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <OyiAssistant />
        <Script id="oyi-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
