// Adapter OdooRow -> Product de dominio.
//
// Concentra todo el conocimiento de la forma de Odoo:
//   - El name viene en mayúsculas y con detalles técnicos pegados;
//     derivamos un nombre presentable y una descripción sintetizada.
//   - El precio viene en COP (pesos) como número de Odoo; lo convertimos
//     a céntimos para que el dominio trabaje siempre en enteros.
//   - La categoría real de Odoo (categ_id=1 "Artículos") no es útil para
//     recomendaciones; la derivamos del nombre por heurística.
//
// Archivo interno. No exportar desde index.ts.

import type { OdooRow } from "./odoo-row";
import { makeSlug } from "./slug";
import type { Product, Category } from "@/lib/mcp/types";

const CATEGORY_RULES: Array<{ category: Category; pattern: RegExp }> = [
  { category: "electrica", pattern: /\b(electrica|eléctrica)\b/i },
  { category: "gravel", pattern: /\bgravel\b/i },
  { category: "ruta", pattern: /\b(ruta|avant|versella|700c)\b/i },
  { category: "bmx", pattern: /\bbmx\b/i },
  { category: "urbana", pattern: /\b(urbana|sin cambios)\b/i },
  { category: "infantil", pattern: /\b(12er|16er|niño|princess|sweety|dragon|sahara|little castle|whoosh|sunny side|fantasy|nitro)\b/i },
  { category: "mtb", pattern: /\b(mtb|29er|27\.5|27er|26er|24er|alma|dude|rise|sagitta|tucana|aquila|aspen|denver|freak|jasper)\b/i },
];

const CATEGORY_LABELS: Record<Category, string> = {
  ruta: "Bicicleta de ruta",
  mtb: "Mountain bike",
  gravel: "Bicicleta gravel",
  electrica: "Bicicleta eléctrica",
  bmx: "BMX",
  urbana: "Bicicleta urbana",
  infantil: "Bicicleta infantil",
  otros: "Bicicleta",
};

export function deriveCategory(name: string): Category {
  for (const rule of CATEGORY_RULES) {
    if (rule.pattern.test(name)) return rule.category;
  }
  return "otros";
}

export function presentableName(rawName: string): string {
  // "BICICLETA ORBEA RISE M20 M AZUL-DORADO" -> "Bicicleta Orbea Rise M20 M Azul-Dorado"
  return rawName
    .toLowerCase()
    .split(/(\s+|-)/)
    .map((part) => {
      if (part.length === 0 || /^\s+$/.test(part) || part === "-") return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("");
}

export function synthDescription(rawName: string, category: Category): string {
  const presentable = presentableName(rawName);
  const tag = CATEGORY_LABELS[category];
  return `${presentable}. ${tag} disponible en Bicicletas Milán.`;
}

export function toDomainProduct(row: OdooRow): Product {
  const category = deriveCategory(row.name_es);
  return {
    slug: makeSlug(row.name_es, row.id),
    name: presentableName(row.name_es),
    description: synthDescription(row.name_es, category),
    priceCents: Math.round(row.price_cop * 100),
    category,
    imageUrl: null,
  };
}
