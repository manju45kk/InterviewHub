import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NEXTAUTH_SECRET } from "./constants/variables";

export async function middleware(req) {
  // Handle API routes CORS
  if (req.nextUrl.pathname.startsWith("/api")) {
    if (req.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "https://interview-hub-qwi7.vercel.app",
          "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://interview-hub-qwi7.vercel.app"
    );
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    return response;
  }

  // Get token for authentication
  const token = await getToken({
    req,
    secret: NEXTAUTH_SECRET,
  });

  // ✅ TEMPORARILY ALLOW /admin WITHOUT LOGIN
  // TODO: Enable authentication check when deploying to production
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Allow access without authentication for now
    return NextResponse.next();
  }

  // Check if accessing /skills - requires login
  if (req.nextUrl.pathname.startsWith("/skills")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Allow both admin and user roles to access skills
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/skills/:path*"],
};
