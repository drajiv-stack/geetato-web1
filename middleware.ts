import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Authentication disabled for all routes!
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/wishlist/:path*", "/admin/:path*"],
};