import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { siteConfig } from "@/lib/site";

const widgetUrl = process.env.NEXT_PUBLIC_OYI_WIDGET_URL || (process.env.NODE_ENV === "development" ? "https://ochiga-lead-agents.onrender.com/widget.js" : "");
const widgetApiBase = process.env.NEXT_PUBLIC_OYI_WIDGET_API_BASE || (process.env.NODE_ENV === "development" ? "https://ochiga-lead-agents.onrender.com" : "");

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
        <Script id="oyi-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        {widgetUrl ? <Script id="oma-widget" src={widgetUrl} data-oma-widget="true" data-api-base={widgetApiBase || undefined} data-title="Chat with Oma" data-subtitle="Learn how Oyi fits your property or operations workflow" data-greeting="Hi, I'm Oma. Tell me what kind of property or operation you manage, and I'll help you find the right next step." strategy="afterInteractive" /> : null}
      </body>
    </html>
  );
}
