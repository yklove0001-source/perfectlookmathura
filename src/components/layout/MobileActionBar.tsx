import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { telLink, whatsappLink } from "@/lib/site";

/** Phones: fixed Call + WhatsApp bar. Desktop: floating WhatsApp button. */
export function MobileActionBar() {
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <a
          href={telLink}
          className="flex h-14 items-center justify-center gap-2 text-[0.72rem] uppercase tracking-[0.2em] text-ivory"
        >
          <Icon name="phone" className="h-4 w-4 text-gold" /> Call Now
        </a>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-14 items-center justify-center gap-2 bg-gold text-[0.72rem] font-medium uppercase tracking-[0.2em] text-ink"
        >
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp
        </a>
      </div>

      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group fixed bottom-8 right-8 z-40 hidden h-14 w-14 items-center justify-center rounded-full border border-gold/50 bg-ink/80 text-gold backdrop-blur-xl transition-all duration-500 ease-luxe hover:scale-105 hover:bg-gold hover:text-ink md:flex"
      >
        <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-gold/30 [animation-duration:3s]" />
        <WhatsAppIcon className="h-6 w-6" />
      </a>
    </>
  );
}
