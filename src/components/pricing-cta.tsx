import { Check, FilePdf } from "@phosphor-icons/react/dist/ssr";
import { PurchaseButton } from "@/components/purchase-button";
import { Reveal } from "@/components/ui/reveal";
import { PRODUCT, priceLabel } from "@/lib/product";

const INCLUDES = [
  "La guía completa en PDF, lista para leer en el celular",
  "Checklist de fotos y puesta a punto de la propiedad",
  "Guion de mensajes para reseñas de 5 estrellas",
];

export function PricingCta() {
  return (
    <section id="comprar" className="lazy-section bg-paper-2 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] bg-ink text-white shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]">
            <div className="grid gap-10 p-8 sm:p-12 md:grid-cols-[1.1fr_0.9fr]">
              {/* left: what you get */}
              <div>
                <h2 className="font-display text-3xl font-800 leading-[1.05] tracking-tight sm:text-4xl">
                  Llevá el sistema GoUppers
                  <br />
                  a donde quieras.
                </h2>
                <p className="mt-3 text-white/60">{PRODUCT.subtitle}.</p>

                <ul className="mt-8 space-y-3.5">
                  {INCLUDES.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-turquesa/20">
                        <Check weight="bold" className="size-3.5 text-turquesa" />
                      </span>
                      <span className="text-[15px] text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* right: price + buy */}
              <div className="flex flex-col justify-between rounded-2xl bg-white/5 p-7 ring-1 ring-white/10">
                <div>
                  <p className="text-sm font-500 text-white/55">Pago único</p>
                  <p className="mt-1 flex items-baseline gap-2">
                    <span className="text-lg text-white/35 line-through">USD 79+</span>
                    <span className="font-display text-5xl font-800 tracking-tight">
                      {priceLabel}
                    </span>
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-white/55">
                    <FilePdf weight="fill" className="size-4" />
                    {PRODUCT.format}
                  </p>
                </div>

                <div className="mt-8">
                  <PurchaseButton label="Obtener mi guía ahora" />
                  <p className="mt-3 text-center text-xs text-white/40">
                    Descarga inmediata en PDF
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
