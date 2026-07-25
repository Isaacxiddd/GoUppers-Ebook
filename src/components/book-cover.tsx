import { HouseLine } from "@phosphor-icons/react/dist/ssr";

const THICK = 48; // page-block depth (px)

/** Static, server-rendered 3D hardcover. Paints immediately (no JS gating LCP).
 *  Tilt + specular highlight are layered on top by <BookTilt> via CSS vars. */
export function BookCover() {
  return (
    <>
      {/* soft elliptical contact shadow */}
      <div
        aria-hidden
        className="absolute -bottom-6 h-12 w-64 rounded-[50%]"
        style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 65%)" }}
      />

      <div
        className="book-card relative aspect-[3/4] w-[290px] sm:w-[336px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* page block (right edge) */}
        <div
          className="absolute inset-y-[7px] right-0 rounded-r-[4px]"
          style={{
            width: THICK,
            transform: `rotateY(90deg) translateZ(${-THICK / 2}px) translateX(${THICK / 2}px)`,
            background: "repeating-linear-gradient(90deg,#fdfdfd 0 1.5px,#dcdcdc 1.5px 3px)",
          }}
        />
        {/* spine (left edge) */}
        <div
          className="absolute inset-y-0 left-0 rounded-l-[4px]"
          style={{
            width: THICK,
            transform: `rotateY(-90deg) translateZ(${-THICK / 2}px) translateX(${-THICK / 2}px)`,
            background: "linear-gradient(90deg,#8f1316,#b3181b)",
          }}
        />

        {/* bookmark ribbon */}
        <div
          aria-hidden
          className="absolute -top-3 right-9 z-10 h-16 w-5 bg-turquesa shadow-md"
          style={{
            transform: `translateZ(${THICK / 2 + 1}px)`,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
          }}
        />

        {/* FRONT board */}
        <div
          className="absolute inset-0 overflow-hidden rounded-r-[8px] rounded-l-[4px] bg-accent-red shadow-[0_36px_70px_-24px_rgba(160,20,22,0.7)] ring-1 ring-black/15"
          style={{ transform: `translateZ(${THICK / 2}px)` }}
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
                    <HouseLine weight="fill" className="size-5 text-white" />
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

            {/* fixed top-light sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-transparent" />
            {/* cursor-tracked specular highlight (driven by CSS vars from BookTilt) */}
            <div
              className="book-glare pointer-events-none absolute inset-0"
              aria-hidden
            />
            {/* hinge shadow near spine */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-7 bg-gradient-to-r from-black/28 to-transparent" />
          </div>
        </div>
      </div>
    </>
  );
}
