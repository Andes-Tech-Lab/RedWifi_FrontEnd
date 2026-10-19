"use client";
import { useCallback, useEffect, useState } from "react";
import { media } from "@/lib/api";
import type { Contenido, Seccion } from "@/lib/tipos";
import { mensaje, type Api } from "./comun";

const SECCIONES: { id: Seccion; txt: string; ayuda: string }[] = [
  { id: "sabores", txt: "Sabores", ayuda: "Café, cacao, recetas, cómo preparar bebidas" },
  { id: "turismo", txt: "Turismo", ayuda: "Tours, rutas y experiencias en Ayacucho" },
  { id: "marcas", txt: "Marcas", ayuda: "Productos propios y empresas aliadas" },
  { id: "novedades", txt: "Novedades", ayuda: "Promociones, eventos y actividades" },
];
type Borrador = Omit<Contenido, "id" | "imagen"> & { id?: number; imagen?: string | null };
const VACIO: Borrador = { seccion: "turismo", titulo: "", resumen: "", url: "", activo: true, orden: 0 };

/** Tarjetas del portal de contenidos que se ve en «¡Conectado!». Solo salen las secciones que tienen tarjetas. */
export default function TabContenidos({ api }: { api: Api }) {
  const [items, setItems] = useState<Contenido[]>([]);
  const [edit, setEdit] = useState<Borrador | null>(null);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => setItems(await api<Contenido[]>("/contenidos")), [api]);
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

  async function guardar() {
    if (!edit) return;
    const { id, imagen, ...datos } = edit;
    await accion(async () => setEdit({ ...(await api<Contenido>(id ? `/contenidos/${id}` : "/contenidos", { method: id ? "PUT" : "POST", json: datos })) }));
  }

  async function subirImagen(archivo: File) {
    if (!edit?.id) return;
    const fd = new FormData();
    fd.append("imagen", archivo);
    await accion(async () => setEdit({ ...(await api<Contenido>(`/contenidos/${edit.id}/imagen`, { method: "POST", body: fd, timeoutMs: 60000 })) }));
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="panel-admin">
        <div className="form-linea" style={{ justifyContent: "space-between" }}>
          <h2>Portal de contenidos</h2>
          <button className="btn btn-go btn-chico" onClick={() => setEdit({ ...VACIO })}>
            + Nueva tarjeta
          </button>
        </div>
        <p className="ayuda">
          Se muestran en «¡Conectado!», cuando el cliente ya tiene internet. Cada tarjeta debe enlazar a un destino real (web, catálogo,
          red social, WhatsApp de la empresa). Las secciones sin tarjetas no aparecen.
        </p>
        {SECCIONES.map((s) => {
          const lista = items.filter((c) => c.seccion === s.id);
          return (
            <div key={s.id} style={{ marginTop: 14 }}>
              <h3 className="sub-admin">
                {s.txt} <span className="ayuda">· {s.ayuda}</span>
              </h3>
              {!lista.length && <p className="ayuda">Sin tarjetas: la sección no se muestra.</p>}
              <div className="tabla-wrap">
                <table className="tabla">
                  <tbody>
                    {lista.map((c) => (
                      <tr key={c.id} className={c.activo ? "" : "inactivo"}>
                        <td style={{ width: 54 }}>{c.imagen && <img className="mini" src={media(c.imagen)!} alt="" />}</td>
                        <td>
                          <b>{c.titulo}</b>
                          <div className="etiquetas">
                            {!c.activo && <span className="et">Oculta</span>}
                            {!c.url && <span className="et">⚠️ Sin enlace</span>}
                          </div>
                        </td>
                        <td className="acciones">
                          <button className="btn btn-sec btn-chico" onClick={() => setEdit({ ...c })}>Editar</button>
                          <button className="btn btn-sec btn-chico" onClick={() => confirm(`¿Borrar "${c.titulo}"?`) && accion(() => api(`/contenidos/${c.id}`, { method: "DELETE" }))}>
                            Borrar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {edit && (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && setEdit(null)}>
          <div className="modal-caja">
            <h2>{edit.id ? "Editar tarjeta" : "Nueva tarjeta"}</h2>
            <label className="lbl">Sección
              <select className="inp" value={edit.seccion} onChange={(e) => setEdit({ ...edit, seccion: e.target.value as Seccion })}>
                {SECCIONES.map((s) => <option key={s.id} value={s.id}>{s.txt} — {s.ayuda}</option>)}
              </select>
            </label>
            <label className="lbl">Título
              <input className="inp" maxLength={100} value={edit.titulo} onChange={(e) => setEdit({ ...edit, titulo: e.target.value })} />
            </label>
            <label className="lbl">Resumen (una o dos frases)
              <textarea className="inp" rows={2} maxLength={400} value={edit.resumen} onChange={(e) => setEdit({ ...edit, resumen: e.target.value })} />
            </label>
            <label className="lbl">Enlace (https://…)
              <input className="inp" placeholder="https://" value={edit.url} onChange={(e) => setEdit({ ...edit, url: e.target.value.trim() })} />
            </label>
            <div className="form-linea">
              <label className="lbl" style={{ width: 90 }}>Orden
                <input className="inp" type="number" value={edit.orden} onChange={(e) => setEdit({ ...edit, orden: +e.target.value })} />
              </label>
              <div className="checks">
                <label><input type="checkbox" checked={edit.activo} onChange={(e) => setEdit({ ...edit, activo: e.target.checked })} /> Visible</label>
              </div>
            </div>
            <div className="lbl">Imagen (foto real del tour, producto o marca; horizontal)
              {edit.id ? (
                <div className="form-linea">
                  {edit.imagen && <img className="mini grande" src={media(edit.imagen)!} alt="" />}
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && subirImagen(e.target.files[0])} />
                </div>
              ) : (
                <p className="ayuda">Guarda la tarjeta primero para poder subir la imagen.</p>
              )}
            </div>
            <div className="form-linea" style={{ justifyContent: "flex-end", marginTop: 12 }}>
              <button className="btn btn-sec btn-chico" onClick={() => setEdit(null)}>Cerrar</button>
              <button className="btn btn-go btn-chico" disabled={!edit.titulo} onClick={guardar}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
