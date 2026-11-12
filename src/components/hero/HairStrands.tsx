"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { hairFragment, hairVertex } from "./shaders";
import { hexVec, mulberry32, type PointerState } from "./colors";

function buildHairGeometry(count: number, segments: number) {
  const rnd = mulberry32(1987);
  const perStrand = (segments + 1) * 2;
  const total = count * perStrand;

  const aT = new Float32Array(total);
  const aSide = new Float32Array(total);
  const aSeed = new Float32Array(total * 4);
  const aWidth = new Float32Array(total);
  const index = new Uint32Array(count * segments * 6);

  let v = 0;
  let k = 0;
  for (let i = 0; i < count; i++) {
    // Sum of randoms → dense core with soft, wispy edges (like a real lock of hair)
    const sx = (rnd() + rnd() + rnd()) / 1.5 - 1;
    const sy = (rnd() + rnd() + rnd()) / 1.5 - 1;
    const phase = rnd();
    const bright = Math.pow(rnd(), 3);
    const width = 0.0032 + rnd() * 0.005 + (bright > 0.6 ? 0.002 : 0);

    const base = i * perStrand;
    for (let j = 0; j <= segments; j++) {
      const t = j / segments;
      for (const side of [-1, 1]) {
        aT[v] = t;
        aSide[v] = side;
        aSeed.set([sx, sy, phase, bright], v * 4);
        aWidth[v] = width;
        v++;
      }
    }
    for (let j = 0; j < segments; j++) {
      const a = base + j * 2;
      index.set([a, a + 1, a + 2, a + 1, a + 3, a + 2], k);
      k += 6;
    }
  }

  const g = new THREE.BufferGeometry();
  // Positions are computed in the shader; three.js still requires the attribute.
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(total * 3), 3));
  g.setAttribute("aT", new THREE.BufferAttribute(aT, 1));
  g.setAttribute("aSide", new THREE.BufferAttribute(aSide, 1));
  g.setAttribute("aSeed", new THREE.BufferAttribute(aSeed, 4));
  g.setAttribute("aWidth", new THREE.BufferAttribute(aWidth, 1));
  g.setIndex(new THREE.BufferAttribute(index, 1));
  return g;
}

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function HairStrands({
  count,
  segments,
  pointer,
}: {
  count: number;
  segments: number;
  pointer: React.RefObject<PointerState>;
}) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const start = useRef<number | null>(null);
  const strength = useRef(0);

  const geometry = useMemo(() => buildHairGeometry(count, segments), [count, segments]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uMouseStrength: { value: 0 },
      uWidthScale: { value: 1 },
      uOpacity: { value: 1 },
      uLightDir: { value: new THREE.Vector3(0.5, 0.8, 0.6) },
      uBase: { value: hexVec("#2c2116") },
      uGold: { value: hexVec("#c9a96e") },
      uGoldSoft: { value: hexVec("#f1dfb8") },
    }),
    [],
  );

  useFrame((state, delta) => {
    const m = material.current;
    const g = group.current;
    if (!m || !g) return;
    const u = m.uniforms;
    const t = state.clock.elapsedTime;
    if (start.current === null) start.current = t;

    // Entrance: strands grow in over ~3.5s
    u.uReveal.value = easeOut(Math.min(1, (t - start.current) / 3.5));
    u.uTime.value = t;

    // Slowly travelling key light → highlight glides along the hair
    u.uLightDir.value.set(0.35 + 0.55 * Math.sin(t * 0.18), 0.75 + 0.15 * Math.cos(t * 0.23), 0.65);

    // Responsive placement: right side on landscape screens, top area on phones
    const { width, height } = state.size;
    const aspect = width / height;
    const cam = state.camera as THREE.PerspectiveCamera;
    const halfH = 6 * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const halfW = halfH * aspect;
    const k = THREE.MathUtils.clamp((aspect - 0.5) / 0.8, 0, 1);
    g.scale.setScalar(lerp(0.5, 1, k));
    g.position.set(lerp(-0.55, (halfW - 3.36) * 0.9, k), lerp(0.35, 0, k), 0);
    g.rotation.z = lerp(0.12, 0, k);
    u.uWidthScale.value = lerp(0.85, 1, k);
    // Phones: hair sits behind the headline, so keep it softer
    const baseOpacity = lerp(0.55, 1, k);

    // Pointer: map to world space at the hair's depth, ease toward it
    const p = pointer.current;
    const camHalfH = cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const tx = cam.position.x + p.x * camHalfH * aspect;
    const ty = cam.position.y + p.y * camHalfH;
    const ease = 1 - Math.exp(-delta * 5);
    u.uMouse.value.x += (tx - u.uMouse.value.x) * ease;
    u.uMouse.value.y += (ty - u.uMouse.value.y) * ease;
    const moving = performance.now() - p.last < 1600 ? 0.34 : 0;
    strength.current += (moving - strength.current) * (1 - Math.exp(-delta * 2.5));
    u.uMouseStrength.value = strength.current;

    // Fade gently as the visitor scrolls past the hero
    const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    u.uOpacity.value = baseOpacity * (1 - scroll * 0.7);
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          ref={material}
          vertexShader={hairVertex}
          fragmentShader={hairFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
