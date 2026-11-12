/**
 * Accessible, server-rendered split text.
 *
 * Text is split into words or characters at render time (no client JS, no layout
 * shift). Screen readers get the full sentence once (sr-only copy); the visual,
 * animated copy is aria-hidden. Nested elements such as <em> accents are preserved.
 *
 * Animation styles are chosen with `variant` and driven by CSS (hero) or by
 * ScrollAnimations (scroll reveals) — see globals.css "TYPOGRAPHY".
 */
import { cloneElement, isValidElement, type CSSProperties, type ElementType, type ReactElement, type ReactNode } from "react";

export type SplitMode = "words" | "chars";
export type SplitVariant = "words" | "blur" | "clip" | "chars" | "scatter" | "scrub";

type Counter = { w: number; c: number };

/** Plain text of any React node (for the screen-reader copy). */
export function plainText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainText).join("");
  if (isValidElement(node)) return plainText((node.props as { children?: ReactNode }).children);
  return "";
}

function splitString(text: string, mode: SplitMode, ctr: Counter, key: string, charClass: string) {
  return text.split(/(\s+)/).map((part, pi) => {
    if (!part) return null;
    if (/^\s+$/.test(part)) return " ";
    const wi = ctr.w++;
    if (mode === "words") {
      return (
        <span key={`${key}-${pi}`} className="split-w">
          <span className="split-wi" style={{ "--i": wi } as CSSProperties}>
            {part}
          </span>
        </span>
      );
    }
    return (
      <span key={`${key}-${pi}`} className="split-w" style={{ "--w": wi } as CSSProperties}>
        {Array.from(part).map((ch, ci) => (
          <span key={ci} className={`split-c ${charClass}`} style={{ "--i": ctr.c++ } as CSSProperties}>
            {ch}
          </span>
        ))}
      </span>
    );
  });
}

/** Split a node tree; a shared counter keeps stagger order continuous across nested elements. */
export function splitNode(
  node: ReactNode,
  mode: SplitMode,
  ctr: Counter = { w: 0, c: 0 },
  key = "s",
  charClass = "",
): ReactNode {
  if (typeof node === "string" || typeof node === "number") return splitString(String(node), mode, ctr, key, charClass);
  if (Array.isArray(node)) return node.map((n, i) => splitNode(n, mode, ctr, `${key}.${i}`, charClass));
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(el, { key: el.key ?? key }, splitNode(el.props.children, mode, ctr, `${key}c`, charClass));
  }
  return node;
}

const HEADING = /^h[1-6]$/;

/**
 * Word splits keep real, readable text (spans between normal spaces) — nothing is
 * duplicated or hidden. Character splits are hidden from assistive tech (letter-by-letter
 * spans can be read oddly) and the full text is given once: as the heading's
 * accessible label, or as a screen-reader-only copy for non-heading elements.
 */
export function SplitText({
  children,
  as: Tag = "span",
  variant = "words",
  className = "",
  id,
}: {
  children: ReactNode;
  as?: ElementType;
  variant?: SplitVariant;
  className?: string;
  id?: string;
}) {
  const chars = variant === "chars" || variant === "scatter";
  if (!chars) {
    return (
      <Tag className={className} id={id}>
        <span data-split={variant} className="split">
          {splitNode(children, "words")}
        </span>
      </Tag>
    );
  }
  const label = plainText(children);
  const isHeading = typeof Tag === "string" && HEADING.test(Tag);
  return (
    <Tag className={className} id={id} aria-label={isHeading ? label : undefined}>
      {!isHeading && <span className="sr-only">{label}</span>}
      <span aria-hidden="true" data-split={variant} className="split">
        {splitNode(children, "chars")}
      </span>
    </Tag>
  );
}

/**
 * Hover "roll": the label slides up and a champagne-gold copy (CSS ::after,
 * no duplicate text in the page) rolls in. Decorative — give the parent link an aria-label.
 */
export function RollText({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`roll ${className}`}>
      <span className="roll-c" data-c={children}>
        {children}
      </span>
    </span>
  );
}
