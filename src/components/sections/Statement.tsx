import { Container } from "@/components/ui/Container";
import { SplitText } from "@/components/type/split";

/**
 * Brand statement. Words light up progressively as the visitor scrolls;
 * the two key words turn champagne-gold with a drawn underline.
 */
export function Statement() {
  return (
    <section aria-label="Our philosophy" className="relative overflow-hidden bg-ink py-28 md:py-44">
      <div aria-hidden className="hairline absolute inset-x-0 top-0 opacity-30" />
      <Container>
        <p data-reveal="up" className="eyebrow flex items-center justify-center gap-4">
          <span aria-hidden className="h-px w-10 bg-gold/70" />
          Our philosophy
          <span aria-hidden className="h-px w-10 bg-gold/70" />
        </p>
        <SplitText
          as="p"
          variant="scrub"
          className="mx-auto mt-10 max-w-5xl text-center font-display text-[clamp(1.85rem,1.1rem+3.1vw,3.9rem)] leading-[1.18] tracking-[-0.005em] text-ivory"
        >
          Every transformation begins with <span className="emph">listening</span> — to your story, your style and
          the <span className="emph">confidence</span> you want to feel.
        </SplitText>
      </Container>
    </section>
  );
}
