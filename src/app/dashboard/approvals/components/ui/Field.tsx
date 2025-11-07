function Field({
  label,
  value,
  onChange,
  editable,
  type = "text",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  editable?: boolean;
  type?: "text" | "number" | "date";
}) {
  return (
    <div className="rounded-lg border border-zinc-200 p-3">
      <div className="text-xs text-zinc-500">{label}</div>
      {editable ? (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="mt-1 w-full rounded-md border border-zinc-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
      ) : (
        <div className="mt-0.5 text-sm text-zinc-900">{value ?? "—"}</div>
      )}
    </div>
  );
}
