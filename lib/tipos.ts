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
  disponible: boolean;          // hay stock hoy (lo dice admintienda)
  origen: "pos" | "local";      // pos = viene de admintienda: nombre, precio y foto se editan allá
};

export type EstadoCatalogo = {
  configurado: boolean;
  ok?: boolean;
  error?: string;
  fecha?: string;
  fecha_error?: string;
  productos?: number;
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

export type Seccion = "sabores" | "turismo" | "marcas" | "novedades";

export type Contenido = { id: number; seccion: Seccion; titulo: string; resumen: string; imagen: string | null; url: string; activo: boolean; orden: number };

export type Landing = {
  negocio: { nombre: string; eslogan: string; wifi_minutos: number; ciudad: string };
  clima: Clima | null;
  flyers: Flyer[];
  promo: {
    tipo: "manual" | "clima" | "horario";
    momento: "calor" | "frio" | "manana" | "almuerzo" | "cafe" | "noche" | null;
    titulo: string;
    texto: string;
    productos: Producto[];
  };
  propio: { titulo: string; intro: string; items: { emoji: string; titulo: string; texto: string }[]; productos: Producto[] };
  contenidos: Partial<Record<Seccion, Contenido[]>>;
  carta: { id: number; nombre: string; emoji: string; productos: Producto[] }[];
  nosotros: { nosotros_historia: string; nosotros_objetivo: string; direccion: string; horario: string };
  enlaces: { wa_canal: string; instagram: string; facebook: string; tiktok: string; resena_url: string };
};
