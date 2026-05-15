import { redirect } from "next/navigation";
import { loginAction } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="max-w-md">
      <h1>Iniciar sesión</h1>
      <p className="text-sm text-neutral-600 mb-4">
        Login mock — ingresa cualquier email válido; no hay contraseña.
      </p>
      <form action={loginAction} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          required
          placeholder="tu@email.com"
          className="border border-neutral-300 rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="border border-neutral-900 rounded px-3 py-2 text-sm hover:bg-neutral-100"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
