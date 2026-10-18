"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { pedir } from "@/lib/api";
import { CLAVE_TOKEN, crearApi, mensaje } from "./comun";
import TabCarta from "./TabCarta";
import TabClientes from "./TabClientes";
import TabFlyers from "./TabFlyers";
import TabPromos from "./TabPromos";
import TabTextos from "./TabTextos";

const TABS = [
  { id: "carta", txt: "🍫 Carta" },
  { id: "flyers", txt: "🖼️ Flyers" },
  { id: "promos", txt: "🌡️ Promo del día" },
  { id: "textos", txt: "📝 Textos" },
  { id: "clientes", txt: "👥 Clientes" },
  { id: "pronto", txt: "🔌 Conectados · Tickets · Reportes" },
] as const;
type TabId = (typeof TABS)[number]["id"];

export default function AdminApp() {
  const [token, setToken] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [listo, setListo] = useState(false);
  const [tab, setTab] = useState<TabId>("carta");

  const salir = useCallback(() => {
    try {
      localStorage.removeItem(CLAVE_TOKEN);
    } catch {}
    setToken(null);
  }, []);

  useEffect(() => {
    let t: string | null = null;
    try {
      t = localStorage.getItem(CLAVE_TOKEN);
    } catch {}
    if (!t) return setListo(true);
    pedir<{ nombre: string }>("/api/admin/me", { token: t })
      .then((me) => {
        setToken(t);
        setNombre(me.nombre);
      })
      .catch(() => salir())
      .finally(() => setListo(true));
  }, [salir]);

  const api = useMemo(() => (token ? crearApi(token, salir) : null), [token, salir]);

  if (!listo) return null;
  if (!api)
    return (
      <Login
        onEntrar={(t, n) => {
          try {
            localStorage.setItem(CLAVE_TOKEN, t);
          } catch {}
          setToken(t);
          setNombre(n);
        }}
      />
    );

  return (
    <div className="pagina admin">
      <header className="admin-cab">
        <h1 className="marca" style={{ fontSize: 24 }}>
          Chinkana · Admin
        </h1>
        <div>
          <span style={{ color: "var(--tenue)", marginRight: 10 }}>{nombre}</span>
          <a className="btn btn-sec btn-chico" href="/portal/" target="_blank" style={{ display: "inline-flex", marginRight: 8 }}>
            Ver landing ↗
          </a>
          <button className="btn btn-sec btn-chico" style={{ display: "inline-flex" }} onClick={salir}>
            Salir
          </button>
        </div>
      </header>
      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "on" : ""}`} onClick={() => setTab(t.id)}>
            {t.txt}
          </button>
        ))}
      </nav>
      {tab === "carta" && <TabCarta api={api} />}
      {tab === "flyers" && <TabFlyers api={api} />}
      {tab === "promos" && <TabPromos api={api} />}
      {tab === "textos" && <TabTextos api={api} />}
      {tab === "clientes" && <TabClientes api={api} />}
      {tab === "pronto" && (
        <div className="panel-admin">
          <h2>Próximamente</h2>
          <p className="ayuda">
            Conectados en vivo, generar e imprimir tickets con QR, reportes y usuarios del staff. Se activan en la fase de conexión
            con el MikroTik (API 8728).
          </p>
        </div>
      )}
    </div>
  );
}

function Login({ onEntrar }: { onEntrar: (token: string, nombre: string) => void }) {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const r = await pedir<{ token: string; nombre: string }>("/api/admin/login", { method: "POST", json: { usuario, clave } });
      onEntrar(r.token, r.nombre);
    } catch (err) {
      setError(mensaje(err));
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="pagina">
      <div className="hero">
        <form className="card" onSubmit={entrar}>
          <h1 className="marca" style={{ marginBottom: 18 }}>
            Admin
          </h1>
          {error && <div className="error">{error}</div>}
          <div className="campo">
            <span>👤</span>
            <input placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} autoComplete="username" />
          </div>
          <div className="campo">
            <span>🔑</span>
            <input placeholder="Clave" type="password" value={clave} onChange={(e) => setClave(e.target.value)} autoComplete="current-password" />
          </div>
          <button className="btn btn-go" disabled={cargando || !usuario || !clave}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
