import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/content";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const meta = content.meta || {};

  const siteName = meta.siteName || "Neo Landing";
  const siteDescription = meta.siteDescription || "Modern landing page template";
  const siteUrl = meta.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const faviconUrl = meta.faviconUrl || "https://i.imgur.com/udCYp7c.png";
  const ogImageUrl = meta.ogImageUrl || "";

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    metadataBase: new URL(siteUrl),
    icons: {
      icon: faviconUrl,
    },
    openGraph: {
      title: siteName,
      description: siteDescription,
      url: siteUrl,
      siteName: siteName,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      locale: meta.siteLang || "en",
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();
  const lang = content.meta?.siteLang || "en";

  return (
    <html lang={lang} className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
