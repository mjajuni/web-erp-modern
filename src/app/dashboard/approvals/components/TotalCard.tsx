"use client";
const idr = (n: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

export default function TotalCard({ total }: { total: number }) {
  return (
    <div className="w-full md:w-72 rounded-xl border border-zinc-200 bg-gradient-to-b from-zinc-50 to-white p-4 shadow-sm">
      <div className="text-xs text-zinc-600">TOTAL</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
        Rp {idr(total)}
      </div>
    </div>
  );
}
