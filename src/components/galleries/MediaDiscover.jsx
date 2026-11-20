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
        <section className="relative w-full bg-brand bg-gradient-to-r from-blue-600 to-blue-700 [&_:focus-visible]:outline-white">
            <div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-8 pt-7 sm:pt-9 flex flex-col gap-4 sm:gap-5">
                <header className="flex flex-col md:flex-row md:items-baseline md:gap-4">
                    <h1 className="font-display font-bold text-3xl sm:text-4xl leading-tight text-white">
                        {t.home.welcome}
                    </h1>
                    <h2 className="mt-1 md:mt-0 text-base sm:text-xl font-semibold leading-snug text-blue-50 max-w-[60ch]">
                        {t.home.subtitle}
                    </h2>
                </header>
                <div className={`
                    ${showingSuggestions ? 'pb-[455px]' : 'pb-8 sm:pb-10'}
                `}>
                    <HomeSearchBar variant="light" onSuggestionsChange={handleSuggestionsChange} />
                </div>
            </div>
        </section>
    );
}
