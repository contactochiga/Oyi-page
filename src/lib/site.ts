export const siteConfig = {
  name: "Oyi",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://getoyi.com",
  title: "Oyi — The Intelligent Operating System for Buildings",
  description:
    "Oyi is one intelligent operating system for buildings, with a Facility experience for the teams who run them and a Resident experience for the people who live and work in them.",
  logo: "/oyi-logo-transparent.png",
  ogImage: "/oyi-logo-transparent.png",
  contactEmail: process.env.NEXT_PUBLIC_OYI_CONTACT_EMAIL || "",
};

// Primary architecture (approved six-part navigation): Oyi is ONE intelligent operating system. People meet it through two experiences --
// Facility (the teams who run a building) and Resident (the people who live, stay or work in it). Core is the intelligence inside Oyi, not a
// separate product. Software deployments are consultation-led (primaryCta). The Store lives at /hardware (the route the Office catalogue
// integration publishes to); it sells only Office-approved hardware and, later, integrated Ochiga packages, and stays a static page until the
// catalogue switch is turned on.
export type NavItem = { label: string; href: string; description?: string; children?: { label: string; href: string; description: string }[] };

export const primaryNav: NavItem[] = [
  {
    label: "Oyi",
    href: "/oyi",
    children: [
      { label: "What is Oyi", href: "/oyi", description: "One intelligent operating system for the whole building." },
      { label: "Oyi Core", href: "/core", description: "The intelligence that runs through every experience." },
    ],
  },
  {
    label: "Experiences",
    href: "/experiences",
    children: [
      { label: "Facility Experience", href: "/facility", description: "For the teams who operate and maintain the building." },
      { label: "Resident Experience", href: "/experience", description: "For the people who live, stay or work in it." },
    ],
  },
  { label: "Solutions", href: "/solutions" },
  { label: "Store", href: "/hardware" },
  { label: "Partners", href: "/partners" },
  { label: "Technology", href: "/technology" },
];

export const primaryCta = { label: "Book a consultation", href: "/deployments" };

export const experiences = [
  { label: "Facility Experience", href: "/facility" },
  { label: "Resident Experience", href: "/experience" },
];

export const technologyLinks = [
  { label: "Oyi Core", href: "/core" },
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
  "/oyi",
  "/experiences",
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
