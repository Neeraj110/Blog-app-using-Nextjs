import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

async function verifyToken(token) {
  try {
    if (!token) {
      console.error("No token provided");
      return null;
    }
    if (token.split(".").length !== 3) {
      console.error("Malformed token:", token);
      return null;
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return payload;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = new URL(request.url);

  // Public routes that don't require authentication
  const publicRoutes = [
    "/_next",
    "/api/user/login",
    "/api/user/register",
    "/api/user/verify",
  ];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get the auth token from the cookies
  const token = request.cookies.get("authToken")?.value;

  // Handle API routes
  if (pathname.startsWith("/api/")) {
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    try {
      const payload = await verifyToken(token);
      if (!payload) {
        throw new Error("Invalid token and payload is null");
      }

      // Add user info to headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("userid", payload._id);
      requestHeaders.set("email", payload.email);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }
  }

  // Handle protected pages
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/dashboard/profile")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    try {
      const payload = await verifyToken(token);

      if (!payload) {
        throw new Error("Invalid token");
      }

      return NextResponse.next();
    } catch (error) {
      const response = NextResponse.redirect(
        new URL("/auth//login", request.url)
      );
      response.cookies.set("authToken", "", {
        httpOnly: true,
        secure: true,
        maxAge: 0,
        path: "/",
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    "/api/user/:path*",
    "/api/post/:path*",
    "/api/message/:path*",
    "/api/notification/:path*",
    "/api/socket/:path*", 
    "/api/socket.io/:path*", 
  ],
};
