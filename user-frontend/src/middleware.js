import { NextResponse } from "next/server";

export function middleware(request) {
  const { cookies } = request;
  const accessToken = cookies.get("access_token")?.value;

  const protectedPaths = [
    "/hjem",
    "/profil",
    "/ordre-og-opslag",
    "/favoritter",
  ]; // Add all protected paths
  const currentPath = request.nextUrl.pathname;

  // If trying to access a protected route without being authenticated, redirect to login
  if (protectedPaths.includes(currentPath) && !accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow access to public routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/hjem/:path*",
    "/profil/:path*",
    "/ordre-og-opslag/:path*",
    "/favoritter",
  ], // Protect these routes
};
