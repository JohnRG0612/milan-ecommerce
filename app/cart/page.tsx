import Link from "next/link";
import { getCart } from "./store";
import { getProductBySlug, type Product } from "@/lib/mcp";

export default async function CartPage() {
  const slugs = await getCart();
  const items = (
    await Promise.all(slugs.map((slug) => getProductBySlug(slug)))
  ).filter((p): p is Product => p !== null);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Carrito</h1>
        <div className="rounded-lg bg-white p-8 shadow-sm border border-neutral-200 text-center">
          <p className="text-neutral-600 mb-4">Tu carrito está vacío.</p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Carrito</h1>
      <ul className="rounded-lg bg-white shadow-sm border border-neutral-200 divide-y divide-neutral-200">
        {items.map((p, i) => (
          <li
            key={`${p.slug}-${i}`}
            className="flex items-center justify-between gap-4 p-4"
          >
            <Link
              href={`/product/${p.slug}`}
              className="font-medium hover:text-emerald-700 transition-colors"
            >
              {p.name}
            </Link>
            <span className="text-neutral-900 font-semibold whitespace-nowrap">
              ${(p.priceCents / 100).toLocaleString("es-CO")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
