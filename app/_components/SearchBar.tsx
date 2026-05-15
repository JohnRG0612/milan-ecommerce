export function SearchBar({ defaultQuery = "" }: { defaultQuery?: string }) {
  return (
    <form method="GET" action="/" className="flex gap-2 mb-6">
      <input
        type="search"
        name="q"
        defaultValue={defaultQuery}
        placeholder="Buscar bicicletas..."
        className="flex-1 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
      />
      <button
        type="submit"
        className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}
