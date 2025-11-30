"use client";

import { useState } from "react";
import { CohortWalkAnimation } from "./CohortWalkAnimation";

type CohortKey = "ylaste" | "toinen" | "aikuinen";

/**
 * Simplified example of the "Kenelle Urakompassi on tarkoitettu?" section
 * with cohort walk animation integration.
 */
export function TargetGroupsSection() {
  const [activeCohort, setActiveCohort] = useState<CohortKey>("ylaste");

  const cohorts = [
    {
      key: "ylaste" as CohortKey,
      label: "Yläasteen oppilaat",
      description: "Löydä suunta toisen asteen opintoihin ja tutki eri urapolkuja.",
    },
    {
      key: "toinen" as CohortKey,
      label: "Toisen asteen opiskelijat",
      description: "Tarkenna urasuunnitelmaasi ja löydä polku jatko-opintoihin.",
    },
    {
      key: "aikuinen" as CohortKey,
      label: "Nuoret aikuiset",
      description: "Harkitse uudelleenkouluttautumista tai uran vaihtoa luottavaisin mielin.",
    },
  ];

  return (
    <section className="py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        {/* Heading */}
        <div className="max-w-4xl mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Kenelle Urakompassi on tarkoitettu?
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-[720px]">
            Tuki urasuunnitteluun kaikissa elämänvaiheissa
          </p>
        </div>

        {/* Content Grid: Text + Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="space-y-8">
            {/* Cohort Selector Buttons */}
            <div className="flex flex-col gap-3">
              {cohorts.map((cohort) => (
                <button
                  key={cohort.key}
                  onClick={() => setActiveCohort(cohort.key)}
                  className={`
                    text-left px-6 py-4 rounded-xl border transition-all
                    ${
                      activeCohort === cohort.key
                        ? "border-urak-accent-blue bg-urak-accent-blue/10 text-white"
                        : "border-white/20 bg-white/5 text-urak-text-secondary hover:bg-white/10 hover:border-white/30"
                    }
                  `}
                >
                  <div className="font-semibold text-lg mb-1">{cohort.label}</div>
                  <div className="text-sm opacity-80">{cohort.description}</div>
                </button>
              ))}
            </div>

            {/* Active Cohort Description */}
            <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10">
              <p className="text-urak-text-secondary leading-relaxed">
                {cohorts.find((c) => c.key === activeCohort)?.description}
              </p>
            </div>
          </div>

          {/* Right Column: Animation (Desktop) / Below Text (Mobile) */}
          <div className="flex items-center justify-center md:justify-end">
            <CohortWalkAnimation activeCohort={activeCohort} />
          </div>
        </div>
      </div>
    </section>
  );
}

