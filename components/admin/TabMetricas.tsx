"use client";
import { useCallback, useEffect, useState } from "react";
import { mensaje, type Api } from "./comun";

type Top = { ref: string; n: number; nombre?: string };
type Metricas = { dias: number; totales: Record<string, number>; promo: Top[]; contenidos: Top[]; suscripciones: Top[] };

const FILAS: { tipo: string; txt: string; ayuda: string }[] = [
  { tipo: "portal_visita", txt: "Visitas al portal", ayuda: "Veces que se abrió el portal antes de conectarse" },
  { tipo: "conexion_intento", txt: "Tocaron «Conectarme»", ayuda: "Intentos de conexión" },
  { tipo: "conexion", txt: "Conexiones completadas", ayuda: "Llegaron a «¡Conectado!» con internet comprobado" },
  { tipo: "promo_click", txt: "Clics en la promo", ayuda: "Oferta destacada del portal y de «¡Conectado!»" },
  { tipo: "menu_visita", txt: "Visitas a la carta", ayuda: "La carta llegó a verse en pantalla" },
  { tipo: "contenido_click", txt: "Clics en contenidos", ayuda: "Sabores, turismo, marcas y novedades" },
  { tipo: "wa_suscripcion", txt: "Suscripciones a WhatsApp", ayuda: "Con consentimiento registrado (portal o «¡Conectado!»)" },
];

/** Analítica sin datos personales. Las ventas atribuibles se medirán con el código de campaña en el POS. */
export default function TabMetricas({ api }: { api: Api }) {
  const [dias, setDias] = useState(7);
  const [m, setM] = useState<Metricas | null>(null);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => setM(await api<Metricas>(`/metricas?dias=${dias}`)), [api, dias]);
  useEffect(() => {
    cargar().catch((e) => setError(mensaje(e)));
  }, [cargar]);

  const n = (tipo: string) => m?.totales[tipo] ?? 0;
  const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : "—");

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel-admin">
        <div className="form-linea" style={{ justifyContent: "space-between" }}>
          <h2>Métricas del portal</h2>
          <select className="inp" value={dias} onChange={(e) => setDias(+e.target.value)}>
            <option value={1}>Hoy (24 h)</option>
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
          </select>
        </div>
        <p className="ayuda">Sin datos personales: solo qué pasó y cuándo. Las ventas atribuibles se medirán con el código de campaña en el POS (pendiente).</p>
        <div className="tabla-wrap">
          <table className="tabla">
            <tbody>
              {FILAS.map((f) => (
                <tr key={f.tipo}>
                  <td>
                    <b>{f.txt}</b>
                    <div className="ayuda" style={{ margin: 0 }}>{f.ayuda}</div>
                  </td>
                  <td className="num"><b>{n(f.tipo)}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="ayuda" style={{ marginTop: 10 }}>
          De visita a conexión: <b>{pct(n("conexion"), n("portal_visita"))}</b> · Suscripción por conexión:{" "}
          <b>{pct(n("wa_suscripcion"), n("conexion"))}</b>
        </p>
      </div>

      <div className="panel-admin">
        <h2>Lo que más interesa</h2>
        <h3 className="sub-admin">Productos de la promo</h3>
        <Lista items={m?.promo ?? []} />
        <h3 className="sub-admin" style={{ marginTop: 12 }}>Contenidos</h3>
        <Lista items={m?.contenidos ?? []} />
      </div>
    </div>
  );
}

function Lista({ items }: { items: Top[] }) {
  if (!items.length) return <p className="ayuda">Todavía sin datos.</p>;
  return (
    <table className="tabla">
      <tbody>
        {items.map((x) => (
          <tr key={x.ref}>
            <td>{x.nombre ?? x.ref}</td>
            <td className="num">{x.n}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
