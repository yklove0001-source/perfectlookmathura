import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/lib/site";
import { Ambient } from "@/components/motion/Ambient";

export function Process() {
  return (
    <section id="process" aria-labelledby="pr-title" className="relative bg-charcoal py-24 md:py-36">
      <Ambient />
      <Container className="relative">
        <SectionHeading
          align="center"
          split="blur"
          eyebrow="How It Works"
          title={
            <span id="pr-title">
              Five steps to a <em className="text-gold-sheen">new you.</em>
            </span>
          }
        />

        {/* The gold line draws itself while scrolling; each step lights up as it passes */}
        <ol data-timeline className="relative mx-auto mt-16 max-w-4xl md:mt-24">
          <span aria-hidden className="absolute bottom-0 left-6 top-0 w-px bg-line md:left-1/2" />
          <span
            aria-hidden
            data-timeline-line
            className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-gold via-gold to-gold/30 shadow-[0_0_12px_rgba(201,169,110,0.5)] md:left-1/2"
          />
          {processSteps.map((step, i) => {
            const right = i % 2 === 1;
            return (
              <li key={step.title} data-step className="group/step relative grid grid-cols-[3rem_1fr] gap-6 pb-14 last:pb-0 md:grid-cols-2 md:gap-16 md:pb-20">
                <span
                  aria-hidden
                  className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-charcoal font-display text-lg text-gold transition-colors duration-700 ease-luxe group-[.is-active]/step:bg-gold group-[.is-active]/step:text-ink group-[.is-active]/step:shadow-[0_0_24px_rgba(201,169,110,0.45)] md:absolute md:left-1/2 md:top-0 md:-translate-x-1/2"
                >
                  {i + 1}
                </span>
                <div data-reveal="up" className={`${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}>
                  <p className="eyebrow">Step 0{i + 1}</p>
                  <h3 className="mt-3 text-title text-ivory">{step.title}</h3>
                  <p className="mt-3 leading-7 text-mist">{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
