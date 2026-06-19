import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes/action", "/notes/my"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  try {
    const user = await checkSession();

    if (!user && privateRoutes.some((route) => pathname.startsWith(route))) {
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }

    if (user && publicRoutes.some((route) => pathname.startsWith(route))) {
      url.pathname = "/profile";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {

    if (privateRoutes.some((route) => pathname.startsWith(route))) {
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/profile",          
    "/profile/:path*",
    "/notes/action/:path*",
    "/notes/my/:path*",
    "/sign-in",
    "/sign-up",
  ],
}