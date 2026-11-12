"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { HairStrands } from "./HairStrands";
import { GoldDust } from "./GoldDust";
import type { PointerState } from "./colors";

/** Slow cinematic drift + intro dolly + pointer parallax + scroll push-in. */
function CameraRig({ pointer }: { pointer: React.RefObject<PointerState> }) {
  useFrame((state, delta) => {
    const cam = state.camera;
    const t = state.clock.elapsedTime;
    const p = pointer.current;
    const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));

    const tx = p.x * 0.32 + Math.sin(t * 0.12) * 0.22;
    const ty = p.y * 0.2 + Math.cos(t * 0.1) * 0.14 - scroll * 0.5;
    const tz = 6 - scroll * 1.1;
    const k = 1 - Math.exp(-delta * 1.6);
    cam.position.x += (tx - cam.position.x) * k;
    cam.position.y += (ty - cam.position.y) * k;
    cam.position.z += (tz - cam.position.z) * k;
    cam.lookAt(0, -scroll * 0.35, 0);
  });
  return null;
}

/** Tells the page the first frames are on screen, so the canvas can fade in. */
function ReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current++;
    if (frames.current === 3) onReady();
  });
  return null;
}

export default function HeroScene({
  lowPower,
  active,
  pointer,
  onReady,
  onFail,
}: {
  lowPower: boolean;
  active: boolean;
  pointer: React.RefObject<PointerState>;
  onReady: () => void;
  onFail: () => void;
}) {
  return (
    <Canvas
      dpr={lowPower ? [1, 1.5] : [1, 1.75]}
      gl={{
        antialias: !lowPower,
        alpha: true,
        depth: false,
        stencil: false,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 7.6], fov: 35, near: 0.1, far: 50 }}
      frameloop={active ? "always" : "never"}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onFail();
        });
      }}
      style={{ pointerEvents: "none" }}
    >
      <CameraRig pointer={pointer} />
      <HairStrands count={lowPower ? 650 : 1600} segments={lowPower ? 44 : 72} pointer={pointer} />
      <GoldDust count={lowPower ? 90 : 240} />
      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
