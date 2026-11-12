/** Client-only capability checks used to decide between the 3D hero and the static fallback. */

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * True only for real, hardware-accelerated WebGL. Software renderers (SwiftShader,
 * llvmpipe — used by some low-end PCs, VMs and testing tools) would make the 3D
 * scene stutter and block the page, so those visitors get the still artwork.
 */
export function hasHardwareWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true })) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext(); // free the test context immediately
    return !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

export function canRender3D() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  if (prefersReducedMotion()) return false;
  // "?3d=force" skips the GPU check (handy for testing on machines without a GPU)
  if (new URLSearchParams(window.location.search).get("3d") === "force") return true;
  return hasHardwareWebGL();
}

/** Phones, tablets and low-core devices get a lighter scene. */
export function isLowPower() {
  const smallOrTouch = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  return smallOrTouch || cores <= 4;
}
