import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export{default} from "next-auth/middleware"

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // Always allow public assets and NextAuth routes
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/unauthorized"
  ) {
    return NextResponse.next();
  }

  // --- Handle if NOT logged in ---
  if (!token) {
    // If visiting /login, allow it
    if (pathname === "/login") {
      return NextResponse.next();
    }

    // If visiting any other protected route, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // --- Handle if LOGGED IN ---
  // If trying to access / or /login, redirect to correct dashboard
  if (pathname === "/" || pathname === "/login") {
    if (token.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (token.role === "employee") {
      return NextResponse.redirect(new URL("/employee/dashboard", request.url));
    } else if (token.role === "intern") {
      return NextResponse.redirect(new URL("/intern/dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // --- Role-based route protection ---
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/employee") && !["admin", "employee"].includes(token.role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/intern") && !["admin", "employee", "intern"].includes(token.role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",             // for root path
    "/login",        // to handle login redirection
    "/admin/:path*",
    "/employee/:path*",
    "/intern/:path*",
  ],
};
