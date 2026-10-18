"use client";
import { useEffect } from "react";

/** La raíz manda a /portal/ conservando los datos del hotspot. */
export default function Inicio() {
  useEffect(() => {
    window.location.replace("/portal/" + window.location.search);
  }, []);
  return null;
}
