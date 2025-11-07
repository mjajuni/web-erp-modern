import { NextResponse, NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // ✅ Jika belum login tapi mencoba masuk ke dashboard → arahkan ke login
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // ✅ Jika SUDAH login tapi mencoba buka /login → arahkan ke dashboard
  if (pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url));
  }

  // ✅ Jika ingin tambahkan rule lain, contoh:
  // if (pathname.startsWith("/admin") && role !== "ADMIN") {
  //   return NextResponse.redirect(new URL("/dashboard/overview", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"], // jangan lupa sertakan "/login"
};
