"use client";

import { motion, useReducedMotion } from "motion/react";
import { ShieldCheck, ArrowDown } from "@phosphor-icons/react";
import { CtaButton } from "@/components/ui/cta-button";
import { EbookCover } from "@/components/ebook-cover";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease },
        };

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-bg-hero"
      style={{ background: "var(--bg-hero)" }}
    >
      {/* warm radial glow behind the cover — depth, not neon */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, #ff3b30 0%, transparent 70%)" }}
      />

      <div className="mx-auto grid min-h-[100dvh] max-w-7xl grid-cols-1 items-center gap-12 px-5 pb-16 pt-28 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pt-24">
        {/* ── copy ── */}
        <div className="max-w-xl">
          <motion.span
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full border border-green-light/40 bg-green-dark px-4 py-1.5 text-[12px] font-600 uppercase tracking-[0.14em] text-green-light"
          >
            <ShieldCheck weight="fill" className="size-4" />
            Guía definitiva para propietarios
          </motion.span>

          <motion.h1
            {...rise(0.08)}
            className="mt-6 font-display text-[2.6rem] font-800 leading-[1.02] tracking-tight text-white sm:text-6xl"
          >
            Tu propiedad ya es buena.
            <br />
            Hacela <span className="text-accent-red">rentable</span>,{" "}
            <span className="text-accent-gold">también.</span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-6 max-w-md text-lg leading-relaxed text-white/70"
          >
            La guía definitiva para transformar tu casa o departamento en un
            alquiler vacacional que rinde todos los meses.
          </motion.p>

          <motion.div
            {...rise(0.24)}
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
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
          </motion.div>
        </div>

        {/* ── cover ── */}
        <motion.div
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 40, rotate: -3 },
                animate: { opacity: 1, y: 0, rotate: 0 },
                transition: { duration: 0.9, delay: 0.2, ease },
              })}
          className="flex justify-center lg:justify-end"
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={
              reduce
                ? undefined
                : { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <EbookCover />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
