import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/berichte", "/patienten"];

export default function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const session = req.cookies.get("session")?.value;

  // Protected Route ohne Session → Login
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Login Page mit Session → Dashboard
  if (path === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
