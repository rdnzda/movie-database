import { Big_Shoulders_Display, Instrument_Sans, Instrument_Serif } from "next/font/google";
import 'simplebar-react/dist/simplebar.min.css';
import "./globals.css";
import { LanguageProvider } from "../contexts/LanguageContext";

const display = Big_Shoulders_Display({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["600", "800"],
});

const body = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const serif = Instrument_Serif({
  variable: "--font-serif-face",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
  themeColor: "#110f0e",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${serif.variable}`}>
      <body className="antialiased bg-ink text-screen font-sans">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
