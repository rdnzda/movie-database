"use client";

import { useLanguage } from "../../contexts/LanguageContext";

/**
 * Sélecteur à deux positions, façon talon de billet
 * Utilisé pour basculer entre "Aujourd'hui" et "Cette semaine"
 */
export default function ToggleButton({ selected, onSelect }) {
  const { t } = useLanguage();

  const base =
    "px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors duration-150";
  const on = "bg-brand text-white";
  const off = "text-gray-700 hover:text-gray-900 hover:bg-gray-100";

  return (
    <div className="flex w-fit rounded-md overflow-hidden border border-gray-300" role="group">
      <button
        onClick={() => onSelect("day")}
        className={`${base} ${selected === "day" ? on : off}`}
        aria-pressed={selected === "day"}
      >
        {t.actions.today}
      </button>
      <button
        onClick={() => onSelect("week")}
        className={`${base} ${selected === "week" ? on : off}`}
        aria-pressed={selected === "week"}
      >
        {t.actions.thisWeek}
      </button>
    </div>
  );
}
