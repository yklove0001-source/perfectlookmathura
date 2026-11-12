/**
 * Slow floating light orbs behind a section. Pure CSS transforms on soft radial
 * gradients (no blur filter) so it stays cheap on phones. Decorative only.
 */
export function Ambient({ variant = "a" }: { variant?: "a" | "b" }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className={`ambient-orb ambient-1 ${variant === "b" ? "left-[60%] top-[8%]" : "left-[-10%] top-[12%]"}`} />
      <span className={`ambient-orb ambient-2 ${variant === "b" ? "left-[-8%] top-[55%]" : "left-[65%] top-[50%]"}`} />
      <span className="ambient-orb ambient-3 left-[30%] top-[85%]" />
    </div>
  );
}
