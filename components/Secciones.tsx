"use client";
import { useEffect, useRef, useState } from "react";
import { media } from "@/lib/api";
import { useIdioma } from "@/lib/idioma";
import { registrar } from "@/lib/metricas";
import { FranjaAndina, Icono, Pilares } from "./Marca";
import type { Landing, Producto } from "@/lib/tipos";
import Flyers from "./Flyers";

const soles = (n: number) => `S/ ${n.toFixed(2)}`;

export function ProductoCard({ p }: { p: Producto }) {
  const { t } = useIdioma();
  const foto = media(p.foto);
  const temp = p.temperatura === "caliente" ? t.caliente : p.temperatura === "fria" ? t.fria : "";
  return (
    <article className={`prod ${p.disponible ? "" : "agotado"}`}>
      <div className="prod-img">
        {/* Sin foto: un marcador neutro con la inicial, nunca un emoji haciéndose pasar por el producto. */}
        {foto ? <img src={foto} alt={p.nombre} loading="lazy" decoding="async" /> : <span className="sin-foto" aria-hidden="true">{p.nombre.charAt(0)}</span>}
        {p.propio && <span className="badge">{t.propio}</span>}
        {p.disponible ? (
          temp && (
            <span className="badge t">
              <Icono n={p.temperatura === "caliente" ? "llama" : "copo"} /> {temp}
            </span>
          )
        ) : (
          <span className="badge t">{t.agotado}</span>
        )}
      </div>
      <div className="prod-cuerpo">
        <h4>{p.nombre}</h4>
        {p.descripcion && <p>{p.descripcion}</p>}
        <span className="precio">{soles(p.precio)}</span>
      </div>
    </article>
  );
}

export function PromoDia({ datos }: { datos: Landing }) {
  const { t } = useIdioma();
  const { promo, clima } = datos;
  if (!promo.productos.length && promo.tipo !== "manual") return null;
  // Las promos manuales se escriben en /admin (español); las automáticas se arman en el idioma elegido.
  const auto = promo.tipo !== "manual" && promo.momento ? t.momentos[promo.momento] : null;
  const titulo = auto ? auto.tit(clima?.temp) : promo.titulo;
  const texto = auto ? auto.txt : promo.texto;
  return (
    <section id="promo" className="seccion">
      <div className={`promo ${promo.tipo === "clima" ? clima?.modo ?? "" : ""}`}>
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
            <span className="etiqueta">
              {t.promoDia}
              {clima ? ` · ${clima.descripcion}` : ""}
            </span>
            <h3>{titulo}</h3>
            {texto && <p>{texto}</p>}
          </div>
        </div>
        {promo.productos.length > 0 && (
          <div className="grilla">
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
    <section id="propio" className="seccion">
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
        <div className="grilla">
          {propio.productos.map((p) => (
            <ProductoCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </section>
  );
}

export function Carta({ datos }: { datos: Landing }) {
  const { t } = useIdioma();
  const ref = useRef<HTMLElement>(null);

  // Visita a la carta = la sección llegó a verse (una vez por página).
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        registrar("menu_visita");
        obs.disconnect();
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const [sel, setSel] = useState<number | "todo">("todo");
  const cats = sel === "todo" ? datos.carta : datos.carta.filter((c) => c.id === sel);
  return (
    <section id="carta" ref={ref} className="seccion">
      <h2>{t.carta}</h2>
      <p className="intro">{t.cartaIntro}</p>
      <div className="tabs" role="tablist">
        <button className={`tab ${sel === "todo" ? "on" : ""}`} onClick={() => setSel("todo")}>
          {t.todo}
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
  const { t } = useIdioma();
  const n = datos.nosotros;
  return (
    <section id="nosotros" className="seccion">
      <h2>{t.nosotros}</h2>
      <div className="nosotros">
        <div className="bloque">
          <h3>{t.historia}</h3>
          <p>{n.nosotros_historia}</p>
        </div>
        <div className="bloque">
          <h3>{t.objetivo}</h3>
          <p>{n.nosotros_objetivo}</p>
        </div>
        <div className="bloque">
          <h3>{t.visitanos}</h3>
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
  const { t } = useIdioma();
  const e = datos.enlaces;
  const redes = [
    { url: e.wa_canal, txt: t.canalWa },
    { url: e.instagram, txt: "Instagram" },
    { url: e.facebook, txt: "Facebook" },
    { url: e.tiktok, txt: "TikTok" },
  ].filter((r) => r.url);
  return (
    <footer className="pie">
      <Pilares />
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
        {datos.negocio.nombre} · {datos.negocio.eslogan} · <a href="/terminos/">{t.terminosPie}</a>
      </p>
      <FranjaAndina />
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
