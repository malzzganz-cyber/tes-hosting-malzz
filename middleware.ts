import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPaths = ["/dashboard", "/admin"];
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected) {
    const token = request.cookies.get("malzz_auth_token")?.value;
    if (!token) {
      const loginUrl = new URL("/premium", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
