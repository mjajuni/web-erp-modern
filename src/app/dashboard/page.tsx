"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function Dashboard() {
  const kpis = useMemo(
    () => [
      {
        label: "Revenue (M)",
        value: "12.4",
        delta: "+8.2%",
        badge: "This month",
      },
      { label: "Invoices", value: "1,284", delta: "+3.1%", badge: "Approved" },
      { label: "Open PO", value: "312", delta: "-1.2%", badge: "Pending" },
      {
        label: "AR Aging >30d",
        value: "72",
        delta: "-6.5%",
        badge: "Improving",
      },
    ],
    []
  );

  // --- Chart data (dummy realistis) ---
  const series = useMemo(
    () => [
      { m: "Jan", revenue: 10.2, expense: 7.9 },
      { m: "Feb", revenue: 10.8, expense: 8.4 },
      { m: "Mar", revenue: 11.5, expense: 8.9 },
      { m: "Apr", revenue: 11.1, expense: 9.2 },
      { m: "Mei", revenue: 11.8, expense: 9.4 },
      { m: "Jun", revenue: 12.0, expense: 9.6 },
      { m: "Jul", revenue: 12.7, expense: 9.9 },
      { m: "Agu", revenue: 12.3, expense: 9.7 },
      { m: "Sep", revenue: 12.9, expense: 10.1 },
      { m: "Okt", revenue: 13.2, expense: 10.3 },
      { m: "Nov", revenue: 13.0, expense: 10.2 },
      { m: "Des", revenue: 13.4, expense: 10.5 },
    ],
    []
  );

  const topVendors = useMemo(
    () => [
      { vendor: "PT Mega Jaya", amount: 45.2 },
      { vendor: "CV Prima Abadi", amount: 28.1 },
      { vendor: "PT Nusantara Tech", amount: 21.6 },
      { vendor: "PT Sinar Karya", amount: 18.9 },
      { vendor: "PT Arunika", amount: 16.3 },
    ],
    []
  );

  const rows = useMemo(
    () => [
      {
        id: "INV-2025-00123",
        vendor: "PT Mega Jaya",
        amount: 45200000,
        status: "Approved",
        date: "02 Nov 2025",
      },
      {
        id: "INV-2025-00124",
        vendor: "CV Prima Abadi",
        amount: 12800000,
        status: "Under Review",
        date: "02 Nov 2025",
      },
      {
        id: "INV-2025-00125",
        vendor: "PT Nusantara Tech",
        amount: 9650000,
        status: "Rejected",
        date: "01 Nov 2025",
      },
      {
        id: "INV-2025-00126",
        vendor: "PT Sinar Karya",
        amount: 7850000,
        status: "Approved",
        date: "01 Nov 2025",
      },
      {
        id: "INV-2025-00127",
        vendor: "PT Arunika",
        amount: 18450000,
        status: "Pending",
        date: "31 Oct 2025",
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(80%_60%_at_10%_10%,#f7f8fc,transparent),radial-gradient(70%_50%_at_90%_0%,#eef1f8,transparent)]">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div
              className="grid size-9 place-items-center rounded-xl text-white font-semibold shadow-sm"
              style={{ backgroundColor: "#272465" }}
            >
              ER
            </div>
            <span className="hidden text-sm font-semibold text-zinc-800 sm:inline">
              ERP Console
            </span>
            <span className="mx-2 hidden text-zinc-300 sm:inline">|</span>
            <nav className="hidden items-center gap-4 text-sm text-zinc-600 sm:flex">
              <a className="hover:text-zinc-900" href="#">
                Dashboard
              </a>
              <a className="hover:text-zinc-900" href="#">
                Procurement
              </a>
              <a className="hover:text-zinc-900" href="#">
                Finance
              </a>
              <a className="hover:text-zinc-900" href="#">
                Inventory
              </a>
              <a className="hover:text-zinc-900" href="#">
                HR
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <input
              placeholder="Search (Ctrl + K)"
              className="hidden w-64 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none transition hover:border-zinc-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 sm:block"
            />
            <button className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50">
              🔔
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5">
              <div className="grid size-6 place-items-center rounded-full bg-[#272465] text-[10px] font-semibold text-white">
                MJ
              </div>
              <span className="hidden text-sm text-zinc-700 sm:inline">
                Juni
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-16 space-y-2">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Navigation
            </div>
            <SideItem active label="Overview" />
            <SideItem label="Approvals" />
            <SideItem label="Vendors" />
            <SideItem label="Purchase Orders" />
            <SideItem label="Invoices" />
            <SideItem label="Payments" />
            <SideItem label="Reports" />
          </div>
        </aside>

        {/* Main */}
        <main>
          {/* Head */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <ol className="flex items-center gap-2 text-xs text-zinc-500">
                <li>Home</li>
                <li>›</li>
                <li className="text-zinc-700">Dashboard</li>
              </ol>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900">
                Executive Overview
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50">
                Export
              </button>
              <button
                className="rounded-lg px-3 py-2 text-sm text-white shadow-sm hover:brightness-110"
                style={{ backgroundColor: "#272465" }}
              >
                New Request
              </button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k) => (
              <div
                key={k.label}
                className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm ring-1 ring-black/5"
              >
                <div className="flex items-start justify-between">
                  <div className="text-sm text-zinc-500">{k.label}</div>
                  <span className="rounded-full bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-600 border border-zinc-200">
                    {k.badge}
                  </span>
                </div>
                <div className="mt-2 flex items-end justify-between">
                  <div className="text-2xl font-semibold text-zinc-900">
                    {k.value}
                  </div>
                  <div
                    className={`text-sm ${
                      k.delta.startsWith("+")
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {k.delta}
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full w-2/3 rounded-full"
                    style={{ backgroundColor: "#272465" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
            {/* Area Chart */}
            <div className="xl:col-span-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <div className="text-sm text-zinc-500">
                    Revenue vs Expense
                  </div>
                  <div className="text-lg font-semibold text-zinc-900">
                    Last 12 months
                  </div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={series}
                    margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#272465"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor="#272465"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#ef4444"
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor="#ef4444"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="m" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} width={40} />
                    <Tooltip cursor={{ stroke: "#d1d5db" }} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#272465"
                      fill="url(#rev)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="expense"
                      stroke="#ef4444"
                      fill="url(#exp)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="mb-2 text-lg font-semibold text-zinc-900">
                Top Vendors (IDR M)
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topVendors}
                    margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="vendor" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} width={40} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      fill="#272465"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white shadow-sm ring-1 ring-black/5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3">
              <div>
                <div className="text-lg font-semibold text-zinc-900">
                  Latest Invoices
                </div>
                <p className="text-xs text-zinc-500">
                  Top 5 recent transactions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  placeholder="Filter vendor…"
                  className="w-48 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm outline-none transition hover:border-zinc-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
                />
                <button className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm hover:bg-zinc-50">
                  Columns
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-separate border-spacing-0">
                <thead>
                  <tr className="text-left text-sm text-zinc-500">
                    {[
                      "Invoice",
                      "Vendor",
                      "Amount (IDR)",
                      "Status",
                      "Date",
                      "",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`border-b border-zinc-200 bg-zinc-50 px-4 py-3 font-medium ${
                          i === 0 ? "rounded-tl-2xl" : ""
                        } ${i === 5 ? "rounded-tr-2xl" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="text-sm">
                      <td className="border-b border-zinc-100 px-4 py-3 font-medium text-zinc-900">
                        {r.id}
                      </td>
                      <td className="border-b border-zinc-100 px-4 py-3 text-zinc-700">
                        {r.vendor}
                      </td>
                      <td className="border-b border-zinc-100 px-4 py-3 tabular-nums text-zinc-800">
                        {r.amount.toLocaleString("id-ID")}
                      </td>
                      <td className="border-b border-zinc-100 px-4 py-3">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="border-b border-zinc-100 px-4 py-3 text-zinc-700">
                        {r.date}
                      </td>
                      <td className="border-b border-zinc-100 px-4 py-3">
                        <div className="flex gap-2">
                          <button className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs hover:bg-zinc-50">
                            View
                          </button>
                          <button className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs hover:bg-zinc-50">
                            Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-3">
              <p className="text-xs text-zinc-500">Showing 5 of 1,284</p>
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm hover:bg-zinc-50">
                  Prev
                </button>
                <button
                  className="rounded-lg px-3 py-1.5 text-sm text-white hover:brightness-110"
                  style={{ backgroundColor: "#272465" }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] text-zinc-500">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </main>
      </div>
    </div>
  );
}

/* ------- kecil-kecil ------- */

function SideItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href="#"
      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
        active
          ? "bg-zinc-900 text-white shadow-sm"
          : "text-zinc-700 hover:bg-zinc-50"
      }`}
      aria-current={active ? "page" : undefined}
    >
      <span>{label}</span>
      <span
        className={`text-[10px] ${active ? "text-white/70" : "text-zinc-400"}`}
      >
        ›
      </span>
    </a>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    Approved: {
      bg: "bg-emerald-50 border-emerald-200",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    "Under Review": {
      bg: "bg-indigo-50 border-indigo-200",
      text: "text-indigo-700",
      dot: "bg-indigo-500",
    },
    Rejected: {
      bg: "bg-rose-50 border-rose-200",
      text: "text-rose-700",
      dot: "bg-rose-500",
    },
    Pending: {
      bg: "bg-amber-50 border-amber-200",
      text: "text-amber-800",
      dot: "bg-amber-500",
    },
  };
  const s = map[status] ?? map["Pending"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${s.bg} ${s.text}`}
    >
      <span className={`inline-block size-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}
