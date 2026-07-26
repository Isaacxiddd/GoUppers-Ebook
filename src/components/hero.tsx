import { Lightning } from "@phosphor-icons/react/dist/ssr";
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
            Tu propiedad vacía
            <br />
            puede <span className="text-amarillo">facturar</span>{" "}
            <br className="hidden sm:block" />{" "}
            <span className="text-turquesa">en 30 días.</span>
          </h1>

          <p className="max-w-md text-base leading-relaxed text-white/65 sm:text-lg">
            La guía de GoUppers para que tengas el sistema completo a mano:
            pasos, números y plantillas que ya funcionan en 60+ ciudades.
          </p>

          <div className="flex flex-col items-center gap-4">
            <CtaButton href="#comprar" pulse>
              Empezar a facturar
            </CtaButton>
          </div>

          <div className="flex flex-col items-center gap-2 text-sm text-white/40">
            <div className="flex items-center gap-1">
              {"★★★★★".split("").map((s, i) => (
                <span key={i} className="text-amarillo">{s}</span>
              ))}
              <span className="ml-1">400+ propiedades administradas por GoUppers</span>
            </div>
            <span className="flex items-center gap-2">
              <Lightning weight="fill" className="size-3.5 text-turquesa" />
              Descarga instantánea · Sin suscripciones · Pago seguro
            </span>
          </div>
        </div>
      </section>

      {/* ── Scroll-driven 3D book experience ── */}
      <BookScrollScene />
    </>
  );
}
