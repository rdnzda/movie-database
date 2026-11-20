"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { MediaCard } from "../cards";
import { Spinner, SkeletonGrid } from "../ui";
import { useMemo } from "react";

/**
 * Galerie de médias générique
 * Affiche une grille de cartes avec pagination et gestion d'états
 */
export default function MediaGallery({ 
  items = [], 
  pageLoading, 
  loadingMore, 
  error, 
  onLoadMore, 
  canLoadMore, 
  title,
  mediaType = "movie" 
}) {
  const { t } = useLanguage();

  // Déduplication des éléments par id (évite les warnings React keys dupliquées)
  const uniqueItems = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const it of items) {
      if (it && it.id != null && !seen.has(it.id)) {
        seen.add(it.id);
        result.push(it);
      }
    }
    if (process.env.NODE_ENV !== 'production' && result.length !== items.length) {
      console.debug('[MediaGallery] duplicates removed', { before: items.length, after: result.length });
    }
    return result;
  }, [items]);

  if (pageLoading) {
    return (
      <div className="flex flex-col gap-10 w-full">
        <SkeletonGrid />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-6 pb-14 w-full">
      {/* Titre */}
      {title && (
        <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight">{title}</h2>
      )}

      {/* Grille de cartes responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-5 gap-y-7 animate-[fadeIn_0.4s_ease] w-full">
        {uniqueItems.map((item, index) => (
          <MediaCard
            media={item}
            key={item.id}
            mediaType={mediaType}
          />
        ))}
      </div>

      {/* Bouton "Charger plus" */}
      {canLoadMore && (
        <button
          className="px-7 py-3 cursor-pointer rounded-md border border-rule-strong text-screen font-semibold hover:bg-brand hover:text-white hover:border-brand mx-auto flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait transition-colors duration-150 text-sm"
          onClick={onLoadMore}
          disabled={loadingMore}
          aria-label={loadingMore ? t.loading.more : t.actions.loadMore}
        >
          {loadingMore && <Spinner size={16} className="border-2" />}
          {loadingMore ? t.loading.more : t.actions.loadMore}
        </button>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="text-brand-light border border-brand-light/50 px-4 py-3 m-auto text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
