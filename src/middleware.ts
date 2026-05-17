import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_BASE_PATH,
  ADMIN_LOGIN_PATH,
  isAdminLoginPath,
  isAdminPath,
} from "@/lib/admin-path";
import { verifySessionTokenEdge } from "@/lib/auth-edge";

const ADMIN_COOKIE = "lanhdao_admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  const authenticated = await verifySessionTokenEdge(session);

  const isAdminLogin = isAdminLoginPath(pathname);
  const isAdminProtected = isAdminPath(pathname) && !isAdminLogin;

  const isLeadersMutationApi =
    pathname.startsWith("/api/leaders") && request.method !== "GET";

  if (isAdminProtected && !authenticated) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminLogin && authenticated) {
    return NextResponse.redirect(new URL(ADMIN_BASE_PATH, request.url));
  }

  if (isLeadersMutationApi && !authenticated) {
    return NextResponse.json(
      { error: "Yêu cầu đăng nhập quản trị." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin1111/:path*", "/api/leaders", "/api/leaders/:path*"],
};
