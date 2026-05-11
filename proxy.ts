import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const { pathname } = request.nextUrl

  // ── Protect all /admin/* routes ─────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url)
      // Remember where they were going so we can redirect back after login
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // ── If already logged in, bounce away from auth pages ───────────────────
  if ((pathname === "/login" || pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Apply to admin routes and auth pages; skip static assets
    "/admin/:path*",
    "/login",
    "/signup",
    "/",
  ],
}
