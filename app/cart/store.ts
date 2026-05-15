// Carrito persistente en cookie httpOnly.
// La cookie guarda solo slugs (no productos completos); la hidratación
// con datos del catálogo se hace al renderizar /cart.

import { cookies } from "next/headers";

const COOKIE_NAME = "milan_cart";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function parseSlugs(raw: string | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string" && x.length > 0);
  } catch {
    return [];
  }
}

export async function getCart(): Promise<string[]> {
  const store = await cookies();
  return parseSlugs(store.get(COOKIE_NAME)?.value);
}

export async function addItem(slug: string): Promise<void> {
  const store = await cookies();
  const current = parseSlugs(store.get(COOKIE_NAME)?.value);
  const next = [...current, slug];
  store.set({
    name: COOKIE_NAME,
    value: JSON.stringify(next),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}
