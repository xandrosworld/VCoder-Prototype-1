export function RubricPreview({ items }: { items: string[] }) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
      <h3 className="text-sm font-bold text-blue-950">Rubric preview</h3>
      <ul className="mt-3 space-y-2 text-sm text-blue-900">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
