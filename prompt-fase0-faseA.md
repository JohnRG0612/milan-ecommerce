# Prompt para la consola de Claude Code — Fases 0 y A

> Rellena antes de pegar:
> - `<RUTA_O_URL_DEL_REPO>` → ruta local o URL del repo starter
> - `<NOMBRE_DEL_MCP>` → nombre/identificador del MCP de productos

---

## Contexto

Estoy en una capacitación práctica con Claude Code. Vas a trabajar sobre un repo starter de e-commerce con Next.js (App Router). El proyecto se construye en **4 fases** con historial de commits limpio. **En este prompt solo trabajaremos hasta la Fase A**; las fases B, C y D te las pasaré en prompts posteriores. No avances más allá de lo pedido.

- **Repo:** `<RUTA_O_URL_DEL_REPO>`
- **MCP de productos disponible:** `<NOMBRE_DEL_MCP>` (NO lo integres todavía en estas fases)

## Reglas globales del proyecto (apĺican a todas las fases)

### Git
- **No squash, no amend** salvo que yo lo pida explícitamente. Quiero preservar el historial.
- Commits pequeños, atómicos y descriptivos.
- La Fase A debe dejar mínimo 3 archivos relevantes en el historial: `cart`, `product/[slug]` y `cart/actions`.

### AGENTS.md (se construye a lo largo de todo el proyecto)
No lo cierres ahora, solo recoge insumos. Al final del proyecto debe contener:
- **Principios de diseño:** 3+ principios operativos y accionables.
- **Skill**
- **PRD** (Product Requirements Document)
- **Deep module**
- **Reflexión**

### Demo funcional (objetivo final del proyecto, NO de esta fase)
- Buscador
- Login
- Agregar al carrito
- Recomendados
- Datos del producto desde el MCP
- Cache: el carrito no se borra al refrescar la página

---

## PASO 0 — Verificación previa (preflight)

Antes de tocar nada del repo, valida el entorno y repórtame el resultado. **No me pidas tokens, contraseñas ni claves SSH** — esos los configuro yo fuera de esta sesión.

Ejecuta y muestra el resultado de:

1. `git --version` — confirmar que git está instalado.
2. `git config user.name` y `git config user.email` — comprobar identidad de commits.
3. `git -C <repo> status` y `git -C <repo> log --oneline -5` — estado del repo y últimos commits.
4. `git -C <repo> remote -v` — ver si ya hay un remoto configurado (no es obligatorio en esta fase).
5. `gh --version` y `gh auth status` — opcional, solo informativo. Si `gh` no está instalado o no estás autenticado, **no lo instales ni inicies sesión**: solo repórtalo.

Reglas de decisión:
- Si `user.name` o `user.email` están vacíos: **detente** y pídeme los valores antes de seguir. (Nunca uses valores inventados ni el "Co-Authored-By" por defecto sin mi OK.)
- Si el repo no es un repositorio git válido: detente y avísame.
- Si `gh` no está disponible: continúa de todos modos. No es necesario para Fases 0 y A.
- **NO ejecutes `git push`, `git fetch`, `git pull` ni nada que toque un remoto.** Trabajo 100% local en estas fases.

Cuando termines, dame un resumen tipo checklist (✓ / ✗) de cada punto y espera mi OK para pasar a Fase 0.

---

## FASE 0 — Entender el código

**Objetivo:** comprender el repo a fondo para alimentar AGENTS.md más adelante.
**Commits:** no son obligatorios en esta fase.

Tareas:
1. Lee el repo completo: estructura de carpetas, `package.json`, scripts, configuración de Next.js.
2. Identifica y reporta en consola:
   - Stack y versiones (Next.js, React, librerías clave, gestor de paquetes).
   - Organización del App Router: layouts, páginas, route handlers, server actions, server vs client components.
   - Componentes y rutas ya existentes.
   - Estado/storage actual (¿hay carrito? ¿dónde vive?).
   - Cómo se prevé conectar el MCP de productos.
3. Responde estas preguntas explícitamente:
   - ¿Qué hay en el repo, qué tecnologías usa y cómo se conectan a la página?
   - ¿Qué es App Router en Next.js y **cómo se diferencia de Pages Router**? Cubre: server vs client components, server actions, layouts anidados, file-based routing, streaming, data fetching.
   - ¿Qué **convenciones de Next.js** debería respetar al organizar este proyecto? (nombres reservados como `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`; ubicación de server actions; colocation de componentes; uso de `app/` vs `src/app/`; route groups `(grupo)`).
   - ¿Qué **decisiones recurrentes** voy a tener que tomar y **cuáles serían los principios razonables para cada una**? Para cada decisión propón un principio operativo (1 línea, accionable). Ejemplos de decisiones a cubrir: server vs client component, dónde vive el estado del carrito, persistencia (cookie/localStorage/db), validación de inputs, manejo de errores, fetching (server fetch vs client SWR), uso de Suspense/streaming.
4. Crea `docs/fase-0-notas.md` con:
   - Resumen del stack y convenciones de Next.js a respetar.
   - Mapa de rutas y componentes existentes.
   - Tabla de **decisión → principio razonable** (al menos 3 filas) — será la base de los "Principios de diseño" de AGENTS.md.
   - Candidatos a **deep module** (parte del sistema con interfaz simple pero implementación rica: catálogo, carrito, búsqueda…).
   - Lista de preguntas/dudas abiertas para resolver en fases posteriores.

**STOP:** termina la Fase 0 y espera mi OK antes de pasar a la Fase A.

---

## FASE A — Tracer Bullet

**Objetivo:** flujo end-to-end **mínimo** que atraviese todas las capas. Sin estilos, sin login, sin MCP real. El punto es validar que la arquitectura completa funcione antes de profundizar.

Flujo a implementar:
1. Usuario llega a `/` y ve **un** producto (puede ser hardcoded).
2. Hace click → navega a `/product/[slug]` con los datos del producto.
3. Click en "Agregar al carrito" → es redirigido a `/cart`.
4. En `/cart` ve el ítem agregado.

Reglas de implementación:
- Producto hardcoded (objeto en memoria o JSON local). **NO conectes el MCP todavía.**
- Carrito en memoria (sin persistencia todavía — eso es de fases posteriores).
- HTML básico; sin estilos importantes ni Tailwind/CSS complejo.
- Mínimo estos 3 archivos deben quedar en el historial de commits de esta fase:
  - `app/cart/page.tsx` (o equivalente según el repo)
  - `app/product/[slug]/page.tsx`
  - `app/cart/actions.ts` (server action para agregar al carrito)
- Si el repo ya trae alguno de estos, modifícalo en lugar de duplicarlo.

Reglas de commits para esta fase:
- Varios commits pequeños está bien, uno por capa o por archivo.
- El **commit que cierra la Fase A** debe llevar el prefijo `tracer:` en el mensaje. Ejemplo:
  > `tracer: flujo home → product → cart funcionando end-to-end`

Flujo de trabajo que quiero:
1. **Antes de tocar código:** propón el plan concreto — qué archivos vas a crear/modificar y en qué orden de commits. Espera mi OK.
2. **Mientras implementas:** ve haciendo commits a medida que cierras cada paso lógico.
3. **Al terminar:**
   - Corre el proyecto y verifica el flujo home → product → add → cart.
   - Muestra `git log --oneline` de los commits de la Fase A.
   - Reporta cualquier decisión no obvia que tomaste (entra en notas para AGENTS.md).

**STOP:** termina la Fase A y espera mi siguiente prompt. **NO avances a Fase B.**
