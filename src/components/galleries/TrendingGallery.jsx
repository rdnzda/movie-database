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
    <section className="w-full pt-8 sm:pt-10 pb-10 flex flex-col gap-7 bg-white text-gray-900">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-wrap gap-x-6 gap-y-3 items-center">
        <h2 className="font-display font-bold text-3xl sm:text-4xl leading-none text-gray-900">
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
