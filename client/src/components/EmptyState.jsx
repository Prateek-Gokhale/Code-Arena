export default function EmptyState({ title, body }) {
  return (
    <div className="rounded border border-dashed border-arena-line p-8 text-center">
      <h3 className="font-semibold">{title}</h3>
      {body && <p className="mt-2 text-sm text-arena-muted">{body}</p>}
    </div>
  );
}
