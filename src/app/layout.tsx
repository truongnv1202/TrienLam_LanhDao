import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import "./globals.css";

const exhibitionSerif = Cormorant_Garamond({
  subsets: ["vietnamese", "latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-exhibition-serif",
});

const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "900"],
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
      <body className={`${exhibitionSerif.variable} ${lato.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
