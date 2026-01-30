import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "./providers";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nex.is-a.dev';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ebenezer Portfolio",
    template: "%s | Ebenezer Portfolio",
  },
  description: "Full-stack engineer specializing in robust backend architectures and AI-driven applications.",
  keywords: ["Full-stack Engineer", "Backend Architecture", "AI Applications", "Portfolio"],
  authors: [{ name: "Ebenezer" }],
  creator: "Ebenezer",
  icons: {
    icon: '/favicon.png',
    shortcut: '/shortcut-static-icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'Ebenezer\'s Portfolio',
    description: 'Full-stack engineer specializing in robust backend architectures and AI-driven applications.',
    url: './',
    siteName: "Ebenezer Portfolio",
    type: 'website',
    images: [
      {
        // url: `${siteUrl}/og-image.png`,
        url: 'og-image.png',
        width: 1200,
        height: 630,
        alt: "Ebenezer Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ebenezer Portfolio',
    description: 'Full-stack engineer specializing in robust backend architectures and AI-driven applications.',
    // images: [`${siteUrl}/og-image.png`],
    images: ['/og-image.png'],
    creator: '@dBillionaireDev',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
