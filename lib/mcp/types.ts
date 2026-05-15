// Tipos públicos del Deep Module lib/mcp/.
// Estos son los únicos tipos que cruzan al UI y a otros módulos lib/.

export type Category =
  | "ruta"
  | "mtb"
  | "gravel"
  | "electrica"
  | "bmx"
  | "urbana"
  | "infantil"
  | "otros";

export type Product = {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  category: Category;
  imageUrl: string | null;
};
