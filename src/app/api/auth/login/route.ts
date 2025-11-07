// app/api/auth/login/route.ts
import { NextResponse } from "next/server";

const RAW_BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"; // <= fallback aman
const BACKEND_LOGIN_URL = `${RAW_BACKEND_URL.replace(
  /\/+$/,
  "",
)}/api/auth/login`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { message: "Email/password wajib diisi" },
        { status: 400 },
      );
    }

    // Forward ke backend
    const upstream = await fetch(BACKEND_LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch((e) => {
      // koneksi gagal (ECONNREFUSED, dll)
      throw new Error(
        `Tidak bisa menghubungi backend di ${BACKEND_LOGIN_URL}: ${e.message}`,
      );
    });

    // Kalau backend balas error, ambil body text biar kelihatan
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "");
      return NextResponse.json(
        {
          message: `Login gagal (backend ${upstream.status}).`,
          detail: text?.slice(0, 500),
        },
        { status: upstream.status },
      );
    }

    // Pastikan JSON & field yang kita butuhkan ada
    const data = await upstream.json().catch(() => null);
    if (!data?.token || !data?.user) {
      return NextResponse.json(
        { message: "Respon backend tidak sesuai (missing token/user)." },
        { status: 502 },
      );
    }

    // Set cookies
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      `token=${data.token}; Path=/; HttpOnly; SameSite=Lax; ${
        process.env.NODE_ENV === "production" ? "Secure; " : ""
      } Max-Age=86400`,
    );
    // opsional: untuk UI gating di client (bukan security)
    if (data.user?.role) {
      headers.append(
        "Set-Cookie",
        `role=${encodeURIComponent(data.user.role)}; Path=/; SameSite=Lax; ${
          process.env.NODE_ENV === "production" ? "Secure; " : ""
        } Max-Age=86400`,
      );
    }

    // Jangan kirim token ke client
    return new NextResponse(JSON.stringify({ user: data.user }), {
      status: 200,
      headers,
    });
  } catch (err: any) {
    // Log detail di server; kirim pesan ringkas ke client
    console.error("[/api/auth/login] ERROR:", err);
    return NextResponse.json(
      {
        message: "Internal Server Error di API proxy.",
        hint: err?.message?.slice(0, 300),
      },
      { status: 500 },
    );
  }
}
