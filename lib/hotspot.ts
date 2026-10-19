/**
 * Datos que el login.html del MikroTik pasa en la URL al redirigir a la PC:
 *   /portal/?mac=..&macesc=..&lo=<link-login-only>&orig=<link-orig>&trial=yes|no
 * Sin `lo` estamos en desarrollo (abrimos la página directo en el navegador).
 */
import { useEffect, useState } from "react";

export type Hotspot = { mac: string; macesc: string; lo: string; orig: string; trial: string };

const VACIO: Hotspot = { mac: "", macesc: "", lo: "", orig: "", trial: "" };

/**
 * Lee la URL después de montar (no con useSearchParams) para que el HTML pre-generado
 * ya traiga el cuadro de conexión: el mini-navegador del portal lo muestra sin esperar al JS.
 */
export function useQuery(): { sp: URLSearchParams; hotspot: Hotspot; leido: boolean } {
  const [estado, setEstado] = useState({ sp: new URLSearchParams(), hotspot: VACIO, leido: false });
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    setEstado({ sp, hotspot: leerHotspot(sp), leido: true });
  }, []);
  return estado;
}

export function leerHotspot(sp: URLSearchParams): Hotspot {
  return {
    mac: sp.get("mac") || "",
    macesc: sp.get("macesc") || "",
    lo: sp.get("lo") || "",
    orig: sp.get("orig") || "",
    trial: sp.get("trial") || "",
  };
}

export const esDemo = (h: Hotspot) => !h.lo;

/** Querystring para pasar los datos del hotspot entre páginas de la app. */
export function qs(h: Hotspot): string {
  const p = new URLSearchParams();
  (Object.keys(h) as (keyof Hotspot)[]).forEach((k) => h[k] && p.set(k, h[k]));
  const s = p.toString();
  return s ? `?${s}` : "";
}

/** Login de trial (40 min) que hace el navegador del cliente contra el MikroTik. */
export function urlTrial(h: Hotspot, dst: string): string {
  // $(mac-esc) ya viene escapado por el MikroTik (AA%3ABB…): escaparlo otra vez daría T-AA%3ABB y el trial falla.
  const usuario = "T-" + (h.macesc || encodeURIComponent(h.mac));
  return `${h.lo}?username=${usuario}&dst=${encodeURIComponent(dst)}`;
}

/** Códigos y staff: se vuelve al portal del propio MikroTik (CHAP), que no redirige si ve ?codigo=1. */
export function urlCodigo(h: Hotspot): string {
  return `${h.lo}?codigo=1`;
}
