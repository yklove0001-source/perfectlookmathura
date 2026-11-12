import * as THREE from "three";

/**
 * Hex → raw RGB vector. Used for shader uniforms so brand colours reach the
 * screen unchanged (THREE.Color would convert them to linear space).
 */
export function hexVec(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

/** Small deterministic random generator, so the scene looks identical on every visit. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type PointerState = { x: number; y: number; last: number };
