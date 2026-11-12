import { Hero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { Transformations } from "@/components/sections/Transformations";
import { Services } from "@/components/sections/Services";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Process } from "@/components/sections/Process";
import { Gallery } from "@/components/sections/Gallery";
import { Reviews } from "@/components/sections/Reviews";
import { FinalCta } from "@/components/sections/FinalCta";
import { Faq } from "@/components/sections/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeJsonLd, seo } from "@/lib/seo";
import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { Marquee } from "@/components/motion/Marquee";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: seo.homeTitle },
  description: seo.homeDescription,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <Hero />
      <Statement />
      <Marquee items={services.map((s) => s.title)} />
      <Transformations />
      <Services />
      <WhyChoose />
      <Process />
      <Gallery />
      <Reviews />
      <Faq />
      <FinalCta />
      <Marquee
        reverse
        outline
        items={["Private consultation", "Non-surgical", "Personalised fitting", "Mathura"]}
      />
      <Contact />
    </>
  );
}
