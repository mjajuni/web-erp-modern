"use client";

import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("API Base:", process.env.NEXT_PUBLIC_API_BASE);

      if (!res.ok) throw new Error("Login gagal");

      const data = await res.json();

      // Simpan token dan user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // redirect ke dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Email atau password salah / server error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* === Background Theme === */}
      <div className="absolute inset-0 bg-linear-to-br from-[#f7f8fc] via-[#edf0f8] to-[#dfe5f7]" />
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(39,36,101,0.35)_0%,transparent_70%)] blur-3xl opacity-70" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(238,44,115,0.2)_0%,transparent_70%)] blur-3xl opacity-60" />
      <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(255,205,5,0.08)_0%,transparent_70%)] blur-3xl opacity-70" />

      {/* === Card === */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-8">
        <header className="mb-6 flex items-center gap-3">
          <div
            className="grid size-10 place-items-center rounded-2xl font-semibold text-white shadow-sm"
            style={{ backgroundColor: "#272465" }}
          >
            ER
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">ERP Console</h2>
            <p className="text-xs text-zinc-500">Secure sign-in</p>
          </div>
        </header>

        <h1 className="text-2xl font-semibold mb-1 text-zinc-900">Masuk</h1>
        <p className="text-sm text-zinc-500 mb-6">
          Gunakan akun perusahaan Anda.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="ani@app.test"
                className="w-full rounded-xl border border-zinc-200 bg-white px-9 py-3 text-sm text-zinc-800 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type={show ? "text" : "password"}
                name="password"
                required
                placeholder="Password@123"
                className="w-full rounded-xl border border-zinc-200 bg-white px-9 py-3 pr-11 text-sm text-zinc-800 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-2 hover:bg-zinc-100 active:scale-95"
              >
                {show ? (
                  <EyeOff className="size-4 text-zinc-500" />
                ) : (
                  <Eye className="size-4 text-zinc-500" />
                )}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-zinc-700">
              <input
                type="checkbox"
                className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              Ingat saya
            </label>
            <Link href="#" className="text-indigo-600 hover:underline">
              Lupa password?
            </Link>
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-[#272465] py-3 text-sm font-medium text-white shadow-sm hover:brightness-110 active:scale-[0.98] transition"
          >
            <div className="flex items-center justify-center gap-2">
              <LogIn className="size-4" />
              {loading ? "Memproses..." : "Masuk"}
            </div>
          </button>
        </form>

        {/* Demo Info */}
        <div className="mt-6 rounded-xl border border-dashed border-zinc-200 bg-white/60 p-3 text-xs text-zinc-600">
          <p className="font-medium">Akun demo</p>
          <p>
            ani@app.test, budi@pb1.test, cici@pb2.test, beni@bo.test —
            Password@123
          </p>
        </div>

        <div className="mt-3 flex justify-between items-center text-xs text-zinc-500">
          <Link href="/" className="underline hover:text-zinc-700">
            ← Kembali
          </Link>
          <p>© {new Date().getFullYear()} Your Company</p>
        </div>
      </div>
    </div>
  );
}
