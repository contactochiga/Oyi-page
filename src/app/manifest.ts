import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oyi",
    short_name: "Oyi",
    description: "The operating platform for modern residential communities.",
    start_url: "/",
    display: "standalone",
    background_color: "#050b14",
    theme_color: "#38bdf8",
    icons: [{ src: "/oyi-logo-transparent.png", sizes: "512x512", type: "image/png" }],
  };
}
