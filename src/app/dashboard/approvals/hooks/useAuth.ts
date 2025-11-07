// app/(whatever)/hooks/useAuth.ts
"use client";

import { useCallback, useEffect, useState } from "react";

export type Role = "APPLICANT" | "PB1" | "PB2" | "BO" | "ADMIN";
export interface User {
  id: number;
  name: string;
  role: Role;
  email?: string;
  companyId?: number;
}

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
).replace(/\/+$/, "");

function normalizeRole(x?: string): Role {
  const s = String(x || "").toUpperCase();
  if (["APPLICANT", "PEMOHON"].includes(s)) return "APPLICANT";
  if (["PB1", "P1", "PIHAK1", "PIHAK 1"].includes(s)) return "PB1";
  if (["PB2", "P2", "PIHAK2", "PIHAK 2"].includes(s)) return "PB2";
  if (s === "BO") return "BO";
  return "ADMIN";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const me = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE}/api/me`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 401) {
        setUser(null);
        return;
      }
      if (!res.ok) throw new Error(`ME ${res.status}`);
      const json = await res.json();
      const raw = json?.data ?? json ?? {};
      setUser({
        id: Number(raw.id ?? raw.userId ?? 0),
        name: String(raw.name ?? raw.user?.name ?? "User"),
        role: normalizeRole(raw.role ?? raw.user?.role),
        email: raw.email ?? raw.user?.email,
        companyId: raw.companyId ?? raw.company ?? raw.companyID,
      });
    } catch (e: any) {
      setError(e?.message || "Gagal memuat profil");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j?.message || `Login ${res.status}`);
        }
        await me(); // cookie sudah diset → tarik profil
        return true;
      } catch (e: any) {
        setError(e?.message || "Login gagal");
        setUser(null);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [me],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
    setUser(null);
  }, []);

  useEffect(() => {
    me();
  }, [me]);

  return { user, loading, error, login, logout, refresh: me };
}
