export type Temperatura = "caliente" | "fria" | "ambas";

export type Producto = {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  emoji: string;
  foto: string | null;
  propio: boolean;
  temperatura: Temperatura;
  destacado: boolean;
  activo: boolean;
  orden: number;
};

export type Clima = { temp: number; icono: string; descripcion: string; modo: "frio" | "templado" | "calor"; actualizado: string };

export type Flyer = {
  id: number;
  titulo: string;
  imagen: string;
  clima: "siempre" | "frio" | "calor";
  producto_id: number | null;
  activo: boolean;
  orden: number;
};

export type Landing = {
  negocio: { nombre: string; eslogan: string; wifi_minutos: number };
  clima: Clima | null;
  flyers: Flyer[];
  promo: { tipo: "manual" | "clima" | "destacados"; titulo: string; texto: string; productos: Producto[] };
  propio: { titulo: string; intro: string; items: { emoji: string; titulo: string; texto: string }[]; productos: Producto[] };
  carta: { id: number; nombre: string; emoji: string; productos: Producto[] }[];
  nosotros: { nosotros_historia: string; nosotros_objetivo: string; direccion: string; horario: string };
  enlaces: { wa_canal: string; instagram: string; facebook: string; tiktok: string; resena_url: string };
};
