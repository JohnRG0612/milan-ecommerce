import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { addToCartAction } from "@/app/cart/actions";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <article>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${(product.priceCents / 100).toLocaleString("es-CO")}</p>
      <form action={addToCartAction}>
        <input type="hidden" name="slug" value={product.slug} />
        <button type="submit">Agregar al carrito</button>
      </form>
      <p>
        <a href="/">← Volver al catálogo</a>
      </p>
    </article>
  );
}
