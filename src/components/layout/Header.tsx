"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { navLinks, telLink, whatsappLink, business } from "@/lib/site";
import { lockScroll } from "@/lib/scroll";
import { RollText } from "@/components/type/split";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  // Solid background after scrolling; hide when scrolling down, reappear when scrolling up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 160);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll and allow Escape to close while the mobile menu is open
  // While open, keyboard and screen-reader focus stays inside the menu (page behind is inert)
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const behind = [document.getElementById("main"), document.querySelector("footer")];
    behind.forEach((el) => el?.setAttribute("inert", ""));
    menu.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      behind.forEach((el) => el?.removeAttribute("inert"));
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[translate,background-color,border-color,backdrop-filter] duration-700 ease-luxe ${
        hidden && !open ? "-translate-y-full" : ""
      } ${
        scrolled && !open
          ? "border-b border-line/70 bg-ink/75 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:h-22 lg:px-12">
        <Link href="/#top" aria-label="Perfect Look Hair Wig House · Mathura — home" className="relative z-[60]">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-label={l.label}
                  className="text-[0.72rem] uppercase tracking-[0.24em] text-ivory/80 hover:text-ivory"
                >
                  <RollText>{l.label}</RollText>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a href={telLink} className="link-underline hidden pb-1 text-[0.78rem] xl:inline tracking-[0.08em] text-mist hover:text-ivory">
            {business.phoneDisplay}
          </a>
          <Link
            href="/#book"
            className="inline-flex h-11 items-center border border-gold/60 px-5 text-[0.7rem] uppercase tracking-[0.24em] text-gold transition-colors duration-500 hover:bg-gold hover:text-ink"
          >
            Book Consultation
          </Link>
        </div>

        <button
          ref={toggle}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="relative z-[60] -mr-2 flex h-12 w-12 items-center justify-center lg:hidden"
        >
          <span className="relative block h-3 w-7">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-ivory transition-transform duration-500 ease-luxe ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 right-0 h-px bg-gold transition-all duration-500 ease-luxe ${
                open ? "w-full -translate-y-1.5 -rotate-45 bg-ivory" : "w-4"
              }`}
            />
          </span>
        </button>
      </div>
    </header>

      {/* Mobile menu — sibling of header so the header's backdrop-filter can't trap it */}
      <div
        ref={menu}
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col bg-ink px-5 pb-10 pt-28 sm:px-8 lg:hidden"
      >
        <nav aria-label="Mobile">
          <ol className="flex flex-col">
            {navLinks.map((l, i) => (
              <li
                key={l.href}
                data-menu-item
                style={{ "--i": i } as React.CSSProperties}
                className="border-b border-line"
              >
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-5 py-5 font-display text-4xl text-ivory"
                >
                  <span className="font-sans text-[0.65rem] tracking-[0.3em] text-gold">0{i + 1}</span>
                  {l.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div data-menu-item style={{ "--i": 6 } as React.CSSProperties} className="mt-auto hidden grid-cols-2 gap-3 md:grid">
          <a href={telLink} className="flex h-13 items-center justify-center gap-2 border border-line text-[0.72rem] uppercase tracking-[0.2em]">
            <Icon name="phone" className="h-4 w-4 text-gold" /> Call
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-13 items-center justify-center gap-2 bg-gold text-[0.72rem] uppercase tracking-[0.2em] text-ink"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
