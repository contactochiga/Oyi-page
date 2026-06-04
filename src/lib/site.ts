export const siteConfig = {
  name: "Oyi",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://getoyi.com",
  title: "Oyi — Connected Residential Living",
  description:
    "Oyi is the operating platform for modern residential communities, connecting residents, homes, visitors, devices, maintenance, community services, and estate operations in one intelligent experience.",
  logo: "/oyi-logo-transparent.png",
  ogImage: "/oyi-logo-transparent.png",
  contactEmail: process.env.NEXT_PUBLIC_OYI_CONTACT_EMAIL || "",
};

export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "Oyi Home", href: "/home" },
  { label: "Facility", href: "/facility" },
  { label: "Watch", href: "/watch" },
  { label: "Deployments", href: "/deployments" },
  { label: "Contact", href: "/contact" },
];

export const publicRoutes = [
  "/",
  "/home",
  "/facility",
  "/watch",
  "/edge",
  "/twin",
  "/intelligence",
  "/deployments",
  "/contact",
  "/privacy",
  "/terms",
  "/support",
];

export const demoDataStrategy = {
  estate: "Oyi Demo Estate",
  resident: "Ada Demo",
  home: "Villa A1",
  rooms: ["Living Room", "Bedroom", "Kitchen", "Lounge"],
  devices: ["Living Room Light", "AC", "TV", "Gate Sensor"],
  visitor: "Demo Guest",
  maintenance: "AC service request",
  community: "Estate notice sample",
};
