"use client";
import { useEffect, useRef, useState } from "react";
import { media } from "@/lib/api";
import type { Flyer } from "@/lib/tipos";

const CADA_MS = 5000;

/** Carrusel de flyers: se desliza con el dedo y avanza solo cada 5 s (se pausa al tocarlo). */
export default function Flyers({ flyers }: { flyers: Flyer[] }) {
  const pista = useRef<HTMLDivElement>(null);
  const [actual, setActual] = useState(0);
  const [pausa, setPausa] = useState(false);

  function ir(i: number) {
    const el = pista.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  useEffect(() => {
    if (flyers.length < 2 || pausa) return;
    const t = setInterval(() => ir((actual + 1) % flyers.length), CADA_MS);
    return () => clearInterval(t);
  }, [actual, pausa, flyers.length]);

  if (!flyers.length) return null;

  return (
    <section className="seccion flyers" aria-label="Promociones">
      <div
        ref={pista}
        className="flyers-pista"
        onScroll={(e) => {
          const el = e.currentTarget;
          setActual(Math.round(el.scrollLeft / el.clientWidth));
        }}
        onPointerDown={() => setPausa(true)}
      >
        {flyers.map((f, i) => (
          <figure key={f.id} className="flyer">
            <img src={media(f.imagen)!} alt={f.titulo || "Promoción"} loading={i === 0 ? "eager" : "lazy"} decoding="async" />
            {f.titulo && <figcaption>{f.titulo}</figcaption>}
          </figure>
        ))}
      </div>
      {flyers.length > 1 && (
        <div className="puntos">
          {flyers.map((f, i) => (
            <button key={f.id} className={i === actual ? "on" : ""} aria-label={`Flyer ${i + 1}`} onClick={() => { setPausa(true); ir(i); }} />
          ))}
        </div>
      )}
    </section>
  );
}
