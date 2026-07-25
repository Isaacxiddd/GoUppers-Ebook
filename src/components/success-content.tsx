"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  DownloadSimple,
  WarningCircle,
  SpinnerGap,
} from "@phosphor-icons/react";
import { CtaButton } from "@/components/ui/cta-button";

type State =
  | { kind: "loading" }
  | { kind: "paid"; downloadUrl: string; email: string | null }
  | { kind: "unpaid" }
  | { kind: "error" };

export function SuccessContent({ sessionId }: { sessionId?: string }) {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!sessionId) {
      setState({ kind: "error" });
      return;
    }
    let active = true;
    (async () => {
      try {
        const res = await fetch(
          `/api/session?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (!active) return;
        if (res.status === 402) return setState({ kind: "unpaid" });
        if (!res.ok) return setState({ kind: "error" });
        const data = (await res.json()) as {
          downloadUrl: string;
          email: string | null;
        };
        setState({ kind: "paid", ...data });
      } catch {
        if (active) setState({ kind: "error" });
      }
    })();
    return () => {
      active = false;
    };
  }, [sessionId]);

  if (state.kind === "loading") {
    return (
      <Card>
        <SpinnerGap className="size-10 animate-spin text-muted" />
        <h1 className="mt-6 font-display text-2xl font-800 text-ink">
          Confirmando tu pago…
        </h1>
        <p className="mt-2 text-muted">Esto toma solo un segundo.</p>
      </Card>
    );
  }

  if (state.kind === "paid") {
    return (
      <Card>
        <span className="grid size-16 place-items-center rounded-full bg-green-light/15">
          <CheckCircle weight="fill" className="size-10 text-green-dark" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-800 tracking-tight text-ink">
          ¡Listo! Ya es tuyo.
        </h1>
        <p className="mt-3 max-w-sm text-muted">
          Gracias por tu compra. Descargá la Guía para propietarios ahora mismo.
          {state.email ? ` También te la enviamos a ${state.email}.` : ""}
        </p>
        <div className="mt-8">
          <CtaButton href={state.downloadUrl}>
            <DownloadSimple weight="bold" className="size-5" />
            Descargar el ebook
          </CtaButton>
        </div>
        <p className="mt-4 text-[13px] text-muted">
          El enlace es temporal. Si expira, volvé a abrir esta página desde tu
          correo.
        </p>
      </Card>
    );
  }

  if (state.kind === "unpaid") {
    return (
      <Card>
        <WarningCircle weight="fill" className="size-12 text-accent-gold" />
        <h1 className="mt-6 font-display text-2xl font-800 text-ink">
          El pago todavía no se confirmó
        </h1>
        <p className="mt-2 max-w-sm text-muted">
          Si acabás de pagar, esperá unos segundos y recargá. Si el problema
          sigue, escribinos a hola@gouppers.com.
        </p>
        <a href="/#comprar" className="mt-6 text-sm font-600 text-accent-red-cta">
          Volver a intentar
        </a>
      </Card>
    );
  }

  return (
    <Card>
      <WarningCircle weight="fill" className="size-12 text-accent-red" />
      <h1 className="mt-6 font-display text-2xl font-800 text-ink">
        No pudimos verificar tu compra
      </h1>
      <p className="mt-2 max-w-sm text-muted">
        No te preocupes, no perdiste nada. Escribinos a hola@gouppers.com con tu
        comprobante y te enviamos el ebook enseguida.
      </p>
      <a href="/" className="mt-6 text-sm font-600 text-accent-red-cta">
        Volver al inicio
      </a>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-5 py-16 text-center">
      <div className="flex flex-col items-center">{children}</div>
    </div>
  );
}
