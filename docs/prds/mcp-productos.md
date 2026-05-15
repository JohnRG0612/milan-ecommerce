# PRD — Integración del catálogo de productos vía MCP de Odoo

**Versión:** 1.0 (Fase B)
**Autor:** sesión de Claude Code con JohnRG
**Estado:** En implementación

---

## 1. Contexto

Hasta Fase A, el catálogo de Milán Ecommerce se servía desde un archivo TypeScript con **un solo producto hardcoded** (`lib/products.ts`). Era suficiente para validar el tracer end-to-end (home → product → cart) pero no es un catálogo real ni usable para evaluar otras features (búsqueda, recomendaciones).

En Fase B el catálogo pasa a venir del **MCP de Odoo** (`mcp__claude_ai_Odoo_MCP__query`), que da acceso de lectura a la base Postgres real de Bicicletas Milán. Tabla principal: `product_template` con ~13,500 productos activos y vendibles, mayoritariamente en categoría "Artículos".

## 2. Problema

1. El catálogo actual no representa el dominio real (1 producto vs ~13k en Odoo).
2. Las features que dependen del catálogo (buscador, recomendaciones, detalle) no pueden demostrarse con un solo producto.
3. La integración con Odoo tiene complejidad real (i18n JSON en `name`, `default_code` parcialmente nulo, no hay categorías granulares — todo bajo "Artículos") que requiere una capa de adaptación.
4. **El MCP es una herramienta de Claude en tiempo de planificación, no una API runtime que la Next app pueda invocar.** Esto fuerza una decisión arquitectónica: ¿conectar a Postgres directamente? ¿exportar un snapshot? ¿proxy intermedio?

## 3. Usuarios

| Usuario | Necesidad |
|---|---|
| Comprador final (navega `/`, `/product/[slug]`) | Ver productos reales con nombre, precio, categoría coherentes. |
| Ingeniero que mantiene el ecommerce | Una capa estable entre Odoo y la UI; tipos de dominio claros; no acoplarse a quirks de Odoo. |
| Evaluador del ejercicio | Evidencia de que los datos vienen del MCP, no del seed. |

## 4. Requisitos funcionales

**RF-1.** La página `/product/[slug]` muestra datos reales del MCP: nombre, descripción, precio en COP, categoría.
**RF-2.** La página `/` (catálogo) lista productos del MCP con link al detalle, no del seed local.
**RF-3.** El buscador (`/?q=texto`) filtra por **nombre y descripción** de los productos del MCP.
**RF-4.** La sección "Otros también vieron…" en `/product/[slug]` muestra 3-4 productos de la **misma categoría** (excluyendo el actual), del MCP.
**RF-5.** Los identificadores (`slug`) son **estables y URL-safe**: regenerar el snapshot no rompe links existentes.

## 5. Requisitos no funcionales

**RNF-1. Arquitectura — Deep Module.** El cliente del MCP se expone como `lib/mcp/` con **interfaz pública estrecha**: máximo 3 funciones exportadas desde `index.ts`. Toda la complejidad de Odoo (mapping i18n, slug, categorización, transform) vive en `lib/mcp/internal/`. Ningún consumidor (UI, otros módulos `lib/`) ve tipos de Odoo.

**RNF-2. Fuente de datos.** Como el MCP es una herramienta de Claude que no se invoca en runtime:
- Se hace **ingest** durante el desarrollo: Claude ejecuta queries SQL al MCP y materializa el resultado en `lib/mcp/internal/dataset.ts` como dataset tipado.
- La Next app lee del dataset materializado. Los datos **son reales de Odoo** (no inventados), solo se refrescan offline cuando se regenera el snapshot.
- **No es un mock.** Un mock devuelve datos fabricados; este dataset es la respuesta literal del MCP en el momento del snapshot. Documentar el snapshot date en el header del archivo para trazabilidad.

**RNF-3. Tipos de dominio.** El módulo expone un solo tipo `Product`:
```ts
type Product = {
  slug: string;          // URL-safe, estable, no contiene espacios ni caracteres especiales
  name: string;          // resuelto a es_CO con fallback a en_US
  description: string;   // texto plano sintetizado del nombre cuando Odoo no lo trae
  priceCents: number;    // list_price * 100, redondeado
  category: string;      // derivada del nombre (ruta, mtb, gravel, electrica, infantil, urbana, bmx, otros)
  imageUrl: string | null;
};
```

**RNF-4. Categorización derivada.** Como el 99% de productos viven en `categ_id = 1` ("Artículos"), las categorías de Odoo no sirven para recomendaciones. Se deriva una categoría heurística a partir del nombre del producto (`BICICLETA RUTA …` → `ruta`, `BICICLETA 29er …` → `mtb`, `BICICLETA GRAVEL …` → `gravel`, etc.). La lógica vive en `lib/mcp/internal/transform.ts` y es testeable.

**RNF-5. Volumen.** El dataset incluye 30-50 productos seleccionados con diversidad de categorías y rangos de precio. Suficiente para demos reales de búsqueda y recomendaciones sin inflar el bundle.

**RNF-6. Estabilidad de slugs.** El slug se genera como `slugify(name) + "-" + id`. El `id` de Odoo es estable, garantiza unicidad; el `name` slugificado da legibilidad.

## 6. Criterios de aceptación

- [x] `lib/mcp/index.ts` exporta **exactamente** 3 funciones públicas: `listProducts`, `getProductBySlug`, `getRelatedProducts`.
- [x] `lib/mcp/index.ts` no exporta tipos privados, helpers internos ni el dataset directamente.
- [x] `app/product/[slug]/page.tsx` muestra datos provenientes del dataset del MCP, demostrable comparando con una query SQL al MCP por `id` u `default_code`.
- [x] `app/page.tsx` lista los productos del MCP.
- [x] El catálogo en `/?q=29er` filtra a productos cuyo nombre o descripción contiene "29er".
- [x] `/product/[slug]` muestra 3-4 productos de la misma categoría en "Otros también vieron".
- [x] Tests unitarios para el transform Odoo→Product cubren: extracción i18n, generación de slug, derivación de categoría, conversión de precio.
- [x] El `Product` type definido en `lib/mcp/` es el único tipo que cruza al UI; no aparece `OdooRow` ni similar fuera del módulo.

## 7. No-objetivos (fuera de alcance de este PRD)

- Persistencia local del catálogo en Prisma (`Product` model se mantiene en `schema.prisma` pero ya no se siembra/usa; queda como deuda técnica para limpiar en Fase C/D).
- Conexión runtime a Postgres de Odoo (requeriría credenciales, configuración de red y manejo de cache; complejidad fuera de Fase B).
- Refresco automático del snapshot (cron, webhook, etc.). El refresh es manual durante desarrollo.
- Soporte multi-idioma en la UI. La UI muestra `es_CO` con fallback a `en_US` y no expone un selector de idioma.
- Multicompañía. El snapshot se toma con el contexto de compañía por defecto del MCP.
- Imágenes reales de productos. `imageUrl` queda `null` en Fase B; se cubre en fase posterior si hay tiempo.

## 8. Riesgos

| Riesgo | Mitigación |
|---|---|
| El snapshot se desincroniza con Odoo real | Documentar la fecha del snapshot en el header del dataset; refrescar a demanda. |
| El nombre i18n cambia su estructura (Odoo evoluciona) | El transform aísla esa dependencia; un cambio en Odoo solo afecta `lib/mcp/internal/transform.ts`. |
| Categorización derivada falla para productos nuevos con nombres ambiguos | Default a `otros`; los recomendados siguen funcionando aunque menos relevantes. Test cases para cada categoría conocida. |
| El bundle JS crece si el dataset crece | Mantener el dataset a ~50 productos; si crece, mover a un endpoint de Next que sirva el JSON dinámicamente. |
| Algún consumidor importa tipos privados del módulo | El public API solo re-exporta `Product`. Lint adicional (no implementado en Fase B) podría bloquear imports de `lib/mcp/internal/*` fuera del módulo. |

## 9. Plan de regeneración del snapshot

Cuando se necesite refrescar:
1. Abrir sesión de Claude Code con MCP `mcp__claude_ai_Odoo_MCP__query` conectado.
2. Ejecutar la query documentada en el header del archivo `dataset.ts`.
3. Reemplazar el array `ODOO_ROWS` y actualizar el comentario `// Snapshot taken: YYYY-MM-DD`.
4. Verificar `pnpm test` sigue en verde (los tests del transform protegen contra regresiones de tipos).
5. Commit `chore(mcp): refresh dataset snapshot YYYY-MM-DD`.
