"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { HeroStrandsFallback } from "./HeroStrandsFallback";
import { canRender3D, isLowPower } from "@/lib/device";
import type { PointerState } from "./colors";

// Three.js is only downloaded when the device can actually use it.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HeroBackdrop() {
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerState>({ x: 0, y: 0, last: -1e9 });
  const [enabled, setEnabled] = useState(false);
  const [lowPower, setLowPower] = useState(true);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(true);

  // Decide on 3D after the page has painted, so text appears instantly.
  useEffect(() => {
    if (!canRender3D()) return;
    // If the intro loader is playing, start the 3D scene just as it lifts away
    const delay = document.documentElement.dataset.loader === "show" ? 1100 : 0;
    let timer = 0;
    const go = () => {
      timer = window.setTimeout(() => {
        setLowPower(isLowPower());
        setEnabled(true);
      }, delay);
    };
    let idle = 0;
    // Safari lacks requestIdleCallback — fall back to a short timeout there
    if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(go, { timeout: 1200 });
    else timer = setTimeout(go, 500) as unknown as number;
    return () => {
      if (idle) window.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
    };
  }, []);

  // Pointer / touch tracking for parallax and strand interaction
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.current.last = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, [enabled]);

  // Stop rendering entirely when the hero is scrolled out of view (saves battery)
  useEffect(() => {
    const el = root.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  const fail = () => {
    setEnabled(false);
    setReady(false);
  };

  return (
    <div ref={root} aria-hidden className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_72%_32%,rgba(201,169,110,0.15),transparent_70%)] max-md:bg-[radial-gradient(90%_45%_at_50%_25%,rgba(201,169,110,0.16),transparent_70%)]" />

      {/* Static fallback — always rendered first; fades out once 3D is on screen */}
      <div
        className={`absolute inset-0 transition-opacity duration-[2000ms] ease-luxe [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_70%,transparent)] ${
          ready ? "opacity-0" : "opacity-90"
        }`}
      >
        <HeroStrandsFallback />
      </div>

      {enabled && (
        <div
          className={`absolute inset-0 transition-opacity duration-[2400ms] ease-luxe ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <SceneBoundary onError={fail}>
            <HeroScene
              lowPower={lowPower}
              active={active}
              pointer={pointer}
              onReady={() => setReady(true)}
              onFail={fail}
            />
          </SceneBoundary>
        </div>
      )}

      {/* Legibility gradients over the scene */}
      <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgba(9,9,9,0.85),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#090909_6%,rgba(9,9,9,0.6)_40%,rgba(9,9,9,0)_75%)]" />
      <div className="absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(9,9,9,0.75)_0%,rgba(9,9,9,0.25)_45%,transparent_70%)] lg:block" />
    </div>
  );
}
