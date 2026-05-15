// Server Component que muestra el email logueado o un link a /login.
// Vive en el header del layout raíz. Usa getCurrentUser() del módulo auth.

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { logoutAction } from "@/lib/auth/actions";

export async function SessionBadge() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Link href="/login" className="text-sm hover:underline">
        Entrar
      </Link>
    );
  }
  return (
    <span className="flex items-center gap-2 text-sm">
      <span className="text-neutral-700">{user.email}</span>
      <form action={logoutAction}>
        <button
          type="submit"
          className="text-neutral-500 hover:text-neutral-900 hover:underline"
        >
          Salir
        </button>
      </form>
    </span>
  );
}
