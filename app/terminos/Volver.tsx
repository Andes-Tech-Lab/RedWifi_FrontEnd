"use client";

/** Vuelve al portal sin perder los datos del hotspot que venían en la URL. */
export default function Volver() {
  return (
    <button className="btn btn-sec btn-chico" type="button" style={{ marginTop: 18 }}
      onClick={() => (history.length > 1 ? history.back() : window.location.assign("/portal/"))}>
      ← Volver
    </button>
  );
}
