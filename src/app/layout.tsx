import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      className={`${bricolage.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-[100dvh] flex flex-col bg-paper text-ink">
        {children}
      </body>
    </html>
  );
}
