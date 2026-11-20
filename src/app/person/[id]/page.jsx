"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaFilm, FaTv } from "react-icons/fa";
import { useLanguage } from "../../../contexts/LanguageContext";
import { getPersonDetails, getPersonCombinedCredits } from "../../../services/api";
import { Footer, Loader } from "../../../components";
import { NavBar } from "../../../components";

function getMediaUrl(mediaType, mediaId) {
  return mediaType === "tv" ? `/series/${mediaId}` : `/movie/${mediaId}`;
}

function getMediaTitle(item) {
  return item.title || item.name || "";
}

function getMediaDate(item) {
  return item.release_date || item.first_air_date || "";
}

export default function PersonPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useLanguage();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = params;

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        setLoading(true);
        setError(null);
        const [personData, creditsData] = await Promise.all([
          getPersonDetails(id, language),
          getPersonCombinedCredits(id),
        ]);
        setPerson(personData);
        setCredits(creditsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPerson();
  }, [id, language]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === "fr" ? "fr-FR" : language === "es" ? "es-ES" : "en-US",
      { year: "numeric" }
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <Loader />
      </div>
    );

  if (error) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display font-extrabold text-4xl text-screen mb-6">{t.errors.loadingError}</h1>
          <button
            onClick={() => router.back()}
            className="bg-rouge text-ink font-semibold px-6 py-2.5 hover:bg-screen transition-colors"
          >
            {t.actions.goBack}
          </button>
        </div>
      </div>
    );
  }

  if (!person) return null;

  const profileUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
    : null;

  const castList = [...(credits?.cast || [])];
  const crewList = [...(credits?.crew || [])];
  const allCredits = [...castList, ...crewList]
    .filter((c) => (c.poster_path || c.backdrop_path) && (c.title || c.name))
    .sort((a, b) => {
      const dateA = getMediaDate(a) || "0000";
      const dateB = getMediaDate(b) || "0000";
      return dateB.localeCompare(dateA);
    });

  const seenIds = new Set();
  const uniqueCredits = allCredits.filter((c) => {
    const key = `${c.media_type}-${c.id}`;
    if (seenIds.has(key)) return false;
    seenIds.add(key);
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-ink">
      <NavBar />
      <div className="relative pt-16 sm:pt-[76px] pb-16 flex-1 bg-ink text-screen">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 border border-rule-strong text-screen hover:bg-screen hover:text-ink px-3 sm:px-4 py-2 text-sm font-semibold transition-colors mb-8"
            aria-label={t.actions.goBack}
          >
            <FaArrowLeft className="text-xs" aria-hidden="true" />
            <span className="hidden sm:inline">{t.actions.goBack}</span>
          </button>

          <div className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[13rem_1fr] lg:grid-cols-[18rem_1fr] gap-4 sm:gap-8 lg:gap-12 items-start">
            <div className="w-full aspect-[2/3] overflow-hidden bg-ink-3 outline outline-1 -outline-offset-1 outline-white/15">
              {profileUrl ? (
                <img
                  src={profileUrl}
                  alt={person.name}
                  className="w-full h-full object-cover"
                  fetchPriority="high"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-faint">
                  <span className="font-display text-5xl">?</span>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h1 className="font-display font-extrabold text-[2.1rem] sm:text-5xl lg:text-7xl leading-[0.9] text-screen break-words">
                {person.name}
              </h1>
              {person.known_for_department && (
                <p className="mt-3 font-serif italic text-lg sm:text-2xl text-dim">
                  {t.person.knownFor} : {person.known_for_department}
                </p>
              )}

              {person.biography && (
                <section className="hidden sm:block mt-8">
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-none text-screen mb-4">
                    {t.person.biography}
                  </h2>
                  <p className="text-dim leading-relaxed text-base whitespace-pre-line max-w-[68ch]">
                    {person.biography}
                  </p>
                </section>
              )}

              {!person.biography && (
                <p className="hidden sm:block mt-8 text-faint text-sm">{t.person.noBiography}</p>
              )}
            </div>
          </div>

          {/* Biographie mobile, pleine largeur */}
          <div className="sm:hidden mt-8">
            {person.biography ? (
              <section>
                <h2 className="font-display font-extrabold text-3xl leading-none text-screen mb-3">
                  {t.person.biography}
                </h2>
                <p className="text-dim leading-relaxed text-base whitespace-pre-line line-clamp-[12]">
                  {person.biography}
                </p>
              </section>
            ) : (
              <p className="text-faint text-sm">{t.person.noBiography}</p>
            )}
          </div>

          {uniqueCredits.length > 0 && (
            <section className="mt-14 sm:mt-20 pt-8 border-t border-rule-strong">
              <h2 className="font-display font-extrabold text-4xl sm:text-5xl leading-none text-screen mb-6">
                {t.person.knownFor}
              </h2>
              <ol className="border-t border-rule">
                {uniqueCredits.slice(0, 24).map((item) => {
                  const mediaType = item.media_type;
                  const mediaId = item.id;
                  const href = getMediaUrl(mediaType, mediaId);
                  const posterPath = item.poster_path || item.backdrop_path;
                  const posterUrl = posterPath
                    ? `https://image.tmdb.org/t/p/w154${posterPath}`
                    : "https://placehold.co/300x450@2x.png";
                  const role = item.character || item.job;
                  const date = getMediaDate(item);

                  return (
                    <li key={`${mediaType}-${mediaId}`} className="border-b border-rule">
                      <Link
                        href={href}
                        className="group grid grid-cols-[2.75rem_3.25rem_1fr] sm:grid-cols-[3rem_4.5rem_1fr_7rem] items-center gap-3 sm:gap-5 py-2.5 hover:bg-ink-2 transition-colors"
                      >
                        <div className="w-11 sm:w-12 aspect-[2/3] overflow-hidden bg-ink-3">
                          <img
                            src={posterUrl}
                            alt={`Affiche : ${getMediaTitle(item)}`}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-display font-semibold text-xl sm:text-2xl text-faint tabular leading-none">
                          {date ? formatDate(date) : "—"}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-screen text-sm sm:text-base leading-snug line-clamp-2 group-hover:underline underline-offset-2 decoration-rouge">
                            {getMediaTitle(item)}
                          </h3>
                          {role && (
                            <p className="text-xs sm:text-sm text-dim line-clamp-1">
                              {item.character ? t.person.asCharacter : t.person.asJob} {role}
                            </p>
                          )}
                          <p className="sm:hidden text-xs text-faint mt-0.5">
                            {mediaType === "movie" ? t.person.movies : t.person.series}
                          </p>
                        </div>
                        <span className="hidden sm:flex items-center gap-1.5 text-sm text-faint justify-self-end pr-3">
                          {mediaType === "movie" ? (
                            <FaFilm className="text-xs" aria-hidden="true" />
                          ) : (
                            <FaTv className="text-xs" aria-hidden="true" />
                          )}
                          {mediaType === "movie" ? t.person.movies : t.person.series}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
