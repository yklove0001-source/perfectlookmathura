# Perfect Look Hair Wig House Mathura — Design Foundation (Phase 1)

Status: **Draft, waiting for your approval**

---

## 1. Project inspection

- The project folder is **empty**: no existing code, images or Git repository.
- Tools available: Node.js 22, npm 10, Git 2.43.
- We start from a clean slate, so nothing old needs to be migrated or fixed.

---

## 2. Creative direction — "The Atelier of Confidence"

The site should feel like a private grooming atelier, not a salon template.
Three ideas guide every decision:

| Idea | What it means on screen |
|---|---|
| **Quiet luxury** | Black space, thin gold lines, large serif headlines, few elements per screen. |
| **Strand → Transformation** | One recurring motif: a single golden hair strand. It flows in the 3D hero, draws the timeline in "How it works", and underlines active links. |
| **Honest craft** | Only real photographs, real reviews and real services. No invented numbers, awards or medical claims. Trust comes from restraint. |

Mood references (in spirit, not copied): luxury fragrance houses, high-end
watch brand sites, editorial fashion magazines.

---

## 3. Design system

### Colours

| Token | Hex | Use |
|---|---|---|
| `ink` | `#090909` | Main page background |
| `charcoal` | `#151515` | Alternate sections, panels |
| `graphite` | `#1F1F1F` | Borders, hover surfaces |
| `gold` | `#C9A96E` | Accent: lines, icons, buttons, highlights |
| `gold-soft` | `#DCC497` | Gold hover / glow |
| `beige` | `#E8DCC8` | Secondary accent, small labels |
| `ivory` | `#F5F1EA` | Headlines and main text |
| `mist` | `#A39E95` | Body text on dark (muted) |

Rules: gold is used sparingly (≈5% of a screen). Never gold body text.
All text meets WCAG AA contrast on black.

### Typography

| Role | Font (free, Google Fonts) | Style |
|---|---|---|
| Display headlines | **Cormorant Garamond** (300–600) | Large, editorial, tight letter-spacing, uppercase for hero lines |
| Body & UI | **Manrope** (300–600) | Clean modern sans-serif |
| Small labels | Manrope, uppercase, wide letter-spacing (0.3em) | "01 — HAIR PATCH" style eyebrows |

Fluid type scale (grows smoothly from phone to desktop):

- Hero: 44px → 120px
- Section title: 34px → 72px
- Sub-title: 22px → 32px
- Body: 16px → 18px
- Label: 11px → 12px

### Spacing, shape, motion

- 8px spacing grid; sections get generous vertical space (96px mobile → 180px desktop).
- Corners: almost square (2px). Luxury = sharp, not bubbly.
- Thin 1px gold or graphite hairlines instead of heavy cards and shadows.
- Motion: slow, eased (0.8–1.2s, "expo out"). Nothing bounces. Respects the
  phone's "reduce motion" setting.

---

## 4. Website structure (one long page + legal pages)

1. **Loader** — gold strand draws the "PL" monogram, then reveals the site.
2. **Header** — logo, menu, "Book Consultation" button; slim mobile menu.
3. **Hero (3D)** — flowing procedural golden/dark hair strands in Three.js,
   floating particles, mouse/touch response, headline
   *"CONFIDENCE BEGINS WITH A PERFECT LOOK."* + 2 buttons.
4. **Transformations** — drag-to-compare before/after slider (your photos).
5. **Services** — Hair Patch, Hair Wig, Hair Fixing, Hair Weaving, Hair
   Replacement, Hair Care Products (only those you confirm).
   Each: image, short text, "Learn more", "Enquire on WhatsApp".
6. **Why Perfect Look** — 5 honest points with gold line icons.
7. **How it works** — 5-step timeline drawn by the gold strand on scroll.
8. **Gallery** — masonry grid, category filters, full-screen lightbox.
9. **Reviews** — only verified reviews you give me (empty-state ready).
10. **Final CTA** — *"YOUR NEW LOOK STARTS HERE."* + Book / WhatsApp / Call.
11. **Contact & Location** — address, click-to-call, WhatsApp, Google Map,
    directions, enquiry form.
12. **Footer** — details, quick links, privacy page.
13. **Fixed mobile bar** — WhatsApp + Call always within thumb reach.

---

## 5. Technical plan

| Area | Choice |
|---|---|
| Framework | Next.js (App Router) + React + TypeScript |
| Styling | Tailwind CSS with the tokens above |
| 3D | Three.js + React Three Fiber + Drei (procedural hair, no heavy model files) |
| Animation | GSAP + ScrollTrigger (scroll), Motion (UI), Lenis (smooth scroll) |
| Images | Next.js `<Image>` — auto WebP/AVIF, lazy loading |
| 3D fallback | If WebGL is missing or the phone is weak → a still cinematic image |
| Mobile 3D | Fewer strands and particles, lower pixel ratio |
| SEO | Metadata, Open Graph image, LocalBusiness + Service JSON-LD, sitemap.xml, robots.txt |

### Contact form — honest options (you choose)

The form must really work. Options:

- **A. WhatsApp form (recommended, free, no server):** customer fills
  name/phone/service/date → it opens WhatsApp with the message pre-written to
  +91 9058028729.
- **B. Email form:** uses a service like Resend or Formspree (needs an account/API key).
- **C. Both.**

---

## 6. What I need from you (content checklist)

| # | Item | Why |
|---|---|---|
| 1 | Which of the 6 services you really offer (and any missing ones) | Only real services are shown |
| 2 | Hair care products: exact names/brands you sell | No invented products |
| 3 | Real before/after photos (with customer permission) | Transformation section |
| 4 | Shop, work and product photos | Services + gallery |
| 5 | Logo (if you have one) | Otherwise I design a text monogram "PL" |
| 6 | Opening hours | Contact section + Google schema |
| 7 | Genuine Google reviews you want shown (copy text + name) | Reviews section |
| 8 | Instagram / Facebook / YouTube links | Footer + SEO |
| 9 | Contact form option A / B / C | See above |
| 10 | Domain name (e.g. perfectlookmathura.com) if you have one | SEO, sitemap, Open Graph |

Until real photos arrive, I will use **clearly labelled placeholders**
(elegant dark frames saying "Your photo here") — never fake customer photos.
