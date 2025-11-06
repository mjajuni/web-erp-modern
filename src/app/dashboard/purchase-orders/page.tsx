"use client";
import RBACGuard from "../approvals/components/RBACGuard";
import { useAuth } from "../approvals/hooks/useAuth";

const purchaseOrders = [
  {
    id: "PO-2025-001",
    vendor: "PT Arunika",
    total: 185000000,
    date: "2025-10-10",
    status: "Approved",
  },
  {
    id: "PO-2025-002",
    vendor: "CV Prima Abadi",
    total: 45000000,
    date: "2025-10-18",
    status: "Pending",
  },
];

export default function PurchaseOrdersPage() {
  const { user } = useAuth();

  return (
    <RBACGuard allow={["PEMOHON", "PIHAK1", "PIHAK2", "ADMIN"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Purchase Orders
        </h1>

        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm ring-1 ring-black/5">
          <table className="w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left bg-zinc-50 text-zinc-500">
                <th className="px-4 py-3 font-medium rounded-tl-2xl">PO ID</th>
                <th className="px-4 py-3 font-medium">Vendor</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium rounded-tr-2xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((po) => (
                <tr
                  key={po.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{po.id}</td>
                  <td className="px-4 py-3">{po.vendor}</td>
                  <td className="px-4 py-3">{po.date}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {po.total.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs border font-medium ${
                        po.status === "Approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {po.status}
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
