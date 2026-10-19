/**
 * Analítica anónima del portal: solo el tipo de evento, a qué se refiere y la hora (la pone la API).
 * Nunca MAC, IP ni teléfono. Si la PC no responde, se pierde el evento, no la navegación.
 */
import { API } from "./api";

export type TipoEvento = "portal_visita" | "conexion_intento" | "conexion" | "promo_click" | "menu_visita" | "contenido_click";

export function registrar(tipo: TipoEvento, ref = "") {
  try {
    // keepalive: el evento sale aunque la página se esté yendo (p. ej. al tocar «Conectarme»).
    fetch(`${API}/api/portal/evento`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, ref: String(ref).slice(0, 60) }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
