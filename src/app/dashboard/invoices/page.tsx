"use client";
import RBACGuard from "../approvals/components/RBACGuard";
import { useAuth } from "../approvals/hooks/useAuth";

interface Invoice {
  id: string;
  vendor: string;
  date: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Overdue";
}

const invoices: Invoice[] = [
  {
    id: "INV-2025-001",
    vendor: "PT Arunika",
    date: "2025-10-12",
    amount: 45000000,
    status: "Paid",
  },
  {
    id: "INV-2025-002",
    vendor: "CV Prima Abadi",
    date: "2025-10-19",
    amount: 12800000,
    status: "Unpaid",
  },
  {
    id: "INV-2025-003",
    vendor: "PT Nusantara Tech",
    date: "2025-10-25",
    amount: 9850000,
    status: "Overdue",
  },
];

export default function InvoicesPage() {
  const { user } = useAuth();
  if (!user) return <div className="p-6 text-zinc-500">Loading user...</div>;

  return (
    <RBACGuard allow={["PIHAK1", "PIHAK2", "BO", "ADMIN"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Invoices Tracking
        </h1>

        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm ring-1 ring-black/5">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-zinc-500 bg-zinc-50">
                <th className="px-4 py-3 font-medium rounded-tl-2xl">
                  Invoice ID
                </th>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium rounded-tr-2xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr
                  key={i.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{i.id}</td>
                  <td className="px-4 py-3">{i.vendor}</td>
                  <td className="px-4 py-3">{i.date}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {i.amount.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border font-medium ${
                        i.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : i.status === "Unpaid"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {i.status}
                    </span>
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
