import Image from "next/image";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/ui/reveal";

const POINTS = [
  "Comprás o ya tenés una propiedad y no sabés por dónde empezar.",
  "Ya alquilás, pero el calendario tiene más huecos que reservas.",
  "Estás cansado de dejar el 20% en manos de una inmobiliaria.",
  "Querés ingresos en dólares sin vivir pendiente del teléfono.",
];

export function ForWhom() {
  return (
    <section id="para-quien" className="bg-paper-2 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl sm:aspect-[4/3] lg:aspect-[4/5]">
            <Image
              src="https://picsum.photos/seed/gouppers-owner-balcony/900/1100"
              alt="Propietaria revisando las reservas de su alquiler vacacional"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal className="order-1 lg:order-2" delay={0.1}>
          <h2 className="font-display text-4xl font-800 leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Es para vos si te pasa
            <br />
            alguna de estas.
          </h2>
          <ul className="mt-10 space-y-5">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3.5">
                <CheckCircle
                  weight="fill"
                  className="mt-0.5 size-6 shrink-0 text-green-light"
                />
                <span className="text-lg leading-relaxed text-ink/85">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
