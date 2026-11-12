import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { FinalCta } from "@/components/sections/FinalCta";
import { services, telLink, whatsappLink } from "@/lib/site";
import { getServicePhotos } from "@/lib/photos";
import { JsonLd } from "@/components/seo/JsonLd";
import { splitNode } from "@/components/type/split";
import { serviceJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) return {};
  const title = `${s.title} in Mathura`;
  const description = `${s.title} at Perfect Look Hair Wig House, Goverdhan Chauraha, Mathura. ${s.short} Book a personalised consultation — call or WhatsApp +91 90580 28729.`;
  return {
    title,
    description,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { type: "website", locale: "en_IN", title, description, url: `/services/${s.slug}` },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const others = services.filter((x) => x.slug !== s.slug);
  const photos = await getServicePhotos();

  return (
    <>
      <JsonLd data={serviceJsonLd(s)} />
      <section className="grain relative overflow-hidden bg-ink pb-24 pt-36 md:pb-32 md:pt-48">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_50%_at_80%_20%,rgba(201,169,110,0.14),transparent_70%)]" />
        <Container className="relative z-10">
          <Link href="/#services" className="link-underline inline-flex items-center gap-2 pb-0.5 text-[0.68rem] uppercase tracking-[0.26em] text-mist hover:text-ivory">
            <Icon name="arrow" className="h-3.5 w-3.5 rotate-180" /> All services
          </Link>
          <div className="mt-10 grid items-end gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow">{s.index} — Mathura</p>
              <h1 aria-label={s.title} className="mt-6 text-hero uppercase text-ivory">
                <span aria-hidden="true" className="hero-split">
                  {splitNode(s.title, "chars", undefined, "t", "hero-c")}
                </span>
              </h1>
              <p className="mt-8 font-display text-title italic text-beige">{s.short}</p>
              <p className="mt-6 max-w-xl text-lead text-mist">{s.description}</p>
              <ul className="mt-10 space-y-3">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-ivory/85">
                    <span aria-hidden className="mt-3 h-px w-5 shrink-0 bg-gold" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-12 flex flex-col gap-3 sm:flex-row">
                <Button
                  href={whatsappLink(
                    `Hello Perfect Look Hair Wig House, I would like to know more about your ${s.title.toLowerCase()} service.`,
                  )}
                  external
                >
                  <WhatsAppIcon className="h-4 w-4" /> Enquire on WhatsApp
                </Button>
                <Button href={`/?service=${s.slug}#book`} variant="outline">
                  Book Consultation
                </Button>
                <Button href={telLink} variant="ghost" className="sm:px-4">
                  <Icon name="phone" className="h-4 w-4 text-gold" /> Call
                </Button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <PhotoFrame photo={photos[s.slug]} alt={s.imageAlt} label={s.title} priority className="aspect-[4/5] w-full" sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="more-title" className="bg-charcoal py-20 md:py-28">
        <Container>
          <h2 id="more-title" className="eyebrow">More solutions</h2>
          <ul data-reveal="stagger" className="mt-8 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <li key={o.slug} className="bg-charcoal">
                <Link href={`/services/${o.slug}`} className="group flex h-full flex-col gap-6 p-7 transition-colors duration-500 hover:bg-graphite">
                  <span className="text-[0.62rem] tracking-[0.3em] text-gold">{o.index}</span>
                  <span className="font-display text-2xl text-ivory">{o.title}</span>
                  <Icon name="arrowUpRight" className="mt-auto h-4 w-4 text-mist transition-colors group-hover:text-gold" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
