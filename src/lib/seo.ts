/**
 * SEO helpers: canonical site URL and structured data (JSON-LD) for Google.
 *
 * SITE ADDRESS — set once when the domain is known:
 *   NEXT_PUBLIC_SITE_URL=https://www.your-domain.com   (in .env.local or hosting settings)
 * On Vercel the production domain is detected automatically if this is not set.
 */
import { business, faqs, services, type Service } from "./site";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/+$/, "");

export const abs = (path = "/") => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;

const businessId = abs("/#business");
const websiteId = abs("/#website");

export const seo = {
  homeTitle: "Hair Patch & Hair Wig in Mathura | Perfect Look Hair Wig House",
  homeDescription:
    "Hair patch, hair wig, hair fixing, weaving & non-surgical hair replacement in Mathura. Private consultation at Goverdhan Chauraha. Call/WhatsApp +91 90580 28729.",
};

function businessNode() {
  const a = business.address;
  return {
    "@type": ["HairSalon", "Store"],
    "@id": businessId,
    name: business.fullName,
    alternateName: business.name,
    url: abs("/"),
    telephone: business.phoneE164,
    image: abs("/opengraph-image"),
    logo: abs("/icons/icon-512.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${a.line1}, ${a.line2}`,
      addressLocality: a.locality,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    hasMap: business.mapsUrl,
    areaServed: { "@type": "City", name: "Mathura" },
    ...(business.social.length ? { sameAs: business.social.map((s) => s.href) } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Hair solutions",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.title, url: abs(`/services/${s.slug}`) },
      })),
    },
  };
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      businessNode(),
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: abs("/"),
        name: business.fullName,
        inLanguage: "en-IN",
        publisher: { "@id": businessId },
      },
      {
        "@type": "FAQPage",
        "@id": abs("/#faq"),
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}

export function serviceJsonLd(s: Service) {
  const url = abs(`/services/${s.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      businessNode(),
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `${s.title} in Mathura`,
        serviceType: s.title,
        description: s.description,
        url,
        provider: { "@id": businessId },
        areaServed: { "@type": "City", name: "Mathura" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
          { "@type": "ListItem", position: 2, name: "Services", item: abs("/#services") },
          { "@type": "ListItem", position: 3, name: s.title, item: url },
        ],
      },
    ],
  };
}
