"use client";

import { useState } from "react";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { CtaButton } from "@/components/ui/cta-button";

/** Client half of the checkout flow. Posts to /api/checkout (added in FASE 3)
 *  and redirects to the Stripe-hosted URL. Full idle/loading/error cycle. */
export function PurchaseButton({
  label = "Comprar ahora",
  pulse = true,
}: {
  label?: string;
  pulse?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "guia-propietarios" }),
      });
      if (!res.ok) throw new Error("checkout_failed");
      const data = (await res.json()) as { url?: string };
      if (!data.url) throw new Error("no_url");
      window.location.assign(data.url);
    } catch {
      setError("No pudimos iniciar el pago. Prueba de nuevo en un momento.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <CtaButton
        onClick={startCheckout}
        loading={loading}
        pulse={pulse && !loading}
        className="w-full sm:w-auto"
      >
        {loading ? "Redirigiendo…" : label}
      </CtaButton>
      {error && (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-sm font-500 text-accent-red"
        >
          <WarningCircle weight="fill" className="size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
