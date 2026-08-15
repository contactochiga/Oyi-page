export const siteConfig = {
  name: "Oyi",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://getoyi.com",
  title: "Oyi — The Operating System for Buildings",
  description:
    "Oyi is one operating system connecting the infrastructure that runs a building, the people who operate it, and the people who experience it.",
  logo: "/oyi-logo-transparent.png",
  ogImage: "/oyi-logo-transparent.png",
  contactEmail: process.env.NEXT_PUBLIC_OYI_CONTACT_EMAIL || "",
};

// Primary architecture: Oyi is one operating system with three pillars
// (Facility, Experience, Core). Digital Twin and Edge are technology
// capabilities inside the system, not separate flagship products, so they
// live under /technology rather than the primary nav. Watch is a real,
// working companion capability of Experience — kept as a route, reachable
// from the Experience page and footer, not the primary nav.
export const primaryNav = [
  { label: "Oyi", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Technology", href: "/technology" },
  { label: "Hardware", href: "/hardware" },
  { label: "Partners", href: "/partners" },
  { label: "Developers", href: "/developers" },
  { label: "Support", href: "/support" },
];

export const primaryCta = { label: "Deploy Oyi", href: "/deployments" };

export const pillars = [
  { label: "Facility", href: "/facility" },
  { label: "Experience", href: "/experience" },
  { label: "Core", href: "/core" },
];

export const technologyLinks = [
  { label: "Facility", href: "/facility" },
  { label: "Experience", href: "/experience" },
  { label: "Core", href: "/core" },
  { label: "Digital Twin", href: "/twin" },
  { label: "Automation", href: "/technology#automation" },
  { label: "Edge", href: "/edge" },
];

export const solutionTypes = [
  { slug: "residential", label: "Residential" },
  { slug: "hospitality", label: "Hospitality" },
  { slug: "commercial", label: "Commercial" },
  { slug: "mixed-use", label: "Mixed-Use" },
  { slug: "healthcare", label: "Healthcare" },
];

export const publicRoutes = [
  "/",
  "/facility",
  "/experience",
  "/core",
  "/technology",
  "/twin",
  "/edge",
  "/watch",
  "/solutions",
  ...solutionTypes.map((solution) => `/solutions/${solution.slug}`),
  "/hardware",
  "/partners",
  "/developers",
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
