# Perfect Look Hair Wig House Mathura — Website

A luxury, cinematic website for **Perfect Look Hair Wig House**, Mathura:
3D hair hero, before/after slider, services, gallery, FAQ, WhatsApp booking
form and Google Map.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Three.js /
React Three Fiber, GSAP + ScrollTrigger, Lenis and Motion.

---

## 1. Run it on your Windows PC

**One-time setup**

1. Install **Node.js 22 LTS** from https://nodejs.org (accept the defaults).
2. Open the project folder in **VS Code** (File → Open Folder…).
3. Open the terminal in VS Code (**Terminal → New Terminal**) and run:

```powershell
npm install
```

**Every time you want to preview the site**

```powershell
npm run dev
```

Then open http://localhost:3000 in your browser. Changes you save appear
instantly. Press `Ctrl + C` in the terminal to stop.

---

## 2. Change text, services, FAQ or reviews

Almost everything is in **one file: `src/lib/site.ts`**

| What | Where in `site.ts` |
|---|---|
| Phone, address, Google Maps link | `business` |
| Opening hours, social media links | `business.openingHours`, `business.social` |
| Services (title, text, bullet points) | `services` |
| "Why choose us" points | `whyChoose` |
| "How it works" steps | `processSteps` |
| FAQ questions & answers | `faqs` |
| **Genuine** customer reviews | `reviews` (copy them from Google, with the name) |
| WhatsApp default message | `whatsappDefaultMessage` |

Honesty rules this site follows — please keep them:
no invented reviews or ratings, no fake before/after photos,
no guarantees or medical claims.

## 3. Add photos (no coding)

Drop photos into folders inside `public/images/` — see
**[docs/ADDING_PHOTOS.md](docs/ADDING_PHOTOS.md)**. Example:

```
public/images/transformations/01-hair-patch/before.jpg
public/images/transformations/01-hair-patch/after.jpg
public/images/gallery/hair-wigs/natural-wig-front.jpg
public/images/services/hair-patch.jpg
```

## 4. Put the website online (free on Vercel)

1. Put this folder on GitHub (GitHub Desktop is easiest: *File → Add local repository → Publish*).
2. Go to https://vercel.com, sign in with GitHub, click **Add New → Project**,
   choose the repository and click **Deploy**. That's it.
3. When you buy a domain, add it in Vercel (*Project → Settings → Domains*) and
   set `NEXT_PUBLIC_SITE_URL` (see `.env.example`).

Then follow **[docs/GOING_LIVE.md](docs/GOING_LIVE.md)** (Google Business
Profile, Search Console, sitemap).

Every time you push a change to GitHub, Vercel updates the live site automatically.

## 5. Quality checks

```powershell
npm run check        # code style + type errors
npm run build        # production build (must succeed before going live)
```

Automated browser tests (desktop + two phone sizes):

```powershell
npx playwright install chromium   # first time only
npm run test:e2e
```

---

## How the site is organised

```
src/
  app/                 pages, SEO files (sitemap, robots, share images, icons)
    page.tsx           homepage (section order)
    services/[slug]/   one page per service
  components/
    sections/          homepage sections (Hero, Services, Faq, Contact, …)
    hero/              3D hair scene + still fallback
    transform/         before/after slider
    gallery/           gallery grid + full-screen viewer
    contact/           WhatsApp enquiry form + map
    motion/            smooth scroll + scroll animations
    layout/            header, footer, loader, mobile action bar
    ui/                buttons, headings, icons, photo frames
  lib/
    site.ts            ← business content (edit this)
    photos.ts          automatic photo discovery
    enquiry.ts         form checks + WhatsApp message
    seo.ts             site address + Google structured data
public/images/         ← your photos
docs/                  guides
tests/e2e/             automated tests
```

### Animated typography

Headings are split into words or letters **on the server** (`src/components/type/split.tsx`),
so there is no layout shift and screen readers still hear whole sentences. Each section uses
its own reveal style — change it with the `split` prop on `SectionHeading`
(`"words"`, `"blur"` or `"clip"`). Gold words get a one-time light sweep; visitors who
prefer reduced motion see still, fully readable text.

### Higgsfield videos

Ready-to-paste prompts for brand videos: **[docs/HIGGSFIELD_PROMPTS.md](docs/HIGGSFIELD_PROMPTS.md)**.

### Good to know

- **3D hero**: shown on devices with real graphics hardware; phones get a
  lighter version; older devices, data-saver mode and "reduce motion" users
  see an elegant still image instead.
- **Intro loader**: shows at most once every 12 hours per visitor.
- **Enquiry form**: nothing is stored — it opens WhatsApp with the details
  filled in and the customer taps Send.
- **Map**: if the pin is not exactly on the shop, paste Google's "Embed a map"
  link into `mapEmbedOverride` in `site.ts`.
