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
    <div>
      <article className="mb-10">
        <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">
          {product.category}
        </div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>${(product.priceCents / 100).toLocaleString("es-CO")}</p>
        <form action={addToCartAction}>
          <input type="hidden" name="slug" value={product.slug} />
          <button type="submit">Agregar al carrito</button>
        </form>
        <p>
          <Link href="/">← Volver al catálogo</Link>
        </p>
      </article>

      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Otros también vieron…</h2>
          <ul>
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/product/${r.slug}`}>{r.name}</Link>{" "}
                <span className="text-neutral-500 text-sm">
                  — ${(r.priceCents / 100).toLocaleString("es-CO")}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
