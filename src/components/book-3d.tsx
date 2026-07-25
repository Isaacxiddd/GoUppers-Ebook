"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import { HouseLine } from "@phosphor-icons/react";

/** True 3D hardcover of the eBook: front board + spine + page block, tilting
 *  toward the cursor with spring physics (decorative, so spring is right —
 *  Emil). Collapses to a static, still cover under reduced motion. */
export function Book3D() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Raw pointer position (-0.5..0.5), smoothed by springs for momentum.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 120, damping: 14, mass: 0.6 };
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-26, 8]), spring);
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), spring);

  // Cursor-tracked specular highlight (museum key-light raking across the board).
  const glareX = useSpring(useTransform(px, [-0.5, 0.5], [12, 88]), spring);
  const glareY = useSpring(useTransform(py, [-0.5, 0.5], [8, 92]), spring);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4), rgba(255,255,255,0.06) 34%, transparent 62%)`;

  function onMove(e: React.PointerEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  const THICK = 46; // page-block depth in px

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative flex items-center justify-center"
      style={{ perspective: 1400 }}
    >
      {/* ambient ground shadow */}
      <div className="absolute -bottom-4 h-12 w-56 rounded-[50%] bg-black/55 blur-2xl" />

      {/* idle float wrapper */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -14, 0] }}
        transition={
          reduce ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <motion.div
          className="relative aspect-[3/4] w-[280px] sm:w-[320px]"
          style={{
            transformStyle: "preserve-3d",
            rotateX: reduce ? 0 : rotX,
            rotateY: reduce ? -14 : rotY,
          }}
        >
          {/* page block (right edge) — thin stacked pages */}
          <div
            className="absolute inset-y-[6px] right-0 rounded-r-[3px]"
            style={{
              width: THICK,
              transform: `rotateY(90deg) translateZ(${-THICK / 2}px) translateX(${THICK / 2}px)`,
              background:
                "repeating-linear-gradient(90deg,#fff 0 2px,#e7e7e7 2px 3px)",
            }}
          />
          {/* spine (left edge) */}
          <div
            className="absolute inset-y-0 left-0 rounded-l-[3px] bg-[#b3181b]"
            style={{
              width: THICK,
              transform: `rotateY(-90deg) translateZ(${-THICK / 2}px) translateX(${-THICK / 2}px)`,
            }}
          />

          {/* FRONT board */}
          <div
            className="absolute inset-0 overflow-hidden rounded-r-[6px] rounded-l-[3px] bg-accent-red shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/10"
            style={{ transform: `translateZ(${THICK / 2}px)` }}
          >
            {/* amarillo title stripe */}
            <div className="flex items-center justify-center bg-amarillo px-5 py-3">
              <span className="font-display text-[15px] font-700 tracking-tight text-[#4a4408]">
                Guía para propietarios
              </span>
            </div>

            <div className="flex h-full flex-col justify-between px-6 pb-9 pt-7">
              <div>
                <p className="font-sans text-[11px] font-600 uppercase tracking-[0.2em] text-white/75">
                  Edición 2026
                </p>
                <p className="mt-4 font-display text-[1.9rem] font-700 leading-[1.05] tracking-tight text-white">
                  Tu propiedad,
                  <br />
                  trabajando
                  <br />
                  para vos.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-white/15 ring-1 ring-white/25">
                  <HouseLine weight="fill" className="size-5 text-white" />
                </span>
                <span className="font-display text-xl font-700 tracking-tight text-white">
                  GoUppers
                </span>
              </div>
            </div>

            {/* cursor-tracked specular highlight (static soft sheen if reduced) */}
            {reduce ? (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent" />
            ) : (
              <motion.div
                className="pointer-events-none absolute inset-0 mix-blend-screen"
                style={{ background: glare }}
              />
            )}
            {/* hinge shadow near spine */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/25 to-transparent" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
