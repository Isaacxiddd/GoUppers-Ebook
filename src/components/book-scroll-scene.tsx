"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";

/**
 * Scroll-locked 3D book experience.
 *
 * Wheel & touch events drive animation progress while the section is in
 * the viewport (scroll-hijack pattern). When progress hits 0 or 1 the
 * lock releases and native scroll resumes.
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

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setIsMobile(vw < 640);
      /* Book + thickness + rotated cover extension ~ 380px when fully open */
      const s = Math.min(1, Math.max(0.42, (vw - 32) / (BOOK_WIDTH + 80)));
      setResponsiveScale(s);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ── Single wheel handler — always mounted, decides whether to hijack ── */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const section = containerRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;

      /* Only hijack when section is the dominant viewport content (~50%+ visible) */
      if (rect.top > vh * 0.5) return;   /* mostly below — user hasn't reached it */
      if (rect.bottom < vh * 0.5) return; /* mostly above — user scrolled past */

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      const p = progress.get();
      const atStart = p <= 0.02;
      const atEnd = p >= 0.86;

      /*
       * HIJACK rules:
       *  - At start (p≈0): only hijack if scrolling DOWN → begin animation
       *  - At end   (p≈1): only hijack if scrolling UP  → reverse animation
       *  - In between: always hijack
       *
       *  If the rule says DON'T hijack → return early → native scroll works.
       */
      if (atStart && scrollingUp) { progress.set(0); return; }
      if (atEnd && scrollingDown) { progress.set(1); return; }

      e.preventDefault();

      const raw = e.deltaY * 0.0005;
      const delta = Math.sign(raw) * Math.min(Math.abs(raw), 0.018);
      const next = Math.max(0, Math.min(1, p + delta));
      progress.set(next);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  /* ── Single touch handler — same logic as wheel ──────────────────── */
  useEffect(() => {
    let lastY = 0;

    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const section = containerRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      /* Only hijack when section is the dominant viewport content (~50%+ visible) */
      if (rect.top > vh * 0.5) return;   /* mostly below — user hasn't reached it */
      if (rect.bottom < vh * 0.5) return; /* mostly above — user scrolled past */

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

      const delta = Math.sign(raw) * Math.min(Math.abs(raw), 0.018);
      const next = Math.max(0, Math.min(1, p + delta));
      progress.set(next);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  /* ── Book transforms ───────────────────────────────────────────── */
  const bookScale = useTransform(progress, [0, 0.12, 0.4],
    isMobile ? [0.85, 0.6, 0.6] : [0.7, 1, 1]);
  const bookRotateY = useTransform(progress, [0, 0.12, 0.4], [-20, -12, -12]);
  const bookRotateX = useTransform(progress, [0, 0.12], [6, 0]);
  const bookY = useTransform(progress, [0, 0.12], [30, 0]);

  /* cover opening: 0° closed → -165° fully open */
  const coverRotate = useTransform(progress, [0.15, 0.45], [0, -165], {
    clamp: true,
  });

  /* re-center: cover opens left → shift book right proportionally */
  const bookShiftX = useTransform(coverRotate, (angle) => {
    const rad = (angle * Math.PI) / 180;
    return (BOOK_WIDTH / 2) * (1 - Math.cos(rad));
  });

  /* glare fades as cover opens */
  const glareOpacity = useTransform(progress, [0.12, 0.35], [1, 0], {
    clamp: true,
  });



  /* ── Text: top-right ── */
  const textTopOpacity = useTransform(
    progress,
    [0.38, 0.46, 0.7, 0.8],
    [0, 1, 1, 0],
  );
  const textTopX = useTransform(
    progress,
    [0.38, 0.46, 0.7, 0.8],
    [30, 0, 0, 20],
  );

  /* ── Text: bottom-right ── */
  const textBottomOpacity = useTransform(
    progress,
    [0.44, 0.52, 0.72, 0.82],
    [0, 1, 1, 0],
  );
  const textBottomX = useTransform(
    progress,
    [0.44, 0.52, 0.72, 0.82],
    [30, 0, 0, 20],
  );

  /* ── Text: below book ── */
  const textBelowOpacity = useTransform(
    progress,
    [0.5, 0.58, 0.74, 0.84],
    [0, 1, 1, 0],
  );
  const textBelowY = useTransform(
    progress,
    [0.5, 0.58, 0.74, 0.84],
    [30, 0, 0, 20],
  );

  /* ── Page leaf transforms (abanico) ── */
  const leaf0 = useTransform(coverRotate, [0, -165], [0, LEAF_ANGLES[0]], { clamp: true });
  const leaf1 = useTransform(coverRotate, [0, -165], [0, LEAF_ANGLES[1]], { clamp: true });
  const leaf2 = useTransform(coverRotate, [0, -165], [0, LEAF_ANGLES[2]], { clamp: true });
  const leaf3 = useTransform(coverRotate, [0, -165], [0, LEAF_ANGLES[3]], { clamp: true });
  const leaf4 = useTransform(coverRotate, [0, -165], [0, LEAF_ANGLES[4]], { clamp: true });
  const leaf5 = useTransform(coverRotate, [0, -165], [0, LEAF_ANGLES[5]], { clamp: true });
  const leafTransforms = [leaf0, leaf1, leaf2, leaf3, leaf4, leaf5];

  /* ── scroll hint ── */
  const scrollHintOpacity = useTransform(progress, [0, 0.06], [1, 0]);

  /* ── shadow ── */
  const shadowScale = useTransform(progress, [0, 0.12, 0.4], [0.6, 1, 1]);
  const shadowOpacity = useTransform(progress, [0, 0.12], [0.3, 0.55]);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height: "100vh", background: "var(--bg-hero)", touchAction: "manipulation" }}
    >
      {/* brand glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 h-[620px] w-[620px] rounded-full opacity-35"
        style={{
          background:
            "radial-gradient(circle,rgba(244,46,49,0.9) 0%,transparent 62%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[460px] w-[460px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle,rgba(39,208,186,0.9) 0%,transparent 62%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 left-2 select-none font-display text-[26vw] font-700 leading-none tracking-tighter text-white/[0.03] sm:text-[20vw]"
      >
        GoUppers
      </span>

      {/* centered book + texts */}
      <div className="flex h-full items-center justify-center">
        <div className="book-scroll-perspective relative">
          {/* ═══ THE BOOK ═══ */}
          <div
            style={{
              transform: `scale(${responsiveScale})`,
              transformOrigin: "center center",
            }}
          >
          <motion.div
            className="book-card-scroll relative"
            style={{
              width: BOOK_WIDTH,
              height: BOOK_HEIGHT,
              transformStyle: "preserve-3d",
              scale: bookScale,
              rotateY: bookRotateY,
              rotateX: bookRotateX,
              y: bookY,
              x: bookShiftX,
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
                    <span className="font-display text-lg font-700 text-white">
                      G
                    </span>
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

            {/* ═══ PAGE BLOCK — fore-edge (right side thickness) ═══ */}
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
              {/* paper line texture */}
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

            {/* ═══ SPINE (lomo) ═══ */}
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

            {/* ═══ PAGE LEAVES (abanico de hojas) ═══ */}
            {LEAF_ANGLES.map((angle, i) => (
              <div
                key={i}
                aria-hidden
                className="absolute"
                style={{
                  top: 6,
                  bottom: 6,
                  left: 2,
                  right: 2,
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
                  />
                </motion.div>
              </div>
            ))}

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
                translateZ: 0,
                backfaceVisibility: "hidden",
                boxShadow:
                  "0 36px 70px -24px rgba(160,20,22,0.7)",
              }}
            >
              {/* ── Outside face (cover) ── */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ borderRadius: "4px 8px 8px 4px" }}
              >
                {/* edge vignette */}
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
                          <span className="font-display text-sm font-700 text-white">
                            G
                          </span>
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

                  {/* top-light sheen */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent" />
                  {/* specular glare */}
                  <motion.div
                    className="book-glare pointer-events-none absolute inset-0"
                    aria-hidden
                    style={{ opacity: glareOpacity }}
                  />
                  {/* hinge shadow */}
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-7 bg-gradient-to-r from-black/28 to-transparent" />
                </div>
              </div>

              {/* ── Inside face (back of cover, visible when open) ── */}
              <div
                className="absolute inset-0 bg-[#f5f0e3]"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex flex-col items-center gap-3 p-6 text-center">
                    <span className="font-display text-base font-700 text-[#4a3728]">
                      GoUppers
                    </span>
                    <div className="h-px w-16 bg-[#c4b8a5]" />
                    <p className="max-w-[12rem] text-[11px] leading-relaxed text-[#8a7d6b]">
                      Tu guía para transformar cualquier propiedad en un
                      negocio de alquiler vacacional exitoso.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          </div>

          {/* ═══ TEXT TOP — below book on mobile, right side on desktop ═══ */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[calc(100%+4.5rem)] w-56 -translate-x-1/2 text-center sm:left-auto sm:top-0 sm:w-52 sm:-translate-x-0 sm:text-left lg:-right-[280px] lg:w-60"
            style={{ opacity: textTopOpacity, x: textTopX }}
          >
            <span className="mb-2 inline-block rounded-full bg-amarillo/15 px-3 py-1 text-[10px] font-600 uppercase tracking-[0.15em] text-amarillo">
              Contenido
            </span>
            <p className="mt-3 font-display text-lg font-700 leading-tight text-white">
              120+ páginas
            </p>
            <p className="mt-2 text-[13px] leading-snug text-white/60">
              Estrategias, checklists y herramientas para empezar a generar
              ingresos desde el día uno.
            </p>
          </motion.div>

          {/* ═══ TEXT BOTTOM — below book on mobile, right side on desktop ═══ */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[calc(100%+9rem)] w-56 -translate-x-1/2 text-center sm:left-auto sm:bottom-0 sm:top-auto sm:w-52 sm:-translate-x-0 sm:text-left lg:-right-[280px] lg:w-60"
            style={{ opacity: textBottomOpacity, x: textBottomX }}
          >
            <span className="mb-2 inline-block rounded-full bg-turquesa/15 px-3 py-1 text-[10px] font-600 uppercase tracking-[0.15em] text-turquesa">
              Incluye
            </span>
            <p className="mt-3 font-display text-lg font-700 leading-tight text-white">
              Bonus y recursos
            </p>
            <p className="mt-2 text-[13px] leading-snug text-white/60">
              Templates, guías de pricing y acceso a herramientas exclusivas
              para optimizar tu propiedad.
            </p>
          </motion.div>

          {/* ═══ TEXT BELOW BOOK ═══ */}
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[calc(100%+2rem)] w-56 -translate-x-1/2 text-center sm:w-64"
            style={{ opacity: textBelowOpacity, y: textBelowY }}
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
      </div>
    </section>
  );
}
