// Deep Module: cliente del catálogo de productos vía MCP de Odoo.
//
// Interfaz pública estrecha (3 funciones). La complejidad real
// (snapshot, transform, slug, categorización heurística) vive en
// lib/mcp/internal/ y nunca cruza esta frontera.
//
// Consumidores no deben importar nada de lib/mcp/internal/*.

import { ODOO_ROWS } from "./internal/dataset";
import { toDomainProduct } from "./internal/transform";
import type { Product } from "./types";

export type { Product, Category } from "./types";

let cachedCatalog: Product[] | null = null;

function catalog(): Product[] {
  if (cachedCatalog === null) {
    cachedCatalog = ODOO_ROWS.map(toDomainProduct);
  }
  return cachedCatalog;
}

export async function listProducts(): Promise<Product[]> {
  return catalog();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return catalog().find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(
  slug: string,
  limit = 4,
): Promise<Product[]> {
  const all = catalog();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];
  return all
    .filter((p) => p.category === current.category && p.slug !== slug)
    .slice(0, limit);
}
