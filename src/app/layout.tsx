import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oyi — Infrastructure Operations",
  description:
    "Infrastructure-grade software for estates and facilities: consumer access, facility operations, and a control plane for reliability.",
  icons: [{ rel: "icon", url: "/oyi-logo-transparent.png" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
