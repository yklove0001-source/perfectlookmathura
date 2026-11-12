import Image from "next/image";
import type { Photo } from "@/lib/photos";

/**
 * Shows a real photo when `photo` is given; otherwise an elegant, clearly
 * labelled placeholder. We never substitute stock or AI images for real photos.
 */
export function PhotoFrame({
  photo,
  alt,
  label = "Photo coming soon",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  className = "",
  imgClassName = "",
  priority = false,
  tone = "default",
  bare = false,
}: {
  photo?: Photo;
  alt?: string;
  label?: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  tone?: "default" | "warm";
  /** Placeholder without icon/label (used inside the compare slider) */
  bare?: boolean;
}) {
  if (photo) {
    return (
      <div className={`relative overflow-hidden bg-charcoal ${className}`}>
        <Image
          src={photo.src}
          alt={alt ?? photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={photo.blurDataURL}
          className={`object-cover ${imgClassName}`}
        />
      </div>
    );
  }

  const bg =
    tone === "warm"
      ? "bg-[radial-gradient(120%_80%_at_70%_20%,#2a2219_0%,#17140f_50%,#0d0c0a_100%)]"
      : "bg-[radial-gradient(120%_80%_at_30%_20%,#1d1a15_0%,#121212_45%,#0b0b0b_100%)]";

  return (
    <div
      role="img"
      aria-label={`${alt ?? label} (photo coming soon)`}
      className={`grain frame-shimmer relative flex items-center justify-center overflow-hidden border border-line ${bg} ${className}`}
    >
      <span aria-hidden className="absolute inset-3 border border-gold/10" />
      <span className={`relative z-[2] flex-col ${bare ? "hidden" : "flex"} items-center gap-3 px-6 text-center`}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold/70" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <circle cx="12" cy="12" r="3.5" />
          <path d="M8 5l1.5-2h5L16 5" />
        </svg>
        <span className="text-[0.62rem] uppercase tracking-[0.3em] text-mist">{label}</span>
      </span>
    </div>
  );
}
