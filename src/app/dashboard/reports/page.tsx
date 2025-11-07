"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import RBACGuard from "../approvals/components/RBACGuard";
import { useAuth } from "../approvals/hooks/useAuth";

const data = [
  { month: "Jan", revenue: 10, expense: 7 },
  { month: "Feb", revenue: 12, expense: 8 },
  { month: "Mar", revenue: 13, expense: 9 },
  { month: "Apr", revenue: 14, expense: 10 },
  { month: "Mei", revenue: 15, expense: 11 },
];

export default function ReportsPage() {
  const { user } = useAuth();
  return (
    <RBACGuard allow={["BO", "ADMIN", "PB2"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Reports & Analytics
        </h1>
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm ring-1 ring-black/5">
          <h2 className="mb-2 text-sm font-semibold text-zinc-600">
            Revenue vs Expense
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#272465"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </RBACGuard>
  );
}
