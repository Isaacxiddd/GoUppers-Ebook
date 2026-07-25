import type { Metadata } from "next";
import { Comfortaa, Poppins } from "next/font/google";
import "./globals.css";

// Comfortaa = tipografía primaria oficial (palo seco redondeado). Solo los pesos usados.
const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

// Poppins = sustituto geométrico de "Woodford Bourne" (fuente paga) para el cuerpo.
// TODO(brand): reemplazar por Woodford Bourne real (.woff2) cuando esté disponible.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
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
      className={`${comfortaa.variable} ${poppins.variable} antialiased`}
    >
      <body className="min-h-[100dvh] flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
