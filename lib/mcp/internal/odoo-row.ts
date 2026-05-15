// Shape interna de una fila del MCP de Odoo (tabla product_template).
// NO se exporta desde lib/mcp/index.ts — los consumidores no deben conocer
// la forma de Odoo, solo el tipo Product de dominio.

export type OdooRow = {
  id: number;
  default_code: string | null;
  name_es: string;
  price_cop: number;
};
