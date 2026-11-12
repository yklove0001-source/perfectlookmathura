import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/site";

/** Accessible accordion built on <details>/<summary> — works without JavaScript. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-ink py-24 md:py-36">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              split="clip"
              eyebrow="Questions"
              title={
                <span id="faq-title">
                  Good to <em className="text-gold-sheen">know.</em>
                </span>
              }
              intro="Straight answers to what people ask us most."
            />
          </div>
          <div data-reveal="stagger" className="lg:col-span-7 lg:col-start-6">
            {faqs.map((f, i) => (
              <details key={f.q} name="faq" open={i === 0} className="faq group border-t border-line last:border-b">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-title text-ivory transition-colors duration-300 group-hover:text-gold">
                    {f.q}
                  </h3>
                  <span
                    aria-hidden
                    className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors duration-500 group-open:bg-gold group-open:text-ink"
                  >
                    <span className="absolute h-px w-3.5 bg-current" />
                    <span className="absolute h-3.5 w-px bg-current transition-transform duration-500 ease-luxe group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-8 pr-16 leading-8 text-mist">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
