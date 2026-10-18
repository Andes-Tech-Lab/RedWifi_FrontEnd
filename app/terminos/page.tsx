import type { Metadata } from "next";
import Volver from "./Volver";

export const metadata: Metadata = { title: "Términos · Chinkana WiFi" };

// TODO: completar razón social, RUC y dirección (igual que chinkana/terminos.html en el MikroTik).
export default function Terminos() {
  return (
    <div className="pagina">
      <article className="texto-legal">
        <h1>Términos de uso y privacidad</h1>
        <p>
          Al usar el WiFi de cortesía de Chinkana aceptas estos términos. Responsable del tratamiento: [RAZÓN SOCIAL], RUC [RUC],
          [DIRECCIÓN], Ayacucho.
        </p>
        <h2>Qué datos guardamos</h2>
        <ul>
          <li>Tu número de WhatsApp y, si lo vinculas, tu nombre y correo de Google.</li>
          <li>La dirección MAC de tu equipo, la fecha y la duración de tus conexiones.</li>
        </ul>
        <h2>Para qué los usamos</h2>
        <ul>
          <li>Darte acceso al WiFi y controlar el tiempo gratuito diario.</li>
          <li>Enviarte novedades y promociones de Chinkana por WhatsApp, si lo aceptaste.</li>
        </ul>
        <h2>Tus derechos (Ley 29733)</h2>
        <p>
          Puedes pedir acceder, corregir o eliminar tus datos, o darte de baja de los mensajes, escribiendo &quot;BAJA&quot; a nuestro
          WhatsApp o pidiéndolo en caja. No vendemos ni compartimos tus datos con terceros.
        </p>
        <h2>Uso del servicio</h2>
        <p>El WiFi es gratuito y de cortesía. No se permite su uso para actividades ilegales. Podemos limitar o suspender el acceso.</p>
        <Volver />
      </article>
    </div>
  );
}
