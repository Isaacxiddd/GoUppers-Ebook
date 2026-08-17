"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useScroll } from "motion/react";
import { Lightning, Star, ShieldCheck, CreditCard } from "@phosphor-icons/react/dist/ssr";
import { CtaButton } from "@/components/ui/cta-button";

/**
 * Unified hero + scroll-locked 3D book experience.
 *
 * Phase 1 (p 0→0.22): Hero text fades out, book moves from right→center & scales up.
 * Phase 2 (p 0.20→0.46): Cover opens.
 * Phase 3 (p 0.42→0.86): Side text labels appear, book fully open.
 * At p≥0.86 scroll releases.
 */

const BOOK_WIDTH = 320;
const BOOK_HEIGHT = 427;
const THICKNESS = 48;
const LEAF_ANGLES = [0, -8, -16, -24, -32, -40];

export function BookScrollScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  /* ── Responsive book scale ──────────────────────────────────────────── */
  const [responsiveScale, setResponsiveScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  /* Warm the cover's inside-face texture once, offscreen, during idle.
     The first open stutters because the GPU rasterizes that face (and the
     book's layers) on the fly, while closing is smooth — the textures are
     already rastered. Keeping layers alive (will-change below) + one hidden
     offscreen open frame makes every open as cheap as every close. */
  useEffect(() => {
    let cancelled = false;
    const run = () => {
      const persp = containerRef.current?.querySelector<HTMLElement>(".book-scroll-perspective");
      if (!persp || cancelled || window.scrollY > 0) return;
      requestAnimationFrame(() => {
        if (cancelled) return;
        persp.style.transform = "translate(120%, 0)";
        progress.set(0.9);
        requestAnimationFrame(() => {
          if (cancelled) return;
          persp.style.transform = "";
          progress.set(0);
        });
      });
    };
    /* Defer the prewarm to idle so it never competes with first paint on
       mobile. Falls back to a timeout where requestIdleCallback is missing. */
    const supportsIdle = "requestIdleCallback" in window;
    const handle: number = supportsIdle
      ? window.requestIdleCallback(run, { timeout: 1200 })
      : (window.setTimeout(run, 350) as unknown as number);
    return () => {
      cancelled = true;
      if (supportsIdle) window.cancelIdleCallback(handle);
      else clearTimeout(handle);
    };
  }, [progress]);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setIsMobile(vw < 640);
      const s = Math.min(1, Math.max(0.42, (vw - 32) / (BOOK_WIDTH + 80)));
      setResponsiveScale(s);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ── Mobile: native scroll drives the animation (Rockstar-style sticky) ──
     Maps window scrollY against the measured section travel. Unlike
     target-based useScroll, this does zero getBoundingClientRect reads per
     scroll frame (no forced layout) — a big win on mobile.
     Desktop keeps the manual hijack. */
  const { scrollY } = useScroll();
  const travel = useMotionValue(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () =>
      travel.set(Math.max(1, el.offsetHeight - window.innerHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [travel]);

  useEffect(() => {
    if (!isMobile) return;
    const unsub = scrollY.on("change", (y) => {
      const t = travel.get();
      progress.set(Math.max(0, Math.min(1, y / t)));
    });
    return unsub;
  }, [isMobile, scrollY, travel, progress]);

  /* ── Single wheel handler — hijack from the start ────────────────── */
  useEffect(() => {
    if (isMobile) return; /* mobile scrolls natively */
    let rafId = 0;

    const handleWheel = (e: WheelEvent) => {
      const section = containerRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      /* Only hijack when section is the dominant viewport content (~50%+ visible) */
      if (rect.top > vh * 0.5) return;
      if (rect.bottom < vh * 0.5) return;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      const p = progress.get();
      const atStart = p <= 0.02;
      const atEnd = p >= 0.86;

      if (atStart && scrollingUp) { progress.set(0); return; }
      if (atEnd && scrollingDown) { progress.set(1); return; }

      e.preventDefault();

      if (rafId) return; /* already scheduled — skip this frame */
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const p2 = progress.get();
        const raw = e.deltaY * 0.0005;
        const delta = Math.sign(raw) * Math.min(Math.abs(raw), 0.018);
        const next = Math.max(0, Math.min(1, p2 + delta));
        progress.set(next);
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  /* ── Single touch handler ──────────────────────────────────────── */
  useEffect(() => {
    if (isMobile) return; /* mobile scrolls natively */
    let lastY = 0;
    let rafId = 0;

    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const section = containerRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top > vh * 0.5) return;
      if (rect.bottom < vh * 0.5) return;

      const y = e.touches[0].clientY;
      const raw = (lastY - y) * 0.0025;
      lastY = y;
      const scrollingDown = raw > 0;
      const scrollingUp = raw < 0;

      const p = progress.get();
      const atStart = p <= 0.02;
      const atEnd = p >= 0.86;

      if (atStart && scrollingUp) { progress.set(0); return; }
      if (atEnd && scrollingDown) { progress.set(1); return; }

      e.preventDefault();

      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const p2 = progress.get();
        const delta = Math.sign(raw) * Math.min(Math.abs(raw), 0.018);
        const next = Math.max(0, Math.min(1, p2 + delta));
        progress.set(next);
      });
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  /* ══════════════════════════════════════════════════════════════════════
     PHASE 1 — Hero text fades, book enters from right
     ══════════════════════════════════════════════════════════════════════ */

  /* Hero text: visible at start, fades out by p=0.20 */
  const heroOpacity = useTransform(progress, [0, 0.18], [1, 0], { clamp: true });
  const heroX = useTransform(progress, [0, 0.18],
    isMobile ? [0, 0] : [0, -70],
  );
  const heroY = useTransform(progress, [0, 0.18],
    isMobile ? [0, -50] : [0, 0],
  );

  /* Book intro: desktop = from right, mobile = from bottom */
  const bookIntroX = useTransform(
    progress,
    [0, 0.22],
    isMobile ? [-24, -24] : [160, 0],
  );
  const bookIntroY = useTransform(
    progress,
    [0, 0.22],
    isMobile ? [200, 0] : [0, 0],
  );
  const bookIntroScale = useTransform(
    progress,
    [0, 0.22, 0.42],
    isMobile ? [0.4, 0.68, 0.68] : [0.48, 0.78, 0.78],
  );

  /* ══════════════════════════════════════════════════════════════════════
     PHASE 2 — Book transforms (rotation, tilt, cover open)
     ══════════════════════════════════════════════════════════════════════ */

  const bookRotateY = useTransform(progress, [0, 0.22, 0.42], [-20, -12, -12]);
  const bookRotateX = useTransform(progress, [0, 0.22], [6, 0]);
  const bookY = useTransform(progress, [0, 0.22], [30, 0]);

  /* Combine intro Y + tilt Y */
  const bookCombinedY = useTransform(
    [bookIntroY, bookY],
    ([intro, tilt]: number[]) => intro + tilt,
  );

  /* Cover opening: 0° closed → -165° fully open */
  const coverRotate = useTransform(progress, [0.20, 0.46], [0, -165], {
    clamp: true,
  });

  /* Re-center: cover opens left → shift book right so visual center stays in middle */
  const bookShiftX = useTransform(coverRotate, (angle) => {
    const rad = (angle * Math.PI) / 180;
    return (BOOK_WIDTH * (1 - Math.cos(rad))) / 5.5;
  });

  /* Combine intro offset + cover re-center */
  const bookCombinedX = useTransform(
    [bookIntroX, bookShiftX],
    ([intro, shift]: number[]) => intro + shift,
  );

  /* Glare fades as cover opens */
  const glareOpacity = useTransform(progress, [0.18, 0.38], [1, 0], {
    clamp: true,
  });

  /* ══════════════════════════════════════════════════════════════════════
     PHASE 3 — Side text labels appear
     ══════════════════════════════════════════════════════════════════════ */

  /* Text: top-left — no bookShiftX, parent already moves with book */
  const textTopOpacity = useTransform(
    progress,
    [0.42, 0.50, 0.72, 0.82],
    [0, 1, 1, 0],
  );
  const textTopX = useTransform(
    progress,
    [0.42, 0.50, 0.72, 0.82],
    [-20, 0, 0, -15],
  );

  /* Text: bottom-left */
  const textBottomOpacity = useTransform(
    progress,
    [0.48, 0.56, 0.74, 0.84],
    [0, 1, 1, 0],
  );
  const textBottomX = useTransform(
    progress,
    [0.48, 0.56, 0.74, 0.84],
    [-20, 0, 0, -15],
  );

  /* Text: below book */
  const textBelowOpacity = useTransform(
    progress,
    [0.54, 0.62, 0.76, 0.86],
    [0, 1, 1, 0],
  );
  const textBelowY = useTransform(
    progress,
    [0.54, 0.62, 0.76, 0.86],
    [30, 0, 0, 20],
  );

  /* Mobile: cycling text slots — same position, one at a time */
  const mobileText1Opacity = useTransform(
    progress,
    [0.30, 0.36, 0.50, 0.54],
    [0, 1, 1, 0],
  );
  const mobileText2Opacity = useTransform(
    progress,
    [0.46, 0.50, 0.64, 0.68],
    [0, 1, 1, 0],
  );
  const mobileText3Opacity = useTransform(
    progress,
    [0.62, 0.66, 0.84, 0.90],
    [0, 1, 1, 0],
  );

  /* ══════════════════════════════════════════════════════════════════════
     MISC — leaves, shadow, scroll hint
     ══════════════════════════════════════════════════════════════════════ */

  const leaf0 = useTransform(coverRotate, [0, -165], [0, LEAF_ANGLES[0]], { clamp: true });
  const leaf1 = useTransform(coverRotate, [0, -165], [0, LEAF_ANGLES[1]], { clamp: true });
  const leaf2 = useTransform(coverRotate, [0, -165], [0, LEAF_ANGLES[2]], { clamp: true });
  const leaf3 = useTransform(coverRotate, [0, -165], [0, LEAF_ANGLES[3]], { clamp: true });
  const leaf4 = useTransform(coverRotate, [0, -165], [0, LEAF_ANGLES[4]], { clamp: true });
  const leaf5 = useTransform(coverRotate, [0, -165], [0, LEAF_ANGLES[5]], { clamp: true });
  const leafTransforms = [leaf0, leaf1, leaf2, leaf3, leaf4, leaf5];

  const scrollHintOpacity = useTransform(progress, [0, 0.06], [1, 0]);

  const shadowScale = useTransform(progress, [0, 0.22, 0.42], [0.6, 1, 1]);
  const shadowOpacity = useTransform(progress, [0, 0.22], [0.3, 0.55]);

  /* ── data attribute for testing ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const unsub = progress.on("change", (p) => {
      el.dataset.book = p < 0.02 ? "closed" : p > 0.86 ? "open" : "opening";
    });
    return unsub;
  }, []);

  return (
    <section
      ref={containerRef}
      data-book="closed"
      className="hero-bg relative [overflow-anchor:none]"
      style={{ height: isMobile ? "300vh" : "100vh", touchAction: "manipulation" }}
    >
      {/* Mobile: sticky viewport pinned while the section scrolls (native momentum).
          Desktop: plain 100vh box — same layout as always.
          NOTE: overflow-hidden lives HERE (the pinned viewport), not on the section —
          an overflow:hidden ancestor would break position:sticky. */}
      <div
        className={
          isMobile
            ? "sticky top-0 h-[100dvh] overflow-hidden"
            : "relative h-full overflow-hidden"
        }
      >
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 left-2 select-none font-display text-[26vw] font-700 leading-none tracking-tighter text-white/[0.03] sm:text-[20vw]"
      >
        GoUppers
      </span>

      {/* ── Main layout: hero text (left) + book (right→center) ── */}
      <div className="flex h-full items-center justify-center px-4 sm:px-8 lg:px-12">

        {/* ═══ HERO TEXT — fades out on scroll ═══ */}
        <motion.div
          className="pointer-events-none absolute left-6 right-6 top-24 z-10 flex flex-col items-center gap-4 text-center sm:left-auto sm:right-auto sm:static sm:top-auto sm:w-[24rem] sm:items-start sm:text-left lg:w-[28rem]"
          style={{ opacity: heroOpacity, x: heroX, y: heroY }}
        >
          <h1 className="font-display text-[2rem] font-700 leading-[1.04] tracking-tight text-white sm:text-[2.6rem] lg:text-[3rem]">
            Tu propiedad vacía
            <br />
            puede <span className="text-amarillo">facturar</span>{" "}
            <br className="hidden sm:block" />{" "}
            <span className="text-turquesa">en 30 días.</span>
          </h1>

          <p className="max-w-sm text-[14px] leading-relaxed text-white/65 sm:text-[15px] lg:text-base">
            La guía de GoUppers para que tengas el sistema completo a mano:
            pasos, números y plantillas que ya funcionan en 60+ ciudades.
          </p>

          <div className="flex flex-col items-center gap-2 sm:items-start">
            <CtaButton href="#comprar" pulse>
              Empezar a facturar
            </CtaButton>
          </div>

          {/* Trust strip */}
          <div className="flex flex-col items-center gap-1.5 sm:items-start">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} weight="fill" className="size-4 text-amarillo" />
                ))}
              </div>
              <span className="text-sm font-600 text-white/70">4.9/5</span>
              <span className="text-sm text-white/40">·</span>
              <span className="text-sm text-white/50">400+ propiedades</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <Lightning weight="fill" className="size-3.5 text-turquesa" />
                Descarga instantánea
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span className="flex items-center gap-1.5">
                <ShieldCheck weight="duotone" className="size-3.5 text-turquesa" />
                Pago seguro
              </span>
              <span className="h-3 w-px bg-white/15" />
              <span className="flex items-center gap-1.5">
                <CreditCard weight="duotone" className="size-3.5 text-turquesa" />
                Sin suscripciones
              </span>
            </div>
          </div>
        </motion.div>

        {/* ═══ BOOK + SIDE TEXTS ═══ */}
        <motion.div
          style={{
            x: bookCombinedX,
            y: bookCombinedY,
            scale: bookIntroScale,
            willChange: "transform",
          }}
        >
          <div className="book-scroll-perspective relative">

            {/* ═══ THE BOOK ═══ */}
            <motion.div
              className="book-card-scroll relative"
              style={{
                width: BOOK_WIDTH,
                height: BOOK_HEIGHT,
                rotateY: bookRotateY,
                rotateX: bookRotateX,
                y: bookY,
                willChange: "transform",
              }}
            >
              {/* contact shadow */}
              <motion.div
                aria-hidden
                className="absolute -bottom-6 h-12 rounded-[50%]"
                style={{
                  width: BOOK_WIDTH * 0.8,
                  left: "10%",
                  background:
                    "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 65%)",
                  scale: shadowScale,
                  opacity: shadowOpacity,
                }}
              />

              {/* ═══ BACK COVER ═══ */}
              <div
                className="absolute inset-0 overflow-hidden rounded-r-[8px] rounded-l-[4px] ring-1 ring-black/15"
                style={{
                  transform: `translateZ(-${THICKNESS}px)`,
                  backgroundColor: "#a01416",
                  backgroundImage:
                    "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 50%)",
                  boxShadow: "0 20px 50px -12px rgba(0,0,0,0.5)",
                }}
              >
                <div className="relative flex h-full flex-col items-center justify-between p-7">
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
                      <svg viewBox="0 0 3330 3840" className="size-6" fill="white">
                        <path d="M540 3060 c-20 -20 -20 -33 -20 -873 0 -801 1 -855 18 -870 30 -28 65 -30 95 -7 l27 21 2 802 3 802 1003 3 1002 2 0 -803 0 -804 23 -21 c30 -29 62 -28 92 3 l25 24 0 849 c0 840 0 848 -20 870 l-21 22 -1104 0 c-1092 0 -1105 0 -1125 -20z" />
                        <path d="M1609 2288 l-22 -23 7 -788 c3 -446 2 -787 -3 -785 -5 2 -125 117 -267 255 -276 271 -288 279 -334 233 -44 -44 -33 -63 157 -249 98 -96 248 -243 333 -327 101 -100 165 -155 184 -160 28 -7 43 6 320 288 371 376 376 382 376 413 0 30 -40 75 -67 75 -9 0 -138 -120 -285 -267 -147 -147 -269 -265 -270 -263 -1 3 -5 360 -8 793 l-5 789 -24 19 c-31 25 -65 24 -92 -3z" />
                      </svg>
                    </span>
                    <span className="font-display text-sm font-700 tracking-tight text-white">
                      GoUppers
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-4 text-center">
                    <p className="max-w-[14rem] text-[11px] leading-relaxed text-white/60">
                      La guía definitiva para transformar tu propiedad en un
                      alquiler vacacional rentable. Paso a paso, con estrategias
                      comprobadas.
                    </p>
                    <div className="h-px w-24 bg-white/15" />
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="size-1.5 rounded-full bg-amarillo"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="mb-2 flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5">
                    <div className="h-px w-8 bg-white/30" />
                    <span className="text-[8px] font-500 uppercase tracking-widest text-white/50">
                      ISBN 978-X-XXXX-XXXX-X
                    </span>
                    <div className="h-px w-8 bg-white/30" />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-white/10 via-transparent to-transparent" />
              </div>

              {/* ═══ PAGE BLOCK — fore-edge ═══ */}
              <div
                className="absolute"
                style={{
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: THICKNESS,
                  transformOrigin: "right center",
                  transform: "rotateY(90deg)",
                  backfaceVisibility: "hidden",
                  background:
                    "linear-gradient(90deg, #ddd5c5, #f0e9da 30%, #f5f0e3 50%, #f0e9da 70%, #ddd5c5)",
                  boxShadow: "inset 0 0 12px rgba(0,0,0,0.18)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2.5px, rgba(180,170,150,0.18) 2.5px, rgba(180,170,150,0.18) 3px)",
                  }}
                />
              </div>

              {/* ═══ PAGE BLOCK — top edge ═══ */}
              <div
                className="absolute"
                style={{
                  left: 0,
                  right: 0,
                  top: 0,
                  height: THICKNESS,
                  transformOrigin: "center top",
                  transform: "rotateX(90deg)",
                  backfaceVisibility: "hidden",
                  background:
                    "linear-gradient(180deg, #ddd5c5, #f0e9da 30%, #f5f0e3 70%, #e8e0d0)",
                  boxShadow: "inset 0 0 12px rgba(0,0,0,0.12)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, transparent, transparent 2.5px, rgba(180,170,150,0.15) 2.5px, rgba(180,170,150,0.15) 3px)",
                  }}
                />
              </div>

              {/* ═══ SPINE ═══ */}
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: THICKNESS,
                  transformOrigin: "left center",
                  transform: "translateZ(-1px) rotateY(-90deg)",
                  backfaceVisibility: "hidden",
                  background:
                    "linear-gradient(90deg, #7a1013 0%, #a01416 40%, #b3181b 60%, #a01416 100%)",
                  borderRadius: "4px 0 0 4px",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                  }}
                >
                  <span
                    className="font-display text-[8px] font-700 uppercase tracking-[0.18em] text-white/80"
                    style={{ transform: "rotate(180deg)" }}
                  >
                    GoUppers · Guía 2026
                  </span>
                </div>
              </div>

              {/* ═══ PAGE LEAVES ═══ */}
              <div
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
              >
              {LEAF_ANGLES.map((angle, i) => (
                <div
                  key={i}
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    transform: `translateZ(${-1 - i * 2}px)`,
                  }}
                >
                  <motion.div
                    className="h-full w-full"
                    style={{
                      transformOrigin: "left center",
                      transformStyle: "preserve-3d",
                      rotateY: leafTransforms[i],
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div
                      className="h-full w-full rounded-r-[2px]"
                      style={{
                        background: `linear-gradient(180deg, rgb(${245 - i * 4},${240 - i * 4},${230 - i * 4}), rgb(${250 - i * 3},${246 - i * 3},${238 - i * 3}))`,
                        boxShadow: `0 1px 3px rgba(0,0,${0.04 + i * 0.008}), inset -2px 0 6px rgba(0,0,0,${0.02 + i * 0.005})`,
                      }}
                    >
                      {i === 0 && (
                        <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                          <span className="font-display text-[14px] font-700 text-[#4a3728]">
                            GoUppers
                          </span>
                          <div className="h-px w-12 bg-[#c4b8a5]" />
                          <p className="text-[14px] leading-[1.2] text-[#8a7d6b]">
                            Tu guía para transformar cualquier propiedad en un
                            negocio de alquiler vacacional exitoso.
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
              </div>

              {/* ═══ BOOKMARK RIBBON ═══ */}
              <div
                aria-hidden
                className="absolute -top-3 right-9 z-10 h-16 w-5 bg-turquesa shadow-md"
                style={{
                  transform: "translateZ(1px)",
                  clipPath:
                    "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
                }}
              />

              {/* ═══ FRONT COVER (animated open) ═══ */}
              <motion.div
                className="absolute inset-0 rounded-r-[8px] rounded-l-[4px] bg-accent-red ring-1 ring-black/15"
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "left center",
                  rotateY: coverRotate,
                  translateZ: 10,
                  backfaceVisibility: "hidden",
                  willChange: "transform",
                  boxShadow: isMobile
                    ? "0 18px 34px -16px rgba(160,20,22,0.55)"
                    : "0 36px 70px -24px rgba(160,20,22,0.7)",
                }}
              >
                {/* Outside face */}
                <div
                  className="absolute inset-0"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ borderRadius: "4px 8px 8px 4px" }}
                  >
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(120% 100% at 30% 20%, rgba(255,255,255,0.14), transparent 45%), linear-gradient(90deg, rgba(0,0,0,0.16), transparent 22%, transparent 80%, rgba(0,0,0,0.14))",
                    }}
                  />

                  <div className="relative flex h-full flex-col justify-between p-7">
                    <div>
                      <span className="font-sans text-[10.5px] font-600 uppercase tracking-[0.24em] text-amarillo">
                        Guía definitiva · 2026
                      </span>
                      <p className="mt-5 font-display text-[2rem] font-700 leading-[1.02] tracking-tight text-white">
                        Guía para
                        <br />
                        propietarios
                      </p>
                      <p className="mt-3 max-w-[15rem] text-[13px] leading-snug text-white/75">
                        Alquiler vacacional rentable, paso a paso.
                      </p>
                    </div>

                    <div>
                      <div className="mb-4 h-px w-full bg-white/20" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="grid size-8 place-items-center rounded-lg bg-white/15 ring-1 ring-white/25">
                            <svg viewBox="0 0 3330 3840" className="size-5" fill="white">
                              <path d="M540 3060 c-20 -20 -20 -33 -20 -873 0 -801 1 -855 18 -870 30 -28 65 -30 95 -7 l27 21 2 802 3 802 1003 3 1002 2 0 -803 0 -804 23 -21 c30 -29 62 -28 92 3 l25 24 0 849 c0 840 0 848 -20 870 l-21 22 -1104 0 c-1092 0 -1105 0 -1125 -20z" />
                              <path d="M1609 2288 l-22 -23 7 -788 c3 -446 2 -787 -3 -785 -5 2 -125 117 -267 255 -276 271 -288 279 -334 233 -44 -44 -33 -63 157 -249 98 -96 248 -243 333 -327 101 -100 165 -155 184 -160 28 -7 43 6 320 288 371 376 376 382 376 413 0 30 -40 75 -67 75 -9 0 -138 -120 -285 -267 -147 -147 -269 -265 -270 -263 -1 3 -5 360 -8 793 l-5 789 -24 19 c-31 25 -65 24 -92 -3z" />
                            </svg>
                          </span>
                          <span className="font-display text-lg font-700 tracking-tight text-white">
                            GoUppers
                          </span>
                        </div>
                        <span className="text-right text-[10px] font-500 leading-tight text-white/60">
                          Juan Carlos
                          <br />
                          &amp; Thaís
                        </span>
                      </div>
                    </div>

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent" />
                    <motion.div
                      className="book-glare pointer-events-none absolute inset-0"
                      aria-hidden
                      style={{ opacity: glareOpacity, willChange: "opacity" }}
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-7 bg-gradient-to-r from-black/28 to-transparent" />
                  </div>
                </div>
              </div>

                {/* Inside face */}
                <div
                  className="absolute inset-0 bg-[#f5f0e3]"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="flex h-full w-full items-start p-4">
                    <div className="flex w-full flex-col gap-[5px]">
                      <span className="text-center text-[11px] font-600 uppercase tracking-wider text-[#b0a594]">— Contenido —</span>
                      <div className="mb-[2px] h-px w-full bg-[#d4c9b8]" />
                      {[
                        ["Prólogo", "3"],
                        ["1  Mentalidad del huésped", "4"],
                        ["2  Fotografía profesional", "8"],
                        ["3  Checklist pre-fotografía", "14"],
                        ["4  Título que para el scroll", "18"],
                        ["5  Descripción perfecta + IA", "22"],
                        ["6  Precio y posicionamiento", "30"],
                        ["7  Reseñas", "35"],
                        ["8  Decoración y staging", "40"],
                        ["9  Marketing en redes", "44"],
                        ["10  Automatización", "48"],
                        ["11  SEO en plataformas", "52"],
                        ["12  Análisis y métricas", "56"],
                        ["13  Guía del huésped", "60"],
                        ["14  Estrategia multiplataforma", "63"],
                        ["Checklist final", "66"],
                        ["Epílogo", "70"],
                      ].map(([item, page]) => (
                        <div
                          key={item}
                          className="flex items-baseline"
                        >
                          <span className="text-[14px] leading-[1.15] text-[#6b5e4f]">
                            {item}
                          </span>
                          <span
                            className="mx-[3px] flex-1 border-b-2 border-dotted border-[#b0a594] opacity-40"
                            style={{ borderBottomStyle: "dotted" }}
                          />
                          <span className="text-[14px] leading-[1.15] text-[#b0a594]">
                            {page}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* scroll hint */}
            <motion.div
              className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center"
              style={{ opacity: scrollHintOpacity }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-500 uppercase tracking-widest text-white/40">
                  {isMobile ? "Desliza" : "Scroll"}
                </span>
                <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 p-1">
                  <motion.div
                    className="size-1.5 rounded-full bg-white/60"
                    animate={{ y: [0, 10, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ═══ SIDE TEXTS — direct children of section, not inside any motion wrapper ═══ */}
      <motion.div
        className="pointer-events-none absolute left-[12%] top-[28%] w-56 text-left max-lg:hidden"
        style={
          isMobile
            ? undefined
            : { opacity: textTopOpacity, x: textTopX, willChange: "opacity, transform" }
        }
      >
        <span className="mb-1 inline-block rounded-full bg-amarillo/15 px-2.5 py-0.5 text-[10px] font-600 uppercase tracking-[0.15em] text-amarillo">
          Contenido
        </span>
        <p className="mt-1.5 font-display text-lg font-700 leading-tight text-white">
          120+ páginas
        </p>
        <p className="mt-1 text-[13px] leading-snug text-white/60">
          Estrategias, checklists y herramientas para empezar a generar
          ingresos desde el día uno.
        </p>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute left-[12%] top-[58%] w-56 text-left max-lg:hidden"
        style={
          isMobile
            ? undefined
            : { opacity: textBottomOpacity, x: textBottomX, willChange: "opacity, transform" }
        }
      >
        <span className="mb-1 inline-block rounded-full bg-turquesa/15 px-2.5 py-0.5 text-[10px] font-600 uppercase tracking-[0.15em] text-turquesa">
          Incluye
        </span>
        <p className="mt-1.5 font-display text-lg font-700 leading-tight text-white">
          Bonus y recursos
        </p>
        <p className="mt-1 text-[13px] leading-snug text-white/60">
          Templates, guías de pricing y acceso a herramientas exclusivas
          para optimizar tu propiedad.
        </p>
      </motion.div>

      {/* ═══ MOBILE: cycling texts — same slot, one at a time ═══ */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[calc(50%+180px)] w-56 -translate-x-1/2 text-center lg:hidden"
        style={!isMobile ? undefined : { opacity: mobileText1Opacity, willChange: "opacity" }}
      >
        <span className="mb-1 inline-block rounded-full bg-amarillo/15 px-2.5 py-0.5 text-[9px] font-600 uppercase tracking-[0.15em] text-amarillo">
          Contenido
        </span>
        <p className="mt-1.5 font-display text-sm font-700 leading-tight text-white">
          120+ páginas
        </p>
        <p className="mt-1 text-[11px] leading-snug text-white/60">
          Estrategias, checklists y herramientas para empezar a generar
          ingresos desde el día uno.
        </p>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute left-1/2 top-[calc(50%+180px)] w-56 -translate-x-1/2 text-center lg:hidden"
        style={!isMobile ? undefined : { opacity: mobileText2Opacity, willChange: "opacity" }}
      >
        <span className="mb-1 inline-block rounded-full bg-turquesa/15 px-2.5 py-0.5 text-[9px] font-600 uppercase tracking-[0.15em] text-turquesa">
          Incluye
        </span>
        <p className="mt-1.5 font-display text-sm font-700 leading-tight text-white">
          Bonus y recursos
        </p>
        <p className="mt-1 text-[11px] leading-snug text-white/60">
          Templates, guías de pricing y acceso a herramientas exclusivas
          para optimizar tu propiedad.
        </p>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute left-1/2 top-[calc(50%+180px)] w-56 -translate-x-1/2 text-center lg:hidden"
        style={!isMobile ? undefined : { opacity: mobileText3Opacity, willChange: "opacity" }}
      >
        <span className="mb-1 inline-block rounded-full bg-salmon/15 px-2.5 py-0.5 text-[9px] font-600 uppercase tracking-[0.15em] text-salmon">
          Resultado
        </span>
        <p className="mt-1.5 font-display text-sm font-700 leading-tight text-white">
          De idea a negocio
        </p>
        <p className="mt-1 text-[11px] leading-snug text-white/60">
          Transforma tu propiedad en un alquiler vacacional que genera
          ingresos todos los meses, sin estrés.
        </p>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute left-1/2 top-[calc(50%+260px)] w-56 -translate-x-1/2 text-center max-lg:hidden sm:top-[calc(50%+200px)] sm:w-64"
        style={isMobile ? undefined : { opacity: textBelowOpacity, y: textBelowY, willChange: "opacity, transform" }}
      >
        <span className="mb-2 inline-block rounded-full bg-salmon/15 px-3 py-1 text-[10px] font-600 uppercase tracking-[0.15em] text-salmon">
          Resultado
        </span>
        <p className="mt-3 font-display text-lg font-700 leading-tight text-white">
          De idea a negocio
        </p>
        <p className="mt-2 text-[13px] leading-snug text-white/60">
          Transforma tu propiedad en un alquiler vacacional que genera
          ingresos todos los meses, sin estrés.
        </p>
      </motion.div>

      {/* Debug: progress value */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            const v = progress.get().toFixed(3);
            navigator.clipboard.writeText(v).catch(() => {});
          }}
          className="rounded-md bg-white/90 px-3 py-1.5 text-xs font-500 text-black shadow-md transition-colors hover:bg-white active:scale-95"
        >
          {progress.get().toFixed(3)}
        </button>
      </div>
      </div>
    </section>
  );
}
