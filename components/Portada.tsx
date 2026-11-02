"use client";
import { useEffect, useState, type ReactNode } from "react";
import { media } from "@/lib/api";
import { SLIDES, fotoMovil, ordenarPorMomento } from "@/lib/escaparate";
import { SelectorIdioma, useIdioma, type Momento } from "@/lib/idioma";
import { registrar } from "@/lib/metricas";
import type { Clima, Landing, Producto } from "@/lib/tipos";
import { pedirWhatsapp } from "./Conexion";
import { Icono, IconoWa, Wordmark, iconoClima } from "./Marca";

const CADA_MS = 6000;
const soles = (n: number) => `S/ ${n.toFixed(2)}`;

type Props = { datos: Landing | null; momento: Momento; children: ReactNode };
type Extra = keyof Landing["carrusel"];
type Texto = { tag: string; tit: string; txt: string };
type Diapo = { clave: string; img?: string; extra?: Extra; texto: Texto };

/** Índice que avanza solo cada CADA_MS; `ir` salta a uno y reinicia el temporizador. Vuelve a 0 cuando cambia `reinicio`. */
function useRotacion(n: number, reinicio: unknown) {
  const [i, setI] = useState(0);
  const [vuelta, setVuelta] = useState(0);
  useEffect(() => setI(0), [reinicio]);
  useEffect(() => {
    if (n < 2) return;
    const id = setInterval(() => setI((x) => (x + 1) % n), CADA_MS);
    return () => clearInterval(id);
  }, [n, vuelta]);
  // n puede bajar cuando llegan los datos: nunca apuntar fuera de la lista
  return [n ? i % n : 0, (j: number) => { setI(j); setVuelta((v) => v + 1); }] as const;
}

/**
 * Portada del portal: fotos a pantalla completa, temperatura real, el mensaje del momento y UNA oferta
 * destacada. La tarjeta de conexión entra como `children` y es la acción principal.
 * Al carrusel se suman el menú del día y el sánguche de chapla (se encienden en /admin → Textos).
 * Mismo diseño que chinkana/login.html (el respaldo del MikroTik), salvo esas dos diapositivas.
 */
export default function Portada({ datos, momento, children }: Props) {
  const { t, lang } = useIdioma();

  // Título y texto de /admin si los hay (en español); si no, los de idioma.tsx.
  const extras = (["menu_dia", "chapla"] as const).filter((k) => datos?.carrusel?.[k]);
  const textoExtra = (k: Extra): Texto => {
    const base = k === "menu_dia" ? t.menuDia : t.chapla;
    const admin = datos?.carrusel[k];
    return { tag: base.tag, tit: admin?.titulo || base.tit, txt: admin?.texto || base.txt };
  };

  // La primera foto lleva el mensaje del momento; las demás, su propio texto.
  const fotos: Diapo[] = ordenarPorMomento(SLIDES, (s) => s.temp, momento).map((s, i) => ({
    clave: s.img, img: s.img, texto: i === 0 ? t.ganchos[momento] : s[lang],
  }));
  const diapos = [...fotos];
  // En almuerzo el menú va justo después del mensaje del momento; el resto del día, al final.
  for (const k of extras) diapos.splice(k === "menu_dia" && momento === "almuerzo" ? 1 : diapos.length, 0, { clave: k, extra: k, texto: textoExtra(k) });

  const [actual, ir] = useRotacion(diapos.length, momento);
  const [actualMovil, irMovil] = useRotacion(1 + extras.length, momento);
  const d = diapos[actual];
  const extraMovil = actualMovil ? extras[actualMovil - 1] : undefined;

  // Solo productos con foto real: un emoji no vende un producto.
  const oferta = datos?.promo.productos.find((p) => p.foto);

  const nombre = datos?.negocio.nombre ?? "Chinkana";
  const [tit1, tit2] = t.tituloMovil[momento];

  return (
    <div className="portada" data-clima={momento === "calor" || momento === "frio" ? momento : "templado"}>
      {/* Celular: composición propia. Foto vertical fija del momento, marca, temperatura y titular sobre ella. */}
      <header className="movil-hero" style={{ backgroundImage: `url(${fotoMovil(momento)})` }}>
        <div className="portada-top">
          <Wordmark nombre={nombre} lema />
          <SelectorIdioma />
        </div>
        {datos?.clima && (
          <div className="clima-chip">
            <Icono n={iconoClima(datos.clima.descripcion, Number(datos.clima.actualizado.slice(11, 13)))} />
            <b>{datos.clima.temp}°</b>
            <span>
              {datos.negocio.ciudad} · {datos.clima.actualizado.slice(11, 16)}
            </span>
          </div>
        )}
        {/* Solo rota el titular: la foto y la temperatura se quedan quietas. */}
        <div key={`${actualMovil}-${lang}-${momento}`} className="movil-titular titulares">
          {!extraMovil && (
            <>
              <h2>
                {tit1} <em>{tit2}</em>
              </h2>
              {oferta && (
                <a className="movil-oferta" href="#carta" onClick={() => registrar("promo_click", String(oferta.id))}>
                  <span>{t.recomendado}</span>
                  <b>{oferta.nombre}</b>
                  <i>{soles(oferta.precio)}</i>
                </a>
              )}
            </>
          )}
          {extraMovil === "menu_dia" && (
            <>
              <h2>{textoExtra("menu_dia").tit}</h2>
              <BotonesMenu />
            </>
          )}
          {extraMovil === "chapla" && (
            <h2>
              <em>{textoExtra("chapla").tit}</em>
            </h2>
          )}
        </div>
        {extras.length > 0 && (
          <Puntos n={1 + extras.length} actual={actualMovil} ir={irMovil} etiqueta={(i) => (i ? textoExtra(extras[i - 1]).tit : tit1 + " " + tit2)} />
        )}
      </header>

      <div className="slides" aria-hidden="true">
        {diapos.map((s, i) => (
          <div
            key={s.clave}
            className={`slide ${s.extra ? `slide-${s.extra}` : ""} ${i === actual ? "on" : ""}`}
            style={s.img ? { backgroundImage: `url(${s.img})` } : undefined}
          />
        ))}
      </div>

      <div className="portada-layout">
        <section className="portada-promo">
          <div className="portada-top">
            <Wordmark nombre={nombre} lema />
            <SelectorIdioma />
          </div>
          <div>
            {datos?.clima && <ClimaGrande clima={datos.clima} ciudad={datos.negocio.ciudad} momento={momento} />}
            <div key={`${actual}-${lang}-${momento}`} className="titulares">
              <p className="eyebrow">{d.texto.tag}</p>
              <h2 className={`titular ${d.extra === "chapla" ? "titular-script" : ""}`}>{d.texto.tit}</h2>
              <p className="bajada">{d.texto.txt}</p>
              {d.extra === "menu_dia" && <BotonesMenu />}
            </div>
          </div>
          <Puntos n={diapos.length} actual={actual} ir={ir} etiqueta={(i) => diapos[i].texto.tit} />
        </section>

        {children}

        {oferta && <Oferta p={oferta} />}
      </div>
    </div>
  );
}

function Puntos({ n, actual, ir, etiqueta }: { n: number; actual: number; ir: (i: number) => void; etiqueta: (i: number) => string }) {
  return (
    <div className="dots">
      {Array.from({ length: n }, (_, i) => (
        <button key={i} type="button" className={i === actual ? "on" : ""} aria-label={etiqueta(i)} onClick={() => ir(i)} />
      ))}
    </div>
  );
}

/** Antes de conectarse no se puede abrir WhatsApp: los botones llevan a la casilla de promos de la tarjeta de conexión. */
function BotonesMenu() {
  const { t } = useIdioma();
  return (
    <div className="menu-dia-cta">
      <button type="button" className="btn-wa-chico" onClick={() => pedirWhatsapp("menu_dia")}>
        <IconoWa />
        {t.menuDiaBtn}
      </button>
      <button type="button" className="link-pension" onClick={() => pedirWhatsapp("pension")}>
        {t.pensionBtn}
      </button>
    </div>
  );
}

/** Temperatura protagonista: dato real de Open-Meteo, con la hora en que se actualizó. */
function ClimaGrande({ clima, ciudad, momento }: { clima: Clima; ciudad: string; momento: Momento }) {
  const { t } = useIdioma();
  return (
    <div className="clima">
      <div className="clima-fila">
        <Icono n={iconoClima(clima.descripcion, Number(clima.actualizado.slice(11, 13)))} className="clima-ico" />
        <div>
          <b className="clima-temp">{clima.temp}°</b>
          <span className="clima-ciudad">{ciudad}</span>
        </div>
      </div>
      <p className="clima-msg">{t.climaMsg[momento]}</p>
      <small>
        {t.climaDesc(clima.descripcion)} · {t.actualizado(clima.actualizado.slice(11, 16))}
      </small>
    </div>
  );
}

/** La recomendación del momento: un producto real, con su foto y su precio. */
function Oferta({ p }: { p: Producto }) {
  const { t } = useIdioma();
  return (
    <a className="oferta" href="#carta" onClick={() => registrar("promo_click", String(p.id))}>
      <div className="oferta-txt">
        <span className="oferta-tag">{t.recomendado}</span>
        <b>{p.nombre}</b>
        {p.descripcion && <small>{p.descripcion}</small>}
        <span className="oferta-pie">
          <span className="oferta-precio">{soles(p.precio)}</span>
          <span className="oferta-cta">
            {t.verCarta} <Icono n="flecha" />
          </span>
        </span>
      </div>
      <img src={media(p.foto)!} alt={p.nombre} decoding="async" />
    </a>
  );
}
