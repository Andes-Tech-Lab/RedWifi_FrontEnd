"use client";
import { useEffect } from "react";
import Conexion from "@/components/Conexion";
import { BotonPromo, Comercial } from "@/components/Secciones";
import { esDemo, qs, useQuery } from "@/lib/hotspot";
import { useLanding } from "@/lib/useLanding";

export default function Landing() {
  const { hotspot, leido } = useQuery();
  const { datos } = useLanding();

  // El MikroTik dice trial=no cuando el equipo ya usó sus minutos de hoy.
  const agotado = leido && !esDemo(hotspot) && hotspot.trial !== "yes";
  useEffect(() => {
    if (agotado) window.location.replace("/portal/agotado/" + qs(hotspot));
  }, [agotado, hotspot]);

  return (
    <div className="pagina">
      <div className="hero">
        <Conexion hotspot={hotspot} nombre={datos?.negocio.nombre ?? "Chinkana"} minutos={datos?.negocio.wifi_minutos ?? 40} />
        <BotonPromo clima={datos?.clima ?? null} />
      </div>
      <Comercial datos={datos} />
    </div>
  );
}
