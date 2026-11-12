/**
 * Single source of truth for all business content.
 * Edit this file to update text, services, photos and reviews across the site.
 * Rule: only real information — no invented reviews, ratings, numbers or claims.
 */

export const business = {
  name: "Perfect Look Hair Wig House",
  city: "Mathura",
  fullName: "Perfect Look Hair Wig House Mathura",
  phoneDisplay: "+91 90580 28729",
  phoneE164: "+919058028729",
  address: {
    line1: "Shop No. 5, Daroga Ji Market, Bhagwan Complex",
    line2: "Near Shri Jamuna Dham, Goverdhan Chauraha",
    locality: "Mathura",
    region: "Uttar Pradesh",
    postalCode: "281004",
    country: "IN",
  },
  mapsUrl: "https://maps.app.goo.gl/WdF1r6QQ3RETxhUw5",
  /**
   * Map search text used for the embedded map and directions.
   * For a pixel-perfect pin: Google Maps → your listing → Share → "Embed a map",
   * copy the src="…" URL and paste it into `mapEmbedOverride` below.
   */
  mapQuery:
    "Perfect Look Hair Wig House, Bhagwan Complex, Goverdhan Chauraha, Mathura, Uttar Pradesh 281004",
  mapEmbedOverride: "" as string,
  /** TODO: confirm with owner. Left empty so nothing false is shown. */
  openingHours: [] as { days: string; hours: string }[],
  /** TODO: add real profile URLs when provided. */
  social: [] as { label: string; href: string }[],
} as const;

export const whatsappDefaultMessage =
  "Hello Perfect Look Hair Wig House, I would like to know more about your hair patch and hair wig services.";

export function whatsappLink(message: string = whatsappDefaultMessage) {
  return `https://wa.me/919058028729?text=${encodeURIComponent(message)}`;
}

export const telLink = `tel:${business.phoneE164}`;

export const mapEmbedUrl =
  business.mapEmbedOverride ||
  `https://www.google.com/maps?q=${encodeURIComponent(business.mapQuery)}&z=17&output=embed`;

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(business.mapQuery)}`;

export const navLinks = [
  { label: "Transformations", href: "/#transformations" },
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
] as const;

/* ------------------------------------------------------------------ */
/* Services — TODO: owner to confirm every service listed is offered. */
/* ------------------------------------------------------------------ */

export type Service = {
  slug: string;
  index: string;
  title: string;
  short: string;
  description: string;
  points: string[];
  imageAlt: string;
};

export const services: Service[] = [
  {
    slug: "hair-patch",
    index: "01",
    title: "Hair Patch",
    short: "A non-surgical way to bring back a fuller-looking hairline.",
    description:
      "A hair patch is a thin base with hair attached, fitted over the area of thinning. We help you choose the base, hair texture and shade, fit it to your needs and show you how to look after it day to day.",
    points: [
      "Hair patch solutions for different needs",
      "Personalised fitting",
      "Natural-looking appearance",
      "Maintenance guidance",
    ],
    imageAlt: "Hair patch fitting at Perfect Look Hair Wig House, Mathura",
  },
  {
    slug: "hair-wig",
    index: "02",
    title: "Hair Wig",
    short: "Wigs in different styles, selected around your face and lifestyle.",
    description:
      "From short everyday styles to fuller looks, we help you compare options in the studio and choose a wig that suits your face shape, hair colour and routine.",
    points: [
      "Hair wig solutions",
      "Different styles and looks",
      "Personalised selection assistance",
    ],
    imageAlt: "Hair wig styles at Perfect Look Hair Wig House, Mathura",
  },
  {
    slug: "hair-fixing",
    index: "03",
    title: "Hair Fixing",
    short: "Secure fitting options chosen for comfort and confidence.",
    description:
      "We explain the available fixing methods, help you decide which one suits your routine, and support you with re-fixing and upkeep afterwards.",
    points: ["Hair fixing services", "Suitable fitting options", "Maintenance support"],
    imageAlt: "Hair fixing service at Perfect Look Hair Wig House, Mathura",
  },
  {
    slug: "hair-weaving",
    index: "04",
    title: "Hair Weaving",
    short: "Hair woven with your own for a blended, fuller look.",
    description:
      "Hair weaving attaches additional hair to your existing hair. We start with a consultation to understand your hair and the look you want, then recommend the right approach.",
    points: ["Hair weaving solutions", "Personalised consultation"],
    imageAlt: "Hair weaving at Perfect Look Hair Wig House, Mathura",
  },
  {
    slug: "hair-replacement",
    index: "05",
    title: "Hair Replacement",
    short: "Non-surgical hair replacement, personalised to you.",
    description:
      "Non-surgical hair replacement brings together the right system, fitting and styling. We guide you through the options and help you choose what fits your look and budget.",
    points: ["Non-surgical hair replacement options", "Personalised hair solutions"],
    imageAlt: "Non-surgical hair replacement at Perfect Look Hair Wig House, Mathura",
  },
  {
    slug: "hair-care-products",
    index: "06",
    title: "Hair Care Products",
    short: "Care essentials made for hair patches and systems.",
    description:
      "The right products help your hair patch stay soft, clean and natural-looking for longer. Ask us which ones suit your system.",
    points: ["Hair patch shampoo", "Hair patch serum", "Hair patch softener"],
    imageAlt: "Hair patch care products at Perfect Look Hair Wig House, Mathura",
  },
];

export const whyChoose = [
  {
    title: "Personalised hair solutions",
    text: "Every recommendation starts with your hair, your face and the look you want.",
    icon: "fingerprint",
  },
  {
    title: "Professional fitting guidance",
    text: "We take you through fitting step by step, so you know exactly what to expect.",
    icon: "compass",
  },
  {
    title: "Different styling options",
    text: "Explore cuts, textures and styles until the result feels like you.",
    icon: "scissors",
  },
  {
    title: "Care & maintenance support",
    text: "Practical guidance and products to keep your hair looking its best.",
    icon: "droplet",
  },
  {
    title: "Customer-focused service",
    text: "Private, respectful and unhurried — your comfort comes first.",
    icon: "hand",
  },
] as const;

export const processSteps = [
  {
    title: "Consultation",
    text: "Visit us or message on WhatsApp. We talk about your hair and your concerns in private.",
  },
  {
    title: "Understanding Your Requirements",
    text: "We look at your hair, lifestyle, budget and the look you want to achieve.",
  },
  {
    title: "Hair Solution Selection",
    text: "Together we choose the right patch, wig or system — base, texture and shade.",
  },
  {
    title: "Fitting & Styling",
    text: "Your hair solution is fitted, cut and styled to blend with your look.",
  },
  {
    title: "Maintenance Guidance",
    text: "We show you how to care for it and are here for upkeep whenever you need.",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Photos are discovered automatically from /public/images —         */
/* see docs/ADDING_PHOTOS.md. Real business photos only.              */
/* ------------------------------------------------------------------ */

/** Gallery folder name → category shown on the website. */
export const galleryFolders = {
  "hair-patch": "Hair Patch",
  "hair-wigs": "Hair Wigs",
  "hair-transformations": "Hair Transformations",
  "hair-styles": "Hair Styles",
  "hair-care-products": "Hair Care Products",
} as const;

export type GalleryCategory = (typeof galleryFolders)[keyof typeof galleryFolders];

/* ------------------------------------------------------------------ */
/* FAQ — shown on the homepage and given to Google (FAQPage data).    */
/* Keep answers factual: no guarantees, prices or medical claims.     */
/* ------------------------------------------------------------------ */
export const faqs = [
  {
    q: "What is a hair patch?",
    a: "A hair patch is a thin base with hair attached that is fitted over areas of thinning or hair loss. It is cut and styled to blend with your own hair, and it is a non-surgical option.",
  },
  {
    q: "Are your hair solutions surgical?",
    a: "No. The hair patch, hair wig, hair fixing, hair weaving and hair replacement solutions we offer are all non-surgical.",
  },
  {
    q: "Will a hair patch or wig look natural on me?",
    a: "We help you choose the base, hair texture and shade that suit you, then cut and style it to blend with your look. Visit us for a consultation and we will show you the options in person.",
  },
  {
    q: "How do I look after my hair patch?",
    a: "We explain day-to-day care when your hair patch is fitted and offer maintenance support afterwards. We also stock hair patch shampoo, serum and softener.",
  },
  {
    q: "Where is Perfect Look Hair Wig House in Mathura?",
    a: "Shop No. 5, Daroga Ji Market, Bhagwan Complex, near Shri Jamuna Dham, Goverdhan Chauraha, Mathura, Uttar Pradesh 281004.",
  },
  {
    q: "How do I book a consultation?",
    a: "Message us on WhatsApp, call +91 90580 28729, or fill in the enquiry form on this page and we will get back to you.",
  },
];

export type Review = {
  name: string;
  text: string;
  /** Where the review is from, e.g. "Google" */
  source: string;
  date?: string;
};

/** TODO: add verified reviews only (copied from Google with the reviewer's name). */
export const reviews: Review[] = [];
