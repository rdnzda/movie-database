"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTrendingMovies } from "../../services/api";
import { Spinner } from "../ui";
import { LittleMediaCard } from "../cards";
import SimpleBar from "simplebar-react";

export default function TrendingMoviesGallery({ timeWindow = "day" }) {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const loadTrendingMovies = async () => {
      try {
        setLoading(true);
        const movies = await getTrendingMovies(timeWindow);
        setTrendingMovies(movies);
      } catch (err) {
        setError(t.errors.loadMovies);
      } finally {
        setLoading(false);
      }
    };
    loadTrendingMovies();
  }, [timeWindow]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="w-full max-w-[1240px] mx-auto mb-4 px-4 sm:px-8 flex items-center gap-4">
        <h3 className="font-display font-semibold text-2xl leading-none text-screen">{t.navigation.films}</h3>
        <span className="flex-1 h-px bg-rule" aria-hidden="true" />
        </div>
        <div className="max-w-[1240px] mx-auto flex items-center justify-center min-h-[260px] px-4 sm:px-8">
          <div className="flex items-center gap-4 text-dim text-sm">
            <Spinner size={20} className="border-2" /> {t.loading.movies}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="w-full max-w-[1240px] mx-auto mb-4 px-4 sm:px-8 flex items-center gap-4">
        <h3 className="font-display font-semibold text-2xl leading-none text-screen">{t.navigation.films}</h3>
        <span className="flex-1 h-px bg-rule" aria-hidden="true" />
        </div>
        <div className="max-w-[1240px] mx-auto flex items-center justify-center min-h-[260px] px-4 sm:px-8">
          <p className="text-rouge text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-[1240px] mx-auto mb-4 px-4 sm:px-8 flex items-center gap-4">
        <h3 className="font-display font-semibold text-2xl leading-none text-screen">{t.navigation.films}</h3>
        <span className="flex-1 h-px bg-rule" aria-hidden="true" />
      </div>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        <SimpleBar autoHide={false} className="w-full">
          <ol className="flex gap-4 sm:gap-5 pb-4">
            {trendingMovies.map((movie, index) => (
              <li key={`movie-${movie.id}`} className="flex-none">
                <LittleMediaCard rank={index + 1} media={movie} mediaType="movie" />
              </li>
            ))}
          </ol>
        </SimpleBar>
      </div>
    </div>
  );
}
