// Sesión mock — solo email, sin contraseña ni verificación.
// La sesión vive en una cookie httpOnly para que pueda leerse desde
// server components y server actions, y sobrevive a recargas.

import { cookies } from "next/headers";

const COOKIE_NAME = "milan_user";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export type User = {
  email: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  const email = raw.trim().toLowerCase();
  if (!isValidEmail(email)) return null;
  return { email };
}

export async function setCurrentUser(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!isValidEmail(normalized)) {
    throw new Error("Email inválido");
  }
  const store = await cookies();
  store.set({
    name: COOKIE_NAME,
    value: normalized,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
  });
}

export async function clearCurrentUser(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
