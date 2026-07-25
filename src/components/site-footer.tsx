import { Logo } from "@/components/logo";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-bg-hero text-white" style={{ background: "var(--bg-hero)" }}>
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-10 sm:flex-row sm:items-center sm:justify-between">
          <Logo href="#top" wordmarkClass="text-white" />
          <a
            href="#comprar"
            className="inline-flex w-fit items-center rounded-full bg-white px-5 py-2.5 text-sm font-700 text-ink transition-transform hover:-translate-y-px"
          >
            Quiero el ebook
          </a>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} GoUppers. Todos los derechos reservados.</p>
          <nav className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white">
              Términos
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Privacidad
            </a>
            <a href="mailto:hola@gouppers.com" className="transition-colors hover:text-white">
              Contacto
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
