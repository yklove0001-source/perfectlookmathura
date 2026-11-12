/**
 * Branded share image (WhatsApp / Facebook / X previews), rendered at build time.
 */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { business } from "./site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const dir = join(process.cwd(), "src/assets/fonts");
// Read once at module scope so share images are generated statically at build time
const [serif, serifItalic, sans] = await Promise.all([
  readFile(join(dir, "CormorantGaramond-Regular.ttf")),
  readFile(join(dir, "CormorantGaramond-Italic.ttf")),
  readFile(join(dir, "Manrope-Medium.ttf")),
]);

const GOLD = "#C9A96E";

/** Flowing gold strands (same motif as the hero). */
function strands() {
  const paths: { d: string; w: number; o: number }[] = [];
  for (let i = 0; i < 34; i++) {
    const t = i / 34;
    const y0 = 40 + t * 560;
    const amp = 60 + Math.sin(i * 1.7) * 35;
    const drift = Math.cos(i * 0.9) * 50;
    paths.push({
      d: `M 380 ${y0.toFixed(1)} C 620 ${(y0 - amp).toFixed(1)}, 760 ${(y0 + amp + drift).toFixed(1)}, 940 ${(y0 - 10 + drift / 2).toFixed(1)} S 1180 ${(y0 - amp).toFixed(1)}, 1260 ${(y0 + 40 - drift).toFixed(1)}`,
      w: i % 7 === 0 ? 1.6 : 0.8,
      o: 0.12 + ((i * 37) % 50) / 100,
    });
  }
  return paths;
}

/** `title` may be several lines; `accent` (gold italic) continues the last line. */
export function renderOgImage({ eyebrow, title, accent }: { eyebrow: string; title: string | string[]; accent?: string }) {
  const lines = Array.isArray(title) ? title : [title];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#090909",
          color: "#F5F1EA",
          fontFamily: "Manrope",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "radial-gradient(circle at 78% 38%, rgba(201,169,110,0.26), rgba(9,9,9,0) 55%)",
          }}
        />
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          {strands().map((p, i) => (
            <path key={i} d={p.d} fill="none" stroke={GOLD} strokeWidth={p.w} strokeOpacity={p.o} />
          ))}
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "linear-gradient(90deg, #090909 0%, rgba(9,9,9,0.92) 42%, rgba(9,9,9,0.1) 100%)",
          }}
        />

        <div style={{ position: "relative", display: "flex", flexDirection: "column", padding: "64px 72px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 64,
                border: `1.5px solid ${GOLD}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Cormorant",
                fontSize: 28,
                color: GOLD,
              }}
            >
              PL
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "Cormorant", fontSize: 30, letterSpacing: 5 }}>PERFECT LOOK</div>
              <div style={{ fontSize: 13, letterSpacing: 5, color: "#A39E95" }}>HAIR WIG HOUSE · MATHURA</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 16, letterSpacing: 6, color: GOLD }}>
              <div style={{ width: 48, height: 1.5, background: GOLD }} />
              {eyebrow.toUpperCase()}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 22,
                fontFamily: "Cormorant",
                fontSize: 84,
                lineHeight: 1.04,
              }}
            >
              {lines.map((line, i) => (
                <div key={i} style={{ display: "flex" }}>
                  {line}
                  {accent && i === lines.length - 1 && (
                    <span style={{ fontFamily: "Cormorant Italic", color: GOLD, marginLeft: 22 }}>{accent}</span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", marginTop: 34, fontSize: 20, letterSpacing: 2, color: "#A39E95" }}>
              {business.phoneDisplay} · Goverdhan Chauraha, Mathura
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Cormorant", data: serif, style: "normal", weight: 400 },
        { name: "Cormorant Italic", data: serifItalic, style: "italic", weight: 400 },
        { name: "Manrope", data: sans, style: "normal", weight: 500 },
      ],
    },
  );
}
