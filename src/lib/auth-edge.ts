/** Xác thực session cho Middleware (Edge Runtime — Web Crypto) */

const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 7 * 1000;

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifySessionTokenEdge(
  token: string | undefined
): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "";
  if (!token || secret.length < 16) return false;

  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const expected = await hmacSha256Hex(secret, issuedAt);
  if (!safeEqual(signature, expected)) return false;

  const age = Date.now() - Number(issuedAt);
  return age >= 0 && age <= SESSION_MAX_AGE_MS;
}
