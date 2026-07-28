import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "مدیریت فیلم",
  description: "مدیریت و پخش فیلم و انیمه",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="dark antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}