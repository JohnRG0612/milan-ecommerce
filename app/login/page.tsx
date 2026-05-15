import { redirect } from "next/navigation";
import { loginAction } from "@/lib/auth/actions";
import { getCurrentUser } from "@/lib/auth/session";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-1">Iniciar sesión</h1>
      <p className="text-sm text-neutral-600 mb-6">
        Login mock — ingresa cualquier email válido; no hay contraseña.
      </p>
      <div className="rounded-lg bg-white p-6 shadow-sm border border-neutral-200">
        <form action={loginAction} className="flex flex-col gap-4">
          <label className="block text-sm font-medium text-neutral-700">
            Email
            <input
              type="email"
              name="email"
              required
              placeholder="tu@email.com"
              className="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
