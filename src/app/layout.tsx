import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Stakenet",
    absolute: "Stakenet - AI Powered Sports Betting Analytics",
  },
  description:
    "AI Powered Sports Betting Analytics with Stakenet. Enhance your betting strategy using advanced data insights and machine learning algorithms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased select-none`}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
