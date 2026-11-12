import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { HeroBackdrop } from "@/components/hero/HeroBackdrop";
import { splitNode } from "@/components/type/split";

/** Shared counter → one continuous stagger across both lines of the headline. */
function HeroHeadline() {
  const ctr = { w: 0, c: 0 };
  return (
    <span aria-hidden="true" className="hero-split">
      {splitNode("Confidence begins with a", "chars", ctr, "a", "hero-c")}{" "}
      <em className="hero-gold font-light not-italic">{splitNode("perfect look.", "chars", ctr, "b", "hero-c metal")}</em>
    </span>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-ink"
    >
      <HeroBackdrop />

      <div data-hero-content className="relative z-10 mx-auto w-full max-w-[1320px] px-5 pb-28 pt-36 sm:px-8 md:pb-24 lg:px-12 lg:pb-28">
        <p className="hero-fade eyebrow flex items-center gap-4" style={{ "--d": "0.15s" } as React.CSSProperties}>
          <span aria-hidden className="h-px w-10 bg-gold/70" />
          Hair Wig House · Mathura
        </p>

        <h1
          id="hero-title"
          aria-label="Confidence begins with a perfect look."
          className="mt-7 max-w-[14ch] text-hero uppercase text-ivory"
        >
          <HeroHeadline />
        </h1>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="hero-fade max-w-md text-lead text-mist" style={{ "--d": "1.1s" } as React.CSSProperties}>
            Discover premium hair patch, hair wig and hair replacement solutions designed to help
            you look and feel confident.
          </p>
          <div className="hero-fade flex flex-col gap-3 sm:flex-row" style={{ "--d": "1.3s" } as React.CSSProperties}>
            <Button href="/#services" magnetic>
              Explore Our Solutions <Icon name="arrow" className="h-4 w-4" />
            </Button>
            <Button href="/#book" variant="outline" magnetic>
              Book Your Consultation
            </Button>
          </div>
        </div>
      </div>

      <Link
        href="/#transformations"
        aria-label="Scroll to transformations"
        className="hero-fade absolute bottom-9 left-[max(3rem,calc((100vw-1320px)/2+3rem))] z-10 hidden items-center gap-4 text-[0.6rem] uppercase tracking-[0.35em] text-mist hover:text-ivory lg:flex"
        style={{ "--d": "1.8s" } as React.CSSProperties}
      >
        Scroll
        <span className="relative h-px w-14 overflow-hidden bg-line">
          <span className="absolute inset-y-0 left-0 w-1/2 animate-[scrollcue-x_2.4s_var(--ease-silk)_infinite] bg-gold" />
        </span>
      </Link>
    </section>
  );
}
