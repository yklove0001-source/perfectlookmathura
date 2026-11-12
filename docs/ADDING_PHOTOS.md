# How to add your photos

You don't need to touch any code. Put photos into the right folder, then
rebuild / redeploy the website. The site finds them automatically, resizes
them for phones, and shows them with a soft blur-in.

All folders are inside **`public/images/`**.

> Use only genuine photos of your own work, and get each customer's
> permission before showing their before/after photos.

---

## 1. Before & After (the drag-to-compare slider)

Make **one folder per customer transformation** inside
`public/images/transformations/`. Inside it, put exactly two photos named
**`before`** and **`after`**:

```
public/images/transformations/
├── 01-hair-patch/
│   ├── before.jpg
│   └── after.jpg
├── 02-hair-wig/
│   ├── before.jpg
│   └── after.jpg
```

- The **folder name becomes the title**: `01-hair-patch` → "Hair Patch".
- The number at the start controls the **order** (01 is shown first).
- Take both photos from the **same angle, distance and lighting** — this is
  what makes the slider look impressive.
- Portrait (upright) photos work best.

## 2. Gallery

Put photos into the matching category folder in `public/images/gallery/`:

| Folder | Shown under |
|---|---|
| `hair-patch` | Hair Patch |
| `hair-wigs` | Hair Wigs |
| `hair-transformations` | Hair Transformations |
| `hair-styles` | Hair Styles |
| `hair-care-products` | Hair Care Products |

**Name files in plain words** — the name becomes the description Google and
screen readers use:

- Good: `natural-hair-patch-front-view.jpg` → "Natural hair patch front view"
- Camera names like `IMG_2034.jpg` also work (the category name is used instead).

Categories with no photos are hidden automatically.

## 3. Service photos

Put one photo per service in `public/images/services/`, named exactly:

```
hair-patch.jpg
hair-wig.jpg
hair-fixing.jpg
hair-weaving.jpg
hair-replacement.jpg
hair-care-products.jpg
```

## Photo tips

- Formats: `.jpg`, `.png`, `.webp` or `.avif`.
- Size: anything from a modern phone is fine (the site optimises them).
  Very large files (over ~8 MB) slow down the build — export at about
  2000 px on the longest side if possible.
- Good light, clean background, and the hair in sharp focus.
