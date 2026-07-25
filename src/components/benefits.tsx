import Image from "next/image";
import { CurrencyDollar, Camera, Star, ChartLineUp } from "@phosphor-icons/react/dist/ssr";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

export function Benefits() {
  return (
    <section id="beneficios" className="bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-700 uppercase tracking-[0.16em] text-accent-red-cta">
            Qué vas a aprender
          </p>
          <h2 className="mt-4 font-display text-4xl font-800 leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Todo lo que separa una propiedad vacía de una que factura.
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* A — wide, dark */}
          <RevealItem className="md:col-span-2">
            <article className="flex h-full flex-col justify-between rounded-3xl bg-ink p-8 text-white sm:p-10">
              <CurrencyDollar weight="duotone" className="size-9 text-turquesa" />
              <div className="mt-16">
                <h3 className="font-display text-2xl font-700 tracking-tight sm:text-3xl">
                  Precios que llenan el calendario
                </h3>
                <p className="mt-3 max-w-md text-white/65">
                  La fórmula para fijar tarifas por temporada, día de semana y
                  demanda real. Sin regalar noches ni espantar reservas.
                </p>
              </div>
            </article>
          </RevealItem>

          {/* B — gold tinted */}
          <RevealItem>
            <article className="flex h-full flex-col justify-between rounded-3xl border border-amarillo/60 bg-amarillo/15 p-8">
              <Camera weight="duotone" className="size-9 text-ink" />
              <div className="mt-16">
                <h3 className="font-display text-2xl font-700 tracking-tight text-ink">
                  Fotos que venden solas
                </h3>
                <p className="mt-3 text-muted">
                  Cómo mostrar tu propiedad para que el huésped haga clic en
                  reservar, aunque uses el celular.
                </p>
              </div>
            </article>
          </RevealItem>

          {/* C — image cell */}
          <RevealItem>
            <article className="relative flex h-full min-h-[280px] flex-col justify-end overflow-hidden rounded-3xl">
              <Image
                src="https://picsum.photos/seed/gouppers-apartment-interior/800/1000"
                alt="Interior de un departamento preparado para alquiler vacacional"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
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

          {/* D — wide */}
          <RevealItem className="md:col-span-2">
            <article className="flex h-full flex-col justify-between rounded-3xl border border-line bg-paper-2 p-8 sm:p-10">
              <div className="flex items-center gap-2">
                <ChartLineUp weight="duotone" className="size-9 text-accent-red" />
                <Star weight="fill" className="size-6 text-accent-red-cta" />
              </div>
              <div className="mt-16">
                <h3 className="font-display text-2xl font-700 tracking-tight text-ink sm:text-3xl">
                  Reseñas de 5 estrellas en piloto automático
                </h3>
                <p className="mt-3 max-w-md text-muted">
                  El guion de mensajes y la experiencia de llegada que convierte
                  huéspedes en reseñas, y reseñas en más reservas.
                </p>
              </div>
            </article>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
