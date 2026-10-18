"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { pedir } from "@/lib/api";
import { esDemo, qs, urlCodigo, urlTrial, type Hotspot } from "@/lib/hotspot";
import Taza from "./Taza";

type Props = { hotspot: Hotspot; nombre: string; minutos: number };

/** El mismo cuadro de conexión del portal del MikroTik: WhatsApp + términos → trial. */
export default function Conexion({ hotspot, nombre, minutos }: Props) {
  const router = useRouter();
  const [tel, setTel] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [aviso, setAviso] = useState("");

  const digitos = tel.replace(/\D/g, "");
  const valido = /^9\d{8}$/.test(digitos);

  function formatear(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 9);
    setTel(d.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" ")));
  }

  async function conectar() {
    setCargando(true);
    try {
      // Si la PC no puede guardar el número, igual se conecta: se pierde el lead, no el cliente.
      await pedir("/api/portal/registro", {
        method: "POST",
        timeoutMs: 3000,
        json: { telefono: digitos, acepta_terminos: acepto, mac: hotspot.mac || null },
      });
    } catch {}
    const listo = `${window.location.origin}/listo/${qs({ ...hotspot, lo: "", trial: "" })}`;
    if (esDemo(hotspot)) {
      router.push("/listo/?demo=1");
      return;
    }
    window.location.href = urlTrial(hotspot, listo);
  }

  function codigo() {
    if (esDemo(hotspot)) {
      setAviso("En el WiFi real esto abre el ingreso de códigos del MikroTik.");
      return;
    }
    window.location.href = urlCodigo(hotspot);
  }

  return (
    <main className="card">
      <Taza />
      <h1 className="marca">{nombre}</h1>
      <p className="sub">
        Bienvenido ☕<br />
        Conéctate gratis a nuestro WiFi.
      </p>

      <div className="chips">
        <div className="chip">
          ⚡ <b>{minutos} min</b> gratis
        </div>
        <div className="chip">
          💻 ¿Home office? <b>pide tu código</b>
        </div>
      </div>

      <div className="campo">
        <span>🇵🇪 +51</span>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={11}
          placeholder="Tu WhatsApp: 987 654 321"
          autoComplete="tel-national"
          value={tel}
          onChange={(e) => formatear(e.target.value)}
        />
      </div>

      <label className="check">
        <input type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)} />
        <span>
          Acepto los <Link href="/terminos/">términos</Link> y que {nombre} me envíe novedades por WhatsApp (Ley 29733). Me puedo dar
          de baja cuando quiera.
        </span>
      </label>

      <button className="btn btn-go" type="button" disabled={!(acepto && valido) || cargando} onClick={conectar}>
        Conectarme gratis
      </button>

      <button className="link" type="button" onClick={codigo}>
        ¿Tienes un código o eres del staff?
      </button>
      {aviso && <div className="aviso">{aviso}</div>}

      <p className="pie-card">
        WiFi de cortesía de <b>{nombre}</b> · 1 vez al día por equipo
      </p>

      {cargando && (
        <div className="conectando">
          <div className="loader" />
          <p>Conectándote…</p>
        </div>
      )}
    </main>
  );
}
