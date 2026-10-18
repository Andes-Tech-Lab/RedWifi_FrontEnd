"use client";
import { useEffect, useState } from "react";
import { mensaje, type Api } from "./comun";

type Cliente = { id: number; telefono: string; nombre: string | null; email: string | null; visitas: number; creado: string; ultima_visita: string };

const fecha = (s: string) => s.replace("T", " ");

export default function TabClientes({ api }: { api: Api }) {
  const [q, setQ] = useState("");
  const [datos, setDatos] = useState<{ total: number; clientes: Cliente[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      api<{ total: number; clientes: Cliente[] }>(`/clientes?q=${encodeURIComponent(q)}`).then(setDatos).catch((e) => setError(mensaje(e)));
    }, 250);
    return () => clearTimeout(t);
  }, [api, q]);

  async function exportar() {
    try {
      const blob = await api<Blob>("/clientes.csv", { timeoutMs: 30000 });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `clientes-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      setError(mensaje(e));
    }
  }

  return (
    <div className="panel-admin">
      {error && <div className="error">{error}</div>}
      <div className="form-linea" style={{ justifyContent: "space-between" }}>
        <h2>Clientes {datos ? `(${datos.total})` : ""}</h2>
        <div className="form-linea">
          <input className="inp" placeholder="Buscar teléfono, nombre o correo" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn btn-go btn-chico" onClick={exportar}>Exportar CSV</button>
        </div>
      </div>
      <div className="tabla-wrap">
        <table className="tabla">
          <thead>
            <tr>
              <th>WhatsApp</th>
              <th>Nombre / correo</th>
              <th className="num">Visitas</th>
              <th>Primera vez</th>
              <th>Última visita</th>
            </tr>
          </thead>
          <tbody>
            {datos?.clientes.map((c) => (
              <tr key={c.id}>
                <td>
                  <a href={`https://wa.me/${c.telefono}`} target="_blank" rel="noopener">+{c.telefono}</a>
                </td>
                <td>{[c.nombre, c.email].filter(Boolean).join(" · ") || "—"}</td>
                <td className="num">{c.visitas}</td>
                <td>{fecha(c.creado)}</td>
                <td>{fecha(c.ultima_visita)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {datos && !datos.clientes.length && <p className="ayuda" style={{ padding: 12 }}>Todavía no hay clientes.</p>}
      </div>
    </div>
  );
}
