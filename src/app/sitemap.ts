import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";
import { services } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: abs("/"), changeFrequency: "weekly", priority: 1 },
    ...services.map((s) => ({
      url: abs(`/services/${s.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
