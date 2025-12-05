import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "./contexts/GameContext";
import ChatBot from "./components/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Opération N.I.R.D - Le Village Résiste",
  description: "Rejoins la Résistance Numérique ! Un jeu éducatif pour découvrir le Numérique Inclusif, Responsable et Durable.",
  keywords: ["NIRD", "Linux", "logiciels libres", "écologie numérique", "éducation", "Nuit de l'Info", "sobriété numérique", "open source"],
  authors: [{ name: "Équipe NIRD" }],
  creator: "Équipe NIRD - Nuit de l'Info 2024",
  publisher: "Nuit de l'Info",
  robots: "index, follow",
  openGraph: {
    title: "Opération N.I.R.D - Le Village Résiste",
    description: "Libère ton écran, sauve ton budget. Un jeu éducatif sur le numérique responsable.",
    type: "website",
    locale: "fr_FR",
    siteName: "Opération N.I.R.D",
    images: [
      {
        url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "Opération N.I.R.D - Jeu éducatif numérique responsable",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Opération N.I.R.D - Le Village Résiste",
    description: "Rejoins la Résistance Numérique ! Jeu éducatif sur le numérique responsable.",
    images: ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GameProvider>
          {children}
          <ChatBot />
        </GameProvider>
      </body>
    </html>
  );
}
