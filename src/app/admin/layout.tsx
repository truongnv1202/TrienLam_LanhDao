"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, Shield } from "lucide-react";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#800000] via-[#6b0000] to-[#4a0000]">
      <header className="border-b border-[#d4af37]/30 bg-[#4a0000]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-[#ffdf7a]">
            <Shield className="h-6 w-6 shrink-0" aria-hidden />
            <span className="text-sm font-semibold uppercase tracking-wide sm:text-base">
              CMS Lãnh đạo
            </span>
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            className="flex items-center gap-1.5 rounded-md border border-[#d4af37]/50 px-3 py-1.5 text-sm text-[#ffdf7a] transition hover:bg-[#800000]/70"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
