"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type CtaButtonProps = {
  children: ReactNode;
  /** anchor target (e.g. "#comprar"). Ignored when onClick is provided. */
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** pulse ring — reserve for the single primary conversion action */
  pulse?: boolean;
  className?: string;
};

const spring = { type: "spring" as const, stiffness: 320, damping: 22 };

/** Primary red CTA. Hover lift + active push (tactile). Pulse motivated:
 *  keeps attention on the one conversion action. FASE 3 wires onClick. */
export function CtaButton({
  children,
  href,
  onClick,
  disabled,
  loading,
  pulse,
  className = "",
}: CtaButtonProps) {
  const reduce = useReducedMotion();

  const base =
    "group inline-flex items-center justify-center gap-2.5 rounded-full " +
    "bg-accent-red-cta px-8 py-4 text-base font-semibold text-white " +
    "shadow-[0_10px_30px_-8px_rgba(255,59,48,0.6)] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-red " +
    "focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 " +
    (pulse && !reduce ? "cta-pulse " : "") +
    className;

  const motionProps = reduce
    ? {}
    : {
        whileHover: { y: -2, scale: 1.02 },
        whileTap: { scale: 0.97, y: 0 },
        transition: spring,
      };

  const label = (
    <>
      {loading && (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
        />
      )}
      <span>{children}</span>
    </>
  );

  if (onClick || disabled || loading) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={base}
        {...motionProps}
      >
        {label}
      </motion.button>
    );
  }

  return (
    <motion.a href={href} className={base} {...motionProps}>
      {label}
    </motion.a>
  );
}
