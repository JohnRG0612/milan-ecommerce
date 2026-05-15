import Link from "next/link";
import { listProducts } from "@/lib/mcp";
import { filterProducts } from "@/lib/search/filter";
import { SearchBar } from "@/app/_components/SearchBar";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const all = await listProducts();
  const products = filterProducts(all, q);

  return (
    <div>
      <h1>Catálogo</h1>
      <SearchBar defaultQuery={q} />
      <p className="text-neutral-600 text-sm mb-4">
        {products.length}{" "}
        {q.trim() ? `resultados para "${q.trim()}"` : "bicicletas disponibles"}
      </p>
      {products.length === 0 ? (
        <p>No hay productos que coincidan con la búsqueda.</p>
      ) : (
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
      )}
    </div>
  );
}
