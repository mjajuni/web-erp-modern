"use client";
import TextArea from "./ui/TextArea";

export default function NotesBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-zinc-800 mb-2">Catatan</h4>
      <ul className="text-xs text-zinc-600 list-disc pl-4 space-y-1 mb-3">
        <li>
          Seluruh bukti transaksi baik fisik dan/atau digital wajib diarsip dan
          dapat dipertanggungjawabkan.
        </li>
        <li>
          Transaksi pembelian bensin wajib mencantumkan plat nomor kendaraan.
        </li>
      </ul>
      <TextArea
        rows={4}
        placeholder="Catatan tambahan (opsional)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
