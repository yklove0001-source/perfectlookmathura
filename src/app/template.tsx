"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LazyMotion, domAnimation, m } from "motion/react";
import { ScrollAnimations } from "@/components/motion/ScrollAnimations";

let firstRender = true;

/**
 * Page transition: on every navigation after the first page load, a gold line
 * sweeps across the top while the new page fades and rises in.
 * The very first load is never hidden, so content appears instantly.
 */
export default function Template({ children }: { children: ReactNode }) {
  const [isFirst] = useState(() => firstRender);
  useEffect(() => {
    firstRender = false;
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      {!isFirst && (
        <m.div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gold"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ scaleX: { duration: 0.8, ease: [0.65, 0, 0.35, 1] }, opacity: { delay: 0.7, duration: 0.5 } }}
        />
      )}
      <m.div
        initial={isFirst ? false : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </m.div>
      <ScrollAnimations />
    </LazyMotion>
  );
}
