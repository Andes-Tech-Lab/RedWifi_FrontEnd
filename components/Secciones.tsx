"use client";
import { useState } from "react";
import { media } from "@/lib/api";
import type { Clima, Landing, Producto } from "@/lib/tipos";
import Flyers from "./Flyers";

const soles = (n: number) => `S/ ${n.toFixed(2)}`;
const TEMP: Record<string, string> = { caliente: "🔥 Caliente", fria: "🧊 Frío", ambas: "" };

export function ProductoCard({ p }: { p: Producto }) {
  const foto = media(p.foto);
  return (
    <article className="prod">
      <div className="prod-img">
        {foto ? <img src={foto} alt={p.nombre} loading="lazy" decoding="async" /> : <span aria-hidden="true">{p.emoji || "☕"}</span>}
        {p.propio && <span className="badge">Propio</span>}
        {TEMP[p.temperatura] && <span className="badge t">{TEMP[p.temperatura]}</span>}
      </div>
      <div className="prod-cuerpo">
        <h4>{p.nombre}</h4>
        {p.descripcion && <p>{p.descripcion}</p>}
        <span className="precio">{soles(p.precio)}</span>
      </div>
    </article>
  );
}

/** Botón bajo la tarjeta de conexión: temperatura actual y salto a la promo. */
export function BotonPromo({ clima }: { clima: Clima | null }) {
  return (
    <a href="#promo" className={`ver-promo ${clima?.modo ?? ""}`}>
      {clima ? (
        <>
          <span>{clima.icono}</span>
          <span className="temp">{clima.temp} °C</span>
          <span>
            · <b>Ver la promo del día</b> ↓
          </span>
        </>
      ) : (
        <span>
          ✨ <b>Ver la promo del día</b> ↓
        </span>
      )}
    </a>
  );
}

export function PromoDia({ datos }: { datos: Landing }) {
  const { promo, clima } = datos;
  if (!promo.productos.length && promo.tipo !== "manual") return null;
  return (
    <section id="promo" className="seccion">
      <div className={`promo ${promo.tipo !== "manual" ? clima?.modo ?? "" : ""}`}>
        <div className="promo-cab">
          {clima && (
            <div className="promo-temp">
              <div>
                <span className="em">{clima.icono}</span>
                <b>{clima.temp}°</b>
              </div>
            </div>
          )}
          <div>
            <span className="etiqueta">Promo del día{clima ? ` · ${clima.descripcion}` : ""}</span>
            <h3>{promo.titulo}</h3>
            {promo.texto && <p>{promo.texto}</p>}
          </div>
        </div>
        {promo.productos.length > 0 && (
          <div className="fila">
            {promo.productos.map((p) => (
              <ProductoCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function Propio({ datos }: { datos: Landing }) {
  const { propio } = datos;
  return (
    <section className="seccion">
      <h2>{propio.titulo}</h2>
      <p className="intro">{propio.intro}</p>
      <div className="propio">
        {propio.items.map((it) => (
          <div key={it.titulo} className="propio-item">
            <div className="em" aria-hidden="true">
              {it.emoji}
            </div>
            <h3>{it.titulo}</h3>
            <p>{it.texto}</p>
          </div>
        ))}
      </div>
      {propio.productos.length > 0 && (
        <div className="fila">
          {propio.productos.map((p) => (
            <ProductoCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}

export function Carta({ datos }: { datos: Landing }) {
  const [sel, setSel] = useState<number | "todo">("todo");
  const cats = sel === "todo" ? datos.carta : datos.carta.filter((c) => c.id === sel);
  return (
    <section id="carta" className="seccion">
      <h2>Nuestra carta</h2>
      <p className="intro">
        Los productos con <b>Propio</b> están hechos con nuestro café y chocolate.
      </p>
      <div className="tabs" role="tablist">
        <button className={`tab ${sel === "todo" ? "on" : ""}`} onClick={() => setSel("todo")}>
          Todo
        </button>
        {datos.carta.map((c) => (
          <button key={c.id} className={`tab ${sel === c.id ? "on" : ""}`} onClick={() => setSel(c.id)}>
            {c.emoji} {c.nombre}
          </button>
        ))}
      </div>
      {cats.map((c) => (
        <div key={c.id} style={{ marginBottom: 22 }}>
          {sel === "todo" && (
            <h3 style={{ fontSize: 17, margin: "4px 0 10px", color: "var(--crema)" }}>
              {c.emoji} {c.nombre}
            </h3>
          )}
          <div className="grilla">
            {c.productos.map((p) => (
              <ProductoCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export function Nosotros({ datos }: { datos: Landing }) {
  const n = datos.nosotros;
  return (
    <section id="nosotros" className="seccion">
      <h2>Nosotros</h2>
      <div className="nosotros">
        <div className="bloque">
          <h3>Nuestra historia</h3>
          <p>{n.nosotros_historia}</p>
        </div>
        <div className="bloque">
          <h3>Nuestro objetivo</h3>
          <p>{n.nosotros_objetivo}</p>
        </div>
        <div className="bloque">
          <h3>Visítanos</h3>
          <p>
            📍 {n.direccion}
            <br />
            🕗 {n.horario}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Pie({ datos }: { datos: Landing }) {
  const e = datos.enlaces;
  const redes = [
    { url: e.wa_canal, txt: "📣 Canal de WhatsApp" },
    { url: e.instagram, txt: "Instagram" },
    { url: e.facebook, txt: "Facebook" },
    { url: e.tiktok, txt: "TikTok" },
  ].filter((r) => r.url);
  return (
    <footer className="pie">
      {redes.length > 0 && (
        <div className="redes">
          {redes.map((r) => (
            <a key={r.txt} href={r.url} target="_blank" rel="noopener">
              {r.txt}
            </a>
          ))}
        </div>
      )}
      <p>
        {datos.negocio.nombre} · {datos.negocio.eslogan} · <a href="/terminos/">Términos y privacidad</a>
      </p>
    </footer>
  );
}

export function Comercial({ datos }: { datos: Landing | null }) {
  if (!datos) return <div className="seccion esqueleto" />;
  return (
    <>
      <Flyers flyers={datos.flyers} />
      <PromoDia datos={datos} />
      <Propio datos={datos} />
      <Carta datos={datos} />
      <Nosotros datos={datos} />
      <Pie datos={datos} />
    </>
  );
}
