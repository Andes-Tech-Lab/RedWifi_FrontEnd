"use client";
import { useEffect, useState } from "react";
import { pedir } from "./api";
import type { Landing } from "./tipos";

const CLAVE = "chinkana-landing";

/** Carga /api/landing. Guarda la última respuesta en la sesión para que /listo la muestre al instante. */
export function useLanding() {
  const [datos, setDatos] = useState<Landing | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    try {
      const guardado = sessionStorage.getItem(CLAVE);
      if (guardado) setDatos(JSON.parse(guardado));
    } catch {}
    pedir<Landing>("/api/landing", { timeoutMs: 6000 })
      .then((d) => {
        setDatos(d);
        try {
          sessionStorage.setItem(CLAVE, JSON.stringify(d));
        } catch {}
      })
      .catch(() => setError(true));
  }, []);

  return { datos, error };
}
