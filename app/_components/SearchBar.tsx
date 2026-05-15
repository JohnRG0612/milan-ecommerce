// Client component mínimo: form GET hacia "/" con un input "q".
// No usa state ni router push — Next renderiza el resultado en server
// con searchParams. La interactividad es solo el submit nativo del form.

export function SearchBar({ defaultQuery = "" }: { defaultQuery?: string }) {
  return (
    <form method="GET" action="/" className="flex gap-2 mb-4">
      <input
        type="search"
        name="q"
        defaultValue={defaultQuery}
        placeholder="Buscar bicicletas..."
        className="flex-1 border border-neutral-300 rounded px-3 py-1 text-sm"
      />
      <button
        type="submit"
        className="border border-neutral-900 rounded px-3 py-1 text-sm hover:bg-neutral-100"
      >
        Buscar
      </button>
    </form>
  );
}
