import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EC4899",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fantasy-shop.vercel.app'),
  title: {
    default: "محصولات فانتزی | فروشگاه آنلاین آرایشی و عطر",
    template: "%s | محصولات فانتزی",
  },
  description: "فروشگاه آنلاین محصولات فانتزی - آرایشی، عطر، اکسسوری و لوازم تحریر با بهترین قیمت و ارسال سریع",
  keywords: ["فانتزی", "آرایشی", "عطر", "ادکلن", "اکسسوری", "لوازم تحریر", "فروشگاه آنلاین", "رژ لب", "کرم"],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "محصولات فانتزی",
    title: "محصولات فانتزی | فروشگاه آنلاین آرایشی و عطر",
    description: "فروشگاه آنلاین محصولات فانتزی - آرایشی، عطر، اکسسوری و لوازم تحریر",
  },
  twitter: {
    card: "summary_large_image",
    title: "محصولات فانتزی",
    description: "فروشگاه آنلاین محصولات فانتزی - آرایشی، عطر، اکسسوری و لوازم تحریر",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'محصولات فانتزی',
    description: 'فروشگاه آنلاین محصولات فانتزی - آرایشی، عطر، اکسسوری و لوازم تحریر',
    url: 'https://fantasy-shop.vercel.app',
  };

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/vazirmatn.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://placehold.co" />
        <link rel="dns-prefetch" href="https://placehold.co" />
      </head>
      <body className="antialiased">
        {children}
        <Toaster />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
