"use client";
import NumberInput from "./ui/NumberInput";
import TextInput from "./ui/TextInput";
import TextArea from "./ui/TextArea";

export type Row = {
  kebutuhan: string;
  total: number;
  dasar: string;
  lawan: string;
  rekening: string;
  rencanaTanggal: string;
  pengakuan: string;
  keterangan: string;
};

export type Category = { nama: string; rows: Row[] };

const idr = (n: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

export default function CategoryTable({
  category,
  onAddRow,
  onUpdateRow,
  onRemoveRow,
}: {
  category: Category;
  onAddRow: () => void;
  onUpdateRow: (rowIndex: number, patch: Partial<Row>) => void;
  onRemoveRow: (rowIndex: number) => void;
}) {
  const subtotal = category.rows.reduce((a, r) => a + (r.total || 0), 0);
  const parseNumber = (v: string) => {
    const num = Number(String(v).replace(/[^\d.-]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-800">{category.nama}</h3>
        <button
          type="button"
          onClick={onAddRow}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs hover:bg-zinc-50"
        >
          + Tambah Baris
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-left text-zinc-500 bg-zinc-50">
              <th className="px-3 py-2 font-medium rounded-tl-2xl">No</th>
              <th className="px-3 py-2 font-medium">Uraian / Kebutuhan</th>
              <th className="px-3 py-2 font-medium">Total (IDR)</th>
              <th className="px-3 py-2 font-medium">Dasar Transaksi</th>
              <th className="px-3 py-2 font-medium">Lawan Transaksi</th>
              <th className="px-3 py-2 font-medium">Rekening Transaksi</th>
              <th className="px-3 py-2 font-medium">Rencana Tanggal</th>
              <th className="px-3 py-2 font-medium">Pengakuan Transaksi</th>
              <th className="px-3 py-2 font-medium rounded-tr-2xl">
                Keterangan
              </th>
            </tr>
          </thead>
          <tbody>
            {category.rows.map((r, i) => (
              <tr key={i} className="border-b border-zinc-100 align-top">
                <td className="px-3 py-2 tabular-nums text-zinc-700">
                  {i + 1}
                </td>
                <td className="px-3 py-2">
                  <TextInput
                    value={r.kebutuhan}
                    onChange={(e) =>
                      onUpdateRow(i, { kebutuhan: e.target.value })
                    }
                    placeholder="Contoh: Kebutuhan A"
                  />
                </td>
                <td className="px-3 py-2">
                  <NumberInput
                    placeholder="0"
                    value={r.total ? idr(r.total) : ""}
                    onChange={(e) =>
                      onUpdateRow(i, { total: parseNumber(e.target.value) })
                    }
                  />
                  <div className="mt-1 text-[11px] text-zinc-500">
                    Rp {idr(r.total || 0)}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <TextArea
                    rows={2}
                    value={r.dasar}
                    onChange={(e) => onUpdateRow(i, { dasar: e.target.value })}
                    placeholder="Invoice; Dokumen Tertentu; Pernyataan Direksi"
                  />
                </td>
                <td className="px-3 py-2">
                  <TextInput
                    value={r.lawan}
                    onChange={(e) => onUpdateRow(i, { lawan: e.target.value })}
                    placeholder="PT Antah Berantah"
                  />
                </td>
                <td className="px-3 py-2">
                  <TextInput
                    value={r.rekening}
                    onChange={(e) =>
                      onUpdateRow(i, { rekening: e.target.value })
                    }
                    placeholder="BCA - 0987654321 - Anton Papua"
                  />
                </td>
                <td className="px-3 py-2">
                  <TextInput
                    type="date"
                    value={r.rencanaTanggal}
                    onChange={(e) =>
                      onUpdateRow(i, { rencanaTanggal: e.target.value })
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <TextInput
                    value={r.pengakuan}
                    onChange={(e) =>
                      onUpdateRow(i, { pengakuan: e.target.value })
                    }
                    placeholder="Honor lawan transaksi / operasional / dll"
                  />
                </td>
                <td className="px-3 py-2">
                  <TextInput
                    value={r.keterangan}
                    onChange={(e) =>
                      onUpdateRow(i, { keterangan: e.target.value })
                    }
                    placeholder="Wajib diisi sesuai panduan"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onRemoveRow(i)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Hapus baris
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={2}
                className="px-3 py-2 text-right font-medium text-zinc-700 bg-zinc-50"
              >
                Subtotal
              </td>
              <td className="px-3 py-2 font-semibold text-zinc-900 bg-zinc-50">
                Rp {idr(subtotal)}
              </td>
              <td className="px-3 py-2 bg-zinc-50" colSpan={6} />
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
