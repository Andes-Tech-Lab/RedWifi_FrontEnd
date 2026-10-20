"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { media } from "@/lib/api";
import { SLIDES, fotoMovil, ordenarPorMomento } from "@/lib/escaparate";
import { SelectorIdioma, useIdioma, type Momento } from "@/lib/idioma";
import { registrar } from "@/lib/metricas";
import type { Clima, Landing, Producto } from "@/lib/tipos";
import { Icono, Wordmark, iconoClima } from "./Marca";

const CADA_MS = 6000;
const soles = (n: number) => `S/ ${n.toFixed(2)}`;

type Props = { datos: Landing | null; momento: Momento; children: ReactNode };

/**
 * Portada del portal: fotos a pantalla completa, temperatura real, el mensaje del momento y UNA oferta
 * destacada. La tarjeta de conexión entra como `children` y es la acción principal.
 * Mismo diseño que chinkana/login.html (el respaldo del MikroTik).
 */
export default function Portada({ datos, momento, children }: Props) {
  const { t, lang } = useIdioma();
  const slides = useMemo(() => ordenarPorMomento(SLIDES, (s) => s.temp, momento), [momento]);
  const [actual, setActual] = useState(0);
  const [vuelta, setVuelta] = useState(0); // reinicia el temporizador al tocar un punto

  useEffect(() => setActual(0), [momento]);
  useEffect(() => {
    const id = setInterval(() => setActual((i) => (i + 1) % slides.length), CADA_MS);
    return () => clearInterval(id);
  }, [slides.length, vuelta]);

  // La primera foto lleva el mensaje del momento; las demás, su propio texto.
  const texto = actual === 0 ? t.ganchos[momento] : slides[actual][lang];
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
        <div className="movil-titular">
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
        </div>
      </header>

      <div className="slides" aria-hidden="true">
        {slides.map((s, i) => (
          <div key={s.img} className={`slide ${i === actual ? "on" : ""}`} style={{ backgroundImage: `url(${s.img})` }} />
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
              <p className="eyebrow">{texto.tag}</p>
              <h2 className="titular">{texto.tit}</h2>
              <p className="bajada">{texto.txt}</p>
            </div>
          </div>
          <div className="dots">
            {slides.map((s, i) => (
              <button
                key={s.img}
                type="button"
                className={i === actual ? "on" : ""}
                aria-label={s[lang].tit}
                onClick={() => {
                  setActual(i);
                  setVuelta((v) => v + 1);
                }}
              />
            ))}
          </div>
        </section>

        {children}

        {oferta && <Oferta p={oferta} />}
      </div>
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
