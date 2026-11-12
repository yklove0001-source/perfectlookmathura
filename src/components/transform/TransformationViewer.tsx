"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { CompareSlider } from "./CompareSlider";
import { Icon } from "@/components/ui/Icon";
import type { TransformationPhotos } from "@/lib/photos";

const two = (n: number) => String(n).padStart(2, "0");

export function TransformationViewer({
  items,
  heading,
}: {
  items: TransformationPhotos[];
  heading: ReactNode;
}) {
  const [i, setI] = useState(0);
  const count = items.length;
  const current = items[i];
  const go = (d: number) => setI((v) => (v + d + count) % count);

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">{heading}</div>

      <div data-reveal="image" className="lg:col-span-6 lg:col-start-7 lg:row-span-2">
        <div
          key={i}
          className="aspect-[4/5] w-full animate-[fade-rise_0.9s_var(--ease-luxe)_both] sm:aspect-square"
        >
          <CompareSlider
            before={current?.before}
            after={current?.after}
            label={current?.label ?? "example"}
            hint={i === 0}
          />
        </div>
      </div>

      <div data-reveal="up" className="lg:col-span-5 lg:self-end">
        {count > 0 ? (
          <>
            <div className="flex items-center justify-between border-y border-line py-5">
              <p className="font-display text-title text-ivory">
                <span className="mr-4 font-sans text-[0.65rem] tracking-[0.3em] text-gold">
                  {two(i + 1)} / {two(count)}
                </span>
                {current.label}
              </p>
              {count > 1 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous transformation"
                    className="flex h-11 w-11 items-center justify-center border border-line text-ivory transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon name="arrow" className="h-4 w-4 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next transformation"
                    className="flex h-11 w-11 items-center justify-center border border-line text-ivory transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon name="arrow" className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            {count > 1 && (
              <ul className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-5" aria-label="Choose a transformation">
                {items.map((t, n) => (
                  <li key={t.after.src}>
                    <button
                      type="button"
                      onClick={() => setI(n)}
                      aria-pressed={n === i}
                      aria-label={`Show ${t.label}`}
                      className={`relative block aspect-square w-full overflow-hidden border transition-all duration-500 ${
                        n === i ? "border-gold" : "border-line opacity-55 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={t.after.src}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={t.after.blurDataURL}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="border-y border-line py-5 text-sm leading-7 text-mist">
            Genuine before &amp; after photos from our customers will appear here soon. The slider shows
            how it works — drag the handle to compare.
          </p>
        )}
        <p className="mt-6 text-xs leading-6 text-mist/80">
          Photos are shared with our customers&apos; permission. Individual results vary.
        </p>
      </div>
    </div>
  );
}
