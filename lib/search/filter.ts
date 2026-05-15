// Filtrado de catálogo por texto libre.
//
// Función pura: input list + query, output sublist. Sin acceso al MCP
// (el caller pasa los productos ya cargados). Esto permite testearla
// sin mocks y reutilizarla con cualquier fuente futura.

import type { Product } from "@/lib/mcp";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function filterProducts(products: Product[], query: string): Product[] {
  const q = normalize(query).trim();
  if (q.length === 0) return products;
  return products.filter((p) => {
    const haystack = normalize(`${p.name} ${p.description}`);
    return haystack.includes(q);
  });
}
