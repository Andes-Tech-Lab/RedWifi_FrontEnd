"use client";
import { useCallback, useEffect, useState } from "react";
import { media } from "@/lib/api";
import type { Flyer } from "@/lib/tipos";
import { mensaje, type Api } from "./comun";

const CLIMA_TXT: Record<Flyer["clima"], string> = { siempre: "Siempre", frio: "🔥 Días fríos", calor: "🧊 Días de calor" };

export default function TabFlyers({ api }: { api: Api }) {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [titulo, setTitulo] = useState("");
  const [clima, setClima] = useState<Flyer["clima"]>("siempre");
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => setFlyers(await api<Flyer[]>("/flyers")), [api]);
  useEffect(() => {
    cargar().catch((e) => setError(mensaje(e)));
  }, [cargar]);

  async function accion(f: () => Promise<unknown>) {
    setError("");
    try {
      await f();
      await cargar();
    } catch (e) {
      setError(mensaje(e));
    }
  }

  async function subir() {
    if (!archivo) return;
    setSubiendo(true);
    const fd = new FormData();
    fd.append("imagen", archivo);
    fd.append("titulo", titulo);
    fd.append("clima", clima);
    fd.append("orden", String(flyers.length));
    await accion(async () => {
      await api("/flyers", { method: "POST", body: fd, timeoutMs: 60000 });
      setArchivo(null);
      setTitulo("");
      (document.getElementById("archivo-flyer") as HTMLInputElement).value = "";
    });
    setSubiendo(false);
  }

  const editar = (f: Flyer, cambios: Partial<Flyer>) => accion(() => api(`/flyers/${f.id}`, { method: "PUT", json: { ...f, ...cambios } }));

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel-admin">
        <h2>Subir flyer</h2>
        <p className="ayuda">
          Se muestran en un carrusel justo debajo del cuadro de conexión. Formato recomendado: vertical 1080×1350 (como un post de
          Instagram). Se convierte solo a WebP liviano.
        </p>
        <div className="form-linea">
          <label className="lbl">Imagen
            <input id="archivo-flyer" className="inp" type="file" accept="image/*" onChange={(e) => setArchivo(e.target.files?.[0] ?? null)} />
          </label>
          <label className="lbl" style={{ flex: 1 }}>Texto debajo (opcional)
            <input className="inp" value={titulo} placeholder="Nuevo: frappé de chocolate" onChange={(e) => setTitulo(e.target.value)} />
          </label>
          <label className="lbl">Cuándo se muestra
            <select className="inp" value={clima} onChange={(e) => setClima(e.target.value as Flyer["clima"])}>
              <option value="siempre">Siempre</option>
              <option value="frio">Solo días fríos</option>
              <option value="calor">Solo días de calor</option>
            </select>
          </label>
          <button className="btn btn-go btn-chico" disabled={!archivo || subiendo} onClick={subir}>
            {subiendo ? "Subiendo…" : "Subir"}
          </button>
        </div>
      </div>

      <div className="panel-admin">
        <h2>Flyers ({flyers.length})</h2>
        {!flyers.length && <p className="ayuda">Todavía no hay flyers. Mientras no haya, el carrusel no aparece en el portal.</p>}
        <div className="grilla-flyers">
          {flyers.map((f) => (
            <div key={f.id} className={`flyer-admin ${f.activo ? "" : "inactivo"}`}>
              <img src={media(f.imagen)!} alt="" />
              <div className="prod-cuerpo">
                <b>{f.titulo || "Sin texto"}</b>
                <select className="inp" value={f.clima} onChange={(e) => editar(f, { clima: e.target.value as Flyer["clima"] })}>
                  {Object.entries(CLIMA_TXT).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                </select>
                <label className="lbl">Orden
                  <input className="inp" type="number" defaultValue={f.orden} onBlur={(e) => +e.target.value !== f.orden && editar(f, { orden: +e.target.value })} />
                </label>
                <div className="form-linea">
                  <button className="btn btn-sec btn-chico" onClick={() => editar(f, { activo: !f.activo })}>{f.activo ? "Ocultar" : "Mostrar"}</button>
                  <button className="btn btn-sec btn-chico" onClick={() => confirm("¿Borrar este flyer?") && accion(() => api(`/flyers/${f.id}`, { method: "DELETE" }))}>Borrar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
