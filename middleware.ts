"use client"
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export default async function middleware(req: NextRequest) {
  const cookieStore = cookies();

  const adminRoutes = [
    "/admin/guide-requests",
    "/admin/adventures",
    "/admin/interactions",
    "/admin/cancelled_bookings",
  ];
  const protectedRoutes = ["/guide-requests", "/profile", "/bookings"];
  
  const isAuthenticated = !!cookieStore.get("accessToken");
  const roles = cookieStore.get("roles")?.value.split(",") || [];
  // const isAuthenticated = !!localStorage.getItem("accessToken");
  // const roles = localStorage.getItem("roles")?.split(".") || [];

  if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  if (
    adminRoutes.includes(req.nextUrl.pathname) &&
    (!isAuthenticated ||
      (!roles.includes("SUPER_ADMIN") && !roles.includes("ADMIN")))
  ) {
    const absoluteURL = new URL("/", req.nextUrl);
    return NextResponse.redirect(absoluteURL.toString());
  }
  // Continue to the next middleware or route handler
}

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/guide-requests",
    "/adventures/:path",
    "/profile",
    "/bookings",
  ],
};
