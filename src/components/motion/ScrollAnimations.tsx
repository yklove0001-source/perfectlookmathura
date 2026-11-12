"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Declarative scroll animations. Components opt in with data attributes:
 *
 *   data-reveal="up"       fade + rise
 *   data-reveal="stagger"  children fade + rise one after another
 *   data-split="words|blur|clip|chars|scatter|scrub"  split-text headings (see components/type/split.tsx)
 *   data-type-scale        large heading settles from a slightly smaller scale while scrolling in
 *   data-reveal="image"    curtain reveal (+ inner [data-reveal-zoom] settles)
 *   data-reveal="line"     gold rule draws from the left
 *   data-parallax="6"      drifts ±6% while scrolling past
 *   data-timeline / data-timeline-line / data-step   "How it works" line
 *   data-hero-content      hero text eases away on scroll
 *   data-magnetic          button gently follows the cursor (desktop)
 *   data-tilt              card tilts in 3D toward the cursor (desktop)
 *   data-marquee="1|-1"    endless ticker; speeds up and follows scroll direction
 *   data-progress          page scroll progress bar
 *   data-fill              outlined wordmark fills with gold while scrolling
 *
 * Hidden start states live in globals.css under `.js`, so nothing flashes.
 */
const EASE = "expo.out";

export function ScrollAnimations() {
  useGSAP(
    () => {
      const html = document.documentElement;
      html.classList.add("anim-ready");
      const all = (sel: string) => gsap.utils.toArray<HTMLElement>(sel);

      const done = (el: HTMLElement, clear = "opacity,transform,clipPath") => {
        el.classList.add("is-in");
        gsap.set(el, { clearProps: clear });
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        all("[data-reveal], [data-split]").forEach((el) => el.classList.add("is-in"));
        document.querySelectorAll(".emph").forEach((el) => el.classList.add("is-lit"));
        return;
      }

      /**
       * One-shot trigger. We deliberately avoid ScrollTrigger's `once: true`: when a page
       * opens part-way down (e.g. "/#book" or a reload), already-passed triggers would
       * kill themselves *during* ScrollTrigger's refresh loop and corrupt it. Instead the
       * trigger fires once and is removed on the next frame.
       */
      const onReach = (el: HTMLElement, start: string, play: () => void) => {
        let fired = false;
        const fire = (st: ScrollTrigger) => {
          if (fired) return;
          fired = true;
          play();
          requestAnimationFrame(() => st.kill());
        };
        ScrollTrigger.create({
          trigger: el,
          start,
          // Reveal however the visitor arrives: scrolling down onto it, jumping past it
          // (menu link / fast fling), or scrolling back up into it from below.
          onEnter: fire,
          onLeave: fire,
          onEnterBack: fire,
        });
      };

      // Fade + rise — elements arriving in the same frame stagger together
      let queue: HTMLElement[] = [];
      let queued = false;
      const flushUp = () => {
        queued = false;
        const batch = queue;
        queue = [];
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: EASE,
          stagger: 0.09,
          onComplete: () => batch.forEach((el) => done(el)),
        });
      };
      all('[data-reveal="up"]:not(.is-in)').forEach((el) =>
        onReach(el, "top 90%", () => {
          queue.push(el);
          if (!queued) {
            queued = true;
            requestAnimationFrame(flushUp);
          }
        }),
      );

      all('[data-reveal="stagger"]:not(.is-in)').forEach((group) => {
        const kids = Array.from(group.children) as HTMLElement[];
        onReach(group, "top 88%", () =>
          gsap.to(kids, {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: EASE,
            stagger: 0.08,
            onComplete: () => {
              kids.forEach((k) => gsap.set(k, { clearProps: "opacity,transform" }));
              done(group);
            },
          }),
        );
      });

      /* ---------- Split-text typography ---------- */
      const small = window.innerWidth < 768;
      // Deterministic pseudo-random so the scatter looks designed, not chaotic
      const rand = (i: number, salt: number) => {
        const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
        return x - Math.floor(x);
      };
      const splitReveal = (
        variant: string,
        targets: string,
        start: string,
        from: gsap.TweenVars,
        to: gsap.TweenVars,
        clear: string,
      ) => {
        all(`[data-split="${variant}"]:not(.is-in)`).forEach((el) => {
          const items = el.querySelectorAll<HTMLElement>(targets);
          onReach(el, start, () =>
            gsap.fromTo(items, from, {
              ...to,
              onComplete: () => {
                gsap.set(items, { clearProps: clear });
                done(el);
              },
            }),
          );
        });
      };

      // Words rise out of a mask with a slight tilt
      splitReveal(
        "words",
        ".split-wi",
        "top 88%",
        { yPercent: 115, rotate: 5 },
        { yPercent: 0, rotate: 0, duration: 1.35, ease: EASE, stagger: 0.07 },
        "transform",
      );
      // Words sharpen from a soft blur
      splitReveal(
        "blur",
        ".split-wi",
        "top 85%",
        { opacity: 0, filter: "blur(12px)", y: 16 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1.5, ease: "power3.out", stagger: 0.09 },
        "opacity,filter,transform",
      );
      // Words wipe in from the left
      splitReveal(
        "clip",
        ".split-wi",
        "top 86%",
        { clipPath: "inset(0% 100% 0% 0%)", x: -10 },
        { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 1.25, ease: "expo.inOut", stagger: 0.1 },
        "clipPath,transform",
      );
      // Letters flip up from below
      splitReveal(
        "chars",
        ".split-c",
        "top 88%",
        { opacity: 0, yPercent: 110, rotateX: -85, transformOrigin: "50% 100%" },
        { opacity: 1, yPercent: 0, rotateX: 0, duration: 1.15, ease: EASE, stagger: 0.03 },
        "opacity,transform",
      );
      // Letters arrive from different directions and settle into place
      const spread = small ? 0.45 : 1;
      splitReveal(
        "scatter",
        ".split-c",
        "top 80%",
        {
          opacity: 0,
          x: (i: number) => (rand(i, 1) - 0.5) * 220 * spread,
          y: (i: number) => (rand(i, 2) - 0.5) * 160 * spread,
          rotate: (i: number) => (rand(i, 3) - 0.5) * 50,
          rotateY: (i: number) => (rand(i, 4) - 0.5) * 120,
          z: (i: number) => -120 - rand(i, 5) * 260,
          filter: "blur(10px)",
          transformPerspective: 700,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          rotateY: 0,
          z: 0,
          filter: "blur(0px)",
          duration: 1.8,
          ease: EASE,
          stagger: { each: 0.035, from: "center" },
        },
        "opacity,transform,filter",
      );

      // Statement: words light up progressively with scroll; key words turn gold
      all('[data-split="scrub"]').forEach((el) => {
        const words = el.querySelectorAll<HTMLElement>(".split-wi");
        gsap.fromTo(
          words,
          { opacity: 0.4 }, // still readable (≥3:1 contrast) before it lights up
          {
            opacity: 1,
            ease: "none",
            stagger: 0.12,
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 48%", scrub: 0.6 },
          },
        );
        el.querySelectorAll<HTMLElement>(".emph").forEach((em) =>
          ScrollTrigger.create({
            trigger: em,
            start: "top 54%", // a moment after the word itself has lit up
            onEnter: () => em.classList.add("is-lit"),
            onLeaveBack: () => em.classList.remove("is-lit"),
          }),
        );
      });

      // Large typography settles from a slightly smaller, lower position
      all("[data-type-scale]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.9, y: 40 },
          {
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "center 55%", scrub: 0.8 },
          },
        );
      });

      all('[data-reveal="image"]:not(.is-in)').forEach((el) => {
        const zoom = el.querySelector<HTMLElement>("[data-reveal-zoom]");
        onReach(el, "top 85%", () => {
          const tl = gsap.timeline({
            onComplete: () => {
              if (zoom) gsap.set(zoom, { clearProps: "scale" });
              done(el);
            },
          });
          tl.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
          );
          if (zoom) tl.fromTo(zoom, { scale: 1.25 }, { scale: 1, duration: 2, ease: EASE }, 0);
        });
      });

      all('[data-reveal="line"]:not(.is-in)').forEach((el) => {
        onReach(el, "top 92%", () =>
          gsap.fromTo(
            el,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 1.4, ease: EASE, onComplete: () => done(el) },
          ),
        );
      });

      // Parallax drift
      all("[data-parallax]").forEach((el) => {
        const amt = Number(el.dataset.parallax) || 6;
        gsap.fromTo(
          el,
          { yPercent: -amt },
          {
            yPercent: amt,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      // Hero text eases away as the visitor scrolls on
      const hero = document.querySelector<HTMLElement>("[data-hero-content]");
      if (hero) {
        gsap.to(hero, {
          y: -90,
          opacity: 0.1,
          ease: "none",
          scrollTrigger: { trigger: hero.closest("section"), start: "top top", end: "bottom top", scrub: true },
        });
      }

      // "How it works": gold line draws with scroll; steps light up as it passes
      all("[data-timeline]").forEach((tl) => {
        const line = tl.querySelector<HTMLElement>("[data-timeline-line]");
        if (line) {
          gsap.fromTo(
            line,
            { scaleY: 0, transformOrigin: "top center" },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: tl, start: "top 65%", end: "bottom 65%", scrub: 0.6 },
            },
          );
        }
        tl.querySelectorAll<HTMLElement>("[data-step]").forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 65%",
            onEnter: () => step.classList.add("is-active"),
            onLeaveBack: () => step.classList.remove("is-active"),
          });
        });
      });

      const cleanups: (() => void)[] = [];

      // Page progress bar
      const bar = document.querySelector<HTMLElement>("[data-progress]");
      if (bar) {
        gsap.to(bar, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 },
        });
      }

      // Endless tickers: base speed, boosted by scroll velocity, flipping with direction
      const tickers = all("[data-marquee]").map((track) => {
        const dir = Number(track.dataset.marquee) || 1;
        const tween = gsap.fromTo(
          track,
          { xPercent: dir > 0 ? 0 : -50 },
          { xPercent: dir > 0 ? -50 : 0, duration: 38, ease: "none", repeat: -1 },
        );
        return tween;
      });
      if (tickers.length) {
        let flip = 1;
        let settle: gsap.core.Tween | undefined;
        ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const v = self.getVelocity();
            flip = self.direction;
            const boost = 1 + Math.min(Math.abs(v) / 450, 5);
            tickers.forEach((t) => gsap.to(t, { timeScale: boost * flip, duration: 0.25, overwrite: true }));
            settle?.kill();
            settle = gsap.delayedCall(0.25, () =>
              tickers.forEach((t) => gsap.to(t, { timeScale: flip, duration: 1.2, ease: "power2.out", overwrite: true })),
            );
          },
        });
        all(".marquee-star").forEach((star) => gsap.to(star, { rotate: 360, duration: 9, ease: "none", repeat: -1 }));
      }

      // Outlined wordmark fills with gold as it scrolls into view
      all("[data-fill]").forEach((el) => {
        gsap.fromTo(
          el,
          { "--fill": "0%" },
          {
            "--fill": "100%",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 95%", end: "bottom 70%", scrub: 0.6 },
          },
        );
      });

      // Magnetic buttons (mouse / trackpad only)
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        all("[data-magnetic]").forEach((el) => {
          const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
          const move = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
          };
          const leave = () => {
            xTo(0);
            yTo(0);
          };
          el.addEventListener("mousemove", move);
          el.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            el.removeEventListener("mousemove", move);
            el.removeEventListener("mouseleave", leave);
          });
        });
      }

      // 3D tilt toward the cursor (mouse / trackpad only)
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        all("[data-tilt]").forEach((el) => {
          gsap.set(el, { transformPerspective: 900 });
          const rxTo = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3" });
          const ryTo = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3" });
          const glare = el.querySelector<HTMLElement>("[data-tilt-glare]");
          const move = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            ryTo(px * 9);
            rxTo(-py * 9);
            if (glare) {
              glare.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
              glare.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
              glare.style.opacity = "1";
            }
          };
          const leave = () => {
            rxTo(0);
            ryTo(0);
            if (glare) glare.style.opacity = "0";
          };
          el.addEventListener("mousemove", move);
          el.addEventListener("mouseleave", leave);
          cleanups.push(() => {
            el.removeEventListener("mousemove", move);
            el.removeEventListener("mouseleave", leave);
          });
        });
      }

      // Keep trigger positions correct when content above changes height (fonts, photos, filters)
      let raf = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      });
      ro.observe(document.body);

      return () => {
        cleanups.forEach((fn) => fn());
        ro.disconnect();
        cancelAnimationFrame(raf);
      };
    },
    { dependencies: [] },
  );

  return null;
}
