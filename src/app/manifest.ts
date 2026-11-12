import type { MetadataRoute } from "next";
import { business } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: business.fullName,
    short_name: "Perfect Look",
    description: "Hair patch, hair wig and hair replacement solutions in Mathura.",
    start_url: "/",
    display: "standalone",
    background_color: "#090909",
    theme_color: "#090909",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
