import type { Metadata } from "next";
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
