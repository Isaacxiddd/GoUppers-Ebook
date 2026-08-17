"use client";

import { Children, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Mobile-only swipe carousel. On < 640px the children become a horizontal
 * scroll-snap track (native momentum, zero deps) with dot indicators. On
 * ≥ 640px the track collapses via `sm:contents` so children flow back into the
 * parent grid untouched — desktop layout is preserved exactly.
 *
 * Two behaviors:
 *  - default: manual swipe (you slide it yourself).
 *  - autoplay: advances on its own; pauses while you touch/hold, resumes on
 *    release. Disabled under reduced-motion or when the tab is hidden.
 *
 * Each child must carry the mobile slide classes, e.g.
 *   `max-sm:min-w-[85%] max-sm:shrink-0 max-sm:snap-center`.
 */
export function MobileSwipe({
  children,
  autoplay = false,
  interval = 3800,
}: {
  children: ReactNode;
  autoplay?: boolean;
  interval?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  const isMobile = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 639px)").matches;

  const goTo = (i: number) => {
    const track = trackRef.current;
    const el = track?.children[i] as HTMLElement | undefined;
    if (!track || !el) return;
    track.scrollTo({
      left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  /* Active dot follows the slide nearest the track center. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!isMobile()) return;
        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        Array.from(track.children).forEach((c, i) => {
          const el = c as HTMLElement;
          const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        activeRef.current = best;
        setActive(best);
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Autoplay — pauses while interacting / tab hidden / reduced-motion. */
  useEffect(() => {
    if (!autoplay) return;
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let paused = false;
    const tick = () => {
      if (paused || document.hidden || !isMobile()) return;
      goTo((activeRef.current + 1) % count);
    };
    const timer = window.setInterval(tick, interval);
    const pause = () => (paused = true);
    const resume = () => (paused = false);

    track.addEventListener("pointerdown", pause);
    track.addEventListener("touchstart", pause, { passive: true });
    track.addEventListener("mouseenter", pause);
    window.addEventListener("pointerup", resume);
    window.addEventListener("touchend", resume);
    track.addEventListener("mouseleave", resume);
    return () => {
      clearInterval(timer);
      track.removeEventListener("pointerdown", pause);
      track.removeEventListener("touchstart", pause);
      track.removeEventListener("mouseenter", pause);
      window.removeEventListener("pointerup", resume);
      window.removeEventListener("touchend", resume);
      track.removeEventListener("mouseleave", resume);
    };
  }, [autoplay, interval, count]);

  return (
    <>
      <div
        ref={trackRef}
        role="group"
        className="flex gap-4 overflow-x-auto overscroll-x-contain scrollbar-hide snap-x snap-mandatory px-5 -mx-5 pb-1 sm:contents"
      >
        {children}
      </div>

      {count > 1 && (
        <div className="mt-5 flex justify-center gap-2 sm:hidden">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir al elemento ${i + 1} de ${count}`}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                active === i ? "w-5 bg-ink" : "w-2 bg-ink/25"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
