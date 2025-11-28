"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Target, Users, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

const targetGroups = [
  {
    id: 1,
    title: "Yläasteen oppilaat",
    intro: "Löydä suunta toisen asteen opintoihin ja tutki eri urapolkuja.",
    icon: GraduationCap,
    points: [
      "Tutustu laajaan valikoimaan uroja ja ammatteja",
      "Tunnista omat vahvuutesi ja kiinnostuksen kohteesi",
      "Saat selkeän kuvan erilaisista koulutuspoluista",
    ],
  },
  {
    id: 2,
    title: "Toisen asteen opiskelijat",
    intro: "Tarkenna urasuunnitelmaasi ja löydä polku jatko-opintoihin.",
    icon: Target,
    points: [
      "Selvitä, mihin ammattialoihin kiinnostuksesi johtavat",
      "Vertaile eri koulutusvaihtoehtoja ja urapolkuja",
      "Tee tietoon perustuvia päätöksiä tulevaisuudestasi",
    ],
  },
  {
    id: 3,
    title: "Nuoret aikuiset",
    intro: "Harkitse uudelleenkouluttautumista tai uran vaihtoa luottavaisin mielin.",
    icon: Users,
    points: [
      "Tutki uusia uramahdollisuuksia ja aloja",
      "Hahmota oma vahvuusprofiilisi ja soveltuvuutesi",
      "Löydä seuraava askel selkeän analyysin avulla",
    ],
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: 20,
    willChange: "opacity, transform",
  }),
  center: {
    opacity: 1,
    y: 0,
    willChange: "opacity, transform",
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: -20,
    willChange: "opacity, transform",
  }),
};

export default function TargetGroupsStepper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentGroup = targetGroups[activeIndex];

  const goToSlide = (index: number) => {
    const newDirection = index > activeIndex ? 1 : -1;
    setDirection(newDirection);
    setActiveIndex(index);
  };

  const goToNext = () => {
    const newIndex = activeIndex === targetGroups.length - 1 ? 0 : activeIndex + 1;
    setDirection(1);
    setActiveIndex(newIndex);
  };

  const goToPrev = () => {
    const newIndex = activeIndex === 0 ? targetGroups.length - 1 : activeIndex - 1;
    setDirection(-1);
    setActiveIndex(newIndex);
  };

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Heading and Subtitle - Left-aligned */}
        <div className="mb-10">
          <span className="text-sm font-semibold text-urak-accent-green uppercase tracking-wider mb-2 block">
            Kohderyhmät
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white leading-tight">
            Kenelle Urakompassi on tarkoitettu?
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl">
            Tuki urasuunnitteluun kaikissa elämänvaiheissa
          </p>
        </div>

        {/* Text Block - No Card Container */}
        <div className="max-w-4xl mx-auto px-6 mt-8">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{ willChange: "opacity, transform" }}
            >
              {/* Label */}
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-urak-text-muted mb-1">
                KOHDERYHMÄ
              </p>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-semibold text-urak-text-primary">
                {currentGroup.title}
              </h3>

              {/* Intro */}
              <p className="mt-2 text-sm md:text-base text-urak-text-secondary">
                {currentGroup.intro}
              </p>

              {/* Bullet Points */}
              <ul className="mt-4 space-y-2.5 text-sm md:text-base text-urak-text-secondary">
                {currentGroup.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls - Below Text Block */}
        <div className="mt-6 flex items-center justify-center gap-4">
          {/* Prev Button */}
          <button
            onClick={goToPrev}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-urak-border/70 bg-urak-bg/70 text-urak-text-secondary hover:border-urak-accent-blue/60 hover:text-urak-accent-blue transition"
            aria-label="Edellinen"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {targetGroups.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  index === activeIndex
                    ? "h-2 w-6 rounded-full bg-urak-accent-blue"
                    : "h-2 w-2 rounded-full bg-urak-border"
                }`}
                aria-label={`Siirry kohtaan ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-urak-border/70 bg-urak-bg/70 text-urak-text-secondary hover:border-urak-accent-blue/60 hover:text-urak-accent-blue transition"
            aria-label="Seuraava"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
