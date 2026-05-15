// Snapshot del catálogo de Bicicletas Milán desde el MCP de Odoo
// (tabla product_template, categoría "Artículos", filtros: active=true, sale_ok=true,
// nombre LIKE 'bicicleta%', excluyendo SKUs de paquetes "LLEVE").
//
// Snapshot date: 2026-05-15
// Total rows: 40
//
// Para regenerar (ver docs/prds/mcp-productos.md §9):
//   SELECT id, default_code, name->>'es_CO' AS name_es, list_price::float AS price_cop
//   FROM product_template
//   WHERE active = true AND sale_ok = true AND categ_id = 1
//     AND LOWER(name->>'es_CO') LIKE 'bicicleta%'
//     AND list_price > 200000
//   ORDER BY list_price DESC LIMIT 40
//
// IMPORTANTE: archivo interno. No importar desde fuera de lib/mcp/.

import type { OdooRow } from "./odoo-row";

export const ODOO_ROWS: OdooRow[] = [
  // — Premium —
  { id: 4992, default_code: "7705084273625", name_es: "BICICLETA ORBEA RISE M20 M AZUL-DORADO", price_cop: 20590000 },
  { id: 11115, default_code: "7705084303957", name_es: "BICICLETA RUTA OPTIMUS CARBONO VERSELLA 12 VEL 51CM BLANCO/NEGRO", price_cop: 6799900 },
  { id: 5264, default_code: "7705084273809", name_es: "BICICLETA ORBEA AVANT H30-D 55 BLANCO-GRIS", price_cop: 6590000 },
  { id: 4988, default_code: "7705084144345", name_es: "BICICLETA ORBEA AVANT H40-D 51 VERDE DE MILITAR-ORO", price_cop: 4999000 },
  { id: 27278, default_code: "7705084278989", name_es: "BICICLETA 29er CORVUS SRAM 12 VEL L BLANCO/GRIS", price_cop: 4799900 },
  { id: 27214, default_code: "7705084348361", name_es: "BICICLETA OPTIMUS 29er AVIOR 12 VEL M AZUL/AZUL METALICO ENSAMBLADA", price_cop: 3999900 },
  { id: 4991, default_code: "7705084144789", name_es: "BICICLETA ORBEA ALMA 29 H30 M AZUL-ROJO", price_cop: 3599000 },
  { id: 12765, default_code: "7705084332230", name_es: "BICICLETA GRAVEL OPTIMUS ANTARA SHIMANO GRX 10 VELOCIDADES 51CM VERDE OLIVA BLANCO", price_cop: 3459000 },
  { id: 32685, default_code: "7705084279054", name_es: "BICICLETA OPTIMUS 29er TUCANA PRO 12 VEL M NEGRO/DORADO", price_cop: 3399900 },

  // — Eléctricas —
  { id: 28186, default_code: "7705084268515", name_es: "BICICLETA ELECTRICA OPTIMUS 29er LYRA M NEGRO ROJO", price_cop: 2999900 },
  { id: 12582, default_code: "7705084329827", name_es: "BICICLETA ELÉCTRICA RIN 20 PROFIT 1X7 VELOCIDADES TIPO MOTO 48V 350W 10.4Ah", price_cop: 2500000 },
  { id: 35626, default_code: "7705084354447", name_es: "BICICLETA PROFIT ELECTRICA 29er VASTRA MTB 9 VEL M GRIS", price_cop: 2259900 },
  { id: 35623, default_code: "7705084354416", name_es: "BICICLETA PROFIT ELECTRICA 700C VASTRA URBAN 8 VEL 49CM GRIS", price_cop: 2159900 },
  { id: 27552, default_code: "7705084348736", name_es: "BICICLETA 29er ELÉCTRICA PROFIT 9 VEL M NEGRO-AZUL", price_cop: 1999900 },

  // — MTB intermedia/entrada —
  { id: 32737, default_code: "7705084296341", name_es: "BICICLETA OPTIMUS 700C VERSELLA LT 10 VEL 53 AZUL/NARANJA", price_cop: 2990000 },
  { id: 32719, default_code: "7705084246469", name_es: "BICICLETA OPTIMUS TUCANA HL 29ER 12 VELOCIDADES M NEGRO NARANJA SLX ENSAMBLADA", price_cop: 2640000 },
  { id: 12160, default_code: "7705084321128", name_es: "BICICLETA MTB 29er CARBONO SAGITTA 12V TALLA M OCRE-NEGRO", price_cop: 2579900 },
  { id: 28566, default_code: "7705084322989", name_es: "BICICLETA OPTIMUS SAGITTA 29ER 12 VELOCIDADES SHIMANO DEORE SUSPENSIÓN SUNTOUR XCR AIRE TALLA M NEGRO ROJO", price_cop: 2069900 },
  { id: 26699, default_code: "7705084057317", name_es: "BICICLETA 29ER OPTIMUS AQUILA MAX HL 13 VEL M GRIS VERDE LIMON ENSAMBLADA", price_cop: 1649900 },
  { id: 38597, default_code: null, name_es: "BICICLETA ORBEA DUDE 20 15 T-55 NEGRO-ANTRACITA", price_cop: 1577990 },

  // — Adulto entrada —
  { id: 27581, default_code: "7705084297461", name_es: "BICICLETA 26er PROFIT FREAK ALUMINIO 1 VEL MORADO TURQUEZA", price_cop: 899900 },
  { id: 32733, default_code: "7705084349238", name_es: "BICICLETA 24er-20er URBANA 1 VEL NARANJA ENSAMBLADA", price_cop: 769018 },
  { id: 38277, default_code: null, name_es: "BICICLETA 26er PROFIT SUNNY SIDE 7 VEL", price_cop: 559900 },
  { id: 26350, default_code: "7705084192544", name_es: "BICICLETA 20 BMX FRENO DE DISCO MARCO LANCER", price_cop: 400000 },
  { id: 27969, default_code: "7705084290929", name_es: "BICICLETA 24er JASPER Z3 7 VEL S GRIS/NEGRO/NARANJA", price_cop: 369900 },
  { id: 27032, default_code: "7705084059519", name_es: "BICICLETA 26er ASPEN 7 VEL M NEGRO/ROJO ENSAMBLADA", price_cop: 340000 },
  { id: 11856, default_code: "7705084315639", name_es: "BICICLETA 26er PROFIT DENVER 7 VEL M NEGRO/ROJO", price_cop: 329900 },
  { id: 26389, default_code: "7705084193855", name_es: "BICICLETA 27.5 F/DISCO R/AERODINAMICO ECONOMICA", price_cop: 299900 },
  { id: 26323, default_code: "7705084191943", name_es: "BICICLETA 20 BMX-TROOPER-DRIVE F/DISCO", price_cop: 300000 },
  { id: 26371, default_code: "7705084193138", name_es: "BICICLETA 26 SIN CAMBIOS ROJO/AZUL FRENO CANTILEVER", price_cop: 200000 },

  // — Infantil 20er —
  { id: 36594, default_code: "7705084357042", name_es: "BICICLETA 20er PROFIT WHOOSH MAGNESIO-ACERO 1 VEL VERDE-AMARILLO", price_cop: 359900 },
  { id: 12740, default_code: "7705084331943", name_es: "BICICLETA 20er PROFIT SWEETY 1 VEL MORADO-ROSADO", price_cop: 299900 },
  { id: 28538, default_code: "7705084301625", name_es: "BICICLETA 20er PROFIT NITRO V-BRAKE 1 VEL GRIS-NEGRO-NARANJA", price_cop: 289900 },
  { id: 12670, default_code: "7705084331127", name_es: "BICICLETA 20er PROFIT DELTA F. DISCO TRASERO 1V CAMUFLADO CAFÉ", price_cop: 269900 },

  // — Infantil 16er —
  { id: 12997, default_code: "7705084336054", name_es: "BICICLETA 16er PROFIT SAHARA 1V AZUL CON LUCES Y SONIDO", price_cop: 379900 },
  { id: 37134, default_code: "7705084358353", name_es: "BICICLETA 16er PROFIT WHOOSH MAGNESIO-ACERO 1 VEL VERDE-AMARILLO", price_cop: 329000 },
  { id: 28535, default_code: "7705084301564", name_es: "BICICLETA 16er PROFIT NITRO 1 VEL NEGRO-GRIS-VERDE NEON ENSAMBLADA", price_cop: 259900 },
  { id: 27517, default_code: "7705084064278", name_es: "BICICLETA 16er DRAGON FANTASY 1 VEL ROSADO ENSAMBLADA", price_cop: 269900 },

  // — Infantil 12er —
  { id: 35474, default_code: "7705084351699", name_es: "BICICLETA 12er NIÑO PROFIT NITRO V-BRAKE 1V ROJA", price_cop: 250000 },
  { id: 11210, default_code: "7705084329322", name_es: "BICICLETA 12er PROFIT PRINCESS PALACE 1 VEL BLANCO-VERDE ENSAMBLADA", price_cop: 258900 },
];
