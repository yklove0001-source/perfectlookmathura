/**
 * Endless gold ticker. The track holds the list twice so it can loop seamlessly;
 * GSAP (ScrollAnimations → [data-marquee]) drives it and reacts to scroll speed and
 * direction. Decorative only — the same words appear as real content elsewhere.
 */
export function Marquee({
  items,
  reverse = false,
  outline = false,
}: {
  items: readonly string[];
  reverse?: boolean;
  /** Outlined letters instead of solid */
  outline?: boolean;
}) {
  const row = (copy: number) => (
    <div className="flex shrink-0 items-center" aria-hidden key={copy}>
      {items.map((t) => (
        <span key={`${copy}-${t}`} className="flex items-center">
          <span className={`px-6 font-display text-[clamp(2.2rem,1.2rem+4vw,5.5rem)] uppercase leading-none tracking-[0.02em] md:px-10 ${outline ? "marquee-outline" : "text-ivory/90"}`}>
            {t}
          </span>
          <svg viewBox="0 0 24 24" className="marquee-star h-5 w-5 shrink-0 text-gold md:h-7 md:w-7" aria-hidden>
            <path fill="currentColor" d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" />
          </svg>
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden className="relative overflow-hidden border-y border-line bg-ink py-7 md:py-10">
      <div data-marquee={reverse ? "-1" : "1"} className="marquee-track flex w-max">
        {row(0)}
        {row(1)}
      </div>
      <span className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent md:w-40" />
      <span className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent md:w-40" />
    </div>
  );
}
