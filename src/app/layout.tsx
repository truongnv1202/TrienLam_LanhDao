import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const exhibitionSerif = Cormorant_Garamond({
  subsets: ["vietnamese", "latin"],
  weight: ["600", "700"],
  variable: "--font-exhibition-serif",
});

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
      <body className={`${exhibitionSerif.variable} antialiased`}>{children}</body>
    </html>
  );
}
