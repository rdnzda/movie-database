"use client";

import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { ToggleButton } from "../ui";
import TrendingMoviesGallery from "./TrendingMoviesGallery";
import TrendingSeriesGallery from "./TrendingSeriesGallery";

/**
 * Galerie principale des tendances
 * Combine films et séries avec sélecteur jour/semaine
 */
export default function TrendingGallery() {
  const [timeWindow, setTimeWindow] = useState("day"); // "day" ou "week"
  const { t } = useLanguage();

  return (
    <section className="w-full pt-10 sm:pt-12 pb-6 flex flex-col gap-8 bg-ink text-screen">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-wrap gap-x-6 gap-y-3 items-end justify-between">
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl leading-none">
          {t.home.trending}
        </h2>
        <ToggleButton selected={timeWindow} onSelect={setTimeWindow} />
      </div>

      <div className="flex flex-col gap-10">
        <TrendingMoviesGallery timeWindow={timeWindow} />
        <TrendingSeriesGallery timeWindow={timeWindow} />
      </div>
    </section>
  );
}
