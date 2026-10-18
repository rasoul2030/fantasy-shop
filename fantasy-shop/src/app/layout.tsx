import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a0a14",
};

export const metadata: Metadata = {
  title: "محصولات فانتزی",
  description: "فروشگاه محصولات فانتزی",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/vazirmatn.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body className="dark antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}