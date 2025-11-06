"use client";
import { useAuth } from "../approvals/hooks/useAuth";
import RBACGuard from "../approvals/components/RBACGuard";

const payments = [
  {
    id: "PAY-001",
    method: "Bank Transfer",
    vendor: "PT Arunika",
    amount: 45000000,
    date: "2025-10-20",
  },
  {
    id: "PAY-002",
    method: "E-Wallet",
    vendor: "CV Prima Abadi",
    amount: 12000000,
    date: "2025-10-28",
  },
];

export default function PaymentsPage() {
  const { user } = useAuth();

  return (
    <RBACGuard allow={["PIHAK2", "BO", "ADMIN"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-zinc-900">Payments</h1>
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm ring-1 ring-black/5">
          <table className="w-full text-sm border-separate border-spacing-0">
            <thead>
              <tr className="text-left bg-zinc-50 text-zinc-500">
                <th className="px-4 py-3 font-medium rounded-tl-2xl">
                  Payment ID
                </th>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium rounded-tr-2xl">Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{p.id}</td>
                  <td className="px-4 py-3">{p.vendor}</td>
                  <td className="px-4 py-3">{p.method}</td>
                  <td className="px-4 py-3">{p.date}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {p.amount.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RBACGuard>
  );
}
