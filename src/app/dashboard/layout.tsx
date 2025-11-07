import Link from "next/link";
import { cn } from "@/lib/utils";

const menu = [
  { label: "Overview", path: "/dashboard/overview" },
  { label: "Approvals", path: "/dashboard/approvals" },
  { label: "Vendors", path: "/dashboard/vendors" },
  { label: "Purchase Orders", path: "/dashboard/purchase-orders" },
  { label: "Invoices", path: "/dashboard/invoices" },
  { label: "Payments", path: "/dashboard/payments" },
  { label: "Reports", path: "/dashboard/reports" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(80%_60%_at_10%_10%,#f7f8fc,transparent),radial-gradient(70%_50%_at_90%_0%,#eef1f8,transparent)]">
      {/* Header */}
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
          </div>

          {/* Logout via POST agar server yang hapus sesi */}
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-16 space-y-2">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Navigation
            </div>
            <nav className="space-y-1">
              {menu.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50"
                  )}
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-zinc-400">›</span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
