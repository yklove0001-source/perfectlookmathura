import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { LocationMap } from "@/components/contact/LocationMap";
import { business, directionsUrl, telLink, whatsappLink } from "@/lib/site";

export function Contact() {
  const a = business.address;
  const rows = [
    {
      icon: <Icon name="pin" className="h-5 w-5" />,
      label: "Visit the studio",
      body: (
        <address className="not-italic">
          {a.line1}, {a.line2}, {a.locality}, {a.region} {a.postalCode}
        </address>
      ),
      href: directionsUrl,
      cta: "Get directions",
      external: true,
    },
    {
      icon: <Icon name="phone" className="h-5 w-5" />,
      label: "Call us",
      body: business.phoneDisplay,
      href: telLink,
      cta: "Call now",
      external: false,
    },
    {
      icon: <WhatsAppIcon className="h-5 w-5" />,
      label: "WhatsApp",
      body: "Message us any time — we reply as soon as we can.",
      href: whatsappLink(),
      cta: "Start chat",
      external: true,
    },
  ];

  return (
    <section id="contact" aria-labelledby="ct-title" className="bg-ink py-24 md:py-36">
      <Container>
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Contact & Location"
              title={
                <span id="ct-title">
                  Visit us in <em className="text-gold-sheen">Mathura.</em>
                </span>
              }
              intro="Book a private consultation, ask a question or drop by the studio."
            />
            <ul data-reveal="stagger" className="mt-12">
              {rows.map((r) => (
                <li key={r.label} className="grid grid-cols-[auto_1fr] gap-5 border-t border-line py-7 last:border-b">
                  <span className="mt-1 text-gold">{r.icon}</span>
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] text-mist">{r.label}</p>
                    <div className="mt-2 leading-7 text-ivory">{r.body}</div>
                    <a
                      href={r.href}
                      {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="link-underline mt-3 inline-flex items-center gap-2 pb-0.5 text-[0.7rem] uppercase tracking-[0.22em] text-gold"
                    >
                      {r.cta} <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Appointment enquiry → opens WhatsApp with the details filled in */}
          <div
            id="book"
            data-reveal="up"
            className="border border-line bg-charcoal p-6 sm:p-10 lg:col-span-6 lg:col-start-7"
          >
            <EnquiryForm />
          </div>
        </div>

        <div data-reveal="up" className="mt-16 md:mt-24">
          <LocationMap />
        </div>
      </Container>
    </section>
  );
}
