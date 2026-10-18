"use client";
import { pedir } from "@/lib/api";

export const CLAVE_TOKEN = "chinkana-token";

/** pedir() con el token del staff. Si la sesión venció, vuelve al login. */
export function crearApi(token: string, salir: () => void) {
  return async function api<T>(ruta: string, opciones: Parameters<typeof pedir>[1] = {}): Promise<T> {
    try {
      return await pedir<T>("/api/admin" + ruta, { ...opciones, token });
    } catch (e) {
      if ((e as { status?: number }).status === 401) salir();
      throw e;
    }
  };
}

export type Api = ReturnType<typeof crearApi>;

export const mensaje = (e: unknown) => (e instanceof Error ? e.message : "Algo falló");
