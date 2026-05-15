import Link from "next/link";
import { listProducts } from "@/lib/mcp";

export default async function HomePage() {
  const products = await listProducts();

  return (
    <div>
      <h1>Catálogo</h1>
      <p className="text-neutral-600 text-sm mb-4">
        {products.length} bicicletas disponibles
      </p>
      <ul>
        {products.map((p) => (
          <li key={p.slug}>
            <Link href={`/product/${p.slug}`}>{p.name}</Link>{" "}
            <span className="text-neutral-500 text-sm">
              — ${(p.priceCents / 100).toLocaleString("es-CO")} · {p.category}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
