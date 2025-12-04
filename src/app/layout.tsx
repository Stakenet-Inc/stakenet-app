import { Toaster } from "@/components/ui/sonner";
import { archivo, neuePower } from "@/lib/customFonts";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import "./globals.css";


const baseUrl = "https://stakenet.app";
const wwwBaseUrl = "https://www.stakenet.app";

export const metadata: Metadata = {
  metadataBase: new URL(`${wwwBaseUrl}`) || new URL(`${baseUrl}`),
  title: {
    template: "%s | Stakenet",
    absolute: "Stakenet - AI Powered Sports Betting Analytics",
  },
  description:
    "AI Powered Sports Betting Analytics with Stakenet. Enhance your betting strategy using advanced data insights and machine learning algorithms.",
  alternates: {
    canonical: wwwBaseUrl,
  },
  openGraph: {
    title: {
      template: "%s | Stakenet",
      absolute: "Stakenet - AI Powered Sports Betting Analytics",
    },
    siteName: "Stakenet",
    description:
      "AI Powered Sports Betting Analytics with Stakenet. Enhance your betting strategy using advanced data insights and machine learning algorithms.",
    images: ["/image/thumbnail.webp"],
    url: `${wwwBaseUrl}`,
  },
  twitter: {
    card: "summary_large_image",
    title: {
      template: "%s | Stakenet",
      absolute: "Stakenet - AI Powered Sports Betting Analytics",
    },
    description:
      "AI Powered Sports Betting Analytics with Stakenet. Enhance your betting strategy using advanced data insights and machine learning algorithms.",
    images: ["/image/thumbnail.webp"],
    creator: "@stakenetapp",
  },
  icons: "/favicon.ico",
  keywords: [
    "AI sports betting",
    "sports analytics",
    "betting predictions",
    "sports betting insights",
    "machine learning betting",
    "sports data analysis",
    "betting strategies",
    "Stakenet",
    "AI-powered betting",
    "sports betting platform",
    "betting technology",
    "responsible gambling",
  ],
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
