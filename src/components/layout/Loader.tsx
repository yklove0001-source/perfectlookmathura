/**
 * Intro loader. Pure CSS — shown only when the boot script in layout.tsx sets
 * html[data-loader="show"] (at most once every 12 hours, motion allowed).
 * It removes itself automatically, even if JavaScript fails afterwards.
 */
export function Loader() {
  return (
    <div className="pl-loader" aria-hidden>
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 48 48" className="h-24 w-24 text-gold" fill="none">
          <circle className="pl-loader-ring" cx="24" cy="24" r="22.5" stroke="currentColor" strokeWidth="0.6" />
          <text
            className="pl-loader-mark"
            x="24"
            y="30.5"
            textAnchor="middle"
            fontFamily="var(--font-cormorant), serif"
            fontSize="20"
            fontWeight="400"
            fill="currentColor"
          >
            PL
          </text>
        </svg>
        <span className="pl-loader-bar mt-8 block h-px w-32 bg-gold" />
        <p className="pl-loader-name mt-6 text-[0.6rem] uppercase tracking-[0.5em] text-mist">Perfect Look</p>
      </div>
    </div>
  );
}
