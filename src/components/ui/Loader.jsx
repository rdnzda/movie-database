"use client";

/**
 * Composant de chargement réutilisable
 * Fournit différents types de loaders : spinner, skeleton, inline
 */

// Spinner de base
export function Spinner({ size = 32, className = "" }) {
  return (
    <div
      className={`relative inline-block animate-spin rounded-full border-[3px] border-rule border-t-rouge ${className}`}
      style={{ width: size, height: size }}
      aria-label="Chargement"
      role="status"
    />
  );
}

// Grille de skeleton pour les cartes
export function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-5 gap-y-7 w-full" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2.5 w-full">
          <div className="aspect-[2/3] w-full bg-ink-3 animate-pulse" />
          <div className="h-3.5 w-3/4 bg-ink-3" />
          <div className="h-3 w-1/2 bg-ink-2" />
        </div>
      ))}
    </div>
  );
}

// Loader inline avec texte
export function InlineLoader({ loading, children }) {
  if (!loading) return children;
  return (
    <div className="flex items-center gap-3 text-sm text-dim">
      <Spinner size={18} />
      <span>Chargement…</span>
    </div>
  );
}

// Loader principal de page
export default function Loader() {
  return (
    <div className="w-full flex flex-col items-center gap-5 py-16">
      <Spinner size={40} className="border-[3px]" />
      <p className="font-serif italic text-dim text-lg">Chargement…</p>
    </div>
  );
}
