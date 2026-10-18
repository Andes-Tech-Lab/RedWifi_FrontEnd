import type { Metadata, Viewport } from "next";
import Fondo from "@/components/Fondo";
import "./globals.css";

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
    <html lang="es">
      <body>
        <Fondo />
        {children}
      </body>
    </html>
  );
}
