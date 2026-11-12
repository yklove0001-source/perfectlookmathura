import { Icon } from "@/components/ui/Icon";
import { business, directionsUrl, mapEmbedUrl } from "@/lib/site";

/**
 * Google Map (no API key needed), tinted to match the dark/gold design.
 * Loads lazily — only when the visitor scrolls near it.
 */
export function LocationMap() {
  const a = business.address;
  return (
    <div className="relative overflow-hidden border border-line bg-charcoal">
      <iframe
        title={`Map showing ${business.fullName}`}
        src={mapEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="block h-[26rem] w-full border-0 [filter:invert(92%)_hue-rotate(180deg)_saturate(0.35)_brightness(0.95)_contrast(0.92)] md:h-[32rem]"
      />
      {/* Gold tint + edge fade so the map sits inside the design */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_50%,transparent_55%,rgba(9,9,9,0.65)_100%)] mix-blend-multiply" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gold/[0.06] mix-blend-color" />

      <div className="relative border-t border-line bg-ink/90 p-6 backdrop-blur-xl md:absolute md:bottom-6 md:left-6 md:max-w-sm md:border md:p-8">
        <p className="eyebrow">Find us</p>
        <p className="mt-4 font-display text-2xl text-ivory">{business.fullName}</p>
        <address className="mt-3 text-sm not-italic leading-7 text-mist">
          {a.line1}, {a.line2}, {a.locality}, {a.region} {a.postalCode}
        </address>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 bg-gold px-5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-ink transition-colors hover:bg-gold-soft"
          >
            <Icon name="pin" className="h-4 w-4" /> Directions
          </a>
          <a
            href={business.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 border border-gold/60 px-5 text-[0.68rem] uppercase tracking-[0.22em] text-ivory transition-colors hover:border-gold hover:text-gold"
          >
            Open in Google Maps <Icon name="arrowUpRight" className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
