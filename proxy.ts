import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isPrivateKey = privateRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isPublicKey = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicKey) {
    if (accessToken) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (isPrivateKey) {
    if (accessToken) {
      return NextResponse.next();
    }

    if (refreshToken) {
      try {
        const response = await checkSession();
        const setCookieHeader = response.headers["set-cookie"];

        if (response && response.data && setCookieHeader) {
          const nextResponse = NextResponse.next();
          
          if (typeof setCookieHeader === "string") {
            nextResponse.headers.append("Set-Cookie", setCookieHeader);
          } else if (Array.isArray(setCookieHeader)) {
            setCookieHeader.forEach((cookieString) => {
              nextResponse.headers.append("Set-Cookie", cookieString);
            });
          }

          return nextResponse;
        }

        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
      } catch {
        url.pathname = "/sign-in";
        return NextResponse.redirect(url);
      }
    }

    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile",
    "/profile/:path*",
    "/notes",
    "/notes/:path*",
    "/sign-in",
    "/sign-up",
  ],
};
