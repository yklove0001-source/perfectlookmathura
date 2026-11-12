import type { ReactNode } from "react";
import { SplitText, type SplitVariant } from "@/components/type/split";

/**
 * Section heading: eyebrow (gold rule draws in), split-text title, optional intro.
 * `split` picks the title's reveal style so sections don't all move the same way:
 *   "words" — words rise out of a mask (default)
 *   "blur"  — words sharpen from a soft blur
 *   "clip"  — words wipe in from the left
 */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Tag = "h2",
  split = "words",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  split?: Extract<SplitVariant, "words" | "blur" | "clip">;
}) {
  const center = align === "center";
  return (
    <header className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <p data-reveal="up" className={`eyebrow flex items-center gap-4 ${center ? "justify-center" : ""}`}>
        <span aria-hidden data-reveal="line" className="h-px w-10 bg-gold/70" />
        {eyebrow}
        {center && <span aria-hidden className="h-px w-10 bg-gold/70" />}
      </p>
      <SplitText as={Tag} variant={split} className="mt-6 text-display text-ivory">
        {title}
      </SplitText>
      {intro && (
        <p data-reveal="up" className="mt-6 text-lead text-mist">
          {intro}
        </p>
      )}
    </header>
  );
}
