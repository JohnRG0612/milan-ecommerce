import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/mcp";
import { addToCartAction } from "@/app/cart/actions";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.slug, 4);

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-block text-sm text-neutral-600 hover:text-emerald-600 transition-colors mb-4"
      >
        ← Volver al catálogo
      </Link>
      <article className="rounded-lg bg-white p-8 shadow-sm border border-neutral-200 mb-10">
        <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-700 mb-3">
          {product.category}
        </span>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          {product.name}
        </h1>
        <p className="text-3xl font-semibold text-emerald-700 mb-4">
          ${(product.priceCents / 100).toLocaleString("es-CO")}
        </p>
        <p className="text-neutral-700 mb-6">{product.description}</p>
        <form action={addToCartAction}>
          <input type="hidden" name="slug" value={product.slug} />
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            Agregar al carrito
          </button>
        </form>
      </article>

      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Otros también vieron…</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/product/${r.slug}`}
                className="group block rounded-lg border border-neutral-200 bg-white p-4 shadow-sm hover:border-emerald-600 hover:shadow-md transition-all"
              >
                <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-emerald-700 mb-2">
                  {r.category}
                </span>
                <h3 className="font-medium text-neutral-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                  {r.name}
                </h3>
                <p className="text-lg font-semibold text-neutral-900">
                  ${(r.priceCents / 100).toLocaleString("es-CO")}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
