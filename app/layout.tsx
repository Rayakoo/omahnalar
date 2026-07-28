import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LayoutShell from "@/components/LayoutShell";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PlayerNameProvider } from "@/contexts/PlayerNameContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Omah Nalar",
  description: "Ruang aman untuk berbagi cerita, belajar, dan melapor — komunitas pendidikan dan kesehatan reproduksi seksual.",
  icons: {
    icon: "/images/logo_omah.png",
    apple: "/images/logo_omah.png",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
  openGraph: {
    title: "Omah Nalar",
    description: "Ruang aman untuk berbagi cerita, belajar, dan melapor — komunitas pendidikan dan kesehatan reproduksi seksual.",
    siteName: "Omah Nalar",
    images: [
      {
        url: "/images/logo_omah.png",
        width: 512,
        height: 512,
        alt: "Omah Nalar",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen bg-page-50 font-sans text-brand-900 flex flex-col">
        <LanguageProvider>
          <AuthProvider>
            <PlayerNameProvider>
              <LayoutShell>{children}</LayoutShell>
              <AccessibilityWidget />
            </PlayerNameProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
