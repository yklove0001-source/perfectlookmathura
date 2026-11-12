"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import type { GalleryPhoto } from "@/lib/photos";
import { lockScroll } from "@/lib/scroll";

const two = (n: number) => String(n).padStart(2, "0");

/**
 * Full-screen photo viewer built on the native <dialog> element
 * (keyboard focus is kept inside, Esc closes, focus returns afterwards).
 * Keys: ← → to browse. Touch: swipe left/right.
 */
export function Lightbox({
  items,
  index,
  onClose,
  onIndex,
}: {
  items: GalleryPhoto[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const swipeX = useRef<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    if (!open) return;
    lockScroll(true);
    return () => lockScroll(false);
  }, [open]);

  const count = items.length;
  const go = (d: number) => index !== null && onIndex((index + d + count) % count);
  const photo = index !== null ? items[index] : null;
  const neighbours = index !== null && count > 1 ? [items[(index + 1) % count], items[(index - 1 + count) % count]] : [];

  return (
    <dialog
      ref={dialog}
      aria-label="Photo viewer"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none overflow-hidden bg-ink/95 p-0 text-ivory backdrop:bg-ink/80 backdrop:backdrop-blur-sm open:flex open:flex-col"
    >
      {photo && (
        <>
          <div className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-mist">
              <span className="text-gold">{two(index! + 1)}</span> / {two(count)} · {photo.category}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close photo viewer"
              className="-mr-2 flex h-12 w-12 items-center justify-center text-ivory transition-colors hover:text-gold"
            >
              <Icon name="close" className="h-6 w-6" />
            </button>
          </div>

          <figure
            className="relative min-h-0 flex-1 touch-pan-y px-3 pb-3 sm:px-20 sm:pb-8"
            onPointerDown={(e) => (swipeX.current = e.clientX)}
            onPointerUp={(e) => {
              if (swipeX.current === null) return;
              const dx = e.clientX - swipeX.current;
              swipeX.current = null;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            }}
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div key={photo.src} className="relative h-full w-full animate-[fade-rise_0.6s_var(--ease-luxe)_both]">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="100vw"
                priority
                placeholder="blur"
                blurDataURL={photo.blurDataURL}
                className="object-contain"
              />
            </div>
            <figcaption className="sr-only">{photo.alt}</figcaption>
          </figure>

          {/* Preload neighbouring photos for instant browsing */}
          <div aria-hidden className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0">
            {neighbours.map((n) => (
              <Image key={n.src} src={n.src} alt="" width={64} height={64} sizes="100vw" loading="eager" />
            ))}
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-ink/60 text-ivory backdrop-blur transition-colors hover:border-gold hover:text-gold sm:flex"
              >
                <Icon name="arrow" className="h-5 w-5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-ink/60 text-ivory backdrop-blur transition-colors hover:border-gold hover:text-gold sm:flex"
              >
                <Icon name="arrow" className="h-5 w-5" />
              </button>
            </>
          )}
        </>
      )}
    </dialog>
  );
}
