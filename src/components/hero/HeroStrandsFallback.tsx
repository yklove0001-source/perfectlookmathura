/**
 * Static, lightweight hair-strand artwork.
 * Used as the hero background until the 3D scene loads, and as the permanent
 * fallback when WebGL is unavailable or the user prefers reduced motion.
 */
function strandPath(i: number, total: number) {
  const t = i / total;
  const y0 = 120 + t * 520;
  const amp = 70 + Math.sin(i * 1.7) * 40;
  const drift = Math.cos(i * 0.9) * 60;
  return `M -80 ${y0.toFixed(1)}
    C 320 ${(y0 - amp).toFixed(1)}, 560 ${(y0 + amp + drift).toFixed(1)}, 860 ${(y0 - 20 + drift / 2).toFixed(1)}
    S 1300 ${(y0 - amp * 1.2).toFixed(1)}, 1680 ${(y0 + 60 - drift).toFixed(1)}`;
}

export function HeroStrandsFallback() {
  const total = 46;
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 800"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="strand" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#c9a96e" stopOpacity="0" />
          <stop offset=".35" stopColor="#dcc497" stopOpacity=".55" />
          <stop offset=".7" stopColor="#c9a96e" stopOpacity=".35" />
          <stop offset="1" stopColor="#9c7f4c" stopOpacity="0" />
        </linearGradient>
        <filter id="soft">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>
      <g filter="url(#soft)" fill="none" stroke="url(#strand)">
        {Array.from({ length: total }, (_, i) => (
          <path
            key={i}
            d={strandPath(i, total)}
            strokeWidth={i % 7 === 0 ? 1.4 : 0.6}
            opacity={0.25 + ((i * 37) % 60) / 100}
          />
        ))}
      </g>
    </svg>
  );
}
