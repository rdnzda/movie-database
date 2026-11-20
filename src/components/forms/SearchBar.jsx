"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

/**
 * Barre de recherche avec debouncing
 * Permet de rechercher des films et séries en temps réel
 */
export default function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const lastSentRef = useRef("");
  const { t } = useLanguage();

  // Appelle la recherche quand le texte est stable (debouncing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const trimmed = searchQuery.trim();
      if (trimmed === lastSentRef.current) return; // ne rien faire si identique
      lastSentRef.current = trimmed;
      onSearch(trimmed);
      setDebouncedQuery(trimmed);
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  return (
    <div className="fixed top-16 sm:top-[76px] flex flex-col items-center w-full bg-ink-2 border-b border-rule z-50">
      <form onSubmit={(e) => e.preventDefault()} className="flex flex-row w-full max-w-[1240px] px-4 sm:px-8 items-center" role="search">
        <Search className="w-4 h-4 text-faint flex-shrink-0" aria-hidden="true" />
        <input
          type="text"
          placeholder={t.search.placeholder}
          className="h-[52px] pl-3 outline-none focus-visible:outline-none text-screen placeholder:text-faint placeholder:font-serif placeholder:italic placeholder:text-lg w-full text-base bg-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Rechercher des films et séries"
        />
      </form>
    </div>
  );
}
