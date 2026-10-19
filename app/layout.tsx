import type { Metadata, Viewport } from "next";
import { Caveat, Marcellus } from "next/font/google";
import Fondo from "@/components/Fondo";
import "./globals.css";

// Se descarga al compilar y la sirve la PC: el cliente no tiene internet cuando ve el portal.
// Marcellus: romana como el letrero de la fachada. Caveat: manuscrita del lema "Del origen a tu taza".
const serif = Marcellus({ subsets: ["latin"], weight: "400", variable: "--serif", display: "swap" });
const script = Caveat({ subsets: ["latin"], weight: ["500", "600"], variable: "--script", display: "swap" });

export const metadata: Metadata = {
  title: "Chinkana · WiFi",
  description: "Café y chocolate de nuestra tierra. Conéctate gratis a nuestro WiFi.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1b0f0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${serif.variable} ${script.variable}`}>
      <body>
        <Fondo />
        {children}
      </body>
    </html>
  );
}
