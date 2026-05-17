import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "lanhdao_admin_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 ngày

function getSecrets(): { password: string; sessionSecret: string } {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? "";
  return { password, sessionSecret };
}

export function isAuthConfigured(): boolean {
  const { password, sessionSecret } = getSecrets();
  return password.length >= 6 && sessionSecret.length >= 16;
}

export function verifyAdminPassword(input: string): boolean {
  const { password } = getSecrets();
  if (!password) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const { sessionSecret } = getSecrets();
  const issuedAt = String(Date.now());
  const signature = createHmac("sha256", sessionSecret)
    .update(issuedAt)
    .digest("hex");
  return `${issuedAt}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const { sessionSecret } = getSecrets();
  if (!sessionSecret) return false;

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const expected = createHmac("sha256", sessionSecret)
    .update(issuedAt)
    .digest("hex");

  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return false;
    if (!timingSafeEqual(sigBuf, expBuf)) return false;
  } catch {
    return false;
  }

  const age = Date.now() - Number(issuedAt);
  return age >= 0 && age <= SESSION_MAX_AGE_SEC * 1000;
}

export function sessionCookieOptions(): {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  };
}

export function getSessionFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(ADMIN_COOKIE)?.value;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export function unauthorizedResponse(): Response {
  return Response.json({ error: "Yêu cầu đăng nhập quản trị." }, { status: 401 });
}
