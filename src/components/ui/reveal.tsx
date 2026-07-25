import type { ReactNode } from "react";

/** Scroll-reveal wrappers backed by pure CSS scroll-driven animations
 *  (see `.reveal` in globals.css). Server components — zero JS hydration.
 *  Falls back to fully-visible content where `animation-timeline` is
 *  unsupported or under reduced-motion. */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  /** kept for API compatibility; CSS handles per-element timing */
  delay?: number;
}) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

export function RevealGroup({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function RevealItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`reveal ${className}`}>{children}</div>;
}
