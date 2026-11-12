export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className} fill="none">
      <circle cx="24" cy="24" r="22.5" stroke="currentColor" strokeWidth="1" opacity=".55" />
      <text
        x="24"
        y="30.5"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), serif"
        fontSize="20"
        fontWeight="500"
        letterSpacing="0.5"
        fill="currentColor"
      >
        PL
      </text>
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <Monogram className="h-10 w-10 shrink-0 text-gold" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] tracking-[0.14em] text-ivory">PERFECT LOOK</span>
        {!compact && (
          <span className="mt-1 text-[0.58rem] uppercase tracking-[0.34em] text-mist">
            Hair Wig House · Mathura
          </span>
        )}
      </span>
    </span>
  );
}
