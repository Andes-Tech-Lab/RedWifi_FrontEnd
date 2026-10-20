"use client";
/**
 * Español / inglés para los textos fijos del portal (los mismos que chinkana/login.html en el MikroTik).
 * Lo que se edita en /admin (carta, promos manuales, nosotros) sigue en español: ver DEUDA-TECNICA.md.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "es" | "en";
export type Momento = "calor" | "frio" | "manana" | "almuerzo" | "cafe" | "noche";

const es = {
  badge: "Te regalamos WiFi",
  bienvenido: (n: string) => `Bienvenido a ${n}`,
  sub2: "Navega gratis con un solo toque.",
  gratis: "gratis",
  homeOffice: "¿Home office?",
  pideCodigo: "pide tu código",
  waTit: "Quiero las promos del día por WhatsApp",
  waTxt: (n: string) =>
    `Si nos dejas tu número te enviaremos promociones del día e información de ${n}. Opcional: puedes darte de baja cuando quieras (Ley 29733).`,
  waErr: "Escribe un celular de 9 dígitos que empiece con 9, o desmarca la casilla para conectarte sin promos.",
  telPh: "Tu WhatsApp: 987 654 321",
  facil: "✓ Sin apps · ✓ Sin contraseña · ✓ Listo en segundos",
  alConectar: "Al conectarte aceptas los",
  terminos: "términos de uso",
  codeLink: "¿Tienes un código o eres del staff?",
  codeDemo: "En el WiFi real esto abre el ingreso de códigos del MikroTik.",
  pie1: "WiFi de cortesía de",
  pie2: "1 vez al día por equipo",
  conectando: "Conectándote…",
  verPromo: "Ver la promo del día",
  promoDia: "Promo del día",
  carta: "Nuestra carta",
  cartaIntro: "Los productos con «Propio» están hechos con nuestro café y chocolate.",
  todo: "Todo",
  propio: "Propio",
  agotado: "Agotado hoy",
  caliente: "Caliente",
  fria: "Frío",
  nosotros: "Nosotros",
  historia: "Nuestra historia",
  objetivo: "Nuestro objetivo",
  visitanos: "Visítanos",
  canalWa: "Canal de WhatsApp",
  terminosPie: "Términos y privacidad",
  // portada con fotos: el gancho va en la primera foto (mismos textos que chinkana/login.html)
  ganchos: {
    calor: { tag: "Día caluroso", tit: "Afuera quema. Aquí, todo bien helado", txt: "Frappés e iced lattes listos en minutos. Pídelo en barra." },
    frio: { tag: "Día frío", tit: "Calidez ayacuchana en tu taza", txt: "Chocolate espeso y café recién hecho para entrar en calor." },
    manana: { tag: "Buenos días", tit: "Empieza el día con un buen café", txt: "Espresso, latte o capuchino recién hechos." },
    almuerzo: { tag: "Buenas tardes", tit: "Tu pausa para recargar energías", txt: "Descubre lo que tenemos para disfrutar algo rico." },
    cafe: { tag: "Hora del café", tit: "Un buen café, algo dulce y un momento para ti", txt: "Café, postres y chocolate de la casa." },
    noche: { tag: "Buenas noches", tit: "Cierra el día con algo rico", txt: "Chocolate caliente y postres para terminar bien el día." },
  },
  climaDesc: (d: string) => d,
  actualizado: (h: string) => `actualizado ${h}`,
  antojosTit: "Antójate mientras navegas",
  antojosSub: "Pídelo en barra",
  ideal: "Ideal hoy",
  verCarta: "Ver la carta",
  // pantalla «¡Conectado!»
  conectado: "¡Conectado!",
  yaPuedes: (n: number) => `Ya puedes navegar gratis por ${n} minutos.`,
  seguir: "Seguir navegando",
  promoDelDia: "Promoción del día",
  verMenu: "Ver menú completo",
  siguenos: "Síguenos en Instagram",
  resena: "Déjanos tu reseña",
  waUneteTit: "Recibe nuestras promociones por WhatsApp",
  waUneteTxt: "Ofertas del día, productos nuevos y eventos especiales.",
  waUneteBtn: "Quiero unirme",
  waCanalBtn: "Unirme al canal",
  waGuardado: "¡Listo! Te escribiremos con las promos del día.",
  waYa: "✓ Ya recibes nuestras promos por WhatsApp.",
  waBaja: "Puedes darte de baja cuando quieras (Ley 29733).",
  waTelMal: "Escribe un celular de 9 dígitos que empiece con 9.",
  waFallo: "No pudimos guardarlo. Inténtalo de nuevo en un momento.",
  descubre: (n: string) => `Descubre más de ${n}`,
  cafeCacao: "Café y cacao",
  gracias: "Gracias por ser parte de esta experiencia",
  demoListo: "Vista de desarrollo: en el WiFi real llegas aquí después del login del MikroTik.",
  lema: "Del origen a tu taza",
  sublema: "Café · Cacao · Experiencias",
  pilares: ["Café de origen", "Chocolate bean to bar", "Gastronomía local", "Experiencias turísticas"],
  wifiGratis: "WiFi gratis",
  ctaSub: (n: number) => `WiFi gratis · ${n} min`,
  // Titular corto del celular: Huamanga + lo que se antoja. La segunda parte va en manuscrita.
  tituloMovil: {
    calor: ["Calor en Huamanga,", "frappé bien helado"], frio: ["Frío en Huamanga,", "chocolate en tu taza"],
    manana: ["Mañana en Huamanga,", "café recién hecho"], almuerzo: ["Mediodía en Huamanga,", "una pausa rica"],
    cafe: ["Tarde en Huamanga,", "café y algo dulce"], noche: ["Noche en Huamanga,", "chocolate calientito"],
  } as Record<Momento, [string, string]>,
  beneficios: (n: number) => [`${n} minutos de navegación`, "Ideal para trabajar o compartir", "Conexión rápida"],
  climaMsg: {
    calor: "¡Día perfecto para algo bien helado!", frio: "¡Día perfecto para un chocolate caliente!",
    manana: "¡Buen día para empezar con café!", almuerzo: "¡Buen momento para recargar energías!",
    cafe: "¡Hora perfecta para un café!", noche: "¡Buena noche para un chocolate!",
  } as Record<Momento, string>,
  recomendado: "Recomendado hoy",
  pideloBarra: "Pídelo en barra",
  waCorto: "Quiero las promos del día por WhatsApp",
  opcional: "opcional",
  verificando: "Verificando tu conexión…",
  sinInternetTit: "Todavía no tienes internet",
  sinInternetTxt: "Si ya tocaste «Conectarme», espera unos segundos y vuelve a intentar.",
  reintentar: "Volver a intentar",
  volverPortal: "Ir al portal",
  explora: "Explora",
  verMas: "Ver más",
  secciones: {
    sabores: { tit: "Sabores", sub: "Café, cacao, recetas y preparación" },
    turismo: { tit: "Turismo", sub: "Tours, rutas y experiencias en Ayacucho" },
    marcas: { tit: "Marcas", sub: "Lo nuestro y empresas aliadas" },
    novedades: { tit: "Novedades", sub: "Promociones, eventos y actividades" },
  },
  propuesta: "Nuestra propuesta",
  momentos: {
    calor: { cta: "Refréscate y conéctate gratis", card: "¿Calor? Refréscate aquí", sub: "Un frappé bien helado + WiFi gratis",
      tit: (t?: number) => `Hoy hace ${t} °C, ¡refréscate!`, txt: "Frappés, bubble tea y bebidas heladas." },
    frio: { cta: "Abrígate y conéctate gratis", card: "¿Frío? Entra en calor", sub: "Un chocolate humeante + WiFi gratis",
      tit: (t?: number) => `Hoy hace ${t} °C, ¡caliéntate!`, txt: "Nuestras bebidas calientes para este frío." },
    manana: { cta: "Empieza tu día · Conéctate gratis", card: "Empieza tu día aquí", sub: "Un buen café + WiFi gratis",
      tit: () => "Empieza el día con un buen café", txt: "Espresso, latte o capuchino recién hechos." },
    almuerzo: { cta: "Recarga energías · Conéctate gratis", card: "Tu pausa para recargar energías", sub: "Algo rico + WiFi gratis",
      tit: () => "Tu pausa para recargar energías", txt: "Descubre lo que tenemos para disfrutar algo rico." },
    cafe: { cta: "Date una pausa · Conéctate gratis", card: "Haz una pausa diferente", sub: "Café, algo dulce + WiFi gratis",
      tit: () => "Un buen café, algo dulce y un momento para ti", txt: "Café, postres y chocolate de la casa." },
    noche: { cta: "Cierra el día · Conéctate gratis", card: "Cierra el día con algo rico", sub: "Un chocolate calientito + WiFi gratis",
      tit: () => "Cierra el día con algo rico", txt: "Chocolate caliente y postres para terminar bien el día." },
  },
};

const en: typeof es = {
  badge: "Free WiFi on us",
  bienvenido: (n) => `Welcome to ${n}`,
  sub2: "Get online with a single tap.",
  gratis: "free",
  homeOffice: "Working remotely?",
  pideCodigo: "ask for a code",
  waTit: "Send me today's deals on WhatsApp",
  waTxt: (n) => `Leave your number and we'll send you ${n}'s daily deals and news. Optional: unsubscribe anytime (Peru Law 29733).`,
  waErr: "Enter a 9-digit Peruvian mobile starting with 9, or untick the box to connect without deals.",
  telPh: "Your WhatsApp: 987 654 321",
  facil: "✓ No apps · ✓ No password · ✓ Ready in seconds",
  alConectar: "By connecting you accept the",
  terminos: "terms of use",
  codeLink: "Have a code or are you staff?",
  codeDemo: "On the real WiFi this opens the MikroTik code login.",
  pie1: "Complimentary WiFi by",
  pie2: "once a day per device",
  conectando: "Connecting…",
  verPromo: "See today's deal",
  promoDia: "Today's deal",
  carta: "Our menu",
  cartaIntro: "Items marked “House-made” use our own coffee and chocolate.",
  todo: "All",
  propio: "House-made",
  agotado: "Sold out today",
  caliente: "Hot",
  fria: "Cold",
  nosotros: "About us",
  historia: "Our story",
  objetivo: "Our goal",
  visitanos: "Visit us",
  canalWa: "WhatsApp channel",
  terminosPie: "Terms & privacy",
  ganchos: {
    calor: { tag: "Hot day", tit: "Scorching outside. Ice cold in here", txt: "Frappés and iced lattes ready in minutes. Order at the counter." },
    frio: { tag: "Cold day", tit: "Ayacucho warmth in your cup", txt: "Thick hot chocolate and fresh coffee to warm you up." },
    manana: { tag: "Good morning", tit: "Start your day with great coffee", txt: "Espresso, latte or cappuccino, freshly made." },
    almuerzo: { tag: "Good afternoon", tit: "Your break to recharge", txt: "Discover something tasty to enjoy." },
    cafe: { tag: "Coffee time", tit: "Great coffee, something sweet and a moment for you", txt: "Coffee, desserts and house chocolate." },
    noche: { tag: "Good evening", tit: "End your day with a treat", txt: "Hot chocolate and desserts to wrap up the day." },
  },
  // La API manda la descripción del clima en español
  climaDesc: (d) =>
    ({ Despejado: "Clear", "Parcialmente nublado": "Partly cloudy", Neblina: "Fog", Lluvia: "Rain", Nieve: "Snow",
       Chubascos: "Showers", Tormenta: "Storm", Nublado: "Cloudy" } as Record<string, string>)[d] ?? d,
  actualizado: (h) => `updated ${h}`,
  antojosTit: "Treat yourself while you browse",
  antojosSub: "Order at the counter",
  ideal: "Perfect today",
  verCarta: "See the menu",
  conectado: "You're connected!",
  yaPuedes: (n) => `Enjoy ${n} minutes of free WiFi.`,
  seguir: "Keep browsing",
  promoDelDia: "Today's deal",
  verMenu: "See full menu",
  siguenos: "Follow us on Instagram",
  resena: "Leave us a review",
  waUneteTit: "Get our deals on WhatsApp",
  waUneteTxt: "Daily deals, new products and special events.",
  waUneteBtn: "Sign me up",
  waCanalBtn: "Join the channel",
  waGuardado: "Done! We'll message you with today's deals.",
  waYa: "✓ You're already getting our deals on WhatsApp.",
  waBaja: "Unsubscribe anytime (Peru Law 29733).",
  waTelMal: "Enter a 9-digit Peruvian mobile starting with 9.",
  waFallo: "We couldn't save it. Please try again in a moment.",
  descubre: (n) => `Discover more of ${n}`,
  cafeCacao: "Coffee & cacao",
  gracias: "Thank you for being part of this experience",
  demoListo: "Dev preview: on the real WiFi you land here after the MikroTik login.",
  lema: "From origin to your cup",
  sublema: "Coffee · Cacao · Experiences",
  pilares: ["Single-origin coffee", "Bean-to-bar chocolate", "Local food", "Travel experiences"],
  wifiGratis: "Free WiFi",
  ctaSub: (n) => `Free WiFi · ${n} min`,
  tituloMovil: {
    calor: ["Hot in Huamanga,", "ice-cold frappé"], frio: ["Cold in Huamanga,", "chocolate in your cup"],
    manana: ["Morning in Huamanga,", "fresh-brewed coffee"], almuerzo: ["Midday in Huamanga,", "a tasty break"],
    cafe: ["Afternoon in Huamanga,", "coffee & something sweet"], noche: ["Night in Huamanga,", "warm hot chocolate"],
  },
  beneficios: (n) => [`${n} minutes online`, "Great for work or hanging out", "Fast connection"],
  climaMsg: {
    calor: "Perfect day for something ice cold!", frio: "Perfect day for a hot chocolate!",
    manana: "Great morning for a coffee!", almuerzo: "Good time to recharge!",
    cafe: "Perfect time for coffee!", noche: "Nice night for a hot chocolate!",
  },
  recomendado: "Recommended today",
  pideloBarra: "Order at the counter",
  waCorto: "Send me today's deals on WhatsApp",
  opcional: "optional",
  verificando: "Checking your connection…",
  sinInternetTit: "You're not online yet",
  sinInternetTxt: "If you already tapped “Connect”, wait a few seconds and try again.",
  reintentar: "Try again",
  volverPortal: "Go to the portal",
  explora: "Explore",
  verMas: "See more",
  secciones: {
    sabores: { tit: "Flavors", sub: "Coffee, cacao, recipes and brewing" },
    turismo: { tit: "Travel", sub: "Tours, routes and experiences in Ayacucho" },
    marcas: { tit: "Brands", sub: "Our own and partner businesses" },
    novedades: { tit: "News", sub: "Deals, events and activities" },
  },
  propuesta: "What we offer",
  momentos: {
    calor: { cta: "Cool off & connect free", card: "Hot out? Cool off here", sub: "An ice-cold frappé + free WiFi",
      tit: (t) => `It's ${t} °C today, cool off!`, txt: "Frappés, bubble tea and iced drinks." },
    frio: { cta: "Warm up & connect free", card: "Chilly? Warm up here", sub: "A steaming hot chocolate + free WiFi",
      tit: (t) => `It's ${t} °C today, warm up!`, txt: "Our hot drinks for this chilly weather." },
    manana: { cta: "Start your day · Connect free", card: "Start your day here", sub: "Great coffee + free WiFi",
      tit: () => "Start your day with great coffee", txt: "Espresso, latte or cappuccino, freshly made." },
    almuerzo: { cta: "Recharge · Connect free", card: "Your break to recharge", sub: "Something tasty + free WiFi",
      tit: () => "Your break to recharge", txt: "Discover something tasty to enjoy." },
    cafe: { cta: "Take a break · Connect free", card: "Take a different kind of break", sub: "Coffee, something sweet + free WiFi",
      tit: () => "Great coffee, something sweet and a moment for you", txt: "Coffee, desserts and house chocolate." },
    noche: { cta: "Unwind · Connect free", card: "End your day with a treat", sub: "A warm hot chocolate + free WiFi",
      tit: () => "End your day with a treat", txt: "Hot chocolate and desserts to wrap up the day." },
  },
};

const TEXTOS = { es, en };
const CLAVE = "chk-lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: typeof es };
const IdiomaCtx = createContext<Ctx>({ lang: "es", setLang: () => {}, t: es });

export function IdiomaProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  // El HTML pre-generado sale en español; al montar se usa lo que eligió antes o el idioma del teléfono.
  useEffect(() => {
    let guardado: string | null = null;
    try {
      guardado = localStorage.getItem(CLAVE);
    } catch {}
    setLangState(guardado === "es" || guardado === "en" ? guardado : /^es/i.test(navigator.language || "es") ? "es" : "en");
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem(CLAVE, l);
    } catch {}
  }

  return <IdiomaCtx.Provider value={{ lang, setLang, t: TEXTOS[lang] }}>{children}</IdiomaCtx.Provider>;
}

export const useIdioma = () => useContext(IdiomaCtx);

/** Hora local → franja de promo cuando el clima no es extremo (mismas horas que la API). */
export function momentoDelDia(): Momento {
  const h = new Date().getHours();
  return h < 11 ? "manana" : h < 15 ? "almuerzo" : h < 20 ? "cafe" : "noche";
}

/**
 * momentoDelDia() para usar en el render. El HTML pre-generado lleva la hora del build (UTC en Vercel):
 * leer la hora antes de montar rompe la hidratación (React #418). Primero "cafe", al montar la hora real.
 */
export function useMomentoDelDia(): Momento {
  const [momento, setMomento] = useState<Momento>("cafe");
  useEffect(() => setMomento(momentoDelDia()), []);
  return momento;
}

// Banderas en SVG: Windows no dibuja los emojis de bandera (salen como "PE").
export function BanderaPE() {
  return (
    <svg viewBox="0 0 3 2" aria-hidden="true">
      <rect width="3" height="2" fill="#D91023" />
      <rect x="1" width="1" height="2" fill="#fff" />
    </svg>
  );
}

function BanderaUS() {
  return (
    <svg viewBox="0 0 38 20" aria-hidden="true">
      <rect width="38" height="20" fill="#fff" />
      <path
        fill="#B22234"
        d="M0 0h38v1.54H0zm0 3.08h38v1.54H0zm0 3.08h38v1.54H0zm0 3.08h38v1.54H0zm0 3.08h38v1.54H0zm0 3.08h38v1.54H0zm0 3.08h38v1.54H0z"
      />
      <rect width="15.2" height="10.77" fill="#3C3B6E" />
    </svg>
  );
}

export function SelectorIdioma() {
  const { lang, setLang } = useIdioma();
  return (
    <div className="idioma" role="group" aria-label="Idioma / Language">
      <button type="button" className={lang === "es" ? "on" : ""} aria-label="Español" onClick={() => setLang("es")}>
        <BanderaPE />
        ES
      </button>
      <button type="button" className={lang === "en" ? "on" : ""} aria-label="English" onClick={() => setLang("en")}>
        <BanderaUS />
        EN
      </button>
    </div>
  );
}
