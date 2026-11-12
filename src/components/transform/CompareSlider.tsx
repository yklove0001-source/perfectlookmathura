"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { PhotoFrame } from "@/components/ui/PhotoFrame";
import type { Photo } from "@/lib/photos";

const clamp = (v: number) => Math.min(100, Math.max(0, v));

/**
 * Drag-to-compare before/after slider.
 * Mouse: click or drag anywhere. Touch: drag sideways (vertical swipes still scroll the page).
 * Keyboard: focus the handle and use ← → (Shift for bigger steps), Home, End.
 */
export function CompareSlider({
  before,
  after,
  label,
  hint = false,
  priority = false,
}: {
  before?: Photo;
  after?: Photo;
  label: string;
  hint?: boolean;
  priority?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const posRef = useRef(50);
  const dragging = useRef(false);
  const touched = useRef(false);
  const tween = useRef<number | null>(null);
  const [pos, setPos] = useState(50); // mirrored for screen readers

  const apply = (v: number) => {
    posRef.current = clamp(v);
    root.current?.style.setProperty("--pos", `${posRef.current}%`);
  };
  const commit = () => setPos(Math.round(posRef.current));
  const stopHint = () => {
    touched.current = true;
    if (tween.current) cancelAnimationFrame(tween.current);
  };
  const fromClientX = (x: number) => {
    const r = root.current?.getBoundingClientRect();
    if (r) apply(((x - r.left) / r.width) * 100);
  };

  // A gentle sweep the first time the slider scrolls into view, so visitors know it moves.
  useEffect(() => {
    const el = root.current;
    if (!hint || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || touched.current) return;
        io.disconnect();
        const keys = [50, 68, 34, 50];
        const dur = 2200;
        const t0 = performance.now();
        const step = (now: number) => {
          if (touched.current) return;
          const p = Math.min(1, (now - t0) / dur);
          const seg = Math.min(keys.length - 2, Math.floor(p * (keys.length - 1)));
          const local = p * (keys.length - 1) - seg;
          const e = local < 0.5 ? 4 * local ** 3 : 1 - (-2 * local + 2) ** 3 / 2;
          apply(keys[seg] + (keys[seg + 1] - keys[seg]) * e);
          if (p < 1) tween.current = requestAnimationFrame(step);
          else commit();
        };
        tween.current = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (tween.current) cancelAnimationFrame(tween.current);
    };
  }, [hint]);

  return (
    <div
      ref={root}
      style={{ "--pos": "50%", touchAction: "pan-y" } as CSSProperties}
      className="group/cmp relative h-full w-full cursor-ew-resize select-none overflow-hidden bg-charcoal"
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        stopHint();
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        if (e.pointerType === "mouse") fromClientX(e.clientX); // touch moves only on sideways drag
      }}
      onPointerMove={(e) => dragging.current && fromClientX(e.clientX)}
      onPointerUp={() => {
        dragging.current = false;
        commit();
      }}
      onPointerCancel={() => {
        dragging.current = false;
        commit();
      }}
    >
      {/* After (full) */}
      <PhotoFrame
        photo={after}
        label="After photo"
        bare
        tone="warm"
        className="absolute inset-0 h-full w-full"
        sizes="(min-width: 1024px) 55vw, 100vw"
        priority={priority}
        imgClassName="pointer-events-none"
      />
      {/* Before (clipped to the left of the handle) */}
      <div className="absolute inset-0 [clip-path:inset(0_calc(100%-var(--pos))_0_0)]">
        <PhotoFrame
          photo={before}
          label="Before photo"
          bare
          className="absolute inset-0 h-full w-full"
          sizes="(min-width: 1024px) 55vw, 100vw"
          priority={priority}
          imgClassName="pointer-events-none"
        />
      </div>

      <span className="pointer-events-none absolute left-4 top-4 z-10 bg-ink/70 px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.3em] text-ivory backdrop-blur">
        Before
      </span>
      <span className="pointer-events-none absolute right-4 top-4 z-10 bg-gold px-3 py-1.5 text-[0.6rem] uppercase tracking-[0.3em] text-ink">
        After
      </span>

      {/* Divider + handle */}
      <div className="pointer-events-none absolute inset-y-0 left-[var(--pos)] z-10 w-px -translate-x-1/2 bg-gold shadow-[0_0_18px_rgba(201,169,110,0.6)]" />
      <button
        type="button"
        role="slider"
        aria-label={`Compare before and after: ${label}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pos}
        aria-valuetext={`${pos}% before photo visible`}
        onKeyDown={(e) => {
          const big = e.shiftKey ? 10 : 5;
          const map: Record<string, number> = {
            ArrowLeft: posRef.current - big,
            ArrowDown: posRef.current - big,
            ArrowRight: posRef.current + big,
            ArrowUp: posRef.current + big,
            Home: 0,
            End: 100,
          };
          if (e.key in map) {
            e.preventDefault();
            stopHint();
            apply(map[e.key]);
            commit();
          }
        }}
        className="absolute left-[var(--pos)] top-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-ink/75 text-gold backdrop-blur-md transition-transform duration-300 ease-luxe group-active/cmp:scale-90"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
          <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
