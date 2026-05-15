import { getCart } from "./store";
import { getProductBySlug, type Product } from "@/lib/products";

export default function CartPage() {
  const slugs = getCart();
  const items = slugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is Product => p !== undefined);

  if (items.length === 0) {
    return (
      <div>
        <h1>Carrito</h1>
        <p>
          El carrito está vacío. <a href="/">Volver al catálogo</a>.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Carrito</h1>
      <ul>
        {items.map((p, i) => (
          <li key={`${p.slug}-${i}`}>
            {p.name} — ${(p.priceCents / 100).toLocaleString("es-CO")}
          </li>
        ))}
      </ul>
    </div>
  );
}
