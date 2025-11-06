"use client";

import { Role, useAuth } from "../hooks/useAuth";
import { ReactNode } from "react";

interface Props {
  allow: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export default function RBACGuard({ allow, children, fallback }: Props) {
  const { user } = useAuth();

  if (!user) return <p className="p-6 text-zinc-500">Loading user...</p>;

  if (!allow.includes(user.role))
    return (
      fallback ?? (
        <div className="p-6 text-center text-zinc-600">
          🚫 Anda tidak memiliki akses ke halaman ini.
        </div>
      )
    );

  return <>{children}</>;
}
