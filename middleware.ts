import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Allow auth and registration routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (!ADMIN_METHODS.includes(req.method)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || (token as any).role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden: admin access required" },
      { status: 403 },
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};

