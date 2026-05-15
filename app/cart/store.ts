// Carrito en memoria del proceso. Se reinicia con cada reload del módulo
// en dev y entre instancias del server en prod. Suficiente para el tracer;
// la persistencia llega en fases posteriores.

const items: string[] = [];

export function getCart(): readonly string[] {
  return items;
}

export function addItem(slug: string): void {
  items.push(slug);
}
