import { Logo } from "@/components/logo";

const NAV = [
  { label: "Qué incluye", href: "#beneficios" },
  { label: "Para quién es", href: "#para-quien" },
  { label: "Opiniones", href: "#opiniones" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo href="#top" wordmarkClass="text-ink" />

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-500 text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#comprar"
          className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-600 text-white transition-transform hover:-translate-y-px active:translate-y-0"
        >
          Quiero el ebook
        </a>
      </div>
    </header>
  );
}
