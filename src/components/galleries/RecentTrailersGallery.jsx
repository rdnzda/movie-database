"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { getRecentMovieTrailers, getRecentSeriesTrailers, getMovieVideos, getSeriesVideos } from '../../services/api';
import { tmdbRequest } from '../../services/api/base';
import { useLanguage } from '../../contexts/LanguageContext';
import SimpleBar from 'simplebar-react';
import { Play, X } from 'lucide-react';

// Carte trailer avec miniature YouTube + ouverture modal interne
function TrailerCard({ item, onOpen }) {
  const thumb = `https://img.youtube.com/vi/${item.video_key}/hqdefault.jpg`;
  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="flex flex-col gap-2.5 w-[280px] sm:w-[340px] md:w-[380px] flex-none group text-left"
    >
      <div className="relative overflow-hidden w-full aspect-video bg-black rounded-md outline outline-1 -outline-offset-1 outline-white/10 group-hover:outline-screen transition-[outline-color]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumb}
          alt={item.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          loading="lazy"
          onError={(e) => {
            if (item.poster_path) {
              e.currentTarget.src = `https://image.tmdb.org/t/p/w342${item.poster_path}`;
            }
          }}
        />
        <span className="absolute bottom-2 left-2 rounded inline-flex items-center gap-1.5 bg-ink text-screen text-xs font-semibold pl-2 pr-2.5 py-1.5 group-hover:bg-brand group-hover:text-white transition-colors">
          <Play className="w-3 h-3 fill-current" aria-hidden="true" />
          {item.video_type || 'Trailer'}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold leading-snug line-clamp-2 text-screen">{item.title}</span>
        <span className="text-xs text-faint tabular">{item.release_date || item.first_air_date}</span>
      </div>
    </button>
  );
}

const FILTERS = [
  { key: 'popular', color: 'blue' },
  { key: 'streaming', color: 'emerald' },
  { key: 'ontv', color: 'violet' },
  { key: 'forrent', color: 'amber' },
  { key: 'intheaters', color: 'rose' },
];

// Simple wrapper utilisant SimpleBar pour un scroll fluide sans boutons
function SimpleBarCarousel({ trailers, onOpen }) {
  return (
    <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-8">
      <SimpleBar autoHide={false} className="w-full pb-4">
        <div className="flex gap-5 pr-6">
          {trailers.map(tr => (
            <TrailerCard key={tr.kind + '-' + tr.id + '-' + tr.video_key} item={tr} onOpen={onOpen} />
          ))}
          {trailers.length === 0 && (
            <div className="text-sm text-dim">Aucun trailer récent trouvé.</div>
          )}
        </div>
      </SimpleBar>
    </div>
  );
}

export default function RecentTrailersGallery({ include = 'both' }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const [active, setActive] = useState(null); // trailer actif pour modal
  const iframeRef = useRef(null);
  const [filter, setFilter] = useState('popular');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const wantMovies = include === 'movies' || include === 'both';
      const wantSeries = include === 'series' || include === 'both';

      // Helper pour récupérer liste brute selon filtre
      async function fetchMovieCandidates() {
        switch (filter) {
          case 'popular':
            return (await tmdbRequest('/discover/movie', { sort_by: 'popularity.desc', page: 1 })).results || [];
          case 'intheaters':
            return (await tmdbRequest('/movie/now_playing', { page: 1 })).results || [];
          case 'streaming':
            return (await tmdbRequest('/discover/movie', { sort_by: 'popularity.desc', with_watch_monetization_types: 'flatrate', watch_region: 'FR', page: 1 })).results || [];
          case 'forrent':
            return (await tmdbRequest('/discover/movie', { sort_by: 'popularity.desc', with_watch_monetization_types: 'rent', watch_region: 'FR', page: 1 })).results || [];
          case 'ontv': // pas de sens pour films, retour vide
            return [];
          default:
            return [];
        }
      }
      async function fetchSeriesCandidates() {
        switch (filter) {
          case 'popular':
            return (await tmdbRequest('/discover/tv', { sort_by: 'popularity.desc', page: 1 })).results || [];
          case 'ontv':
            return (await tmdbRequest('/tv/on_the_air', { page: 1 })).results || [];
          case 'streaming':
            return (await tmdbRequest('/discover/tv', { sort_by: 'popularity.desc', with_watch_monetization_types: 'flatrate', watch_region: 'FR', page: 1 })).results || [];
          // Heuristiques approximatives pour mapping louable / salles inexistants côté TV
          case 'forrent':
            return [];
          case 'intheaters':
            return [];
          default:
            return [];
        }
      }

      let movieCandidates = wantMovies ? await fetchMovieCandidates() : [];
      let seriesCandidates = wantSeries ? await fetchSeriesCandidates() : [];

      // Limiter pour réduire requêtes vidéos
  movieCandidates = movieCandidates.slice(0, 18);
  seriesCandidates = seriesCandidates.slice(0, 18);

      const trailers = [];

      // Fetch vidéos en parallèle contrôlé
      async function processCandidates(candidates, kind) {
        for (const media of candidates) {
          if (trailers.length >= 30) break; // limite globale
          try {
            const vids = kind === 'movie' ? await getMovieVideos(media.id) : await getSeriesVideos(media.id);
            const official = vids.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
            if (official) {
              trailers.push({
                id: media.id,
                kind,
                title: media.title || media.name || media.original_title || media.original_name,
                release_date: media.release_date,
                first_air_date: media.first_air_date,
                poster_path: media.poster_path,
                popularity: media.popularity,
                video_key: official.key,
                video_name: official.name,
                video_type: official.type,
              });
            }
          } catch {/* ignore */}
        }
      }

      // Traiter films puis séries (ordre dépend du filtre pour cohérence UX)
      if (filter === 'ontv') {
        await processCandidates(seriesCandidates, 'series');
        await processCandidates(movieCandidates, 'movie');
      } else if (filter === 'forrent' || filter === 'intheaters') {
        await processCandidates(movieCandidates, 'movie');
        await processCandidates(seriesCandidates, 'series');
      } else if (filter === 'streaming') {
        await processCandidates(seriesCandidates, 'series');
        await processCandidates(movieCandidates, 'movie');
      } else { // popular
        await processCandidates(movieCandidates, 'movie');
        await processCandidates(seriesCandidates, 'series');
      }

      // Tri final selon filtre
      if (filter === 'popular') {
        trailers.sort((a,b) => (b.popularity||0) - (a.popularity||0));
      } else if (filter === 'intheaters') {
        trailers.sort((a,b) => ( (b.release_date||'') > (a.release_date||'') ? 1 : -1));
      } else if (filter === 'ontv') {
        trailers.sort((a,b) => ( (b.first_air_date||'') > (a.first_air_date||'') ? 1 : -1));
      } else {
        // fallback tri par date dispo
        trailers.sort((a,b) => ((b.release_date||b.first_air_date||'') > (a.release_date||a.first_air_date||'') ? 1 : -1));
      }

  const results = trailers.slice(0, 10);

      setTrailers(results);
    } catch (e) {
      console.error(e);
      setError('Impossible de charger les trailers');
    } finally {
      setLoading(false);
    }
  }, [include, filter]);

  useEffect(() => { load(); }, [load, filter]);

  // Fermer avec ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setActive(null); };
    if (active) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active]);

  // Empêcher scroll arrière-plan quand modal ouverte
  useEffect(() => {
    if (active) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [active]);

  return (
    <section className="w-full flex flex-col gap-6 text-screen pt-10 sm:pt-12 pb-12 bg-ink">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl leading-none">
            {t?.sections?.recentTrailers || 'Nouveaux Trailers'}
          </h2>
          <div className="flex gap-x-5 gap-y-1 flex-wrap -mb-1" role="group">
            {FILTERS.map(f => {
              const isActive = f.key === filter;
              const label = t?.trailersFilters?.[f.key] || f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  aria-pressed={isActive}
                  className={`py-1 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${isActive ? 'border-brand-light text-screen' : 'border-transparent text-dim hover:text-screen hover:border-rule-strong'}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {loading && (
        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-8 pb-4">
          <div className="relative overflow-hidden">
            <div className="flex gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-1 min-w-[260px] aspect-video rounded-md bg-ink-3 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      )}
      {error && <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-8 text-sm text-brand-light">{error}</div>}
      {!loading && !error && (
        <SimpleBarCarousel trailers={trailers} onOpen={setActive} />
      )}
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/85"
            onClick={() => setActive(null)}
          />
          <div className="relative w-full max-w-6xl aspect-video bg-black border border-rule" role="dialog" aria-modal="true" aria-label={active.title}>
            <button
              onClick={() => setActive(null)}
              className="absolute -top-11 right-0 flex items-center justify-center w-10 h-10 text-screen hover:text-brand-light"
              aria-label="Fermer"
            ><X className="w-6 h-6" aria-hidden="true" /></button>
            <iframe
              ref={iframeRef}
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${active.video_key}?autoplay=1&rel=0`}
              title={active.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}