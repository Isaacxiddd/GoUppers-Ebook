"use client";

import { useRef, type ReactNode } from "react";

/** Progressive-enhancement tilt: sets CSS vars on pointer move so the
 *  server-rendered <BookCover> leans toward the cursor with a light glare.
 *  No animation library — near-zero hydration cost, never gates LCP. */
export function BookTilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.PointerEvent) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
    const ny = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${-13 + nx * 30}deg`);
    el.style.setProperty("--rx", `${-ny * 18}deg`);
    el.style.setProperty("--gx", `${12 + (nx + 0.5) * 76}%`);
    el.style.setProperty("--gy", `${6 + (ny + 0.5) * 88}%`);
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    for (const v of ["--rx", "--ry", "--gx", "--gy"]) el.style.removeProperty(v);
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative flex items-center justify-center"
      style={{ perspective: 1500 }}
    >
      {children}
    </div>
  );
}
