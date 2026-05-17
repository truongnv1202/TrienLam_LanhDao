"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, Shield } from "lucide-react";
import { ADMIN_BASE_PATH, isAdminPath } from "@/lib/admin-path";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data: unknown = await res.json();

      if (!res.ok) {
        const msg =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (data as { error: string }).error === "string"
            ? (data as { error: string }).error
            : "Đăng nhập thất bại.";
        throw new Error(msg);
      }

      const from = searchParams.get("from");
      router.replace(from && isAdminPath(from) ? from : ADMIN_BASE_PATH);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#d4af37]/40 bg-[#5c0000]/80 p-8 shadow-[0_0_40px_rgba(212,175,55,0.15)] backdrop-blur">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#d4af37] bg-[#800000]/60">
          <Shield className="h-7 w-7 text-[#ffdf7a]" aria-hidden />
        </div>
        <h1 className="text-xl font-bold text-[#ffdf7a]">Quản trị nội dung</h1>
        <p className="mt-2 text-sm text-white/70">Đăng nhập để quản lý lãnh đạo</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="rounded-md border border-red-400/40 bg-red-900/30 px-3 py-2 text-sm text-red-100">
            {error}
          </p>
        )}

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#d4af37]"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4af37]/70" />
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#d4af37]/40 bg-[#4a0000]/70 py-2.5 pl-10 pr-3 text-sm text-white outline-none focus:border-[#ffdf7a] focus:ring-1 focus:ring-[#ffdf7a]/40"
              placeholder="Nhập mật khẩu quản trị"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#d4af37] py-2.5 text-sm font-bold text-[#4a0000] transition hover:bg-[#ffdf7a] disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Lock className="h-4 w-4" />
          )}
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#4a0000] via-[#800000] to-[#2a0000] px-4">
      <Suspense
        fallback={
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#ffdf7a]" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
