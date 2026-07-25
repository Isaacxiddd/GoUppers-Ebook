import { ArrowDown, Lightning } from "@phosphor-icons/react/dist/ssr";
import { CtaButton } from "@/components/ui/cta-button";
import { BookTilt } from "@/components/book-tilt";
import { BookCover } from "@/components/book-cover";

/** Server component: the LCP copy is static so it paints immediately (no mount
 *  animation gating LCP). Only the 3D book is a client island. */
export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{ background: "var(--bg-hero)" }}
    >
      {/* brand glows — depth, not neon */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 h-[620px] w-[620px] rounded-full opacity-35"
        style={{ background: "radial-gradient(circle,rgba(244,46,49,0.9) 0%,transparent 62%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 bottom-0 h-[460px] w-[460px] rounded-full opacity-20"
        style={{ background: "radial-gradient(circle,rgba(39,208,186,0.9) 0%,transparent 62%)" }}
      />
      {/* oversized ghost wordmark breaking the grid */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-8 left-2 select-none font-display text-[26vw] font-700 leading-none tracking-tighter text-white/[0.03] sm:text-[20vw]"
      >
        GoUppers
      </span>

      <div className="relative mx-auto grid min-h-[100dvh] max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-6 lg:pt-24">
        {/* ── left: editorial copy (minimal, title-first) ── */}
        <div className="relative">
          <h1 className="font-display text-[2.8rem] font-700 leading-[1.04] tracking-tight text-white sm:text-[4rem]">
            Tu propiedad ya
            <br />
            es buena. Hazla{" "}
            <span className="text-amarillo">rentable</span>,
            <br className="hidden sm:block" />{" "}
            <span className="text-turquesa">también.</span>
          </h1>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-white/70">
            La guía definitiva para transformar tu casa o departamento en un
            alquiler vacacional que rinde todos los meses.
          </p>

          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <CtaButton href="#comprar" pulse>
              Quiero el ebook
            </CtaButton>
            <a
              href="#beneficios"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 text-base font-600 text-white/85 transition-colors hover:border-white/40 hover:text-white"
            >
              Ver qué incluye
              <ArrowDown weight="bold" className="size-4" />
            </a>
          </div>

          <p className="mt-6 text-sm text-white/45">
            Descarga inmediata · Garantía de 7 días
          </p>
        </div>

        {/* ── right: 3D book + floating accents ── */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            <BookTilt>
              <BookCover />
            </BookTilt>

            {/* floating amarillo seal */}
            <div className="seal-wobble absolute -right-2 -top-3 grid size-20 place-items-center rounded-full bg-amarillo text-center shadow-lg sm:-right-4">
              <span className="font-display text-[11px] font-700 uppercase leading-tight tracking-tight text-[#4a4408]">
                Edición
                <br />
                2026
              </span>
            </div>

            {/* floating turquesa chip */}
            <div className="absolute -left-3 bottom-8 flex items-center gap-2 rounded-full bg-turquesa px-3.5 py-2 text-[13px] font-600 text-[#083b34] shadow-lg sm:-left-8">
              <Lightning weight="fill" className="size-4" />
              Descarga inmediata
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
