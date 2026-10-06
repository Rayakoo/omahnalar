import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import LayoutShell from "@/components/LayoutShell";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { PlayerNameProvider } from "@/contexts/PlayerNameContext";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://omahnalar.org"),
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
      className={`${poppins.variable} h-full antialiased`}
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
