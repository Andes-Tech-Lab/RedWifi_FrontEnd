"use client";
import { useCallback, useEffect, useState } from "react";
import { media } from "@/lib/api";
import type { Producto, Temperatura } from "@/lib/tipos";
import { mensaje, type Api } from "./comun";

type Categoria = { id: number; nombre: string; emoji: string; orden: number };
type Borrador = Omit<Producto, "id" | "foto"> & { id?: number; foto?: string | null };

const VACIO: Borrador = {
  categoria_id: 0, nombre: "", descripcion: "", precio: 0, emoji: "", propio: false,
  temperatura: "ambas", destacado: false, activo: true, orden: 0,
};
const TEMP_TXT: Record<Temperatura, string> = { caliente: "🔥 caliente", fria: "🧊 fría", ambas: "—" };

export default function TabCarta({ api }: { api: Api }) {
  const [cats, setCats] = useState<Categoria[]>([]);
  const [prods, setProds] = useState<Producto[]>([]);
  const [edit, setEdit] = useState<Borrador | null>(null);
  const [nuevaCat, setNuevaCat] = useState({ nombre: "", emoji: "" });
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    const [c, p] = await Promise.all([api<Categoria[]>("/categorias"), api<Producto[]>("/productos")]);
    setCats(c);
    setProds(p);
  }, [api]);
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
    const { id, foto, ...datos } = edit;
    await accion(async () => {
      const r = await api<Producto>(id ? `/productos/${id}` : "/productos", { method: id ? "PUT" : "POST", json: datos });
      setEdit({ ...r });
    });
  }

  async function subirFoto(archivo: File) {
    if (!edit?.id) return;
    const fd = new FormData();
    fd.append("foto", archivo);
    await accion(async () => {
      const r = await api<Producto>(`/productos/${edit.id}/foto`, { method: "POST", body: fd, timeoutMs: 30000 });
      setEdit({ ...r });
    });
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="panel-admin">
        <h2>Categorías</h2>
        <div className="chips" style={{ justifyContent: "flex-start" }}>
          {cats.map((c) => (
            <span key={c.id} className="chip">
              {c.emoji} {c.nombre}
              <button className="x" title="Borrar" onClick={() => confirm(`¿Borrar "${c.nombre}"?`) && accion(() => api(`/categorias/${c.id}`, { method: "DELETE" }))}>
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="form-linea">
          <input className="inp" style={{ width: 70 }} placeholder="🍩" value={nuevaCat.emoji} onChange={(e) => setNuevaCat({ ...nuevaCat, emoji: e.target.value })} />
          <input className="inp" placeholder="Nueva categoría" value={nuevaCat.nombre} onChange={(e) => setNuevaCat({ ...nuevaCat, nombre: e.target.value })} />
          <button
            className="btn btn-go btn-chico"
            disabled={!nuevaCat.nombre}
            onClick={() => accion(async () => {
              await api("/categorias", { method: "POST", json: { ...nuevaCat, orden: cats.length } });
              setNuevaCat({ nombre: "", emoji: "" });
            })}
          >
            Agregar
          </button>
        </div>
      </div>

      <div className="panel-admin">
        <div className="form-linea" style={{ justifyContent: "space-between" }}>
          <h2>Productos ({prods.length})</h2>
          <button className="btn btn-go btn-chico" disabled={!cats.length} onClick={() => setEdit({ ...VACIO, categoria_id: cats[0]?.id ?? 0 })}>
            + Nuevo producto
          </button>
        </div>
        {cats.map((c) => {
          const lista = prods.filter((p) => p.categoria_id === c.id);
          if (!lista.length) return null;
          return (
            <div key={c.id} style={{ marginTop: 14 }}>
              <h3 className="sub-admin">{c.emoji} {c.nombre}</h3>
              <div className="tabla-wrap">
                <table className="tabla">
                  <tbody>
                    {lista.map((p) => (
                      <tr key={p.id} className={p.activo ? "" : "inactivo"}>
                        <td style={{ width: 54 }}>
                          {p.foto ? <img className="mini" src={media(p.foto)!} alt="" /> : <span style={{ fontSize: 26 }}>{p.emoji}</span>}
                        </td>
                        <td>
                          <b>{p.nombre}</b>
                          <div className="etiquetas">
                            {p.propio && <span className="et propio">Propio</span>}
                            {p.destacado && <span className="et">⭐ Destacado</span>}
                            {!p.activo && <span className="et">Oculto</span>}
                            <span className="et">{TEMP_TXT[p.temperatura]}</span>
                          </div>
                        </td>
                        <td className="num">S/ {p.precio.toFixed(2)}</td>
                        <td className="acciones">
                          <button className="btn btn-sec btn-chico" onClick={() => setEdit({ ...p })}>Editar</button>
                          <button className="btn btn-sec btn-chico" onClick={() => confirm(`¿Borrar "${p.nombre}"?`) && accion(() => api(`/productos/${p.id}`, { method: "DELETE" }))}>
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
            <h2>{edit.id ? "Editar producto" : "Nuevo producto"}</h2>
            <label className="lbl">Categoría
              <select className="inp" value={edit.categoria_id} onChange={(e) => setEdit({ ...edit, categoria_id: +e.target.value })}>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>)}
              </select>
            </label>
            <div className="form-linea">
              <label className="lbl" style={{ width: 80 }}>Emoji
                <input className="inp" value={edit.emoji} onChange={(e) => setEdit({ ...edit, emoji: e.target.value })} />
              </label>
              <label className="lbl" style={{ flex: 1 }}>Nombre
                <input className="inp" value={edit.nombre} onChange={(e) => setEdit({ ...edit, nombre: e.target.value })} />
              </label>
            </div>
            <label className="lbl">Descripción
              <textarea className="inp" rows={2} value={edit.descripcion} onChange={(e) => setEdit({ ...edit, descripcion: e.target.value })} />
            </label>
            <div className="form-linea">
              <label className="lbl" style={{ flex: 1 }}>Precio (S/)
                <input className="inp" type="number" step="0.5" min="0" value={edit.precio} onChange={(e) => setEdit({ ...edit, precio: +e.target.value })} />
              </label>
              <label className="lbl" style={{ flex: 1 }}>Temperatura (promo por clima)
                <select className="inp" value={edit.temperatura} onChange={(e) => setEdit({ ...edit, temperatura: e.target.value as Temperatura })}>
                  <option value="caliente">🔥 Caliente (días fríos)</option>
                  <option value="fria">🧊 Fría (días de calor)</option>
                  <option value="ambas">— No aplica</option>
                </select>
              </label>
              <label className="lbl" style={{ width: 80 }}>Orden
                <input className="inp" type="number" value={edit.orden} onChange={(e) => setEdit({ ...edit, orden: +e.target.value })} />
              </label>
            </div>
            <div className="checks">
              <label><input type="checkbox" checked={edit.propio} onChange={(e) => setEdit({ ...edit, propio: e.target.checked })} /> Elaboración propia (insignia &quot;Propio&quot;)</label>
              <label><input type="checkbox" checked={edit.destacado} onChange={(e) => setEdit({ ...edit, destacado: e.target.checked })} /> Destacado (sale primero en la promo)</label>
              <label><input type="checkbox" checked={edit.activo} onChange={(e) => setEdit({ ...edit, activo: e.target.checked })} /> Visible en la carta</label>
            </div>

            <div className="lbl">Foto
              {edit.id ? (
                <div className="form-linea">
                  {edit.foto && <img className="mini grande" src={media(edit.foto)!} alt="" />}
                  <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && subirFoto(e.target.files[0])} />
                  {edit.foto && (
                    <button className="btn btn-sec btn-chico" onClick={() => accion(async () => setEdit({ ...(await api<Producto>(`/productos/${edit.id}/foto`, { method: "DELETE" })) }))}>
                      Quitar foto
                    </button>
                  )}
                </div>
              ) : (
                <p className="ayuda">Guarda el producto primero para poder subir la foto.</p>
              )}
            </div>

            <div className="form-linea" style={{ justifyContent: "flex-end", marginTop: 12 }}>
              <button className="btn btn-sec btn-chico" onClick={() => setEdit(null)}>Cerrar</button>
              <button className="btn btn-go btn-chico" disabled={!edit.nombre} onClick={guardar}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
