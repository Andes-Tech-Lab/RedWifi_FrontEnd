"use client";
import { useCallback, useEffect, useState } from "react";
import { pedir } from "@/lib/api";
import type { Landing, Producto } from "@/lib/tipos";
import { mensaje, type Api } from "./comun";

type Promo = { id: number; fecha: string; titulo: string; texto: string; producto_ids: number[]; activa: boolean };

const hoy = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export default function TabPromos({ api }: { api: Api }) {
  const [landing, setLanding] = useState<Landing | null>(null);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [prods, setProds] = useState<Producto[]>([]);
  const [umbral, setUmbral] = useState({ umbral_frio: "", umbral_calor: "" });
  const [nueva, setNueva] = useState({ fecha: hoy(), titulo: "", texto: "", producto_ids: [] as number[], activa: true });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const cargar = useCallback(async () => {
    const [l, p, pr, aj] = await Promise.all([
      pedir<Landing>("/api/landing"),
      api<Promo[]>("/promos"),
      api<Producto[]>("/productos"),
      api<Record<string, string>>("/ajustes"),
    ]);
    setLanding(l);
    setPromos(p);
    setProds(pr.filter((x) => x.activo));
    setUmbral({ umbral_frio: aj.umbral_frio, umbral_calor: aj.umbral_calor });
  }, [api]);
  useEffect(() => {
    cargar().catch((e) => setError(mensaje(e)));
  }, [cargar]);

  async function accion(f: () => Promise<unknown>, txt = "") {
    setError("");
    setOk("");
    try {
      await f();
      await cargar();
      if (txt) setOk(txt);
    } catch (e) {
      setError(mensaje(e));
    }
  }

  const c = landing?.clima;
  const nombre = (id: number) => prods.find((p) => p.id === id)?.nombre ?? `#${id}`;

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {ok && <div className="aviso">{ok}</div>}

      <div className="panel-admin">
        <h2>Así se ve hoy</h2>
        <p>
          {c ? (
            <>
              {c.icono} <b>{c.temp} °C</b> en Ayacucho ({c.descripcion}) → modo <b>{c.modo}</b>. Actualizado: {c.actualizado.replace("T", " ")}
            </>
          ) : (
            "Sin datos de clima (¿la PC tiene internet?)."
          )}
        </p>
        {landing && (
          <p className="ayuda" style={{ marginTop: 6 }}>
            Promo mostrada ({landing.promo.tipo}): <b>{landing.promo.titulo}</b> — {landing.promo.productos.map((p) => p.nombre).join(", ") || "sin productos"}
          </p>
        )}
        <button className="btn btn-sec btn-chico" style={{ display: "inline-flex" }} onClick={() => accion(() => api("/clima/actualizar", { method: "POST" }), "Clima actualizado.")}>
          Actualizar clima ahora
        </button>
      </div>

      <div className="panel-admin">
        <h2>Regla del clima</h2>
        <p className="ayuda">Frío: muestra bebidas marcadas como &quot;caliente&quot;. Calor: las marcadas como &quot;fría&quot;. En medio: los destacados.</p>
        <div className="form-linea">
          <label className="lbl">Frío si es ≤ (°C)
            <input className="inp" type="number" value={umbral.umbral_frio} onChange={(e) => setUmbral({ ...umbral, umbral_frio: e.target.value })} />
          </label>
          <label className="lbl">Calor si es ≥ (°C)
            <input className="inp" type="number" value={umbral.umbral_calor} onChange={(e) => setUmbral({ ...umbral, umbral_calor: e.target.value })} />
          </label>
          <button className="btn btn-go btn-chico" onClick={() => accion(() => api("/ajustes", { method: "PUT", json: umbral }), "Umbrales guardados.")}>
            Guardar
          </button>
        </div>
      </div>

      <div className="panel-admin">
        <h2>Promo manual</h2>
        <p className="ayuda">Si hay una promo activa para hoy, reemplaza a la automática del clima. Ej.: &quot;2x1 en frappés hoy&quot;.</p>
        <div className="form-linea">
          <label className="lbl">Fecha
            <input className="inp" type="date" value={nueva.fecha} onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })} />
          </label>
          <label className="lbl" style={{ flex: 1 }}>Título
            <input className="inp" value={nueva.titulo} placeholder="2x1 en frappés hoy" onChange={(e) => setNueva({ ...nueva, titulo: e.target.value })} />
          </label>
        </div>
        <label className="lbl">Texto
          <input className="inp" value={nueva.texto} placeholder="Solo hasta las 6 pm" onChange={(e) => setNueva({ ...nueva, texto: e.target.value })} />
        </label>
        <div className="lbl">Productos de la promo</div>
        <div className="checks grid">
          {prods.map((p) => (
            <label key={p.id}>
              <input
                type="checkbox"
                checked={nueva.producto_ids.includes(p.id)}
                onChange={(e) =>
                  setNueva({ ...nueva, producto_ids: e.target.checked ? [...nueva.producto_ids, p.id] : nueva.producto_ids.filter((i) => i !== p.id) })
                }
              />{" "}
              {p.emoji} {p.nombre}
            </label>
          ))}
        </div>
        <button
          className="btn btn-go btn-chico"
          style={{ display: "inline-flex", marginTop: 10 }}
          disabled={!nueva.titulo}
          onClick={() => accion(async () => {
            await api("/promos", { method: "POST", json: nueva });
            setNueva({ fecha: hoy(), titulo: "", texto: "", producto_ids: [], activa: true });
          }, "Promo creada.")}
        >
          Crear promo
        </button>

        {promos.length > 0 && (
          <div className="tabla-wrap" style={{ marginTop: 16 }}>
            <table className="tabla">
              <tbody>
                {promos.map((p) => (
                  <tr key={p.id} className={p.activa ? "" : "inactivo"}>
                    <td>{p.fecha}</td>
                    <td>
                      <b>{p.titulo}</b>
                      <div className="ayuda">{p.producto_ids.map(nombre).join(", ")}</div>
                    </td>
                    <td className="acciones">
                      <button className="btn btn-sec btn-chico" onClick={() => accion(() => api(`/promos/${p.id}`, { method: "PUT", json: { ...p, activa: !p.activa } }))}>
                        {p.activa ? "Desactivar" : "Activar"}
                      </button>
                      <button className="btn btn-sec btn-chico" onClick={() => confirm("¿Borrar la promo?") && accion(() => api(`/promos/${p.id}`, { method: "DELETE" }))}>
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
