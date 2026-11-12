/** Thin gold line along the top edge that fills as the visitor scrolls the page. */
export function ScrollProgress() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]">
      <div data-progress className="h-full origin-left scale-x-0 bg-gradient-to-r from-gold-deep via-gold to-gold-soft shadow-[0_0_10px_rgba(201,169,110,0.6)]" />
    </div>
  );
}
