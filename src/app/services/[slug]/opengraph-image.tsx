import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { services } from "@/lib/site";

export const alt = "Service at Perfect Look Hair Wig House Mathura";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return renderOgImage({ eyebrow: "Perfect Look · Mathura", title: s?.title ?? "Hair solutions", accent: "in Mathura" });
}
