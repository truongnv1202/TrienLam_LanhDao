import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
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
      <body className={`${lato.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
