// Generación de slug URL-safe estable.
//
// Pure function. Toma el nombre del producto y su id de Odoo, devuelve
// un slug en kebab-case con id como sufijo. El id garantiza unicidad
// aunque dos productos compartan nombre.
//
// Ejemplos:
//   ("BICICLETA ORBEA RISE M20", 4992) -> "bicicleta-orbea-rise-m20-4992"
//   ("Bicicleta Eléctrica RIN 20", 12582) -> "bicicleta-electrica-rin-20-12582"
//
// Archivo interno. No exportar desde index.ts.

const COMBINING_MARKS = /[̀-ͯ]/g;
const NON_ALPHANUMERIC = /[^a-z0-9]+/g;
const LEADING_TRAILING_DASH = /^-+|-+$/g;

export function makeSlug(name: string, id: number): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(NON_ALPHANUMERIC, "-")
    .replace(LEADING_TRAILING_DASH, "");
  return slug ? `${slug}-${id}` : `producto-${id}`;
}
