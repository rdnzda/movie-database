"use client";

import Link from "next/link";
import { useLanguage } from "../../contexts/LanguageContext";

/**
 * Pied de page de l'application
 * Contient les liens de navigation organisés et les crédits
 * Mis en page comme un générique de fin : rôles à gauche, noms à droite.
 */
export default function Footer() {
  const { t } = useLanguage();

  const linkClass = "text-sm text-dim hover:text-screen transition-colors";
  const headClass = "font-display font-semibold text-xl text-screen leading-none mb-3";

  return (
    <footer className="w-full bg-ink border-t border-rule pt-12 pb-10 mt-auto">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
        {/* Logo */}
        <div className="col-span-2 sm:col-span-1">
          <Link href="/" className="inline-block">
            <span className="font-display font-extrabold text-5xl leading-none text-screen">MDTB</span>
          </Link>
        </div>

        {/* Section Films */}
        <div>
          <h3 className={headClass}>{t.navigation.films}</h3>
          <ul className="flex flex-col gap-1.5">
            <li><Link className={linkClass} href="/popular">{t.footer.links.popularMovies}</Link></li>
            <li><Link className={linkClass} href="/top">{t.footer.links.topMovies}</Link></li>
          </ul>
        </div>

        {/* Section Séries */}
        <div>
          <h3 className={headClass}>{t.navigation.series}</h3>
          <ul className="flex flex-col gap-1.5">
            <li><Link className={linkClass} href="/series/popular">{t.footer.links.popularSeries}</Link></li>
            <li><Link className={linkClass} href="/series/top">{t.footer.links.topSeries}</Link></li>
          </ul>
        </div>

        {/* Section Autres */}
        <div>
          <h3 className={headClass}>{t.navigation.about}</h3>
          <ul className="flex flex-col gap-1.5">
            <li><Link className={linkClass} href="/about">{t.footer.links.about}</Link></li>
          </ul>
        </div>
      </div>

      {/* Crédits */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 mt-10"><div className="pt-5 border-t border-rule flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-faint">
        <p>
          {t.footer.createdBy}
          <span className="mx-2 text-rule-strong" aria-hidden="true">/</span>
          <a
            href="https://github.com/rdnzda"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 decoration-rule-strong hover:text-screen hover:decoration-screen transition-colors"
          >
            {t.footer.sourceCode}
          </a>
        </p>
        <p>
          {t.footer.poweredBy}{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-screen underline underline-offset-2 decoration-rouge hover:text-rouge transition-colors"
          >
            The Movie Database (TMDB)
          </a>
        </p>
      </div></div>
    </footer>
  );
}
