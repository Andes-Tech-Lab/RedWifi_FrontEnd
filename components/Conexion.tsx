"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { pedir } from "@/lib/api";
import { esDemo, qs, urlCodigo, urlTrial, type Hotspot } from "@/lib/hotspot";
import { BanderaPE, useIdioma, type Momento } from "@/lib/idioma";
import { registrar } from "@/lib/metricas";
import { Icono } from "./Marca";

type Props = { hotspot: Hotspot; nombre: string; minutos: number; momento: Momento };

/**
 * El mismo cuadro de conexión del portal del MikroTik: un toque → trial.
 * El WhatsApp es opcional y solo se guarda si el cliente marca la casilla de promos.
 */
export default function Conexion({ hotspot, nombre, minutos, momento }: Props) {
  const router = useRouter();
  const { t } = useIdioma();
  const m = t.momentos[momento];
  const [quiero, setQuiero] = useState(false);
  const [tel, setTel] = useState("");
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState("");
  const telRef = useRef<HTMLInputElement>(null);

  const digitos = tel.replace(/\D/g, "");
  const valido = /^9\d{8}$/.test(digitos);

  function formatear(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 9);
    setTel(d.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" ")));
    if (/^9\d{8}$/.test(d)) setError(false);
  }

  function marcar(v: boolean) {
    setQuiero(v);
    setError(false);
    if (v) setTimeout(() => telRef.current?.focus(), 250);
  }

  async function conectar() {
    if (quiero && !valido) {
      setError(true);
      telRef.current?.focus();
      return;
    }
    setCargando(true);
    // La conexión completada se registra en /listo, cuando hay internet de verdad.
    registrar("conexion_intento", momento);
    if (quiero) {
      try {
        // Si la PC no puede guardar el número, igual se conecta: se pierde el lead, no el cliente.
        await pedir("/api/portal/registro", {
          method: "POST",
          timeoutMs: 3000,
          json: { telefono: digitos, acepta_promos: true, mac: hotspot.mac || null, origen: "portal" },
        });
      } catch {}
    }
    // wa=1: /listo no le vuelve a pedir el WhatsApp
    const extra = quiero ? "wa=1" : "";
    const base = qs({ ...hotspot, lo: "", trial: "" });
    const listo = `${window.location.origin}/listo/${base}${extra ? (base ? "&" : "?") + extra : ""}`;
    if (esDemo(hotspot)) {
      router.push(`/listo/?demo=1${extra ? "&" + extra : ""}`);
      return;
    }
    window.location.href = urlTrial(hotspot, listo);
  }

  function codigo() {
    if (esDemo(hotspot)) {
      setAviso(t.codeDemo);
      return;
    }
    window.location.href = urlCodigo(hotspot);
  }

  return (
    <main className="card">
      <div className="wifi-cab">
        <Icono n="wifi" className="wifi-ico" />
        <div>
          <h1 className="marca">{t.wifiGratis}</h1>
          <p className="sub">{m.sub}</p>
        </div>
      </div>

      <ul className="beneficios">
        {t.beneficios(minutos).map((b, i) => (
          <li key={b}>
            <Icono n={(["reloj", "personas", "rayo"] as const)[i]} />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className={`wa-opt ${quiero ? "on" : ""}`}>
        <label className="check wa">
          <input type="checkbox" checked={quiero} onChange={(e) => marcar(e.target.checked)} />
          <svg className="wa-ico" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="12" fill="#25D366" />
            <path
              fill="#fff"
              d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.7.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"
            />
          </svg>
          <span>
            <b>
              {t.waCorto} <i>({t.opcional})</i>
            </b>
            {/* El detalle del consentimiento aparece al marcar: informa justo cuando se decide. */}
            <small>{t.waTxt(nombre)}</small>
          </span>
        </label>
        <div className="wa-campo">
          <div className="campo">
            <span className="pref">
              <BanderaPE />
              +51
            </span>
            <input
              ref={telRef}
              type="tel"
              inputMode="numeric"
              maxLength={11}
              placeholder={t.telPh}
              autoComplete="tel-national"
              value={tel}
              tabIndex={quiero ? 0 : -1}
              onChange={(e) => formatear(e.target.value)}
            />
          </div>
          {error && <p className="wa-error">{t.waErr}</p>}
        </div>
      </div>

      <button className="btn btn-go" type="button" disabled={cargando} onClick={conectar}>
        {m.cta} <Icono n="flecha" />
      </button>
      <p className="legal">
        {t.alConectar} <Link href="/terminos/">{t.terminos}</Link>.
      </p>

      <button className="link" type="button" onClick={codigo}>
        {t.codeLink}
      </button>
      {aviso && <div className="aviso">{aviso}</div>}

      <p className="pie-card">
        {t.pie1} <b>{nombre}</b> · {t.pie2}
      </p>

      {cargando && (
        <div className="conectando">
          <div className="loader" />
          <p>{t.conectando}</p>
        </div>
      )}
    </main>
  );
}
