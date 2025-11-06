"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearAuth, getUser } from "../lib/auth";
import { LogOut, FilePlus2, Home, Inbox } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    setUser(getUser());
  }, [pathname]);

  function signOut() {
    clearAuth();
    router.push("/login");
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <div className="font-semibold">ERP Mini</div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-600">
              {user?.name} · {user?.role}
            </span>
            <button onClick={signOut} className="btn-ghost">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="card p-3 h-max sticky top-16">
          <nav className="text-sm">
            <NavLink href="/" icon={<Home className="w-4 h-4 mr-2" />}>
              Dashboard
            </NavLink>
            <NavLink
              href="/requests"
              icon={<FilePlus2 className="w-4 h-4 mr-2" />}
            >
              My Requests
            </NavLink>
            <NavLink href="/requests/new">＋ New Request</NavLink>
            <NavLink href="/inbox" icon={<Inbox className="w-4 h-4 mr-2" />}>
              Inbox
            </NavLink>
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
}: {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const active = path === href;
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
