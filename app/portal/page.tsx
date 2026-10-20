"use client";
import { useEffect } from "react";
import Conexion from "@/components/Conexion";
import Portada from "@/components/Portada";
import { Carta, Pie } from "@/components/Secciones";
import { esDemo, qs, useQuery } from "@/lib/hotspot";
import { IdiomaProvider, useMomentoDelDia } from "@/lib/idioma";
import { registrar } from "@/lib/metricas";
import { useLanding } from "@/lib/useLanding";

export default function Landing() {
  const { hotspot, leido } = useQuery();
  const { datos } = useLanding();

  // El MikroTik dice trial=no cuando el equipo ya usó sus minutos de hoy.
  const agotado = leido && !esDemo(hotspot) && hotspot.trial !== "yes";
  useEffect(() => registrar("portal_visita"), []);
  useEffect(() => {
    if (agotado) window.location.replace("/portal/agotado/" + qs(hotspot));
  }, [agotado, hotspot]);

  // Misma regla que la API y el login del MikroTik: clima extremo primero, si no la hora.
  const horaLocal = useMomentoDelDia();
  const momento = datos?.promo.momento ?? horaLocal;

  // Antes de conectarse, una sola pantalla: foto, promo del momento y el botón. La carta queda abajo
  // para quien quiera; lo demás (redes, historia, suscripción) va en /listo, ya con internet.
  return (
    <IdiomaProvider>
      <Portada datos={datos} momento={momento}>
        <Conexion
          hotspot={hotspot}
          nombre={datos?.negocio.nombre ?? "Chinkana"}
          minutos={datos?.negocio.wifi_minutos ?? 40}
          momento={momento}
        />
      </Portada>
      {datos && (
        <div className="pagina">
          <Carta datos={datos} />
          <Pie datos={datos} />
        </div>
      )}
    </IdiomaProvider>
  );
}
