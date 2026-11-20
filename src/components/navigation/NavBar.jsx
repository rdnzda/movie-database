"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes, FaChevronDown, FaUsers } from "react-icons/fa";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSwitch from "./LanguageSwitch";

/**
 * Barre de navigation principale responsive
 * Contient le logo, les menus déroulants et le sélecteur de langue
 * Avec menu hamburger pour mobile
 */

const desktopLink =
  "block py-2 text-[0.95rem] text-dim hover:text-screen transition-colors";
const dropdownPanel =
  "absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-opacity duration-150 z-[70]";
const dropdownLink =
  "block px-4 py-2.5 text-sm text-dim hover:text-screen hover:bg-ink-3 transition-colors";
const mobileLink =
  "flex items-center justify-between w-full py-3 text-lg text-screen hover:text-brand-light transition-colors";
const mobileSubLink =
  "block py-2 pl-4 border-l border-rule text-dim hover:text-screen hover:border-brand-light transition-colors";

export default function NavBar() {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <header className="bg-ink w-full fixed z-[60] flex justify-center items-center border-b border-rule">
      <nav className="flex flex-row items-center justify-between min-h-[64px] sm:min-h-[76px] px-4 sm:px-8 w-full max-w-[1240px]">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          onClick={closeMobileMenu}
          aria-label="MDTB — accueil"
        >
          <span className="mdtb-logo text-2xl sm:text-3xl leading-none">MDTB</span>
        </Link>

        {/* Menu desktop */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex flex-row gap-7 items-center list-none">
            {/* Menu Films */}
            <li className="relative group">
              <button className="flex items-center gap-1.5 py-2 text-[0.95rem] text-dim hover:text-screen group-focus-within:text-screen transition-colors" aria-haspopup="true">
                <span>{t.navigation.films}</span>
                <FaChevronDown className="w-2.5 h-2.5" aria-hidden="true" />
              </button>
              <div className={dropdownPanel}>
                <div className="bg-ink-2 border border-rule rounded-md overflow-hidden min-w-[170px] py-1 shadow-lg shadow-black/20">
                  <Link className={dropdownLink} href="/popular">{t.navigation.popular}</Link>
                  <Link className={dropdownLink} href="/top">{t.navigation.topRated}</Link>
                </div>
              </div>
            </li>

            {/* Menu Séries */}
            <li className="relative group">
              <button className="flex items-center gap-1.5 py-2 text-[0.95rem] text-dim hover:text-screen group-focus-within:text-screen transition-colors" aria-haspopup="true">
                <span>{t.navigation.series}</span>
                <FaChevronDown className="w-2.5 h-2.5" aria-hidden="true" />
              </button>
              <div className={dropdownPanel}>
                <div className="bg-ink-2 border border-rule rounded-md overflow-hidden min-w-[170px] py-1 shadow-lg shadow-black/20">
                  <Link className={dropdownLink} href="/series/popular">{t.navigation.popular}</Link>
                  <Link className={dropdownLink} href="/series/top">{t.navigation.topRatedFeminine}</Link>
                </div>
              </div>
            </li>

            {/* Lien Distribution (acteurs, réalisateurs) */}
            <li>
              <Link className={`${desktopLink} flex items-center gap-2`} href="/people">
                <FaUsers className="w-4 h-4" aria-hidden="true" />
                {t.navigation.distribution}
              </Link>
            </li>

            {/* Lien À Propos */}
            <li>
              <Link className={desktopLink} href="/about">
                {t.navigation.about}
              </Link>
            </li>
          </ul>

          <div className="pl-6 border-l border-rule">
            <LanguageSwitch />
          </div>
        </div>

        {/* Bouton menu mobile */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden flex items-center justify-center w-11 h-11 -mr-2 text-screen hover:text-brand-light transition-colors"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Menu mobile overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-[70] lg:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Menu mobile */}
        <div className={`fixed top-[64px] sm:top-[76px] right-0 h-[calc(100vh-64px)] sm:h-[calc(100vh-76px)] w-80 max-w-[85vw] bg-ink border-l border-rule transform transition-transform duration-200 ease-out z-[80] lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full invisible'
        }`}>
          <div className="flex flex-col h-full">
            <div className="px-6 py-4 border-b border-rule flex items-center justify-between">
              <span className="font-display font-bold text-lg text-screen">Menu</span>
              <LanguageSwitch />
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <nav className="flex flex-col divide-y divide-rule">
                <Link href="/" onClick={closeMobileMenu} className={mobileLink}>
                  Accueil
                </Link>

                {/* Films */}
                <div>
                  <button
                    onClick={() => toggleDropdown('films')}
                    className={mobileLink}
                    aria-expanded={openDropdown === 'films'}
                  >
                    <span>{t.navigation.films}</span>
                    <FaChevronDown className={`w-3.5 h-3.5 text-faint transition-transform duration-200 ${
                      openDropdown === 'films' ? 'rotate-180' : ''
                    }`} aria-hidden="true" />
                  </button>
                  {openDropdown === 'films' && (
                    <div className="pb-3 space-y-1">
                      <Link href="/popular" onClick={closeMobileMenu} className={mobileSubLink}>
                        {t.navigation.popular}
                      </Link>
                      <Link href="/top" onClick={closeMobileMenu} className={mobileSubLink}>
                        {t.navigation.topRated}
                      </Link>
                    </div>
                  )}
                </div>

                {/* Séries */}
                <div>
                  <button
                    onClick={() => toggleDropdown('series')}
                    className={mobileLink}
                    aria-expanded={openDropdown === 'series'}
                  >
                    <span>{t.navigation.series}</span>
                    <FaChevronDown className={`w-3.5 h-3.5 text-faint transition-transform duration-200 ${
                      openDropdown === 'series' ? 'rotate-180' : ''
                    }`} aria-hidden="true" />
                  </button>
                  {openDropdown === 'series' && (
                    <div className="pb-3 space-y-1">
                      <Link href="/series/popular" onClick={closeMobileMenu} className={mobileSubLink}>
                        {t.navigation.popular}
                      </Link>
                      <Link href="/series/top" onClick={closeMobileMenu} className={mobileSubLink}>
                        {t.navigation.topRatedFeminine}
                      </Link>
                    </div>
                  )}
                </div>

                <Link href="/people" onClick={closeMobileMenu} className={mobileLink}>
                  {t.navigation.distribution}
                </Link>

                <Link href="/about" onClick={closeMobileMenu} className={mobileLink}>
                  {t.navigation.about}
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
