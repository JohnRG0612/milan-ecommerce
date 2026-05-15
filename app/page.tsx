import { listProducts } from "@/lib/products";

export default function HomePage() {
  const products = listProducts();

  return (
    <div>
      <h1>Catálogo</h1>
      <ul>
        {products.map((p) => (
          <li key={p.slug}>
            <a href={`/product/${p.slug}`}>{p.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
