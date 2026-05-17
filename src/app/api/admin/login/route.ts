import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  isAuthConfigured,
  sessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/auth";

interface LoginBody {
  password?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Chưa cấu hình ADMIN_PASSWORD và ADMIN_SESSION_SECRET trên server.",
      },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as LoginBody;
    const password = typeof body.password === "string" ? body.password : "";

    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: "Mật khẩu không đúng." },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, sessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json(
      { error: "Không thể xử lý đăng nhập." },
      { status: 500 }
    );
  }
}
