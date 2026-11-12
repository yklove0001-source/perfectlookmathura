import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Perfect Look Hair Wig House Mathura — hair patch, hair wig and hair replacement";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Hair patch · Hair wig · Hair replacement", title: ["Confidence begins", "with a"], accent: "perfect look." });
}
