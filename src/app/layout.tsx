import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Oyi — Infrastructure Operations",
  description:
    "Infrastructure-grade software for estates and facilities: consumer access, facility operations, and a control plane for reliability.",
  icons: [{ rel: "icon", url: "/oyi-logo-transparent.png" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Script
          id="oma-widget"
          src="https://ochiga-lead-agents.onrender.com/widget.js"
          data-oma-widget="true"
          data-api-base="https://ochiga-lead-agents.onrender.com"
          data-title="Chat with Oma"
          data-subtitle="Learn how Oyi fits your property or operations workflow"
          data-greeting="Hi, I'm Oma. Tell me what kind of property or operation you manage, and I'll help you find the right next step."
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
