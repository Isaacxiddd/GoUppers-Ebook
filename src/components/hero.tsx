import { Lightning, Star, ShieldCheck, CreditCard } from "@phosphor-icons/react/dist/ssr";
import { CtaButton } from "@/components/ui/cta-button";
import { BookScrollScene } from "@/components/book-scroll-scene";

/** Server component: the LCP copy is static so it paints immediately (no mount
 *  animation gating LCP). The scroll-driven book is a client island. */
export function Hero() {
  return (
    <>
      {/* ── Top bar: title + CTA (always visible above the scroll scene) ── */}
      <section
        className="hero-bg relative overflow-hidden pb-8 pt-36 sm:pt-32"
      >

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

          {/* ── Trust strip: stars + social proof + security ── */}
          <div className="flex flex-col items-center gap-3">
            {/* Stars + rating */}
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

            {/* Trust badges row */}
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
        </div>
      </section>

      {/* ── Scroll-driven 3D book experience ── */}
      <BookScrollScene />
    </>
  );
}
