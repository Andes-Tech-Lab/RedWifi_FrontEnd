"use client";
import { useEffect, useState } from "react";
import { mensaje, type Api } from "./comun";

const GRUPOS: { titulo: string; campos: { clave: string; etiqueta: string; largo?: boolean; siNo?: boolean }[] }[] = [
  { titulo: "Marca", campos: [
    { clave: "nombre", etiqueta: "Nombre del local" },
    { clave: "eslogan", etiqueta: "Eslogan" },
    { clave: "wifi_minutos", etiqueta: "Minutos gratis (solo texto; el tiempo real lo define el MikroTik)" },
  ] },
  { titulo: "Lo nuestro es propio", campos: [
    { clave: "propio_titulo", etiqueta: "Título" },
    { clave: "propio_intro", etiqueta: "Introducción", largo: true },
    { clave: "propio_cafe", etiqueta: "Nuestro café", largo: true },
    { clave: "propio_chocolate", etiqueta: "Nuestro chocolate", largo: true },
  ] },
  { titulo: "Nosotros", campos: [
    { clave: "nosotros_historia", etiqueta: "Historia", largo: true },
    { clave: "nosotros_objetivo", etiqueta: "Objetivo", largo: true },
    { clave: "direccion", etiqueta: "Dirección" },
    { clave: "horario", etiqueta: "Horario" },
  ] },
  { titulo: "Carrusel: menú del día (vacío = texto por defecto, en español e inglés)", campos: [
    { clave: "menu_dia_activo", etiqueta: "Mostrar en el carrusel", siNo: true },
    { clave: "menu_dia_titulo", etiqueta: "Título (p. ej. «Hoy: ají de gallina»)" },
    { clave: "menu_dia_texto", etiqueta: "Texto", largo: true },
  ] },
  { titulo: "Carrusel: sánguche de chapla (vacío = texto por defecto)", campos: [
    { clave: "chapla_activo", etiqueta: "Mostrar en el carrusel", siNo: true },
    { clave: "chapla_titulo", etiqueta: "Eslogan" },
    { clave: "chapla_texto", etiqueta: "Texto", largo: true },
  ] },
  { titulo: "Enlaces (vacío = no se muestra)", campos: [
    { clave: "wa_canal", etiqueta: "Canal de WhatsApp" },
    { clave: "resena_url", etiqueta: "Reseña en Google" },
    { clave: "instagram", etiqueta: "Instagram" },
    { clave: "facebook", etiqueta: "Facebook" },
    { clave: "tiktok", etiqueta: "TikTok" },
  ] },
  { titulo: "Ubicación para el clima", campos: [
    { clave: "lat", etiqueta: "Latitud" },
    { clave: "lon", etiqueta: "Longitud" },
  ] },
];

export default function TabTextos({ api }: { api: Api }) {
  const [datos, setDatos] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    api<Record<string, string>>("/ajustes").then(setDatos).catch((e) => setError(mensaje(e)));
  }, [api]);

  async function guardar() {
    setError("");
    setOk("");
    try {
      setDatos(await api<Record<string, string>>("/ajustes", { method: "PUT", json: datos }));
      setOk("Guardado. Recarga la landing para verlo.");
    } catch (e) {
      setError(mensaje(e));
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {GRUPOS.map((g) => (
        <div key={g.titulo} className="panel-admin">
          <h2>{g.titulo}</h2>
          {g.campos.map((c) => c.siNo ? (
            <label key={c.clave} className="check">
              <input type="checkbox" checked={datos[c.clave] === "1"} onChange={(e) => setDatos({ ...datos, [c.clave]: e.target.checked ? "1" : "0" })} />
              <span>{c.etiqueta}</span>
            </label>
          ) : (
            <label key={c.clave} className="lbl">
              {c.etiqueta}
              {c.largo ? (
                <textarea className="inp" rows={3} value={datos[c.clave] ?? ""} onChange={(e) => setDatos({ ...datos, [c.clave]: e.target.value })} />
              ) : (
                <input className="inp" value={datos[c.clave] ?? ""} onChange={(e) => setDatos({ ...datos, [c.clave]: e.target.value })} />
              )}
            </label>
          ))}
        </div>
      ))}
      <div className="barra-guardar">
        {ok && <span className="aviso" style={{ margin: 0 }}>{ok}</span>}
        <button className="btn btn-go btn-chico" onClick={guardar}>Guardar textos</button>
      </div>
    </div>
  );
}
