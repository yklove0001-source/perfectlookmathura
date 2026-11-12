import { Button } from "@/components/ui/Button";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { telLink, whatsappLink } from "@/lib/site";
import { SplitText } from "@/components/type/split";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="grain relative overflow-hidden bg-ink py-32 md:py-48">
      <div aria-hidden data-parallax="12" className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(201,169,110,0.22),transparent_70%)]" />
      <div aria-hidden className="cta-orb absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl" />
      <div aria-hidden className="hairline absolute inset-x-0 top-0 opacity-40" />
      <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-8">
        <p data-reveal="up" className="eyebrow">Begin today</p>
        <div data-type-scale>
          <SplitText as="h2" id="cta-title" variant="scatter" className="mt-7 text-hero uppercase text-ivory">
            <span className="block">Your new look</span>{" "}
            <em className="text-gold-sheen block font-light not-italic">starts here.</em>
          </SplitText>
        </div>
        <p data-reveal="up" className="mx-auto mt-8 max-w-lg text-lead text-mist">
          Let&apos;s find the right hair solution for your style and confidence.
        </p>
        <div data-reveal="up" className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/#book" magnetic>
            Book Consultation
          </Button>
          <Button href={whatsappLink()} variant="outline" external magnetic>
            <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
          </Button>
          <Button href={telLink} variant="outline" magnetic>
            <Icon name="phone" className="h-4 w-4" /> Call Now
          </Button>
        </div>
      </div>
    </section>
  );
}
