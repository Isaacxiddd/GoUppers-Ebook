import { HouseLine } from "@phosphor-icons/react/dist/ssr";

/** Designed eBook cover (the real product cover, per brand spec):
 *  red board, gold top stripe with the title, GoUppers wordmark.
 *  Rendered as a standing hardcover with a spine for depth. */
export function EbookCover({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative aspect-[3/4] w-full max-w-[340px] ${className}`}
      role="img"
      aria-label="Portada del ebook Guía para propietarios de GoUppers"
    >
      {/* soft ground shadow */}
      <div className="absolute inset-x-6 -bottom-6 h-10 rounded-[50%] bg-black/45 blur-2xl" />

      {/* spine */}
      <div className="absolute inset-y-2 left-0 w-3 rounded-l-md bg-[#c22f27]" />

      {/* front board */}
      <div className="absolute inset-0 left-3 overflow-hidden rounded-r-md rounded-l-sm bg-accent-red shadow-[0_30px_60px_-20px_rgba(0,0,0,0.65)] ring-1 ring-black/10">
        {/* gold top stripe */}
        <div className="flex items-center justify-center bg-accent-gold px-5 py-3">
          <span className="font-display text-[15px] font-700 tracking-tight text-[#3a2f05]">
            Guía para propietarios
          </span>
        </div>

        {/* cover body */}
        <div className="flex h-full flex-col justify-between px-6 pb-8 pt-7">
          <div>
            <p className="font-sans text-[11px] font-600 uppercase tracking-[0.2em] text-white/70">
              Edición 2026
            </p>
            <p className="mt-4 font-display text-3xl font-800 leading-[1.05] tracking-tight text-white">
              Tu propiedad,
              <br />
              trabajando
              <br />
              para vos.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-white/15 ring-1 ring-white/25">
              <HouseLine weight="fill" className="size-5 text-white" />
            </span>
            <span className="font-display text-xl font-800 tracking-tight text-white">
              GoUppers
            </span>
          </div>
        </div>

        {/* page-edge highlight */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-px bg-white/25" />
      </div>
    </div>
  );
}
