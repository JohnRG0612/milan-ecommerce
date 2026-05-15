"use server";

import { redirect } from "next/navigation";
import { clearCurrentUser, isValidEmail, setCurrentUser } from "./session";

export async function loginAction(formData: FormData): Promise<void> {
  const raw = formData.get("email");
  const email = typeof raw === "string" ? raw : "";
  if (!isValidEmail(email)) {
    throw new Error("Email inválido");
  }
  await setCurrentUser(email);
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await clearCurrentUser();
  redirect("/");
}
