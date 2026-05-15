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
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Catálogo</h1>
        <p className="text-sm text-neutral-600">
          {products.length}{" "}
          {q.trim() ? `resultados para "${q.trim()}"` : "bicicletas disponibles"}
        </p>
      </div>
      <SearchBar defaultQuery={q} />
      {products.length === 0 ? (
        <p className="text-neutral-600">
          No hay productos que coincidan con la búsqueda.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/product/${p.slug}`}
              className="group block rounded-lg border border-neutral-200 bg-white p-4 shadow-sm hover:border-emerald-600 hover:shadow-md transition-all"
            >
              <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-emerald-700 mb-2">
                {p.category}
              </span>
              <h3 className="font-medium text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                {p.name}
              </h3>
              <p className="text-lg font-semibold text-neutral-900">
                ${(p.priceCents / 100).toLocaleString("es-CO")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
