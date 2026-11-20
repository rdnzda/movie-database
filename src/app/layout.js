import { Geist, Geist_Mono } from "next/font/google";
import 'simplebar-react/dist/simplebar.min.css';
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "MDTB — Films, séries et distribution",
    template: "%s · MDTB",
  },
  description:
    "Parcourez films, séries et personnalités du cinéma grâce aux données TMDB : tendances du jour et de la semaine, recherche, filtres et tri.",
};

export const viewport = {
  themeColor: "#111827",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-ink text-screen font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
