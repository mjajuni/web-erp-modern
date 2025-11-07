"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, FilePlus2, Home, Inbox } from "lucide-react";

type User = { name: string; role: string };

export default function Shell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" }); // hapus cookie di server
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  // Contoh: filter menu by role (sederhana)
  const baseMenu = [
    {
      label: "Dashboard",
      href: "/",
      icon: <Home className="w-4 h-4 mr-2" />,
      roles: ["APPLICANT", "PB1", "PB2", "BO"],
    },
    {
      label: "My Requests",
      href: "/requests",
      icon: <FilePlus2 className="w-4 h-4 mr-2" />,
      roles: ["APPLICANT"],
    },
    { label: "＋ New Request", href: "/requests/new", roles: ["APPLICANT"] },
    {
      label: "Inbox",
      href: "/inbox",
      icon: <Inbox className="w-4 h-4 mr-2" />,
      roles: ["PB1", "PB2", "BO"],
    },
  ];
  const menu = baseMenu.filter((m) => !m.roles || m.roles.includes(user.role));

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="font-semibold">ERP Mini</div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-600">
              {user?.name} · {user?.role}
            </span>
            <button onClick={signOut} className="btn-ghost" disabled={loading}>
              <LogOut className="w-4 h-4 mr-2" />
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="card p-3 h-max sticky top-16">
          <nav className="text-sm">
            {menu.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                active={pathname === item.href}
                icon={item.icon}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
  active,
}: {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 ${
        active ? "bg-zinc-900 text-white" : "hover:bg-zinc-100"
      }`}
      href={href}
    >
      {icon}
      {children}
    </Link>
  );
}
