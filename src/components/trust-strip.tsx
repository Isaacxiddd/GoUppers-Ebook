import { Lightning, LockKey, SealCheck } from "@phosphor-icons/react/dist/ssr";

const ITEMS = [
  { icon: Lightning, label: "Descarga inmediata", sub: "Recibís el PDF apenas pagás" },
  { icon: LockKey, label: "Pago seguro con Stripe", sub: "Tus datos nunca pasan por nosotros" },
  { icon: SealCheck, label: "Garantía de 7 días", sub: "No te sirve, te devolvemos todo" },
];

export function TrustStrip() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {ITEMS.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3 px-6 py-5 sm:px-8">
            <Icon weight="duotone" className="size-6 shrink-0 text-accent-red" />
            <div>
              <p className="text-sm font-700 text-ink">{label}</p>
              <p className="text-[13px] text-muted">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
