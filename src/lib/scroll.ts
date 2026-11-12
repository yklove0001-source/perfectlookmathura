import type Lenis from "lenis";

/** Shared access to the smooth-scroll engine (set by <SmoothScroll />). */
let lenis: Lenis | null = null;
let locks = 0;


export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Lock page scrolling (menus, photo viewer). Calls are counted, so nested locks are safe. */
export function lockScroll(lock: boolean) {
  locks = Math.max(0, locks + (lock ? 1 : -1));
  const on = locks > 0;
  document.documentElement.style.overflow = on ? "hidden" : "";
  if (on) lenis?.stop();
  else lenis?.start();
}

/** Room left for the fixed header — matches `scroll-padding-top` in globals.css. */
const HEADER_SPACE = 80;

/** Document position from layout (offsetTop), so in-progress reveal transforms don't skew it. */
function layoutTop(el: HTMLElement) {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

export function scrollToElement(el: HTMLElement) {
  if (lenis) {
    lenis.resize(); // page height may have just changed (e.g. after navigating here)
    lenis.scrollTo(Math.max(0, layoutTop(el) - HEADER_SPACE), { duration: 1.5, force: true });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
