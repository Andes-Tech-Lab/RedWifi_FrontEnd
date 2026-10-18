// En desarrollo apunta a la API en :8000; en producción va vacío (mismo origen).
export const API = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export function media(url?: string | null): string | null {
  return url ? API + url : null;
}

type Opciones = RequestInit & { token?: string | null; timeoutMs?: number; json?: unknown };

export class ErrorApi extends Error {
  constructor(public status: number, mensaje: string) {
    super(mensaje);
  }
}

export async function pedir<T>(ruta: string, { token, timeoutMs = 8000, json, headers, ...init }: Opciones = {}): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  const h = new Headers(headers);
  if (token) h.set("Authorization", `Bearer ${token}`);
  if (json !== undefined) h.set("Content-Type", "application/json");
  try {
    const r = await fetch(API + ruta, { ...init, headers: h, signal: ctrl.signal, body: json !== undefined ? JSON.stringify(json) : init.body });
    if (!r.ok) {
      let msg = `Error ${r.status}`;
      try {
        const d = await r.json();
        if (typeof d.detail === "string") msg = d.detail;
      } catch {}
      throw new ErrorApi(r.status, msg);
    }
    const tipo = r.headers.get("content-type") || "";
    return (tipo.includes("application/json") ? await r.json() : await r.blob()) as T;
  } finally {
    clearTimeout(t);
  }
}
