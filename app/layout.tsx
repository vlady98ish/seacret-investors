import type { Metadata } from "next";
import { Cinzel, Assistant } from "next/font/google";
import "./globals.css";

const serif = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
