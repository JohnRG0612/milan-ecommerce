export type Product = {
  slug: string;
  name: string;
  description: string;
  priceCents: number;
};

const products: Product[] = [
  {
    slug: "milan-urbana-01",
    name: "Milán Urbana 01",
    description:
      "Bicicleta urbana ideal para ciclorrutas de Bogotá. Cuadro de aluminio, 7 cambios.",
    priceCents: 1290000,
  },
];

export function listProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
