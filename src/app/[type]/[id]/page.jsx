"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaStar, FaArrowLeft, FaCalendarAlt, FaClock, FaPlay, FaTimes, FaUser } from "react-icons/fa";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getMovieDetails, getSeriesDetails, getMovieCredits, getSeriesCredits, getMovieVideos, getSeriesVideos, getMovieReviews, getSeriesReviews } from "../../../services/api";
import { Footer, Loader } from "../../../components";
import { NavBar } from "../../../components";

export default function MediaDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const [media, setMedia] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [reviewsToShow, setReviewsToShow] = useState(5);
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all', 'positive', 'negative'
  const [reviewSort, setReviewSort] = useState('newest'); // 'newest', 'oldest', 'rating_high', 'rating_low'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { type, id } = params;
  const isMovie = type === "movie";

  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer les détails du media
        const mediaData = isMovie 
          ? await getMovieDetails(id, language)
          : await getSeriesDetails(id, language);

        // Récupérer les crédits (casting)
        const creditsData = isMovie 
          ? await getMovieCredits(id)
          : await getSeriesCredits(id);

        // Récupérer les vidéos/trailers
        const videosData = isMovie 
          ? await getMovieVideos(id)
          : await getSeriesVideos(id);

        // Récupérer les avis
        const reviewsData = isMovie 
          ? await getMovieReviews(id)
          : await getSeriesReviews(id);

        setMedia(mediaData);
        setCredits(creditsData);
        setVideos(videosData); // videosData est déjà un array selon votre API
        setReviews(reviewsData);
        setAllReviews(reviewsData || []);
        setFilteredReviews(reviewsData || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && type) {
      fetchMediaDetails();
    }
  }, [id, type, language, isMovie]);

  // Fermer le modal avec Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowTrailer(false);
      }
    };

    if (showTrailer) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showTrailer]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const formatNote = (note) => {
    return Math.round(note * 10) / 10;
  };

  const toggleReviewExpansion = (reviewId) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const renderStars = (rating) => {
    const stars = [];
    const normalizedRating = rating / 2; // TMDB utilise /10, nous voulons /5
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={`${i <= normalizedRating ? 'text-brand-light' : 'text-rule-strong'} text-xs`} 
          aria-hidden="true"
        />
      );
    }
    return stars;
  };

  // Fonction pour filtrer et trier les avis
  const filterAndSortReviews = (reviewsData, filter, sort) => {
    let filtered = [...reviewsData];

    // Filtrage par note
    if (filter === 'positive') {
      filtered = filtered.filter(review => 
        review.author_details?.rating && review.author_details.rating >= 6
      );
    } else if (filter === 'negative') {
      filtered = filtered.filter(review => 
        review.author_details?.rating && review.author_details.rating < 6
      );
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'rating_high':
          const ratingA = a.author_details?.rating || 0;
          const ratingB = b.author_details?.rating || 0;
          return ratingB - ratingA;
        case 'rating_low':
          const ratingA2 = a.author_details?.rating || 0;
          const ratingB2 = b.author_details?.rating || 0;
          return ratingA2 - ratingB2;
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    return filtered;
  };

  // Effet pour filtrer et trier les avis quand les filtres changent
  useEffect(() => {
    if (allReviews.length > 0) {
      const filtered = filterAndSortReviews(allReviews, reviewFilter, reviewSort);
      setFilteredReviews(filtered);
    }
  }, [allReviews, reviewFilter, reviewSort]);

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <Loader />
    </div>
  );
  
  if (error) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display font-bold text-4xl text-screen mb-6">{t.errors.loadingError}</h1>
          <button 
            onClick={() => router.back()}
            className="rounded-md bg-brand text-white font-semibold px-6 py-2.5 hover:bg-blue-500 transition-colors"
          >
            {t.actions.goBack}
          </button>
        </div>
      </div>
    );
  }

  if (!media) return null;

  const title = isMovie ? media.title : media.name;
  const releaseDate = isMovie ? media.release_date : media.first_air_date;
  const backdrop = media.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${media.backdrop_path}`
    : null;

  // Préférer une vidéo de type "Trailer" pour l'affichage
  const trailerVideo = videos?.length > 0
    ? videos.find((v) => v.type === "Trailer" && v.site === "YouTube") || videos[0]
    : null;

  const backButton = (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 bg-ink/80 hover:bg-brand hover:text-white hover:border-brand text-screen rounded-md border border-rule-strong px-3 sm:px-4 py-2 text-sm font-semibold transition-colors"
      aria-label={t.actions.goBack}
    >
      <FaArrowLeft className="text-xs" aria-hidden="true" />
      <span className="hidden sm:inline">{t.actions.goBack}</span>
    </button>
  );

  const trailerButton = trailerVideo && (
    <button
      onClick={() => setShowTrailer(true)}
      className="inline-flex items-center gap-2.5 rounded-md bg-brand text-white hover:bg-blue-500 px-4 sm:px-5 py-2.5 font-semibold text-sm sm:text-base transition-colors"
      aria-label={t.details.watchTrailer}
    >
      <FaPlay className="text-xs" aria-hidden="true" />
      <span>{t.details.watchTrailer}</span>
    </button>
  );

  // Fiche technique (lignes du programme)
  const factRow = "grid grid-cols-[7rem_1fr] sm:grid-cols-[9rem_1fr] lg:grid-cols-1 gap-x-3 gap-y-0.5 py-2";
  const factLabel = "text-sm text-faint";
  const factValue = "text-sm sm:text-base text-screen";

  const sectionTitle = "font-display font-bold text-3xl sm:text-4xl leading-tight text-screen";

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <NavBar />
      <div className="relative pt-16 sm:pt-[76px] pb-16 flex-1 bg-ink text-screen">
        {/* Image de fond */}
        {backdrop ? (
          <div className="relative h-[34vh] sm:h-[46vh] max-h-[560px] overflow-hidden">
            <img
              src={backdrop}
              alt=""
              className="w-full h-full object-cover object-[center_30%]"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-ink/45" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink to-transparent" />
            <div className="absolute top-4 inset-x-0 z-20">
              <div className="max-w-[1240px] mx-auto px-4 sm:px-8">{backButton}</div>
            </div>
          </div>
        ) : (
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-6 pb-24">{backButton}</div>
        )}

        {/* Contenu principal */}
        <div className="relative -mt-20 sm:-mt-28 z-10">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[13rem_1fr] lg:grid-cols-[18rem_1fr] gap-4 sm:gap-8 lg:gap-12 items-start">
              {/* Poster */}
              <div>
                <img
                  src={
                    media.poster_path
                      ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
                      : 'https://placehold.co/300x450@2x.png'
                  }
                  alt={`Affiche : ${title}`}
                  className="w-full h-auto aspect-[2/3] object-cover bg-ink-3 outline outline-1 -outline-offset-1 outline-white/15"
                  fetchPriority="high"
                />
              </div>

              {/* Informations */}
              <div className="min-w-0 pt-14 sm:pt-20 lg:pt-24">
                <h1 className="font-display font-bold text-[1.75rem] sm:text-4xl lg:text-5xl leading-[1.05] text-screen break-words">{title}</h1>
                {media.tagline && (
                  <p className="mt-3 font-medium text-lg sm:text-2xl text-dim leading-snug">{media.tagline}</p>
                )}

                {/* Note */}
                <div className="mt-4 sm:mt-6 flex items-baseline gap-2 tabular">
                  <span className="font-display font-bold text-3xl sm:text-4xl leading-tight text-brand-light">{formatNote(media.vote_average)}</span>
                  <span className="text-sm text-faint">/10</span>
                  <span className="text-sm text-faint hidden sm:inline ml-2">{media.vote_count} {t.details.votes}</span>
                </div>

                {/* Bouton Trailer desktop */}
                {trailerVideo && (
                  <div className="hidden sm:block mt-6">{trailerButton}</div>
                )}
              </div>
            </div>

            {/* Bouton Trailer mobile */}
            {trailerVideo && (
              <div className="sm:hidden mt-5">{trailerButton}</div>
            )}

            {/* Fiche + synopsis */}
            <div className="mt-10 sm:mt-14 grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-12">
              <dl className="bg-ink-2 rounded-md px-5 py-3 self-start">
                <div className={factRow}>
                  <dt className={factLabel}>{isMovie ? t.meta.releaseDate : t.meta.firstAirDate}</dt>
                  <dd className={`${factValue} tabular`}>
                    {formatDate(releaseDate)}
                    {isMovie && media.runtime ? (
                      <span className="block text-dim"><FaClock className="inline -mt-0.5 mr-1.5 text-faint text-xs" aria-hidden="true" />{formatRuntime(media.runtime)}</span>
                    ) : null}
                    {!isMovie && media.number_of_seasons ? (
                      <span className="block text-dim"><FaCalendarAlt className="inline -mt-0.5 mr-1.5 text-faint text-xs" aria-hidden="true" />{media.number_of_seasons} {t.details.seasons}</span>
                    ) : null}
                  </dd>
                </div>
                <div className={`${factRow} sm:hidden`}>
                  <dt className={factLabel}>{t.meta.rating}</dt>
                  <dd className={`${factValue} tabular`}>{media.vote_count} {t.details.votes}</dd>
                </div>
                {media.genres && media.genres.length > 0 && (
                  <div className={factRow}>
                    <dt className={factLabel}>Genres</dt>
                    <dd className={factValue}>{media.genres.map((g) => g.name).join(", ")}</dd>
                  </div>
                )}
                {media.production_countries && media.production_countries.length > 0 && (
                  <div className={factRow}>
                    <dt className={factLabel}>{t.details.countries}</dt>
                    <dd className={factValue}>{media.production_countries.map((c) => c.name).join(", ")}</dd>
                  </div>
                )}
              </dl>

              {media.overview && (
                <section>
                  <h2 className={`${sectionTitle} mb-4`}>{t.details.synopsis}</h2>
                  <p className="text-dim text-base sm:text-lg leading-relaxed max-w-[68ch]">{media.overview}</p>
                </section>
              )}
            </div>

            {/* Section Distribution (réalisateurs + casting) */}
            {credits && (credits.cast?.length > 0 || credits.crew?.length > 0) && (() => {
              const directors = (credits.crew || []).filter((c) => c.job === "Director");
              const directorsUnique = directors.filter((d, i, arr) => arr.findIndex((x) => x.id === d.id) === i);
              const cast = credits.cast || [];
              const CastCard = ({ person, sublabel, className = "" }) => (
                <Link
                  href={`/person/${person.id}`}
                  className={`group flex flex-col ${className}`}
                >
                  <div className="aspect-[3/4] overflow-hidden rounded-md bg-ink-3 outline outline-1 -outline-offset-1 outline-white/10 group-hover:outline-screen transition-[outline-color]">
                    <img
                      src={
                        person.profile_path
                          ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                          : "https://placehold.co/185x278@2x.png"
                      }
                      alt={person.name}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 transition-[filter]"
                    />
                  </div>
                  <h3 className="mt-2 font-semibold text-screen text-sm leading-snug line-clamp-2 group-hover:underline underline-offset-2 decoration-brand-light">
                    {person.name}
                  </h3>
                  {sublabel && (
                    <p className="text-xs text-faint line-clamp-2 mt-0.5">{sublabel}</p>
                  )}
                </Link>
              );

              return (
                <section className="mt-16 sm:mt-20">
                  {/* Réalisateurs */}
                  {directorsUnique.length > 0 && (
                    <div className="mb-12">
                      <h2 className={`${sectionTitle} mb-6`}>{t.details.directors}</h2>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-6">
                        {directorsUnique.slice(0, 8).map((d) => (
                          <CastCard key={d.id} person={d} sublabel={d.job} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Distribution (casting) */}
                  {cast.length > 0 && (
                    <div>
                      <h2 className={`${sectionTitle} mb-6`}>{t.details.cast}</h2>
                      <div className="hidden sm:grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 gap-x-4 gap-y-6">
                        {cast.slice(0, 18).map((actor) => (
                          <CastCard key={actor.id} person={actor} sublabel={actor.character} />
                        ))}
                      </div>

                      {/* Mobile: accordéon distribution */}
                      <div className="sm:hidden">
                        <details className="group/details">
                          <summary className="list-none cursor-pointer flex items-center justify-between border-y border-rule py-3 text-screen font-semibold">
                            <span>{t.details.viewCast}</span>
                            <svg
                              className="w-4 h-4 text-faint transition-transform duration-200 group-open/details:rotate-180"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </summary>
                          <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-5">
                            {cast.slice(0, 12).map((actor) => (
                              <CastCard key={actor.id} person={actor} sublabel={actor.character} />
                            ))}
                          </div>
                        </details>
                      </div>
                    </div>
                  )}
                </section>
              );
            })()}

            {/* Section Avis */}
            {allReviews && allReviews.length > 0 && (
              <section className="mt-16 sm:mt-20">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-6 gap-4">
                  <div>
                    <h2 className={sectionTitle}>{t.details.reviews}</h2>
                    <p className="mt-2 text-sm text-faint tabular">
                      {t.reviewsSystem.stats.showing} {Math.min(reviewsToShow, filteredReviews.length)} {t.reviewsSystem.stats.of} {filteredReviews.length} ({allReviews.length} {t.reviewsSystem.stats.total})
                    </p>
                  </div>

                  {/* Contrôles de filtrage */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:min-w-[30rem]">
                    <div className="flex-1">
                      <label htmlFor="review-filter" className="block text-xs font-semibold text-faint mb-1.5">
                        {t.reviewsSystem.filterBy}
                      </label>
                      <select
                        id="review-filter"
                        value={reviewFilter}
                        onChange={(e) => setReviewFilter(e.target.value)}
                        className="w-full bg-ink rounded-md border border-rule-strong px-3 py-2 text-sm text-screen hover:border-dim focus:border-screen"
                      >
                        <option value="all">{t.reviewsSystem.filters.all}</option>
                        <option value="positive">{t.reviewsSystem.filters.positive}</option>
                        <option value="negative">{t.reviewsSystem.filters.negative}</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label htmlFor="review-sort" className="block text-xs font-semibold text-faint mb-1.5">
                        {t.reviewsSystem.sortBy}
                      </label>
                      <select
                        id="review-sort"
                        value={reviewSort}
                        onChange={(e) => setReviewSort(e.target.value)}
                        className="w-full bg-ink rounded-md border border-rule-strong px-3 py-2 text-sm text-screen hover:border-dim focus:border-screen"
                      >
                        <option value="newest">{t.reviewsSystem.sorts.newest}</option>
                        <option value="oldest">{t.reviewsSystem.sorts.oldest}</option>
                        <option value="rating_high">{t.reviewsSystem.sorts.rating_high}</option>
                        <option value="rating_low">{t.reviewsSystem.sorts.rating_low}</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-8">
                  {filteredReviews.slice(0, reviewsToShow).map((review) => (
                    <article key={review.id} className="grid sm:grid-cols-[14rem_1fr] gap-3 sm:gap-8">
                      <header className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2">
                        <div className="w-10 h-10 bg-ink-3 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {review.author_details?.avatar_path && !review.author_details.avatar_path.includes('gravatar') ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`}
                              alt={review.author}
                              className="w-10 h-10 object-cover"
                            />
                          ) : (
                            <FaUser className="text-faint" aria-hidden="true" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-screen truncate">{review.author}</h3>
                          <p className="text-xs text-faint tabular">{formatDate(review.created_at)}</p>
                          {review.author_details?.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(review.author_details.rating)}
                              <span className="text-xs text-dim ml-1 tabular">
                                ({review.author_details.rating}/10)
                              </span>
                            </div>
                          )}
                        </div>
                      </header>
                      
                      <div className="text-dim max-w-[70ch]">
                        {review.content.length > 300 ? (
                          <div>
                            <p className="leading-relaxed whitespace-pre-line">
                              {expandedReviews.has(review.id) 
                                ? review.content 
                                : `${review.content.substring(0, 300)}...`
                              }
                            </p>
                            <button
                              onClick={() => toggleReviewExpansion(review.id)}
                              className="text-screen underline underline-offset-2 decoration-brand-light hover:text-brand-light text-sm mt-2 font-semibold transition-colors"
                            >
                              {expandedReviews.has(review.id) ? t.details.readLess : t.details.readMore}
                            </button>
                          </div>
                        ) : (
                          <p className="leading-relaxed whitespace-pre-line">{review.content}</p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>

                {/* Boutons de pagination */}
                {filteredReviews.length > reviewsToShow && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setReviewsToShow(prev => prev + 5)}
                      className="rounded-md border border-rule-strong text-screen hover:bg-brand hover:text-white hover:border-brand px-6 py-3 font-semibold text-sm transition-colors"
                    >
                      {t.reviewsSystem.showMore}
                    </button>
                  </div>
                )}

                {reviewsToShow > 5 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => setReviewsToShow(5)}
                      className="text-dim hover:text-screen text-sm transition-colors"
                    >
                      {t.reviewsSystem.showLess}
                    </button>
                  </div>
                )}

                {filteredReviews.length === 0 && allReviews.length > 0 && (
                  <div className="py-8">
                    <p className="text-dim">{t.reviewsSystem.noReviewsWithFilters}</p>
                  </div>
                )}
              </section>
            )}

            {allReviews && allReviews.length === 0 && (
              <section className="mt-16 sm:mt-20">
                <h2 className={`${sectionTitle} mb-4`}>{t.details.reviews}</h2>
                <p className="text-dim font-medium text-lg">{t.details.noReviews}</p>
              </section>
            )}
          </div>
        </div>

        {/* Modal Trailer */}
        {showTrailer && trailerVideo && (
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={t.details.watchTrailer}
            onClick={(e) => e.target === e.currentTarget && setShowTrailer(false)}
          >
            <div className="relative w-full max-w-5xl">
              <button
                type="button"
                onClick={() => setShowTrailer(false)}
                className="absolute -top-12 right-0 z-10 flex items-center justify-center w-10 h-10 text-screen hover:text-brand-light transition-colors"
                aria-label={t.actions.goBack}
              >
                <FaTimes className="text-2xl" aria-hidden="true" />
              </button>
              <div className="relative w-full overflow-hidden border border-rule" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1`}
                  title={t.details.watchTrailer}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
