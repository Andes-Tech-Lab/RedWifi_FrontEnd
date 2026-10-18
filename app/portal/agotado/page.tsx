"use client";
import { Comercial } from "@/components/Secciones";
import { esDemo, urlCodigo, useQuery } from "@/lib/hotspot";
import { useLanding } from "@/lib/useLanding";

export default function Agotado() {
  const { hotspot } = useQuery();
  const { datos } = useLanding();
  const nombre = datos?.negocio.nombre ?? "Chinkana";

  return (
    <div className="pagina">
      <div className="hero">
        <main className="card">
          <div className="icono suave">☕</div>
          <h1 className="marca">Ya usaste tu WiFi de hoy</h1>
          <p className="sub">
            Tus <b>{datos?.negocio.wifi_minutos ?? 40} min gratis</b> se renuevan mañana.
            <br />
            ¿Necesitas más tiempo? Pide un <b>código de 3 h u 8 h</b> en caja.
          </p>
          <button
            className="btn btn-go"
            type="button"
            onClick={() => {
              if (!esDemo(hotspot)) window.location.href = urlCodigo(hotspot);
            }}
          >
            Tengo un código
          </button>
          <p className="pie-card">
            WiFi de cortesía de <b>{nombre}</b>
          </p>
        </main>
        <a href="#promo" className="ver-promo">
          ✨ <b>Mientras tanto, mira la promo del día</b> ↓
        </a>
      </div>
      <Comercial datos={datos} />
    </div>
  );
}
