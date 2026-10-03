"use client";

import { useEffect } from "react";

/**
 * Same-page anchor navigation (#seccion) targeting `.lazy-section` elements.
 * Those use `content-visibility: auto`, so before the section has ever been
 * rendered its height is only an estimate → a native anchor jump on a fresh
 * load lands in the wrong place. Intercept the click, force the lazy
 * sections to real layout, scroll precisely, then restore the lazy mode.
 */
export function AnchorScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;
      const selector = anchor.getAttribute("href")!;
      const id = selector.slice(1);
      if (id === "top") return; /* native jump to top is exact */

      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();

      const lazy = document.querySelectorAll<HTMLElement>(".lazy-section");
      const setLazy = (v: string) => {
        for (const el of lazy) el.style.contentVisibility = v;
      };

      /* Force real layout so the target offset is exact. */
      setLazy("visible");

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });

      /* Restore after the scroll settles; by then sections are rendered. */
      window.setTimeout(() => setLazy(""), reduce ? 300 : 1000);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}