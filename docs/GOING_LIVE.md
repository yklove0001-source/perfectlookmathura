# Going live — SEO checklist

The website is already set up for Google (titles, descriptions, business
details, FAQ, sitemap, share images). These steps need **you**, because they
involve your own accounts and domain.

## 1. Set your website address (once)

When you have a domain (for example `www.perfectlookmathura.com`), set it in
your hosting settings as an environment variable:

```
NEXT_PUBLIC_SITE_URL=https://www.your-domain.com
```

On Vercel this is filled in automatically if you skip it, but setting it is
safest. Rebuild after changing it.

## 2. Google Search Console (free) — tells Google your site exists

1. Go to https://search.google.com/search-console and add your domain.
2. Verify ownership (your domain provider has a one-click option).
3. Under **Sitemaps**, submit: `https://www.your-domain.com/sitemap.xml`

## 3. Google Business Profile — the most important step for "near me" searches

Searches like "hair patch in Mathura" mostly show the **map results**, which
come from your Google Business Profile, not the website alone.

- Add your website address to the profile.
- Make sure name, address and phone **exactly match** the website:
  - Perfect Look Hair Wig House Mathura
  - Shop No. 5, Daroga Ji Market, Bhagwan Complex, Near Shri Jamuna Dham,
    Goverdhan Chauraha, Mathura, Uttar Pradesh 281004
  - +91 90580 28729
- Add opening hours, real photos, and choose categories such as
  "Wig shop" and "Hair replacement service".
- Ask happy customers for reviews (never write or buy reviews).

## 4. Map pin (optional, for a pixel-perfect pin)

Google Maps → your listing → **Share → Embed a map** → copy the URL inside
`src="…"` and paste it into `mapEmbedOverride` in `src/lib/site.ts`.

## 5. Check the share preview

Paste your link into WhatsApp (to yourself) — you should see the gold
"Confidence begins with a perfect look." preview card.
