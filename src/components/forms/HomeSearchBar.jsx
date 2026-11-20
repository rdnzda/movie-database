"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, Film, Tv, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../contexts/LanguageContext";
import { searchAllWithPeople } from "../../services/api";

/**
 * Barre de recherche moderne pour la page d'accueil
 * Champ sobre à filet, suggestions en temps réel
 */
export default function HomeSearchBar({ variant = 'contrast', onSuggestionsChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();
  const searchTimeout = useRef(null);
  const suggestionsRef = useRef(null);

  // Notifier le parent quand l'état des suggestions change
  useEffect(() => {
    const hasActiveSuggestions = showSuggestions && suggestions.length > 0;
    if (onSuggestionsChange) {
      onSuggestionsChange(hasActiveSuggestions);
    }
  }, [showSuggestions, suggestions.length, onSuggestionsChange]);

  // Fonction de recherche avec debouncing
  const searchSuggestions = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const results = await searchAllWithPeople(query);
      const topResults = results.all.slice(0, 10);
      setSuggestions(topResults);
      if (topResults.length > 0) {
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Erreur de recherche:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour le debouncing de la recherche
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchSuggestions(searchQuery);
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  // Fermer les suggestions en cliquant ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/people?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (item) => {
    const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
    const id = item.id;

    setShowSuggestions(false);
    setSearchQuery("");
    setSuggestions([]);
    setIsFocused(false);

    if (mediaType === 'person') {
      router.push(`/person/${id}`);
    } else {
      const path = mediaType === 'tv' ? 'series' : mediaType;
      router.push(`/${path}/${id}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).getFullYear();
  };

  const getTitle = (item) => {
    return item.title || item.name;
  };

  const getReleaseDate = (item) => {
    return item.release_date || item.first_air_date;
  };

  const getMediaType = (item) => {
    return item.media_type || (item.title ? 'movie' : 'tv');
  };

  const isPerson = (item) => getMediaType(item) === 'person';

  const typeLabel = (item) =>
    isPerson(item) ? t.search.person : getMediaType(item) === 'movie' ? t.search.film : t.search.seriesLabel;

  return (
    <div className="w-full" ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="w-full" role="search">
        <div className="relative">
          <div className={`
            relative flex items-stretch
            bg-ink-2 border transition-colors duration-150
            ${isFocused ? 'border-screen' : 'border-rule-strong'}
          `}>
            <div className="flex items-center justify-center w-11 sm:w-12 flex-shrink-0" aria-hidden="true">
              <Search className={`w-5 h-5 ${loading ? 'text-rouge' : 'text-faint'}`} />
            </div>

            <input
              type="text"
              placeholder={t.search.homePlaceholder}
              className="flex-1 min-w-0 h-13 sm:h-14 pr-2 text-base bg-transparent text-screen placeholder:text-faint outline-none focus-visible:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setIsFocused(true);
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
              onBlur={() => setIsFocused(false)}
              aria-label="Rechercher des films et séries"
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="flex items-center justify-center w-13 sm:w-14 flex-shrink-0 bg-rouge text-ink hover:bg-screen transition-colors disabled:bg-ink-3 disabled:text-faint disabled:cursor-not-allowed"
              aria-label={t.actions.search}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 z-[100] bg-ink-2 border border-rule-strong">
              <div className="max-h-96 overflow-y-auto divide-y divide-rule">
                {suggestions.map((item) => (
                  <button
                    key={`${getMediaType(item)}-${item.id}`}
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-screen hover:bg-ink-3 transition-colors"
                  >
                    <div className={`flex-shrink-0 overflow-hidden bg-ink-3 ${isPerson(item) ? 'w-10 h-10' : 'w-10 h-[60px]'}`}>
                      {isPerson(item) ? (
                        item.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${item.profile_path}`}
                            alt={getTitle(item)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-5 h-5 text-faint" aria-hidden="true" />
                          </div>
                        )
                      ) : item.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                          alt={`Affiche : ${getTitle(item)}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {getMediaType(item) === 'movie' ? (
                            <Film className="w-5 h-5 text-faint" aria-hidden="true" />
                          ) : (
                            <Tv className="w-5 h-5 text-faint" aria-hidden="true" />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{getTitle(item)}</h3>
                      <p className="text-xs text-faint truncate tabular">
                        <span className={isPerson(item) ? 'text-dim' : 'text-rouge'}>{typeLabel(item)}</span>
                        {isPerson(item) ? (
                          item.known_for_department && <> · {item.known_for_department}</>
                        ) : (
                          <>
                            {getReleaseDate(item) && <> · {formatDate(getReleaseDate(item))}</>}
                            {item.vote_average > 0 && <> · {Math.round(item.vote_average * 10) / 10}/10</>}
                          </>
                        )}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="px-3 py-2 text-xs text-faint border-t border-rule">
                Appuyez sur Entrée pour voir tous les résultats
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
