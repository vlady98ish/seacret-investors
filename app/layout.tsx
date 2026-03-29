import type { Metadata } from "next";
import { Cinzel, Josefin_Sans } from "next/font/google";

import "./globals.css";

const serif = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | The Sea'cret Residences Chiliadou",
    default: "The Sea'cret Residences Chiliadou — Luxury Coastal Living in Greece",
  },
  description:
    "Exclusive beachfront residences in Chiliadou, Greece. 39 luxury villas on the Corinthian Gulf. Hidden from many, perfect for few.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
