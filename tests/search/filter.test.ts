// TDD — fase ROJA: estos tests deben FALLAR mientras lib/search/filter.ts
// no exista. La implementación llega en el commit siguiente (verde).

import { describe, expect, it } from "vitest";
import { filterProducts } from "@/lib/search/filter";
import type { Product } from "@/lib/mcp";

function product(over: Partial<Product> = {}): Product {
  return {
    slug: "p-1",
    name: "Bicicleta Orbea",
    description: "Bicicleta de prueba",
    priceCents: 100000,
    category: "mtb",
    imageUrl: null,
    ...over,
  };
}

describe("filterProducts", () => {
  it("query vacía retorna todos los productos", () => {
    const all = [product({ slug: "a" }), product({ slug: "b" })];
    expect(filterProducts(all, "")).toEqual(all);
    expect(filterProducts(all, "   ")).toEqual(all);
  });

  it("filtra por substring en el nombre, case-insensitive", () => {
    const all = [
      product({ slug: "orbea", name: "Bicicleta Orbea Rise" }),
      product({ slug: "profit", name: "Bicicleta Profit Whoosh" }),
    ];
    const result = filterProducts(all, "ORBEA");
    expect(result).toHaveLength(1);
    expect(result[0]!.slug).toBe("orbea");
  });

  it("filtra por substring en la descripción", () => {
    const all = [
      product({ slug: "x", description: "Mountain bike con frenos shimano" }),
      product({ slug: "y", description: "Bicicleta urbana de paseo" }),
    ];
    const result = filterProducts(all, "shimano");
    expect(result).toHaveLength(1);
    expect(result[0]!.slug).toBe("x");
  });

  it("ignora acentos y diacríticos (eléctrica = electrica)", () => {
    const all = [
      product({ slug: "e", name: "Bicicleta Eléctrica RIN 20" }),
      product({ slug: "m", name: "Bicicleta MTB" }),
    ];
    expect(filterProducts(all, "electrica")).toHaveLength(1);
    expect(filterProducts(all, "ELECTRICA")[0]!.slug).toBe("e");
    expect(filterProducts(all, "Eléctrica")[0]!.slug).toBe("e");
  });

  it("retorna [] cuando no hay matches", () => {
    const all = [product({ slug: "a" }), product({ slug: "b" })];
    expect(filterProducts(all, "zzzzz")).toEqual([]);
  });

  it("preserva el orden original de los productos coincidentes", () => {
    const all = [
      product({ slug: "1", name: "Bicicleta Uno" }),
      product({ slug: "2", name: "Bicicleta Dos" }),
      product({ slug: "3", name: "Bicicleta Tres" }),
    ];
    const result = filterProducts(all, "bicicleta");
    expect(result.map((p) => p.slug)).toEqual(["1", "2", "3"]);
  });
});
