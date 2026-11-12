import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { services, whatsappLink } from "@/lib/site";
import { getServicePhotos } from "@/lib/photos";
import { RollText, SplitText } from "@/components/type/split";
import { Ambient } from "@/components/motion/Ambient";

export async function Services() {
  const photos = await getServicePhotos();
  return (
    <section id="services" aria-labelledby="sv-title" className="relative bg-charcoal py-24 md:py-36">
      <Ambient />
      <Container className="relative">
        <SectionHeading
          eyebrow="Our Solutions"
          title={
            <span id="sv-title">
              Crafted around <em className="text-gold-sheen">you.</em>
            </span>
          }
          intro="Hair patch, hair wig, hair fixing, hair weaving and non-surgical hair replacement in Mathura. Every solution begins with a private consultation — we listen first, then recommend what suits your hair, style and routine."
        />

        {/* Quick index of all services */}
        <nav aria-label="Jump to a service" className="mt-14 border-y border-line">
          <ul data-reveal="stagger" className="grid grid-cols-2 gap-x-6 py-2 sm:grid-cols-3 lg:grid-cols-6">
            {services.map((s) => (
              <li key={s.slug}>
                <a
                  href={`#service-${s.slug}`}
                  aria-label={s.title}
                  className="group flex h-full flex-col gap-2 py-4"
                >
                  <span className="text-[0.6rem] tracking-[0.3em] text-gold">{s.index}</span>
                  <RollText className="font-display text-xl text-ivory">{s.title}</RollText>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ol className="mt-6 md:mt-10">
          {services.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={s.slug} id={`service-${s.slug}`} className="scroll-mt-24 border-b border-line py-14 last:border-b-0 md:py-20">
                <article className="group grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                  <div className={`lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}>
                    {/* Curtain reveal → parallax drift → hover zoom */}
                    <div data-tilt className="relative">
                    <div data-reveal="image" className="relative aspect-[4/5] w-full overflow-hidden">
                      <div data-parallax="5" className="absolute inset-x-0 -inset-y-[7%]">
                        <div data-reveal-zoom className="h-full w-full">
                          <PhotoFrame
                            photo={photos[s.slug]}
                            alt={s.imageAlt}
                            label={s.title}
                            className="h-full w-full"
                            imgClassName="transition-transform duration-[1.6s] ease-luxe group-hover:scale-[1.04]"
                            sizes="(min-width: 1024px) 40vw, 100vw"
                          />
                        </div>
                      </div>
                      <span data-tilt-glare />
                    </div>
                    </div>
                  </div>

                  <div
                    data-reveal="stagger"
                    className={`lg:col-span-6 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}
                  >
                    <p className="eyebrow">{s.index} — Service</p>
                    <SplitText as="h3" variant="chars" className="mt-5 text-display text-ivory">
                      {s.title}
                    </SplitText>
                    <p className="mt-5 font-display text-title italic text-beige">{s.short}</p>
                    <p className="mt-5 max-w-xl leading-8 text-mist">{s.description}</p>

                    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-start gap-3 text-sm text-ivory/85">
                          <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-gold" />
                          {p}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                      <Link
                        href={`/services/${s.slug}`}
                        className="link-underline inline-flex items-center gap-3 pb-1 text-[0.75rem] uppercase tracking-[0.22em] text-ivory"
                      >
                        Learn more<span className="sr-only"> about {s.title}</span> <Icon name="arrow" className="h-4 w-4 text-gold" />
                      </Link>
                      <a
                        href={whatsappLink(
                          `Hello Perfect Look Hair Wig House, I would like to know more about your ${s.title.toLowerCase()} service.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 text-[0.75rem] uppercase tracking-[0.22em] text-gold hover:text-gold-soft"
                      >
                        <WhatsAppIcon className="h-4 w-4" /> Enquire on WhatsApp
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
