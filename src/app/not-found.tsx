import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { services, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink py-32">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_50%_at_70%_30%,rgba(201,169,110,0.14),transparent_70%)]" />
      <div className="relative z-10 mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <p className="eyebrow flex items-center gap-4">
          <span aria-hidden className="h-px w-10 bg-gold/70" />
          Error 404
        </p>
        <h1 className="mt-7 max-w-[16ch] text-display text-ivory">
          This page has <em className="text-gold-sheen">moved on.</em>
        </h1>
        <p className="mt-6 max-w-md text-lead text-mist">
          The link may be old or mistyped. Here are some places to continue.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/">
            Back to home <Icon name="arrow" className="h-4 w-4" />
          </Button>
          <Button href={whatsappLink()} variant="outline" external>
            <WhatsAppIcon className="h-4 w-4" /> Ask us on WhatsApp
          </Button>
        </div>
        <ul className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8">
          {services.map((s) => (
            <li key={s.slug}>
              <a href={`/services/${s.slug}`} className="link-underline pb-0.5 text-sm text-ivory/80 hover:text-ivory">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
