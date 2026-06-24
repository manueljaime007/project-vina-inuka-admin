import type { Metadata } from "next";
import { Playfair_Display, Jost } from "next/font/google";
import "./globals.css";

// Configurar fonte Playfair Display para headings
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

// Configurar fonte Jost para corpo do texto
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"], // Pesos opcionais
  style: ["normal", "italic"], // Estilos opcionais
});

export const metadata: Metadata = {
  title: "Vina-INUKA Admin",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={`
        ${jost.variable} 
        ${playfair.variable} 
        h-full antialiased
      `}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
