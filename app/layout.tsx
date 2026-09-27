import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "أستاذة العلوم الطبيعية دلالجة",
  description: "مساعد مهني لتنظيم عمل أستاذة العلوم الطبيعية للطور المتوسط",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}