# AGENTS.md — Milán Ecommerce

> Steering operativo para Claude Code. Mantener corto: cada vez que se trabaje en este repo, Claude lee este archivo, no es documentación general.

## Stack del proyecto

- Next.js 15 (App Router) + TypeScript + React 19
- Prisma 5 + SQLite (modelo `User`, `CartItem`; `Product` está obsoleto, ver §"Catálogo y MCP")
- Catálogo de productos: **MCP de Odoo** (`mcp__claude_ai_Odoo_MCP__query`), snapshot materializado en `lib/mcp/internal/dataset.ts`
- Tests con Vitest, pre-commit con Husky (bloquea si lint o tests fallan)
- pnpm 9 con cuarentena 7 días (no usar npm)

## Principios de diseño

1. **El dominio vive en `lib/`, no en `app/`.** Las páginas son orquestación + render. Toda lógica reusable (catálogo, carrito, búsqueda, auth) se importa desde `lib/<dominio>/`.
2. **Tipos de dominio propios; tipos de Odoo y Prisma no cruzan al UI.** Cada módulo expone su tipo público (ej. `Product` en `lib/mcp/types.ts`). Los adapters (`fromOdooRow`, `fromPrisma`) viven dentro del módulo.
3. **Deep Module = interfaz estrecha, implementación rica.** Cuando un módulo tiene complejidad real (mapping, transform, heurísticas), su `index.ts` expone máximo 3 funciones públicas; el resto vive en `internal/`. Ver §"Deep Module: lib/mcp/".
4. **Server Components por defecto.** Client solo cuando hay estado local, eventos DOM o hooks de cliente. Los Client Components no leen de cookies httpOnly ni de Prisma.
5. **Una sola fuente de verdad por recurso.** Catálogo = MCP (snapshot). Carrito = cookie httpOnly. Sesión = cookie httpOnly. Si dos módulos guardan lo mismo, hay un bug de diseño.

## Convenciones de código

- **Server Actions** en `lib/<dominio>/actions.ts` (auth) o `app/<ruta>/actions.ts` (cart) con `"use server"` en la primera línea del archivo. Nunca mezclar lectores con server actions en el mismo archivo.
- **Tests**: `tests/<dominio>/<archivo>.test.ts`. `tests/smoke.test.ts` se mantiene como canario de tooling.
- **Tamaño**: componente React > 80 líneas o módulo `lib/` > 150 líneas dispara división.
- **Naming**: componentes `PascalCase.tsx`, módulos `lib/` `kebab-case.ts`, server actions con prefijo verbo (`addToCartAction`, `loginAction`).
- **Commits**: convencionales — `feat | fix | test | refactor | docs | chore(scope): mensaje`. No squash, no amend (preservar historial).
- **TDD**: para lógica pura nueva, escribir tests primero. El ciclo rojo→verde tiene que ser visible en `git log`. Hacer el rojo **antes** de activar el bloqueo de tests en el pre-commit hook.

## Catálogo y MCP

- `lib/mcp/` es la única frontera con Odoo. Ver `docs/prds/mcp-productos.md`.
- **Limitación**: el MCP es una herramienta de Claude en tiempo de planificación, no una API runtime. Por eso el catálogo se ingiere como snapshot tipado en `lib/mcp/internal/dataset.ts`. Los datos son reales, no inventados. No es un mock.
- El modelo Prisma `Product` se mantiene en `schema.prisma` por compatibilidad de la migración inicial, pero **no se siembra ni se consulta**. Es deuda técnica para limpiar en Fase C/D.

## Deep Module: `lib/mcp/`

Interfaz pública (`lib/mcp/index.ts` — 3 funciones):

```ts
listProducts(): Promise<Product[]>
getProductBySlug(slug: string): Promise<Product | null>
getRelatedProducts(slug: string, limit?: number): Promise<Product[]>
```

Complejidad encapsulada en `lib/mcp/internal/`:

| Archivo | Responsabilidad |
|---|---|
| `dataset.ts` | Snapshot crudo de Odoo (rows `OdooRow`). Documenta query SQL y fecha de snapshot. |
| `odoo-row.ts` | Tipo privado `OdooRow`. **No exportado al exterior.** |
| `slug.ts` | `makeSlug(name, id)` — pure, slugifica + sufija id para unicidad. |
| `transform.ts` | `toDomainProduct(row)` — concentra extracción de nombre, derivación de categoría, síntesis de descripción, conversión COP→céntimos. |

**Reglas:**
- Importar **solo** desde `@/lib/mcp` (no desde `internal/`). Si necesitas algo nuevo, expónlo desde `index.ts`.
- Si una nueva función pública sería la cuarta, primero pregunta si la lógica encaja en una de las tres existentes.

## Persistencia: decisiones

- **Carrito**: cookie httpOnly (`milan_cart`), JSON de slugs. Razón: server components pueden leer/escribir sin "use client", evita hidratación, mismo patrón que sesión.
- **Sesión** (login mock): cookie httpOnly (`milan_user`) con el email normalizado. Sin password, sin verificación — mock.
- **No usamos `localStorage`** en Fase B. localStorage forzaría client components y rompería SSR del header con email/contador. Si en una fase futura se necesita persistencia cross-tab inmediata, evaluar entonces.

## Cómo correr el proyecto

```bash
pnpm install
pnpm db:setup       # genera Prisma client + migración inicial (no estrictamente necesario para Fase B)
pnpm dev
```

## Cómo correr los tests

```bash
pnpm test           # una vez
pnpm test:watch     # modo watch
```

## Flujo de trabajo esperado

- Features no triviales → PRD en `docs/prds/<feature>.md` antes de tocar código. Ejemplo de la fase: `docs/prds/mcp-productos.md`.
- Pre-commit hook activo (`pnpm lint && pnpm test`). Si necesitas committear código con tests rojos (ciclo TDD), hazlo **antes** de activar el hook o usa `--no-verify` solo si el usuario lo aprueba explícitamente.
- Commit pequeño por capa: data → módulo → wiring → UI.
- Si tocas `prisma/schema.prisma`, ejecuta `pnpm prisma migrate dev` con nombre descriptivo (irrelevante mientras el catálogo viva en MCP).

## MCP disponibles

- **`mcp__claude_ai_Odoo_MCP__query`** (Odoo) — Postgres real de Bicicletas Milán, **solo lectura**. Usar solo durante refresh manual del snapshot (ver PRD §9), nunca en runtime. Restringir queries a `categ_id = 1 AND active = true AND sale_ok = true`. El JSONB `name` requiere `->>'es_CO'` con fallback `'en_US'`.
- Otros MCPs solo si el usuario los autoriza explícitamente para una tarea concreta.
