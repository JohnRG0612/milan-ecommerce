import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { logoutAction } from "@/lib/auth/actions";

export async function SessionBadge() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Link
        href="/login"
        className="text-neutral-700 hover:text-emerald-600 transition-colors"
      >
        Entrar
      </Link>
    );
  }
  return (
    <span className="flex items-center gap-3">
      <span className="text-neutral-600">{user.email}</span>
      <form action={logoutAction}>
        <button
          type="submit"
          className="text-neutral-500 hover:text-emerald-600 transition-colors"
        >
          Salir
        </button>
      </form>
    </span>
  );
}
