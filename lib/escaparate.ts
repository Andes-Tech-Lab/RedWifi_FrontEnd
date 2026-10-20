/**
 * Fotos de fondo de la portada. Están en public/img/ (no en internet) porque el cliente todavía no
 * navega cuando ve el portal. Son las mismas del respaldo del MikroTik (chinkana/img/): fotos de
 * Unsplash de ejemplo, ver DEUDA-TECNICA.md.
 */
import type { Momento } from "./idioma";

export type Temp = "fria" | "caliente" | "ambas";
type Texto = { tag: string; tit: string; txt: string };
export type Slide = { img: string; temp: Temp; es: Texto; en: Texto };

export const SLIDES: Slide[] = [
  { img: "/img/hero-latte.jpg", temp: "caliente",
    es: { tag: "Recién preparado", tit: "Café de especialidad", txt: "Granos seleccionados y latte art hecho al momento." },
    en: { tag: "Freshly made", tit: "Specialty coffee", txt: "Hand-picked beans and latte art made to order." } },
  { img: "/img/hero-frappe-cafe.jpg", temp: "fria",
    es: { tag: "El favorito", tit: "Frappés que enamoran", txt: "Helado, crema batida y mucho chocolate." },
    en: { tag: "Crowd favorite", tit: "Frappés you'll love", txt: "Ice cream, whipped cream and lots of chocolate." } },
  { img: "/img/hero-chocolate.jpg", temp: "caliente",
    es: { tag: "Cacao peruano", tit: "Chocolate caliente", txt: "Espeso, cremoso y servido humeante." },
    en: { tag: "Peruvian cacao", tit: "Hot chocolate", txt: "Thick, creamy and served steaming." } },
  { img: "/img/hero-iced.jpg", temp: "fria",
    es: { tag: "Bien helado", tit: "Bebidas heladas", txt: "Iced latte y cold brew para refrescarte." },
    en: { tag: "Ice cold", tit: "Iced drinks", txt: "Iced latte and cold brew to cool you down." } },
];

/** Qué se antoja en cada momento: eso va primero (fotos y carrusel). */
const PREFIERE: Record<Momento, Temp | ""> = {
  calor: "fria", frio: "caliente", manana: "caliente", almuerzo: "", cafe: "caliente", noche: "caliente",
};

export const prefiere = (m: Momento) => PREFIERE[m];

/** Orden estable: primero lo del momento, luego lo que sirve para ambos, al final el resto. */
export function ordenarPorMomento<T>(lista: T[], temp: (x: T) => string, m: Momento): T[] {
  const p = PREFIERE[m];
  const rango = (t: string) => (!p ? 0 : t === p ? 0 : t === "ambas" ? 1 : 2);
  return lista
    .map((x, i) => [x, i] as const)
    .sort((a, b) => rango(temp(a[0])) - rango(temp(b[0])) || a[1] - b[1])
    .map(([x]) => x);
}

/**
 * Foto vertical (2:3, ~900×1350) de la portada en el celular: una fija por momento, sin rotar.
 * Para cambiarla, reemplaza el archivo en public/img/ con el mismo nombre.
 */
const FOTO_MOVIL: Record<Momento, string> = {
  calor: "/img/movil-calor.jpg", frio: "/img/movil-frio.jpg", noche: "/img/movil-frio.jpg",
  manana: "/img/movil-cafe.jpg", almuerzo: "/img/movil-cafe.jpg", cafe: "/img/movil-cafe.jpg",
};
export const fotoMovil = (m: Momento) => FOTO_MOVIL[m];

/** Foto de respaldo para la promo cuando el producto no tiene foto. */
export const fotoDelMomento = (m: Momento) => (PREFIERE[m] === "fria" ? "/img/hero-frappe-cafe.jpg" : "/img/hero-chocolate.jpg");
