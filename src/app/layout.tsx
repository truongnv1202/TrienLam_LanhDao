import type { Metadata } from "next";
import Link from "next/link";
import { Shield } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Triển lãm Lãnh đạo An ninh nhân dân",
  description:
    "Hệ thống hiển thị sơ đồ tổ chức và quản lý tiểu sử timeline Lãnh đạo An ninh nhân dân",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <header className="sticky top-0 z-40 border-b border-[#d4af37]/30 bg-[#4a0000]/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#ffdf7a] transition hover:text-white"
            >
              <Shield className="h-7 w-7 shrink-0" aria-hidden />
              <span className="text-sm font-semibold uppercase tracking-wide sm:text-base">
                An ninh nhân dân
              </span>
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              <Link
                href="/"
                className="rounded-md border border-transparent px-3 py-1.5 text-[#ffdf7a]/90 transition hover:border-[#d4af37]/40 hover:bg-[#800000]/60 hover:text-white"
              >
                Trang chủ
              </Link>
              <Link
                href="/admin"
                className="rounded-md border border-[#d4af37]/40 bg-[#800000]/50 px-3 py-1.5 text-[#ffdf7a] transition hover:bg-[#a30000]/70 hover:text-white"
              >
                Quản trị
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
