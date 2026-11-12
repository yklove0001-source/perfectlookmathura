"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { dustFragment, dustVertex } from "./shaders";
import { hexVec, mulberry32 } from "./colors";

export function GoldDust({ count }: { count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const start = useRef<number | null>(null);

  const geometry = useMemo(() => {
    const rnd = mulberry32(42);
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      pos.set([(rnd() - 0.5) * 9, (rnd() - 0.5) * 6.5, (rnd() - 0.5) * 5], i * 3);
      seed.set([rnd(), rnd(), rnd(), rnd()], i * 4);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uPixelRatio: { value: 1 },
      uGold: { value: hexVec("#dcc497") },
    }),
    [],
  );

  useFrame((state) => {
    const m = material.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    if (start.current === null) start.current = t;
    m.uniforms.uTime.value = t;
    m.uniforms.uReveal.value = Math.min(1, (t - start.current) / 2.5);
    m.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
