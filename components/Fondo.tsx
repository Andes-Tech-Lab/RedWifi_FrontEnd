"use client";
import { useEffect, useState } from "react";

type Grano = { left: string; dur: string; delay: string };

/** Fondo animado (granos de café) + efecto ripple en los botones .btn */
export default function Fondo() {
  const [granos, setGranos] = useState<Grano[]>([]);

  useEffect(() => {
    // Posiciones al azar solo en el navegador (evita diferencias con el HTML pre-generado).
    setGranos(Array.from({ length: 14 }, () => ({
      left: Math.random() * 100 + "%",
      dur: 9 + Math.random() * 10 + "s",
      delay: -Math.random() * 18 + "s",
    })));

    const onDown = (e: PointerEvent) => {
      const btn = (e.target as HTMLElement).closest?.(".btn") as HTMLButtonElement | null;
      if (!btn || btn.disabled) return;
      const r = btn.getBoundingClientRect();
      const d = Math.max(r.width, r.height);
      const s = document.createElement("span");
      s.className = "ripple";
      s.style.width = s.style.height = d + "px";
      s.style.left = e.clientX - r.left - d / 2 + "px";
      s.style.top = e.clientY - r.top - d / 2 + "px";
      btn.appendChild(s);
      setTimeout(() => s.remove(), 600);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div className="bg" aria-hidden="true">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      {granos.map((g, i) => (
        <i key={i} className="grano" style={{ left: g.left, animationDuration: g.dur, animationDelay: g.delay }} />
      ))}
    </div>
  );
}
