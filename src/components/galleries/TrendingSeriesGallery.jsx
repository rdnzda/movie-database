"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { getTrendingSeries } from "../../services/api";
import { Spinner } from "../ui";
import { LittleMediaCard } from "../cards";
import SimpleBar from "simplebar-react";

export default function TrendingSeriesGallery({ timeWindow = "day" }) {
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const loadTrendingSeries = async () => {
      try {
        setLoading(true);
        const series = await getTrendingSeries(timeWindow);
        setTrendingSeries(series);
      } catch (err) {
        setError(t.errors.loadSeries);
      } finally {
        setLoading(false);
      }
    };
    loadTrendingSeries();
  }, [timeWindow]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="w-full max-w-[1240px] mx-auto mb-4 px-4 sm:px-8 flex items-center gap-4">
        <h3 className="font-display font-semibold text-2xl leading-none text-screen">{t.navigation.series}</h3>
        <span className="flex-1 h-px bg-rule" aria-hidden="true" />
        </div>
        <div className="max-w-[1240px] mx-auto flex items-center justify-center min-h-[260px] px-4 sm:px-8">
          <div className="flex items-center gap-4 text-dim text-sm">
            <Spinner size={20} className="border-2" /> {t.loading.series}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="w-full max-w-[1240px] mx-auto mb-4 px-4 sm:px-8 flex items-center gap-4">
        <h3 className="font-display font-semibold text-2xl leading-none text-screen">{t.navigation.series}</h3>
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
        <h3 className="font-display font-semibold text-2xl leading-none text-screen">{t.navigation.series}</h3>
        <span className="flex-1 h-px bg-rule" aria-hidden="true" />
      </div>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        <SimpleBar autoHide={false} className="w-full">
          <ol className="flex gap-4 sm:gap-5 pb-4">
            {trendingSeries.map((series, index) => (
              <li key={`series-${series.id}`} className="flex-none">
                <LittleMediaCard rank={index + 1} media={series} mediaType="tv" />
              </li>
            ))}
          </ol>
        </SimpleBar>
      </div>
    </div>
  );
}
