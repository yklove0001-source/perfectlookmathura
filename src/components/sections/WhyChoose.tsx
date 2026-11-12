import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { whyChoose } from "@/lib/site";
import { Ambient } from "@/components/motion/Ambient";

export function WhyChoose() {
  return (
    <section id="why" aria-labelledby="why-title" className="relative bg-ink py-24 md:py-36">
      <Ambient variant="b" />
      <Container className="relative">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                split="clip"
                eyebrow="Why Perfect Look"
                title={
                  <span id="why-title">
                    Quiet expertise. <em className="text-gold-sheen">Personal care.</em>
                  </span>
                }
                intro="No pressure and no shortcuts — just honest guidance and attention to detail, from your first visit to every follow-up."
              />
            </div>
          </div>

          <ul data-reveal="stagger" className="lg:col-span-6 lg:col-start-7">
            {whyChoose.map((w, i) => (
              <li key={w.title} className="group grid grid-cols-[auto_1fr] gap-6 border-t border-line py-9 last:border-b md:gap-10">
                <span className="icon-ring relative flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors duration-500 group-hover:bg-gold group-hover:text-ink">
                  <Icon name={w.icon} className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-[0.62rem] uppercase tracking-[0.3em] text-mist">0{i + 1}</p>
                  <h3 className="mt-2 text-title text-ivory">{w.title}</h3>
                  <p className="mt-3 leading-7 text-mist">{w.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
