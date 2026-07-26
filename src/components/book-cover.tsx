
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
        {/* page block — fore-edge (right): fine warm leaves + shading */}
        <div
          className="absolute inset-y-[6px] right-0 rounded-r-[3px]"
          style={{
            width: THICK,
            transform: `rotateY(90deg) translateZ(${-THICK / 2}px) translateX(${THICK / 2}px)`,
            backgroundColor: "#efe8d6",
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(92,80,58,0.32) 0 0.6px, rgba(255,255,255,0) 0.6px 2.3px), linear-gradient(90deg, rgba(0,0,0,0.32), transparent 22%), linear-gradient(180deg, rgba(0,0,0,0.26), transparent 13%, transparent 87%, rgba(0,0,0,0.26))",
            boxShadow: "inset 0 0 8px rgba(0,0,0,0.28)",
          }}
        />
        {/* page block — top edge: page tops visible when the book leans back */}
        <div
          className="absolute left-[6px] right-[6px] top-0 rounded-t-[2px]"
          style={{
            height: THICK,
            transform: `rotateX(90deg) translateZ(${THICK / 2}px)`,
            transformOrigin: "top",
            backgroundColor: "#efe8d6",
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(92,80,58,0.22) 0 0.6px, rgba(255,255,255,0) 0.6px 3px), linear-gradient(90deg, rgba(0,0,0,0.28), transparent 18%, transparent 82%, rgba(0,0,0,0.12))",
          }}
        />
        {/* a few individual leaves peeking past the front board (natural, imperfect) */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            aria-hidden
            className="absolute rounded-r-[2px]"
            style={{
              top: 11 + i * 2,
              bottom: 12 + i * 3,
              right: -1.5 - i * 0.6,
              width: 7,
              background: "linear-gradient(90deg,#efe6d2,#fbf7ec)",
              transform: `translateZ(${THICK / 2 - 3 - i * 4}px)`,
              boxShadow: "0 1px 1.5px rgba(0,0,0,0.16)",
            }}
          />
        ))}
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
