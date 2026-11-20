"use client";

import Link from "next/link";
import {
  formatDateEnglish,
  getMediaTitle,
  getMediaReleaseDate,
  getTMDBImageUrl,
  getPlaceholderImage
} from "../../services/utils/formatters.js";

/**
 * Version compacte de la carte média
 * Pour les affichages en bande défilante (tendances)
 * Numérotée comme une séance du programme quand `rank` est fourni.
 */
export default function LittleMediaCard({ media, mediaType = "movie", rank }) {
  const title = getMediaTitle(media, mediaType);
  const releaseDate = getMediaReleaseDate(media, mediaType);
  const posterUrl = getTMDBImageUrl(media.poster_path, 'w342') || getPlaceholderImage(200, 300, 'No Image');

  return (
    <Link
      href={`/${mediaType}/${media.id}`}
      className="group flex-none w-[140px] sm:w-[164px] flex flex-col"
    >
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-md bg-gray-200 ring-1 ring-black/5 group-hover:ring-2 group-hover:ring-brand transition-shadow duration-150">
        <img
          alt={`Affiche : ${title}`}
          src={posterUrl}
          className="absolute inset-0 w-full h-full object-cover select-none"
          loading="lazy"
        />
      </div>

      <div className="flex gap-2.5 pt-2.5 w-full">
        {rank != null && (
          <span className="font-display font-bold text-2xl leading-none text-brand tabular flex-shrink-0" aria-hidden="true">
            {String(rank).padStart(2, "0")}
          </span>
        )}
        <div className="min-w-0">
          <h3 className="text-sm font-bold leading-snug text-gray-900 line-clamp-2 group-hover:text-brand">
            {title}
          </h3>
          {releaseDate && <p className="text-xs text-gray-600 tabular mt-0.5">{formatDateEnglish(releaseDate)}</p>}
        </div>
      </div>
    </Link>
  );
}
