import type { Metadata } from "next";
import { Cinzel, Cormorant_SC, Frank_Ruhl_Libre, Assistant } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { GoogleTagManagerNoscript } from "@/components/analytics/google-tag-manager";
import "./globals.css";

const serif = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const serifCyrillic = Cormorant_SC({
  subsets: ["cyrillic"],
  variable: "--font-serif-cyrillic",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const serifHebrew = Frank_Ruhl_Libre({
  subsets: ["hebrew"],
  variable: "--font-serif-hebrew",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const sans = Assistant({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | The Sea'cret Residences Chiliadou",
    default: "The Sea'cret Residences Chiliadou — Luxury Coastal Living in Greece",
  },
  description:
    "Exclusive beachfront residences in Chiliadou, Greece. 39 luxury villas on the Corinthian Gulf. Hidden from many, perfect for few.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${serif.variable} ${serifCyrillic.variable} ${serifHebrew.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>
        <GoogleTagManagerNoscript />
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
