"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { business, telLink, whatsappLink } from "@/lib/site";

/** Friendly fallback if something unexpected breaks while showing a page. */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[100svh] items-center bg-ink py-32">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-6 max-w-[18ch] text-display text-ivory">Sorry — this page didn&apos;t load properly.</h1>
        <p className="mt-6 max-w-md text-lead text-mist">
          Please try again. You can always reach us directly on {business.phoneDisplay}.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex min-h-12 items-center justify-center bg-gold px-7 text-[0.78rem] font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold-soft"
          >
            Try again
          </button>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center gap-3 border border-gold/60 px-7 text-[0.78rem] uppercase tracking-[0.22em] text-ivory hover:border-gold"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
          <a href={telLink} className="inline-flex min-h-12 items-center px-2 text-[0.78rem] uppercase tracking-[0.22em] text-mist hover:text-ivory">
            Call us
          </a>
        </div>
      </div>
    </section>
  );
}
