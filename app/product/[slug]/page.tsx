import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/mcp";
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

  return (
    <article>
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
  );
}
