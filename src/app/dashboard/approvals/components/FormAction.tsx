"use client";

export default function FormActions({
  sending,
  onCancel,
}: {
  sending: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm hover:bg-zinc-50"
      >
        Batal
      </button>
      <button
        disabled={sending}
        className="rounded-lg px-4 py-2 text-sm text-white shadow-sm hover:brightness-110 disabled:opacity-60"
        style={{ backgroundColor: "#272465" }}
      >
        {sending ? "Mengirim..." : "Kirim Form"}
      </button>
    </div>
  );
}
