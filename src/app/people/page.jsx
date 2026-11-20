"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, User } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { searchPeople } from "../../services/api";
import { Footer, Loader, NavBar } from "../../components";

function PeoplePageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(!!initialQuery);
  const { t } = useLanguage();

  useEffect(() => {
    setQuery(initialQuery);
    if (initialQuery.trim()) {
      setLoading(true);
      searchPeople(initialQuery)
        .then((data) => {
          setResults(data || []);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      setLoading(true);
      searchPeople(q)
        .then((data) => setResults(data || []))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
      window.history.replaceState(null, "", `/people?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-ink text-screen">
      <NavBar />
      <main className="flex-1 pt-16 sm:pt-[76px] pb-16">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
          <div className="pt-10 sm:pt-12 pb-8 grid gap-6 lg:grid-cols-[1fr_minmax(0,32rem)] lg:items-end">
            <div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl leading-[1.05] text-screen">
                {t.navigation.distribution}
              </h1>
              <p className="mt-3 font-medium text-dim text-lg sm:text-xl">
                {t.search.searchPeoplePlaceholder}
              </p>
            </div>

            <form onSubmit={handleSubmit} role="search">
              <div className="flex items-stretch bg-ink-2 rounded-md overflow-hidden border border-rule-strong focus-within:border-screen transition-colors">
                <div className="flex items-center justify-center w-11 text-faint" aria-hidden="true">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.search.searchPeoplePlaceholder}
                  className="flex-1 min-w-0 h-12 pr-2 bg-transparent text-screen placeholder:text-faint outline-none focus-visible:outline-none text-base"
                  aria-label={t.search.searchPeoplePlaceholder}
                />
                <button
                  type="submit"
                  disabled={!query.trim()}
                  className="px-4 sm:px-6 font-semibold rounded-md bg-brand text-white hover:bg-blue-500 disabled:bg-ink-3 disabled:text-faint disabled:cursor-not-allowed text-sm transition-colors"
                >
                  {t.actions.search}
                </button>
              </div>
            </form>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader />
            </div>
          ) : results.length === 0 && query.trim() ? (
            <div className="py-8">
              <p className="text-screen font-semibold text-lg">{t.search.noResults}</p>
              <p className="text-faint text-sm mt-1">{t.search.searchPeoplePlaceholder}</p>
            </div>
          ) : results.length === 0 && !query.trim() ? (
            <p className="text-faint text-sm py-8">
              {t.search.searchPeoplePlaceholder}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-5 gap-y-7">
              {results.map((person) => (
                <Link
                  key={person.id}
                  href={`/person/${person.id}`}
                  className="group flex flex-col"
                >
                  <div className="aspect-[2/3] overflow-hidden rounded-md bg-ink-3 outline outline-1 -outline-offset-1 outline-white/10 group-hover:outline-screen transition-[outline-color]">
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                        alt={person.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-rule-strong" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="pt-2.5">
                    <h2 className="font-semibold text-screen text-sm leading-snug line-clamp-2 group-hover:underline underline-offset-2 decoration-brand-light">
                      {person.name}
                    </h2>
                    {person.known_for_department && (
                      <p className="text-xs text-faint mt-0.5">
                        {person.known_for_department}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PeoplePage() {
  return (
    <Suspense fallback={<Loader />}>
      <PeoplePageContent />
    </Suspense>
  );
}
