# Fase 0 — Notas de entendimiento del repo

> Insumos para AGENTS.md. **No** son la versión final de los Principios de Diseño — se refinarán en fases posteriores.

## 1. Stack y convenciones a respetar

### Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 15.5.18 |
| Runtime UI | React | 19.2.6 |
| Lenguaje | TypeScript | 5.9.3 |
| ORM | Prisma | 5.22.0 |
| DB local | SQLite (`file:./dev.db`) | — |
| Estilos | Tailwind CSS | 3.4.19 |
| Tests | Vitest + jsdom | 2.1.9 |
| Hooks git | Husky (desactivado en Fase A) | 9.1.7 |
| Gestor paquetes | pnpm con cuarentena 7 días | 9.15.0 |

### ¿Cómo se conectan a la página?

- `app/layout.tsx` envuelve toda la app, importa `globals.css` (Tailwind) y define el header.
- Cada `page.tsx` es un Server Component por defecto.
- `lib/prisma.ts` exporta un singleton `prisma` que cualquier server component o server action puede importar para hablar con SQLite.
- El catálogo en Fase A se sirve desde `Product` de Prisma (seed con 20 bicis). En Fase B el catálogo migra al **MCP de Odoo** (Ejercicio 1) — `User` y `CartItem` siguen en Prisma.
- `tailwind.config.ts` apunta a `./app/**/*.{ts,tsx}` y `./lib/**/*.{ts,tsx}` para purgar.
- `.npmrc` aplica cuarentena anti supply-chain (`minimum-release-age=10080`) — usar `pnpm`, no `npm`.

### Convenciones de Next.js (App Router) que se respetan aquí

| Archivo / patrón | Significado | Uso en este repo |
|---|---|---|
| `page.tsx` | Ruta navegable | `/`, `/cart`, `/login`, `/product/[slug]` |
| `layout.tsx` | Layout compartido (anidable) | Solo raíz por ahora |
| `[slug]` | Segmento dinámico | `/product/[slug]` |
| `loading.tsx` | Fallback de Suspense por ruta | No usado todavía |
| `error.tsx` | Error boundary por ruta | No usado todavía |
| `route.ts` | Route handler (REST/API) | No usado todavía |
| `(group)` | Route group sin URL | No usado todavía |
| `_carpeta` | Carpeta privada (no enruta) | A usar para `app/_components/` |
| `"use client"` / `"use server"` | Boundary cliente/servidor o server action | Solo añadir cuando haga falta |

Convenciones adicionales del proyecto:
- **No usamos `src/`**, `app/` está en la raíz.
- Alias `@/*` mapea a `./*` (configurado en `tsconfig.json` y `vitest.config.ts`).
- Estructura de dominio en `lib/<area>/`, no en `app/`.

---

## 2. Mapa actual de rutas y componentes

```
app/
├── layout.tsx              ← Server Component, header "Milán Bicicletas"
├── globals.css             ← @tailwind base/components/utilities
├── page.tsx                ← Server Component PLACEHOLDER (home/catálogo)
├── cart/
│   └── page.tsx            ← Server Component PLACEHOLDER
├── login/
│   └── page.tsx            ← Server Component PLACEHOLDER
└── product/
    └── [slug]/
        └── page.tsx        ← Server Component async PLACEHOLDER (recibe params: Promise<{slug}>)

lib/
└── prisma.ts               ← Singleton PrismaClient con guard de dev

prisma/
├── schema.prisma           ← Models Product, User, CartItem
└── seed.ts                 ← 20 bicicletas Milán vía upsert(slug)

tests/
└── smoke.test.ts           ← Solo dummy (1+1=2), sin coverage real

docs/
├── prds/README.md          ← Carpeta para PRDs (vacía)
└── reflexion.md            ← Plantilla Fase C
```

**Componentes reutilizables**: ninguno todavía.
**Server actions**: ninguna todavía.
**Route handlers**: ninguno todavía.

---

## 3. App Router vs Pages Router — diferencias clave

| Aspecto | Pages Router (legacy) | App Router (este repo) |
|---|---|---|
| Carpeta | `pages/` | `app/` |
| Componentes | Client por defecto | **Server** por defecto; cliente solo con `"use client"` en la primera línea |
| Data fetching | `getServerSideProps`, `getStaticProps`, `getInitialProps` | `await fetch(...)` o `await prisma.x.findMany()` directamente en el componente; Next aplica cache automático |
| Mutaciones | API routes + fetch del cliente | **Server Actions** (`"use server"`) llamadas desde `<form action={fn}>` o `useTransition` |
| Layouts | `_app.tsx` + manual | `layout.tsx` anidables — cada segmento puede tener su layout |
| Streaming | No nativo | Nativo con `<Suspense>` + `loading.tsx` |
| Routing | Basado en archivos en `pages/` | Basado en `page.tsx` dentro de `app/`; soporta route groups `(grupo)` |
| Error handling | `_error.tsx` global | `error.tsx` por segmento (boundaries anidados) |
| API routes | `pages/api/*.ts` | `app/**/route.ts` con `GET/POST/...` exportados |
| Bundle | Todo va al cliente salvo SSR opt-in | Lo server-only **no llega** al cliente — ideal para Prisma, secretos |

**Implicación práctica:** en este repo, `prisma` se importa libremente en server components y server actions sin riesgo de leak al cliente. Los componentes interactivos (input de búsqueda, botón "Agregar") serán Client Components mínimos.

---

## 4. Decisión → principio razonable (base para Principios de Diseño)

> Tabla insumo para AGENTS.md. Cada principio es **operativo**: una línea accionable que pasa el test "¿me dice qué hacer cuando dude?".

| Decisión recurrente | Principio razonable propuesto |
|---|---|
| **Server vs Client Component** | Server por defecto. Sólo `"use client"` si el componente necesita estado local, eventos del DOM o hooks de cliente. Los Client Components no llaman a Prisma. |
| **Dónde vive la lógica de dominio** | En `lib/<area>/`, no en `app/`. Las páginas son orquestación + render; toda lógica reusable (carrito, búsqueda, recomendaciones, auth) se importa de `lib/`. |
| **Tipos que cruzan capas** | Tipos de dominio definidos en `lib/<area>/types.ts`. Tipos de Prisma o de Odoo **no cruzan al UI**; cada módulo expone su propio tipo y mantiene su adapter (`fromPrisma`, `fromOdoo`). |
| **Dónde vive el estado del carrito** | Server-side, leído desde cookie o DB. Nunca en `useState` global del cliente — eso pierde persistencia y SSR. |
| **Persistencia del carrito** | Fase A: en memoria (proceso) para validar el flujo. Fase B+: cookie httpOnly anónima → DB cuando hay sesión. La transición debe estar detrás del API `lib/cart/store.ts` para que `app/` no la note. |
| **Server Actions: dónde viven** | En `lib/<area>/actions.ts` con `"use server"` en la cabecera. Las páginas importan la función y la pasan a `<form action={...}>` o `startTransition`. |
| **Validación de inputs** | Validar en el límite (server action o route handler) antes de tocar DB o cookies. Mensajes de error son strings devueltos, no excepciones silenciosas. |
| **Manejo de errores** | Para fallos esperados (producto no existe) usar `notFound()` o devolver `null`. Para fallos inesperados, dejar que el `error.tsx` del segmento los capture. |
| **Data fetching** | Server fetch directo en el componente (`await ...`). Si la fuente es lenta o cacheable, definir `revalidate` en la función. Evitar SWR/React Query salvo necesidad probada. |
| **Streaming / Suspense** | Default: render síncrono. Adoptar `<Suspense>` + `loading.tsx` sólo cuando una sección dependa de un fetch lento que valga separar del resto del árbol. |
| **Naming de archivos** | Componentes `PascalCase.tsx`. Módulos `lib/` `kebab-case.ts`. Server actions con prefijo verbo (`addToCart`, `searchProducts`). |
| **Test naming** | `tests/<area>/<archivo>.test.ts`. `tests/smoke.test.ts` se mantiene como canario de tooling. |

---

## 5. Candidatos a deep module

> Definición (estilo Ousterhout): interfaz simple + implementación rica. Vale la pena cuando el módulo encapsula varios mecanismos detrás de pocas funciones.

| Candidato | Interfaz pública propuesta | Riqueza interna |
|---|---|---|
| **Carrito (`lib/cart`)** | `getCart()`, `addToCart(slug)`, `removeFromCart(slug)`, `clearCart()` | Persistencia (memoria → cookie → DB), merge anónimo→logueado, validación, hidratación con datos de producto |
| **Catálogo (`lib/products`)** | `listProducts()`, `getProductBySlug(slug)`, `getProductsBySlugs(slugs)` | Fase A: Prisma. Fase B: MCP Odoo. Adapter, cache, flag de fuente |
| **Búsqueda (`lib/search`)** | `searchProducts({q, category})`, `listCategories()` | Filtrado server-side, parsing de querystring, soporte para múltiples backends |
| **Sesión/auth (`lib/auth`)** | `getSession()`, `setSession(...)`, `clearSession()` + `loginAction` | Cookie httpOnly, validación, upsert de usuario, merge de carrito al login |
| **Recomendaciones (`lib/recommendations`)** | `getRecommendations(slug, limit?)` | Hoy heurística por categoría; mañana podría venir del MCP, scoring, popularidad |

---

## 6. Preguntas / dudas abiertas

- **MCP de Odoo**: ¿nombre exacto del tool? ¿formato de respuesta de `product.template`? ¿necesidad de fijar `allowed_company_ids`? ¿hay slug nativo o usar `default_code`?
- **Login mock**: ¿basta upsert por email sin contraseña? El brief dice "login mock" — confirmar que no se espera password ni JWT.
- **Persistencia del carrito**: cuando un usuario logueado tenía ítems anónimos en cookie, ¿se mergean o se reemplazan? Asumo merge sumando cantidades.
- **Skill custom** (`.claude/skills/`): el README de skills está vacío. ¿Qué skill se espera? ¿Una de PRD? ¿Una de review?
- **Pre-commit**: el brief dice que lint+test bloqueen commits en Fase B. ¿Aplica también a Fase A si los tests existen? Hoy está comentado.
- **Imágenes de producto**: `Product.imageUrl` es opcional y el seed no las trae. ¿Vienen del MCP o son placeholder?
- **PRDs**: ¿qué features ameritan PRD propio? Sugiero: integración Odoo, carrito persistente con merge, búsqueda. Decisión final tras Fase A.
- **Convenciones de commit**: el brief pide `tracer:` para cierre de Fase A. ¿Qué prefijos espera para fases posteriores? (`feat:`, `chore:`, etc.)
