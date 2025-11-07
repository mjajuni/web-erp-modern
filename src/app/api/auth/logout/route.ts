import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(
    new URL("/", process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  );

  // Hapus cookie sesi
  response.cookies.set("token", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
    sameSite: "lax",
  });

  response.cookies.set("role", "", {
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });

  return response;
}
