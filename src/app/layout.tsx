import type { Metadata } from "next";
import type { Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { MantraMarkSprite } from "@/components/MantraMark";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Mantra — Unleash Your Childhood Again",
  description: "A local migration foundation for the Mantra experience.",
};

export const viewport: Viewport = {
  themeColor: "#111027",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={nunitoSans.variable}>
        <MantraMarkSprite />
        {children}
      </body>
    </html>
  );
}
