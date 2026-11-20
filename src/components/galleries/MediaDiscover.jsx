"use client";

import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { HomeSearchBar } from "../forms";

export default function MediaDiscover() {
    const { t } = useLanguage();
    const [showingSuggestions, setShowingSuggestions] = useState(false);

    const handleSuggestionsChange = (isShowing) => {
        setShowingSuggestions(isShowing);
    };

    return (
        <section className="relative w-full border-b border-rule">
            <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-8 pt-10 sm:pt-14 lg:pt-16 grid gap-6 lg:gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-end">
                <header className="lg:pb-12">
                    <h1 className="font-display font-extrabold text-[3.75rem] sm:text-[5.5rem] lg:text-[7rem] leading-[0.85] text-screen">
                        {t.home.welcome}
                    </h1>
                    <h2 className="mt-4 max-w-xl font-serif italic text-xl sm:text-2xl lg:text-[1.7rem] leading-snug text-dim">
                        {t.home.subtitle}
                    </h2>
                </header>
                <div className={`
                    transition-[padding] duration-300 ease-out
                    ${showingSuggestions ? 'pb-[455px]' : 'pb-10 sm:pb-12'}
                `}>
                    <HomeSearchBar variant="light" onSuggestionsChange={handleSuggestionsChange} />
                </div>
            </div>
        </section>
    );
}
