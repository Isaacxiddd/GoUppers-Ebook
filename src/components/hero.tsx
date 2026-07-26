import { ArrowDown, Lightning } from "@phosphor-icons/react/dist/ssr";
import { CtaButton } from "@/components/ui/cta-button";
import { BookScrollScene } from "@/components/book-scroll-scene";

/** Server component: the LCP copy is static so it paints immediately (no mount
 *  animation gating LCP). The scroll-driven book is a client island. */
export function Hero() {
  return (
    <>
      {/* ── Top bar: title + CTA (always visible above the scroll scene) ── */}
      <section
        className="relative overflow-hidden pb-8 pt-36 sm:pt-32"
        style={{ background: "var(--bg-hero)" }}
      >
        {/* brand glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 top-1/4 h-[420px] w-[420px] rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle,rgba(244,46,49,0.9) 0%,transparent 62%)",
          }}
        />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-7 px-5 text-center sm:px-8">
          <h1 className="font-display text-[2.4rem] font-700 leading-[1.04] tracking-tight text-white sm:text-[3.2rem]">
            Tu propiedad ya
            <br />
            es buena. Hazla{" "}
            <span className="text-amarillo">rentable</span>,
            <br className="hidden sm:block" />{" "}
            <span className="text-turquesa">también.</span>
          </h1>

          <p className="max-w-md text-base leading-relaxed text-white/65 sm:text-lg">
            La guía de GoUppers para que tengas el sistema completo a mano:
            pasos, números y plantillas que ya funcionan en 60+ ciudades.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <CtaButton href="#comprar" pulse>
              Obtener mi guía
            </CtaButton>
            <a
              href="#beneficios"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-4 text-base font-600 text-white/85 transition-colors hover:border-white/40 hover:text-white"
            >
              Ver qué incluye
              <ArrowDown weight="bold" className="size-4" />
            </a>
          </div>

          <div className="flex flex-col items-center gap-2 text-sm text-white/40">
            <div className="flex items-center gap-1">
              {"★★★★★".split("").map((s, i) => (
                <span key={i} className="text-amarillo">{s}</span>
              ))}
              <span className="ml-1">Basada en +130 mentorías y 400+ propiedades</span>
            </div>
            <span className="flex items-center gap-2">
              <Lightning weight="fill" className="size-3.5 text-turquesa" />
              Descarga instantánea · PDF + plantillas · Pago seguro
            </span>
          </div>
        </div>
      </section>

      {/* ── Scroll-driven 3D book experience ── */}
      <BookScrollScene />
    </>
  );
}
