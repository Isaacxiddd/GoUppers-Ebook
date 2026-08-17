import Image from "next/image";
import { CurrencyDollar, Camera, Star, ChartLineUp } from "@phosphor-icons/react/dist/ssr";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { MobileSwipe } from "@/components/ui/mobile-swipe";
import { DeptPhoto } from "@/components/ui/dept-photo";

export function Benefits() {
  return (
    <section id="beneficios" className="lazy-section bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-700 uppercase tracking-[0.16em] text-accent-red-cta">
            Qué vas a aprender
          </p>
          <h2 className="mt-4 font-display text-4xl font-800 leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Todo lo que separa una propiedad vacía de una que factura.
          </h2>
        </Reveal>

        {/* Mobile: swipe manual · Desktop: bento intacto */}
        <RevealGroup className="mt-14 sm:grid sm:grid-cols-1 sm:gap-5 md:grid-cols-3">
          <MobileSwipe>
          {/* A — wide, dark, with real "full calendar" screenshot */}
          <RevealItem className="md:col-span-2 max-sm:w-[85%] max-sm:shrink-0 max-sm:snap-center">
            <article className="grid h-full grid-cols-1 items-center gap-8 rounded-3xl bg-ink p-8 text-white sm:p-10 md:grid-cols-[1fr_auto]">
              <div className="flex h-full flex-col justify-between">
                <CurrencyDollar weight="duotone" className="size-9 text-turquesa" />
                <div className="mt-10 sm:mt-16">
                  <h3 className="font-display text-2xl font-700 tracking-tight sm:text-3xl">
                    Precios que llenan el calendario
                  </h3>
                  <p className="mt-3 max-w-md text-white/65">
                    La fórmula para fijar tarifas por temporada, día de semana y
                    demanda real. Sin regalar noches ni espantar reservas.
                  </p>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[260px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
                <Image
                  src="/images/proof/calendario-lleno.jpg"
                  alt="Calendario de reservas casi completo, con huéspedes confirmados casi todos los días del mes"
                  width={1320}
                  height={1467}
                  sizes="(max-width: 768px) 80vw, 260px"
                  className="h-auto w-full"
                />
              </div>
            </article>
          </RevealItem>

          {/* B — photo of the property */}
          <RevealItem className="max-sm:w-[85%] max-sm:shrink-0 max-sm:snap-center">
            <article className="relative flex h-full min-h-[280px] flex-col justify-end overflow-hidden rounded-3xl">
              <DeptPhoto
                alt="Fotografías profesionales de un departamento para alquiler vacacional"
                sizes="(max-width: 768px) 100vw, 33vw"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="relative flex items-start gap-3 p-8">
                <Camera weight="duotone" className="mt-1 size-6 shrink-0 text-amarillo" />
                <div>
                  <h3 className="font-display text-2xl font-700 tracking-tight text-white">
                    Fotos que venden solas
                  </h3>
                  <p className="mt-2 text-sm text-white/75">
                    Cómo mostrar tu propiedad para que el huésped haga clic en
                    reservar, aunque uses el celular.
                  </p>
                </div>
              </div>
            </article>
          </RevealItem>

          {/* C — image cell */}
          <RevealItem className="max-sm:w-[85%] max-sm:shrink-0 max-sm:snap-center">
            <article className="relative flex h-full min-h-[280px] flex-col justify-end overflow-hidden rounded-3xl">
              <DeptPhoto
                alt="Interior de un departamento preparado para alquiler vacacional"
                sizes="(max-width: 768px) 100vw, 33vw"
                className="absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="relative p-8">
                <h3 className="font-display text-2xl font-700 tracking-tight text-white">
                  Puesta a punto
                </h3>
                <p className="mt-2 text-sm text-white/75">
                  El checklist de amenities que sube tu tarifa sin gastar de más.
                </p>
              </div>
            </article>
          </RevealItem>

          {/* D — wide, with real 5-star review screenshot */}
          <RevealItem className="md:col-span-2 max-sm:w-[85%] max-sm:shrink-0 max-sm:snap-center">
            <article className="grid h-full grid-cols-1 items-center gap-8 rounded-3xl border border-line bg-paper-2 p-8 sm:p-10 md:grid-cols-[1fr_auto]">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center gap-2">
                  <ChartLineUp weight="duotone" className="size-9 text-accent-red" />
                  <Star weight="fill" className="size-6 text-accent-red-cta" />
                </div>
                <div className="mt-10 sm:mt-16">
                  <h3 className="font-display text-2xl font-700 tracking-tight text-ink sm:text-3xl">
                    Reseñas de 5 estrellas en piloto automático
                  </h3>
                  <p className="mt-3 max-w-md text-muted">
                    El guion de mensajes y la experiencia de llegada que convierte
                    huéspedes en reseñas, y reseñas en más reservas.
                  </p>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-24px_rgba(0,0,0,0.35)] ring-1 ring-line">
                <Image
                  src="/images/proof/resena-detalle.jpg"
                  alt="Reseña real de una huésped con calificación de 5 estrellas"
                  width={1320}
                  height={1119}
                  sizes="(max-width: 768px) 80vw, 280px"
                  className="h-auto w-full"
                />
              </div>
            </article>
          </RevealItem>
          </MobileSwipe>
        </RevealGroup>
      </div>
    </section>
  );
}
