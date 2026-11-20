"use client";

import { Footer, NavBar } from "../../components";
import { useLanguage } from "../../contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  const sectionTitle = "font-display font-bold text-3xl sm:text-4xl leading-tight text-screen";

  return (
    <div className="flex flex-col min-h-screen bg-ink text-screen">
      <NavBar />
      <main className="pt-16 sm:pt-[76px] w-full flex-1">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
          {/* En-tête */}
          <section className="pt-12 sm:pt-16 pb-12 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl leading-[1.05]">
                {t.about.title}
              </h1>
              <p className="mt-4 font-medium text-2xl sm:text-3xl text-dim">
                {t.about.subtitle}
              </p>
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl text-screen mb-3">
                {t.about.mission.title}
              </h2>
              <p className="text-dim text-lg leading-relaxed max-w-[60ch]">
                {t.about.mission.description}
              </p>
            </div>
          </section>

          {/* Fonctionnalités */}
          <section className="py-12 sm:py-16">
            <h2 className={`${sectionTitle} mb-8`}>{t.about.features.title}</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 max-w-[72rem]">
              {t.about.features.items.map((feature, index) => (
                <li key={index} className="py-5">
                  <div>
                    <h3 className="text-lg font-semibold text-screen mb-2">{feature.title}</h3>
                    <p className="text-dim leading-relaxed">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Technologie & équipe */}
          <section className="py-12 sm:py-16 grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className={`${sectionTitle} mb-5`}>{t.about.technology.title}</h2>
              <p className="text-dim text-lg leading-relaxed max-w-[60ch] mb-6">
                {t.about.technology.description}
              </p>
              <p className="inline-flex items-center gap-3 rounded-md border border-rule-strong px-4 py-2.5">
                <span className="font-display font-bold text-xl leading-none text-brand-light">TMDB</span>
                <span className="font-semibold text-sm">The Movie Database</span>
              </p>
            </div>

            <div>
              <h3 className={`${sectionTitle} mb-5`}>{t.about.team.title}</h3>
              <p className="text-dim text-lg leading-relaxed max-w-[60ch] mb-6">
                {t.about.team.description}
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-brand text-white font-semibold hover:bg-blue-500 transition-colors"
              >
                <span>Découvrez notre travail</span>
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
