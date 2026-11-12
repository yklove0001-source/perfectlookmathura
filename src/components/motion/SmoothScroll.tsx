"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToElement, setLenis } from "@/lib/scroll";

/**
 * Silky wheel scrolling (Lenis) kept in sync with GSAP ScrollTrigger,
 * plus smooth gliding for same-page links like "/#services".
 * Disabled for visitors who prefer reduced motion; touch scrolling stays native.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  // Arriving with a #hash (shared link, or from another page): the browser's own jump can be
  // a little off while reveal animations are still offset, so settle precisely afterwards.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = window.setTimeout(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) scrollToElement(el);
    }, 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, autoRaf: false });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tick = (t: number) => lenis?.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("data-native")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      window.history.pushState(window.history.state, "", url.hash);
      // If a menu is closing (scroll locked), wait a moment for it to release
      const locked = document.documentElement.style.overflow === "hidden";
      window.setTimeout(() => scrollToElement(el), locked ? 90 : 0);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
