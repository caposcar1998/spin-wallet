import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const acceptedPath = ["/login", "/"];
  const user = request.cookies.has("userId");
  const mainPath = acceptedPath.includes(request.nextUrl.pathname);
  if (!user && !mainPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (user && mainPath) {
    return NextResponse.redirect(new URL("/home", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg).*)",
  ],
};
