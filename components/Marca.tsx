"use client";
/**
 * Identidad de Chinkana tomada de la fachada: chakana escalonada con mazorcas de cacao, wordmark romano,
 * lema manuscrito "Del origen a tu taza" y los cuatro pilares. Iconos de línea en vez de emojis.
 *
 * El logo es una vectorización PROVISIONAL del render de la fachada: reemplazar por el archivo oficial
 * (ver DEUDA-TECNICA.md).
 */
import type { ReactNode } from "react";
import { useIdioma } from "@/lib/idioma";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg className={`logo-svg ${className}`} viewBox="0 0 120 104" aria-hidden="true">
      <path d="M6 104V74h16V52h16V30h16V10h12v20h16v22h16v22h16v30" fill="none" stroke="currentColor" strokeWidth="8" strokeLinejoin="miter" />
      <g transform="rotate(-24 48 76)">
        <ellipse cx="48" cy="76" rx="12" ry="21" fill="currentColor" />
        <path d="M48 58v36" stroke="var(--logo-fondo, #1b0f0a)" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <g transform="rotate(22 74 80)">
        <ellipse cx="74" cy="80" rx="9.5" ry="18" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M74 65v30" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function Wordmark({ nombre, centrado = false, lema = false }: { nombre: string; centrado?: boolean; lema?: boolean }) {
  const { t } = useIdioma();
  return (
    <div className={`wordmark ${centrado ? "centrado" : ""}`}>
      <Logo />
      <div>
        <b>{nombre}</b>
        <small>{t.sublema}</small>
        {lema && <em className="lema">{t.lema}</em>}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------ iconos de línea (trazo = color del texto)
const TRAZOS: Record<string, ReactNode> = {
  wifi: (<><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><path d="M12 20h.01" /></>),
  reloj: (<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>),
  personas: (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>),
  rayo: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
  flecha: (<><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>),
  check: <path d="M20 6 9 17l-5-5" />,
  libro: (<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>),
  instagram: (<><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><path d="M17.5 6.5h.01" /></>),
  estrella: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  grano: (<><ellipse cx="12" cy="12" rx="7" ry="10" transform="rotate(30 12 12)" /><path d="M8.5 5.5c3 2.5 4 4.5 3.5 6.5s-.5 4 3.5 6.5" /></>),
  cacao: (<><ellipse cx="12" cy="12" rx="6" ry="10.5" transform="rotate(-25 12 12)" /><path d="M9 3.5c0 6 1 11 6 17" /></>),
  cubiertos: (<><path d="M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3zm0 0v7" /></>),
  montana: <path d="m8 3 4 8 5-5 5 15H2L8 3z" />,
  regalo: (<><path d="M20 12v10H4V12" /><path d="M2 7h20v5H2z" /><path d="M12 22V7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></>),
  llama: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
  copo: (<><path d="M2 12h20M12 2v20" /><path d="m4.9 4.9 14.2 14.2M19.1 4.9 4.9 19.1" /></>),
  sol: (<><circle cx="12" cy="12" r="4.2" /><path d="M12 1.5v2.5M12 20v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M1.5 12H4M20 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" /></>),
  solNube: (<><path d="M12 2v2M4.93 4.93l1.41 1.41M20 12h2M19.07 4.93l-1.41 1.41" /><path d="M15.95 12.65a4 4 0 0 0-5.93-4.13" /><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6z" /></>),
  nube: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />,
  luna: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />,
  lluvia: (<><path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24" /><path d="M16 14v6M8 14v6M12 16v6" /></>),
  tormenta: (<><path d="M6 16.33A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.97" /><path d="m13 12-3 5h4l-3 5" /></>),
  neblina: (<><path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24" /><path d="M16 17H7M17 21H9" /></>),
};

export type NombreIcono = keyof typeof TRAZOS;

export function Icono({ n, className = "" }: { n: NombreIcono; className?: string }) {
  return (
    <svg className={`ico ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {TRAZOS[n]}
    </svg>
  );
}

/** La API manda la descripción del clima en español (services/clima.py). */
const CLIMA_ICONO: Record<string, NombreIcono> = {
  Despejado: "sol", "Parcialmente nublado": "solNube", Nublado: "nube", Neblina: "neblina",
  Lluvia: "lluvia", Chubascos: "lluvia", Tormenta: "tormenta", Nieve: "copo",
};
/** `hora` del dato (0-23): de noche no se dibuja el sol. */
export function iconoClima(descripcion: string, hora: number): NombreIcono {
  const ico = CLIMA_ICONO[descripcion] ?? "solNube";
  const noche = hora >= 19 || hora < 6;
  return noche && ico === "sol" ? "luna" : noche && ico === "solNube" ? "nube" : ico;
}

// ------------------------------------------------------------------ pilares (los de la fachada) y franja andina
export function Pilares() {
  const { t } = useIdioma();
  const iconos: NombreIcono[] = ["grano", "cacao", "cubiertos", "montana"];
  return (
    <ul className="pilares">
      {t.pilares.map((p, i) => (
        <li key={p}>
          <Icono n={iconos[i]} />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

/** Greca escalonada (motivo de la chakana), sutil, para cerrar las páginas. El dibujo está en globals.css. */
export function FranjaAndina() {
  return <div className="franja-andina" aria-hidden="true" />;
}
