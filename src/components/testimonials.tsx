import Image from "next/image";
import { Star } from "@phosphor-icons/react/dist/ssr";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { MobileSwipe } from "@/components/ui/mobile-swipe";

/* Capturas reales de reseñas de huéspedes — prueba social verificable. */
const REAL_REVIEWS = [
  { src: "/images/proof/resena-valeria-v2.jpg", alt: "Reseña real de Valeria Díaz, 5 estrellas", w: 862, h: 770 },
  { src: "/images/proof/resena-zoe-v3.jpg", alt: "Reseña real de Zoe, 5 estrellas", w: 884, h: 812 },
  { src: "/images/proof/resena-alberto-v2.jpg", alt: "Reseña real de Alberto, 5 estrellas", w: 862, h: 812 },
];

/* Testimonios ilustrativos — reemplazar por reales antes de campaña pública.
   Registrado como deuda deliberada en .arquitecto/DEUDA.md. */
const TESTIMONIALS = [
  {
    quote:
      "Apliqué el capítulo de precios y en el primer mes pasé de 9 a 21 noches reservadas. La guía se pagó sola en una semana.",
    name: "Marcela Ferreyra",
    role: "Depto en Mar del Plata",
    initials: "MF",
    tone: "bg-accent-red",
  },
  {
    quote:
      "Tenía dos departamentos parados medio año. Con el checklist de fotos y llegada empecé a recibir reseñas de 5 estrellas seguidas.",
    name: "Damián Rossi",
    role: "2 propiedades en Córdoba",
    initials: "DR",
    tone: "bg-ink",
  },
  {
    quote:
      "Dejé de depender de la inmobiliaria que me cobraba comisión por todo. Ahora manejo mi casa de la costa yo solo, sin estrés.",
    name: "Lucía Paredes",
    role: "Casa en Rocha, Uruguay",
    initials: "LP",
    tone: "bg-cobalto",
  },
];

export function Testimonials() {
  return (
    <section id="opiniones" className="lazy-section bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-4xl font-800 leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Propietarios que ya
            <br className="hidden sm:block" /> le sacan jugo.
          </h2>
        </Reveal>

        {/* Mobile: swipe manual · Desktop: grid intacto */}
        <RevealGroup className="mt-14 sm:grid sm:grid-cols-1 sm:gap-6 md:grid-cols-3">
          <MobileSwipe>
          {TESTIMONIALS.map((t) => (
            <RevealItem key={t.name} className="max-sm:w-[85%] max-sm:shrink-0 max-sm:snap-center">
              <figure className="flex h-full flex-col rounded-3xl border border-line bg-paper p-7 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
                <div className="flex gap-1" role="img" aria-label="Calificación 5 de 5 estrellas">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} weight="fill" className="size-4 text-accent-red-cta" />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 text-[17px] leading-relaxed text-ink/85">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    className={`grid size-11 place-items-center rounded-full ${t.tone} text-sm font-700 text-white`}
                    aria-hidden
                  >
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-700 text-ink">{t.name}</span>
                    <span className="block text-[13px] text-muted">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
          </MobileSwipe>
        </RevealGroup>

        {/* Reseñas reales — capturas de plataforma */}
        <Reveal className="mt-20">
          <p className="text-sm font-700 uppercase tracking-[0.16em] text-accent-red-cta">
            Reseñas reales de huéspedes
          </p>
          <h3 className="mt-3 max-w-xl font-display text-2xl font-700 leading-tight tracking-tight text-ink sm:text-3xl">
            Directo de la plataforma, sin retoques.
          </h3>
        </Reveal>

        {/* Mobile: autoplay (se pausa al tocar) · Desktop: grid intacto */}
        <RevealGroup className="mt-10 sm:grid sm:grid-cols-3 sm:gap-5">
          <MobileSwipe autoplay>
          {REAL_REVIEWS.map((r) => (
            <RevealItem key={r.src} className="max-sm:w-[85%] max-sm:shrink-0 max-sm:snap-center">
              <div className="overflow-hidden rounded-2xl ring-1 ring-line/70">
                <Image
                  src={r.src}
                  alt={r.alt}
                  width={r.w}
                  height={r.h}
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="h-auto w-full"
                />
              </div>
            </RevealItem>
          ))}
          </MobileSwipe>
        </RevealGroup>
      </div>
    </section>
  );
}
