import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

const base =
  "group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-xs px-7 text-[0.78rem] font-medium uppercase tracking-[0.22em] transition-colors duration-500 ease-luxe";

const variants: Record<Variant, string> = {
  primary: "btn-shine bg-gold text-ink hover:bg-gold-soft",
  outline: "border border-gold/60 text-ivory hover:border-gold hover:text-ink",
  ghost: "px-0 text-ivory hover:text-gold",
};

export function Button({
  href,
  children,
  variant = "primary",
  external = false,
  className = "",
  ariaLabel,
  magnetic = false,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  ariaLabel?: string;
  /** Gently follows the cursor on desktop */
  magnetic?: boolean;
}) {
  const inner = (
    <>
      {variant === "outline" && (
        <span
          aria-hidden
          className="absolute inset-0 -z-0 origin-left scale-x-0 bg-gold transition-transform duration-700 ease-luxe group-hover:scale-x-100"
        />
      )}
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </>
  );
  const cls = `${base} ${variants[variant]} ${className}`;
  const mag = magnetic ? { "data-magnetic": "" } : {};

  // Internal routes use Next.js Link for instant client-side navigation
  if (href.startsWith("/")) {
    return (
      <Link href={href} aria-label={ariaLabel} className={cls} {...mag}>
        {inner}
      </Link>
    );
  }
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={cls}
      {...mag}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </a>
  );
}
