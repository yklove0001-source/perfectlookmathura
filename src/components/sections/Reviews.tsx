import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { business, reviews } from "@/lib/site";

export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="rv-title" className="bg-charcoal py-24 md:py-36">
      <Container>
        <SectionHeading
          align="center"
          split="blur"
          eyebrow="Client Voices"
          title={
            <span id="rv-title">
              In their <em className="text-gold-sheen">own words.</em>
            </span>
          }
        />

        {reviews.length > 0 ? (
          <ul data-reveal="stagger" className="mt-16 grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <li key={r.name + r.text.slice(0, 12)} className="bg-charcoal p-8 md:p-10">
                <blockquote>
                  <span aria-hidden className="font-display text-6xl leading-none text-gold">“</span>
                  <p className="mt-2 font-display text-title italic text-ivory">{r.text}</p>
                  <footer className="mt-8 text-[0.68rem] uppercase tracking-[0.26em] text-mist">
                    {r.name} · {r.source}
                    {r.date ? ` · ${r.date}` : ""}
                  </footer>
                </blockquote>
              </li>
            ))}
          </ul>
        ) : (
          <div data-reveal="up" className="mx-auto mt-14 max-w-xl text-center">
            <p className="leading-8 text-mist">
              We only share genuine, verified reviews from our customers. Read what people say about
              us on Google.
            </p>
            <a
              href={business.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-6 inline-block pb-1 text-[0.75rem] uppercase tracking-[0.22em] text-gold"
            >
              Read our Google reviews
            </a>
          </div>
        )}
      </Container>
    </section>
  );
}
