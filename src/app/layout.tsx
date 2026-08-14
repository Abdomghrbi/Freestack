import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreeStack - أدوات مجانية مجتمعية",
  description: "اكتشف وشارك الأدوات المجانية التي تستخدم الذكاء الاصطناعي والتصميم والتطوير",
  openGraph: {
    title: "FreeStack - أدوات مجانية مجتمعية",
    description: "مجموعة من الأدوات المجانية المجربة والمفيدة",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
