import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { brandConfig } from "@/config/brand.config";
import { Providers } from "@/lib/query/providers";
import { StoreProvider } from "@/lib/store/store";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atelierparfum.example.com"),
  title: {
    default: `${brandConfig.name} — ${brandConfig.tagline}`,
    template: `%s — ${brandConfig.name}`,
  },
  description: brandConfig.description,
  keywords: ["luxury perfume", "niche fragrance", "eau de parfum", "perfume house", brandConfig.name],
  openGraph: {
    type: "website",
    siteName: brandConfig.name,
    title: `${brandConfig.name} — ${brandConfig.tagline}`,
    description: brandConfig.description,
    images: [{ url: brandConfig.hero.image, width: 1600, height: 1100 }],
  },
  twitter: {
    card: "summary_large_image",
    title: brandConfig.name,
    description: brandConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: brandConfig.theme.ink,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const t = brandConfig.theme;
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-ivory text-ink">
        <style>{`:root{--brand-ink:${t.ink};--brand-ivory:${t.ivory};--brand-accent:${t.accent};--brand-muted:${t.muted};--brand-line:${t.line};}`}</style>
        <Providers>
          <StoreProvider>{children}</StoreProvider>
        </Providers>
      </body>
    </html>
  );
}
