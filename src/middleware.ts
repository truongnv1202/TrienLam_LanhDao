import { NextRequest, NextResponse } from "next/server";
import { verifySessionTokenEdge } from "@/lib/auth-edge";

const ADMIN_COOKIE = "lanhdao_admin_session";

function isAdminSubdomain(host: string): boolean {
  const hostname = host.split(":")[0].toLowerCase();
  return (
    hostname.startsWith("admin.") && hostname.endsWith("gamegiaoduc.co")
  );
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const url = request.nextUrl.clone();

  if (isAdminSubdomain(host)) {
    if (url.pathname === "/" || url.pathname === "") {
      url.pathname = "/admin";
      return NextResponse.rewrite(url);
    }
    if (url.pathname === "/login" || url.pathname === "/login/") {
      url.pathname = "/admin/login";
      return NextResponse.rewrite(url);
    }
  }

  const { pathname } = request.nextUrl;
  const session = request.cookies.get(ADMIN_COOKIE)?.value;
  const authenticated = await verifySessionTokenEdge(session);

  const isAdminLogin = pathname === "/admin/login";
  const isAdminProtected = pathname.startsWith("/admin") && !isAdminLogin;

  const isLeadersMutationApi =
    pathname.startsWith("/api/leaders") && request.method !== "GET";

  if (isAdminProtected && !authenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminLogin && authenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
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
  matcher: ["/admin/:path*", "/api/leaders", "/api/leaders/:path*"],
};
