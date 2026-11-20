"use client";

import { FaStar } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
  formatNote,
  formatDateEnglish,
  getMediaTitle,
  getMediaReleaseDate,
  getTMDBImageUrl,
  getPlaceholderImage
} from "../../services/utils/formatters.js";

/**
 * Composant de carte média principal
 * Affiche une carte de film ou série avec poster, note, titre et date
 * Fiche à filet : l'affiche d'abord, puis titre / date / note alignés.
 */
export default function MediaCard({ media, mediaType = "movie" }) {
  const router = useRouter();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    // TODO: Implémenter la logique des favoris
    alert("Favori cliqué");
  };

  const handleCardClick = () => {
    router.push(`/${mediaType}/${media.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  const title = getMediaTitle(media, mediaType);
  const releaseDate = getMediaReleaseDate(media, mediaType);
  const posterUrl = getTMDBImageUrl(media.poster_path, 'w342') || getPlaceholderImage(200, 300);

  return (
    <div
      className="group flex flex-col w-full cursor-pointer"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={title}
    >
      {/* Poster */}
      <div className="relative w-full aspect-[2/3] overflow-hidden rounded-md bg-ink-3 outline outline-1 -outline-offset-1 outline-white/10 group-hover:outline-screen transition-[outline-color] duration-150">
        <img
          alt={`Affiche : ${title}`}
          src={posterUrl}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="movie-overlay">
          <button
            className="favorite-btn"
            onClick={handleFavoriteClick}
            aria-label="Ajouter aux favoris"
          />
        </div>
      </div>

      {/* Informations */}
      <div className="pt-2.5 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold leading-snug text-screen line-clamp-2 group-hover:underline underline-offset-2 decoration-brand-light">
          {title}
        </h3>
        <div className="mt-auto pt-1 flex items-center justify-between gap-2 text-xs tabular">
          <span className="text-faint">{formatDateEnglish(releaseDate)}</span>
          <span className="flex items-center gap-1 text-screen font-semibold">
            <FaStar className="text-brand-light text-[0.65rem]" aria-hidden="true" />
            {formatNote(media.vote_average)}
          </span>
        </div>
      </div>
    </div>
  );
}
