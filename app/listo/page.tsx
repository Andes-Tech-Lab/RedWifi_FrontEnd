"use client";
import Flyers from "@/components/Flyers";
import { Carta, Pie, PromoDia } from "@/components/Secciones";
import { useQuery } from "@/lib/hotspot";
import { useLanding } from "@/lib/useLanding";

export default function Listo() {
  const { sp } = useQuery();
  const { datos } = useLanding();
  const orig = sp.get("orig");
  const minutos = datos?.negocio.wifi_minutos ?? 40;
  const e = datos?.enlaces;

  return (
    <div className="pagina">
      <div className="hero" style={{ minHeight: "auto", paddingTop: 24 }}>
        <main className="card">
          <div className="icono">✓</div>
          <h1 className="marca">¡Listo, ya estás conectado!</h1>
          <p className="sub">
            Disfruta tus <b>{minutos} minutos</b> de WiFi ☕
            <br />
            Te avisaremos por WhatsApp de promos y novedades.
          </p>
          {e?.wa_canal && (
            <a className="btn btn-wa" href={e.wa_canal}>
              📣 Únete a nuestro canal de WhatsApp
            </a>
          )}
          {e?.resena_url && (
            <a className="btn btn-sec" href={e.resena_url}>
              ⭐ Déjanos tu reseña
            </a>
          )}
          <a className="btn btn-sec" href={orig && /^https?:\/\//.test(orig) ? orig : "https://www.google.com"}>
            Seguir navegando →
          </a>
          {sp.get("demo") && <div className="aviso">Vista de desarrollo: en el WiFi real llegas aquí después del login del MikroTik.</div>}
        </main>
      </div>
      {datos && (
        <>
          <Flyers flyers={datos.flyers} />
          <PromoDia datos={datos} />
          <Carta datos={datos} />
          <Pie datos={datos} />
        </>
      )}
    </div>
  );
}
