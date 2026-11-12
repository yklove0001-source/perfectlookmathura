import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { business, directionsUrl, navLinks, services, telLink, whatsappLink } from "@/lib/site";

export function Footer() {
  const a = business.address;
  return (
    <footer className="border-t border-line bg-ink pb-24 pt-20 md:pb-12">
      <Container>
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-7 text-mist">
              Hair patch, hair wig, hair fixing, hair weaving and non-surgical hair replacement
              solutions in Mathura.
            </p>
          </div>

          <nav aria-label="Services" className="md:col-span-3">
            <p className="eyebrow">Services</p>
            <ul className="mt-6 space-y-3 text-sm text-ivory/80">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="link-underline pb-0.5 hover:text-ivory">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="eyebrow">Visit</p>
            <address className="mt-6 text-sm not-italic leading-7 text-ivory/80">
              {a.line1}
              <br />
              {a.line2}
              <br />
              {a.locality}, {a.region} {a.postalCode}
            </address>
            <div className="mt-5 flex flex-col gap-2 text-sm">
              <a href={telLink} className="link-underline w-fit pb-0.5 text-ivory">
                {business.phoneDisplay}
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="link-underline w-fit pb-0.5 text-ivory">
                WhatsApp
              </a>
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="link-underline w-fit pb-0.5 text-gold">
                Get directions
              </a>
            </div>
          </div>
        </div>

        <p
          aria-hidden
          data-fill
          className="wordmark mt-20 select-none whitespace-nowrap text-center font-display text-[clamp(2.4rem,10.5vw,11rem)] uppercase leading-[0.85] tracking-[-0.01em]"
        >
          Perfect Look
        </p>
        <div className="hairline mt-10 opacity-40" />
        <div className="mt-8 flex flex-col gap-4 text-xs text-mist md:flex-row md:items-center md:justify-between">
          <p>© {business.fullName}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-ivory">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
