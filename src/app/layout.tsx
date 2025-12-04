import { Toaster } from "@/components/ui/sonner";
import { archivo, neuePower } from "@/lib/customFonts";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: {
    template: "%s | Stakenet",
    absolute: "Stakenet - AI Powered Sports Betting Analytics",
  },
  description:
    "AI Powered Sports Betting Analytics with Stakenet. Enhance your betting strategy using advanced data insights and machine learning algorithms.",
};

export const viewport = {
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "antialiased font-archivo font-normal",
          `${neuePower.variable} ${archivo.variable}`
        )}
      >
        <Analytics />
        <Toaster />
        {children}
      </body>
    </html >
  );
}
