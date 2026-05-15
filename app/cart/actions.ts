"use server";

import { redirect } from "next/navigation";
import { addItem } from "./store";

export async function addToCartAction(formData: FormData): Promise<void> {
  const slug = formData.get("slug");
  if (typeof slug !== "string" || slug.length === 0) {
    throw new Error("slug requerido");
  }
  addItem(slug);
  redirect("/cart");
}
