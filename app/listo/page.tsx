"use client";
import { useEffect, useState } from "react";
import Flyers from "@/components/Flyers";
import { Icono, Wordmark } from "@/components/Marca";
import { Carta, Nosotros, Pie } from "@/components/Secciones";
import { media, pedir } from "@/lib/api";
import { useQuery } from "@/lib/hotspot";
import { BanderaPE, IdiomaProvider, SelectorIdioma, momentoDelDia, useIdioma } from "@/lib/idioma";
import { registrar } from "@/lib/metricas";
import type { Contenido, Landing, Seccion } from "@/lib/tipos";
import { useLanding } from "@/lib/useLanding";

const soles = (n: number) => `S/ ${n.toFixed(2)}`;
const SECCIONES: Seccion[] = ["sabores", "turismo", "marcas", "novedades"];
// Responde 204 solo si hay internet de verdad; antes del login el hotspot no lo deja pasar.
const PRUEBA_INTERNET = "https://www.gstatic.com/generate_204";

export default function Listo() {
  return (
    <IdiomaProvider>
      <Conectado />
    </IdiomaProvider>
  );
}

/** ¿Hay internet? Se comprueba antes de decir «¡Conectado!»: el MikroTik manda aquí tras el login, pero cualquiera puede abrir la URL. */
function useInternet(activo: boolean) {
  const [estado, setEstado] = useState<"verificando" | "si" | "no">("verificando");
  const [intento, setIntento] = useState(0);
  useEffect(() => {
    if (!activo) return;
    setEstado("verificando");
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 5000);
    fetch(PRUEBA_INTERNET, { mode: "no-cors", cache: "no-store", signal: ctrl.signal })
      .then(() => setEstado("si"))
      .catch(() => setEstado("no"))
      .finally(() => clearTimeout(t));
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [activo, intento]);
  return { estado, reintentar: () => setIntento((i) => i + 1) };
}

/**
 * «¡Conectado!»: el cliente ya tiene internet. Aquí va lo comercial y los contenidos: promo del día,
 * carta, redes, suscripción por WhatsApp (si no la dio antes), sabores, turismo, marcas y novedades.
 */
function Conectado() {
  const { t } = useIdioma();
  const { sp, hotspot, leido } = useQuery();
  const { datos } = useLanding();
  const demo = !!sp.get("demo");
  const { estado, reintentar } = useInternet(leido && !demo);
  const ok = demo || estado === "si";
  const orig = sp.get("orig");
  const seguir = orig && /^https?:\/\//.test(orig) ? orig : "https://www.google.com";
  const nombre = datos?.negocio.nombre ?? "Chinkana";
  const e = datos?.enlaces;

  useEffect(() => {
    if (estado === "si") registrar("conexion");
  }, [estado]);

  return (
    <div className="portada conectado">
      <div className="slides" aria-hidden="true">
        <div className="slide on" style={{ backgroundImage: "url(/img/ayacucho-catedral.jpg)" }} />
      </div>

      <div className="pagina pagina-listo">
        <div className="barra-idioma">
          <SelectorIdioma />
        </div>
        <Wordmark nombre={nombre} centrado lema />

        <main className="card listo-card">
          {!ok && estado === "verificando" && (
            <>
              <div className="loader" style={{ margin: "8px auto 16px" }} />
              <p className="sub">{t.verificando}</p>
            </>
          )}
          {!ok && estado === "no" && (
            <>
              <div className="icono suave">!</div>
              <h1 className="marca">{t.sinInternetTit}</h1>
              <p className="sub">{t.sinInternetTxt}</p>
              <button className="btn btn-go" type="button" onClick={reintentar}>
                {t.reintentar}
              </button>
              {/* Cualquier página http abre el login del hotspot si todavía no hay sesión. */}
              <a className="btn btn-sec" href={orig && orig.startsWith("http://") ? orig : "http://neverssl.com"}>
                {t.volverPortal}
              </a>
            </>
          )}
          {ok && (
            <>
              <div className="icono-check">
                <Icono n="check" />
              </div>
              <h1 className="marca">{t.conectado}</h1>
              <p className="sub">{t.yaPuedes(datos?.negocio.wifi_minutos ?? 40)}</p>
              <a className="btn btn-go" href={seguir}>
                {t.seguir} <Icono n="flecha" />
              </a>
              {demo && <div className="aviso">{t.demoListo}</div>}
            </>
          )}
        </main>

        {ok && (
          <>
            {datos && <PromoDestacada datos={datos} />}

            <div className="accesos">
              <a className="acceso" href="#carta">
                <Icono n="libro" />
                {t.verMenu}
              </a>
              {e?.instagram ? (
                <a className="acceso" href={e.instagram} target="_blank" rel="noopener">
                  <Icono n="instagram" />
                  {t.siguenos}
                </a>
              ) : (
                e?.resena_url && (
                  <a className="acceso" href={e.resena_url} target="_blank" rel="noopener">
                    <Icono n="estrella" />
                    {t.resena}
                  </a>
                )
              )}
            </div>

            <SuscripcionWa ya={sp.get("wa") === "1"} mac={hotspot.mac} canal={e?.wa_canal ?? ""} />

            {datos && (
              <>
                <Explora contenidos={datos.contenidos} />
                <Propuesta datos={datos} />
                <Flyers flyers={datos.flyers} />
                <Carta datos={datos} />
                <Nosotros datos={datos} />
                <div className="gracias">
                  <Icono n="montana" />
                  <p>{t.gracias}</p>
                </div>
                <Pie datos={datos} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** Una sola oferta: la promo manual del día o el primer producto con foto de la promo automática. */
function PromoDestacada({ datos }: { datos: Landing }) {
  const { t } = useIdioma();
  const { promo, clima } = datos;
  const p = promo.productos.find((x) => x.foto) ?? promo.productos[0];
  if (!p && promo.tipo !== "manual") return null;
  const momento = promo.momento ?? momentoDelDia();
  const auto = promo.tipo !== "manual" ? t.momentos[momento] : null;
  const titulo = promo.tipo === "manual" ? promo.titulo : p?.nombre ?? auto?.tit(clima?.temp);
  const texto = promo.tipo === "manual" ? promo.texto : p?.descripcion || auto?.txt;
  const foto = media(p?.foto);

  return (
    <a
      className={`promo-destacada ${foto ? "" : "sin-foto"}`}
      href="#carta"
      style={foto ? { backgroundImage: `url(${foto})` } : undefined}
      onClick={() => p && registrar("promo_click", String(p.id))}
    >
      <span className="eyebrow">{t.promoDelDia}</span>
      <h2>{titulo}</h2>
      {texto && <p>{texto}</p>}
      <div className="promo-pie">
        {p && <span className="promo-precio">{soles(p.precio)}</span>}
        <span className="promo-flecha">
          <Icono n="flecha" />
        </span>
      </div>
    </a>
  );
}

/** Portal de contenidos: cada tarjeta enlaza a un destino real cargado en /admin. Secciones vacías no salen. */
function Explora({ contenidos }: { contenidos: Landing["contenidos"] }) {
  const { t } = useIdioma();
  const secciones = SECCIONES.filter((s) => contenidos[s]?.length);
  if (!secciones.length) return null;
  return (
    <section className="explora">
      <h2>{t.explora}</h2>
      {secciones.map((s) => (
        <div key={s} className="explora-seccion">
          <div className="explora-cab">
            <h3>{t.secciones[s].tit}</h3>
            <p>{t.secciones[s].sub}</p>
          </div>
          <div className="explora-grilla">
            {contenidos[s]!.map((c) => (
              <TarjetaContenido key={c.id} c={c} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function TarjetaContenido({ c }: { c: Contenido }) {
  const { t } = useIdioma();
  const img = media(c.imagen);
  const cuerpo = (
    <>
      {img && <img src={img} alt="" loading="lazy" decoding="async" />}
      <div>
        <b>{c.titulo}</b>
        {c.resumen && <small>{c.resumen}</small>}
        {c.url && (
          <span className="explora-mas">
            {t.verMas} <Icono n="flecha" />
          </span>
        )}
      </div>
    </>
  );
  return c.url ? (
    <a className="tarjeta-contenido" href={c.url} target="_blank" rel="noopener" onClick={() => registrar("contenido_click", `${c.seccion}:${c.id}`)}>
      {cuerpo}
    </a>
  ) : (
    <div className="tarjeta-contenido">{cuerpo}</div>
  );
}

/** Lo que hace distinto a Chinkana, numerado (los textos se editan en /admin → Textos). */
function Propuesta({ datos }: { datos: Landing }) {
  const { t } = useIdioma();
  const { propio } = datos;
  return (
    <section id="propio" className="propuesta">
      <span className="eyebrow">{t.propuesta}</span>
      <h2>{propio.titulo}</h2>
      <p className="intro">{propio.intro}</p>
      <ol>
        {propio.items.map((it, i) => (
          <li key={it.titulo}>
            <span className="num">({String(i + 1).padStart(2, "0")})</span>
            <div>
              <h3>{it.titulo}</h3>
              <p>{it.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Segunda oportunidad para dejar el WhatsApp, ahora que ya navega (si no lo dejó en el portal). */
function SuscripcionWa({ ya, mac, canal }: { ya: boolean; mac: string; canal: string }) {
  const { t } = useIdioma();
  const [tel, setTel] = useState("");
  const [estado, setEstado] = useState<"" | "enviando" | "ok" | "error" | "fallo">(ya ? "ok" : "");
  const digitos = tel.replace(/\D/g, "");
  const valido = /^9\d{8}$/.test(digitos);

  async function unirme() {
    if (!valido) {
      setEstado("error");
      return;
    }
    setEstado("enviando");
    try {
      await pedir("/api/portal/registro", {
        method: "POST",
        timeoutMs: 5000,
        json: { telefono: digitos, acepta_promos: true, mac: mac || null, origen: "listo" },
      });
      setEstado("ok");
    } catch {
      setEstado("fallo");
    }
  }

  return (
    <section className="wa-box">
      <div className="wa-box-cab">
        <svg className="wa-ico" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="12" fill="#25D366" />
          <path
            fill="#fff"
            d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 2.5 1 3 .8 3.6.7.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"
          />
        </svg>
        <div>
          <h3>{t.waUneteTit}</h3>
          <p>{t.waUneteTxt}</p>
        </div>
      </div>

      {estado === "ok" ? (
        <p className="wa-ok">{ya ? t.waYa : t.waGuardado}</p>
      ) : (
        <>
          <div className="campo">
            <span className="pref">
              <BanderaPE />
              +51
            </span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={11}
              placeholder={t.telPh}
              autoComplete="tel-national"
              value={tel}
              onChange={(ev) => {
                const d = ev.target.value.replace(/\D/g, "").slice(0, 9);
                setTel(d.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" ")));
                if (estado === "error" || estado === "fallo") setEstado("");
              }}
            />
          </div>
          {estado === "error" && <p className="wa-error">{t.waTelMal}</p>}
          {estado === "fallo" && <p className="wa-error">{t.waFallo}</p>}
          <button className="btn btn-go" type="button" disabled={estado === "enviando"} onClick={unirme}>
            {t.waUneteBtn}
          </button>
        </>
      )}
      {canal && (
        <a className="btn btn-wa" href={canal} target="_blank" rel="noopener">
          {t.waCanalBtn}
        </a>
      )}
      <p className="legal">{t.waBaja}</p>
    </section>
  );
}
