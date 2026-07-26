import type { Metadata } from "next";
import { Comfortaa, DM_Sans, Great_Vibes } from "next/font/google";
import "./globals.css";

// Comfortaa = tipografía primaria oficial (palo seco redondeado).
const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

// DM Sans = sustituto gratuito de "Woodford Bourne" (fuente paga).
// Geométrico, limpio, corporativo — el más cercano en espíritu.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Great Vibes = sustituto gratuito de "Billie Signature" (cursiva/caligráfica).
// Solo para acentos y palabras clave dentro de títulos.
const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const FALLBACK_URL = "http://localhost:3000";
function metadataBase(): URL {
  try {
    return new URL((process.env.NEXT_PUBLIC_APP_URL ?? FALLBACK_URL).trim());
  } catch {
    return new URL(FALLBACK_URL);
  }
}

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: "Guía para propietarios | GoUppers",
  description:
    "La guía definitiva para convertir tu propiedad en un alquiler vacacional que genera ingresos todos los meses. Estrategias probadas de GoUppers.",
  openGraph: {
    title: "Guía para propietarios | GoUppers",
    description:
      "Convertí tu propiedad en un alquiler vacacional rentable. La guía definitiva de GoUppers para propietarios.",
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${comfortaa.variable} ${dmSans.variable} ${greatVibes.variable} antialiased`}
    >
      <body className="min-h-[100dvh] flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
