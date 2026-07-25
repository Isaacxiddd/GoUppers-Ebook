import Image from "next/image";

/** GoUppers brand mark (real SVG in /public) + wordmark. */
export function Logo({
  href = "#top",
  wordmarkClass = "text-ink",
  size = 30,
}: {
  href?: string;
  wordmarkClass?: string;
  size?: number;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-2"
      aria-label="GoUppers, inicio"
    >
      <Image
        src="/gouppers-logo.svg"
        alt=""
        width={Math.round((size * 1589) / 1674)}
        height={size}
        priority
        unoptimized
      />
      <span
        className={`font-display text-xl font-800 tracking-tight ${wordmarkClass}`}
      >
        GoUppers
      </span>
    </a>
  );
}
