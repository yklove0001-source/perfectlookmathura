"use client";

import { useMemo, useState } from "react";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { Icon } from "@/components/ui/Icon";
import { Lightbox } from "./Lightbox";
import { galleryFolders, type GalleryCategory } from "@/lib/site";
import type { GalleryPhoto } from "@/lib/photos";

type Filter = "All" | GalleryCategory;
const filters: Filter[] = ["All", ...Object.values(galleryFolders)];

/** Shown only until real photographs are added (see docs/ADDING_PHOTOS.md). */
const placeholders: { category: GalleryCategory; ratio: string }[] = [
  { category: "Hair Patch", ratio: "4 / 5" },
  { category: "Hair Wigs", ratio: "1 / 1" },
  { category: "Hair Transformations", ratio: "4 / 3" },
  { category: "Hair Styles", ratio: "3 / 4" },
  { category: "Hair Care Products", ratio: "1 / 1" },
  { category: "Hair Patch", ratio: "3 / 4" },
];

export function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<Filter>("All");
  const [open, setOpen] = useState<number | null>(null);
  // First render: items reveal on scroll (GSAP). After a filter change: quick CSS fade.
  const [filtered, setFiltered] = useState(false);
  const itemMotion = (i: number) =>
    filtered
      ? {
          className: "mb-4 break-inside-avoid animate-[fade-rise_0.8s_var(--ease-luxe)_both]",
          style: { animationDelay: `${Math.min(i, 8) * 70}ms` },
        }
      : { className: "mb-4 break-inside-avoid", "data-reveal": "up" };
  const hasPhotos = photos.length > 0;

  const visible = useMemo(
    () => (active === "All" ? photos : photos.filter((p) => p.category === active)),
    [active, photos],
  );
  const visiblePlaceholders =
    active === "All" ? placeholders : placeholders.filter((p) => p.category === active);
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: photos.length };
    for (const p of photos) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [photos]);

  return (
    <>
      <div
        role="toolbar"
        data-reveal="up"
        aria-label="Filter gallery by category"
        className="-mx-5 mt-12 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {filters
          .filter((c) => !hasPhotos || c === "All" || (counts[c] ?? 0) > 0) // hide empty categories once photos exist
          .map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
              setActive(c);
              setFiltered(true);
            }}
              aria-pressed={active === c}
              className={`flex h-10 shrink-0 items-center gap-2 border px-5 text-[0.68rem] uppercase tracking-[0.22em] transition-colors duration-500 ${
                active === c
                  ? "border-gold bg-gold text-ink"
                  : "border-line text-mist hover:border-gold/60 hover:text-ivory"
              }`}
            >
              {c}
              {hasPhotos && (
                <span className={active === c ? "text-ink/60" : "text-mist/60"}>{counts[c] ?? 0}</span>
              )}
            </button>
          ))}
      </div>

      <ul key={active} className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {hasPhotos
          ? visible.map((p, i) => (
              <li key={p.src} {...itemMotion(i)}>
                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  aria-label={`Open photo: ${p.alt}`}
                  className="group relative block w-full overflow-hidden text-left"
                >
                  <div style={{ aspectRatio: `${p.width} / ${p.height}` }} className="relative">
                    <PhotoFrame
                      photo={p}
                      className="h-full w-full"
                      imgClassName="transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.05]"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/0 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between p-5 opacity-0 transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                    <span className="text-[0.62rem] uppercase tracking-[0.3em] text-beige">{p.category}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/60 text-gold">
                      <Icon name="arrowUpRight" className="h-4 w-4" />
                    </span>
                  </span>
                </button>
              </li>
            ))
          : visiblePlaceholders.map((p, i) => (
              <li key={`${p.category}-${i}`} {...itemMotion(i)}>
                <div style={{ aspectRatio: p.ratio }}>
                  <PhotoFrame alt={p.category} label={p.category} className="h-full w-full" />
                </div>
              </li>
            ))}
      </ul>

      {hasPhotos && visible.length === 0 && (
        <p className="py-16 text-center text-sm text-mist">Photos for this category are coming soon.</p>
      )}

      <Lightbox items={visible} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
