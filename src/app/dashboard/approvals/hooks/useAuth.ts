"use client";

import { useState, useEffect } from "react";

export type Role = "PEMOHON" | "PIHAK1" | "PIHAK2" | "BO" | "ADMIN";

export interface User {
  id: number;
  name: string;
  role: Role;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // simulasi login (ganti nanti dengan fetch token API)
    setTimeout(() => {
      setUser({
        id: 1,
        name: "Rani Pratiwi",
        role: "PIHAK2", // ubah role di sini untuk simulasi
      });
    }, 300);
  }, []);

  const logout = () => setUser(null);

  return { user, logout };
}
