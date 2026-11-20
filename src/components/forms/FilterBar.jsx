"use client";

import { useState, useEffect, useRef } from "react";
import { FaFilter, FaCalendarAlt, FaStar, FaSort, FaTimes, FaChevronDown } from "react-icons/fa";
import { useLanguage } from "../../contexts/LanguageContext";

// Liste minimaliste de genres (id TMDB) pour démonstration
const GENRES = [
  { id: 28, nameKey: "action" },
  { id: 12, nameKey: "adventure" },
  { id: 16, nameKey: "animation" },
  { id: 35, nameKey: "comedy" },
  { id: 80, nameKey: "crime" },
  { id: 18, nameKey: "drama" },
  { id: 14, nameKey: "fantasy" },
  { id: 27, nameKey: "horror" },
  { id: 10749, nameKey: "romance" },
  { id: 878, nameKey: "sciFi" },
];

/**
 * Barre de filtres avancée
 * Permet de filtrer par tri, année, note minimale et genres
 */
export default function FilterBar({ onChange, initial = {}, compact = false }) {
  const [sortBy, setSortBy] = useState(initial.sort_by || "popularity.desc");
  const [year, setYear] = useState(initial.primary_release_year || "");
  const [minVote, setMinVote] = useState(initial['vote_average.gte'] || "");
  const [genres, setGenres] = useState(initial.with_genres || []);
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();

  // Options de tri dynamiques basées sur la traduction
  const SORT_OPTIONS = [
    { value: "popularity.desc", labelKey: "popularityDesc" },
    { value: "popularity.asc", labelKey: "popularityAsc" },
    { value: "primary_release_date.desc", labelKey: "releaseDateDesc" },
    { value: "primary_release_date.asc", labelKey: "releaseDateAsc" },
    { value: "release_date.desc", labelKey: "releaseDateDesc" },
    { value: "release_date.asc", labelKey: "releaseDateAsc" },
    { value: "revenue.desc", labelKey: "revenueDesc" },
    { value: "revenue.asc", labelKey: "revenueAsc" },
    { value: "vote_average.desc", labelKey: "ratingDesc" },
    { value: "vote_average.asc", labelKey: "ratingAsc" },
    { value: "vote_count.desc", labelKey: "voteCountDesc" },
    { value: "vote_count.asc", labelKey: "voteCountAsc" },
  ];

  // Synchroniser les filtres avec le parent
  // Éviter d'appeler onChange avec un objet identique (sinon boucle de re-renders côté parent)
  const lastPayloadRef = useRef(null);
  useEffect(() => {
    const payload = {
      sort_by: sortBy,
      primary_release_year: year || undefined,
      'vote_average.gte': minVote || undefined,
      with_genres: genres.length ? genres : undefined,
    };
    const serialized = JSON.stringify(payload);
    if (serialized !== lastPayloadRef.current) {
      lastPayloadRef.current = serialized;
      onChange(payload);
    }
  }, [sortBy, year, minVote, genres, onChange]);

  const toggleGenre = (id) => {
    setGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const hasActiveFilters = year || minVote || genres.length > 0 || sortBy !== "popularity.desc";

  const resetFilters = () => {
    setSortBy(initial.sort_by || "popularity.desc");
    setYear("");
    setMinVote("");
    setGenres([]);
  };

  const labelClass = "flex items-center gap-2 text-sm font-semibold text-dim";
  const fieldClass =
    "w-full bg-ink rounded-md border border-rule-strong px-3 py-2.5 text-screen text-sm placeholder:text-faint hover:border-dim focus:border-screen transition-colors";

  return (
    <div className="w-full pb-2">
      <div className="w-full">
        {/* Header avec toggle */}
        <div className="mb-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            className="flex items-center gap-3 rounded-md border border-rule-strong px-4 py-2.5 text-screen hover:border-screen transition-colors"
          >
            <FaFilter className="text-faint text-xs" aria-hidden="true" />
            <span className="font-semibold text-sm">Filtres</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-light" aria-hidden="true"></span>
            )}
            <FaChevronDown
              className={`text-faint text-xs transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Panel de filtres */}
        <div className={`transition-[max-height,opacity] duration-300 ease-out overflow-hidden ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 invisible'
        }`}>
          <div className="bg-ink-2 border border-rule rounded-md p-4 sm:p-6 mb-4 max-h-[80vh] overflow-y-auto">
            {/* Header avec reset */}
            <div className="flex flex-wrap items-center justify-between mb-5 gap-2">
              <h3 className="font-display font-bold text-2xl leading-none text-screen">
                <span className="hidden xs:inline">Personnaliser votre recherche</span>
                <span className="inline xs:hidden">Recherche</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1.5 text-brand-light hover:text-screen text-sm font-semibold transition-colors"
                >
                  <FaTimes className="text-xs" aria-hidden="true" />
                  Réinitialiser
                </button>
              )}
            </div>

            {/* Filtres principaux */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6">
              {/* Tri */}
              <div className="space-y-2">
                <label className={labelClass} htmlFor="filter-sort">
                  <FaSort className="text-faint" aria-hidden="true" />
                  {t.filters.sort}
                </label>
                <div className="relative">
                  <select
                    id="filter-sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`${fieldClass} appearance-none pr-9 cursor-pointer`}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value} className="bg-ink-2">
                        {t.filters.sortOptions[o.labelKey]}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-faint text-xs pointer-events-none" aria-hidden="true" />
                </div>
              </div>

              {/* Année */}
              <div className="space-y-2">
                <label className={labelClass} htmlFor="filter-year">
                  <FaCalendarAlt className="text-faint" aria-hidden="true" />
                  {t.filters.year}
                </label>
                <input
                  id="filter-year"
                  type="number"
                  placeholder="2024"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className={`${fieldClass} tabular`}
                />
              </div>

              {/* Note minimale */}
              <div className="space-y-2">
                <label className={labelClass} htmlFor="filter-vote">
                  <FaStar className="text-faint" aria-hidden="true" />
                  {t.filters.minRating}
                </label>
                <input
                  id="filter-vote"
                  type="number"
                  placeholder="7.0"
                  min="0"
                  max="10"
                  step="0.1"
                  value={minVote}
                  onChange={(e) => setMinVote(e.target.value)}
                  className={`${fieldClass} tabular`}
                />
              </div>
            </div>

            {/* Genres */}
            <div className="space-y-3">
              <h4 className={labelClass}>Genres</h4>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => {
                  const active = genres.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleGenre(g.id)}
                      aria-pressed={active}
                      className={`px-3 py-1.5 text-sm font-semibold border transition-colors duration-150 ${
                        active
                          ? "bg-brand text-white border-screen"
                          : "text-dim border-rule-strong hover:text-screen hover:border-screen"
                      }`}
                    >
                      {t.genres[g.nameKey]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
