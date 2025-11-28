"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Target, Users, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

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
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function TargetGroupsStepper() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const currentGroup = targetGroups[activeIndex];
  const Icon = currentGroup.icon;

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
    <AnimatedSection id="kenelle" className="py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="text-sm font-semibold text-urak-accent-green uppercase tracking-wider mb-2 block">
            Kohderyhmät
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white leading-tight">
            Kenelle Urakompassi<br />on tarkoitettu?
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Tuki urasuunnitteluun kaikissa elämänvaiheissa
          </p>
        </div>

        {/* Stepper Container */}
        <div className="max-w-2xl mx-auto relative">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 h-10 w-10 rounded-full bg-[#11161f] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all"
            aria-label="Edellinen"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 h-10 w-10 rounded-full bg-[#11161f] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all"
            aria-label="Seuraava"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Card Container */}
          <div className="relative h-[500px] md:h-[450px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="absolute inset-0"
              >
                <div className="bg-[#11161f] ring-1 ring-white/5 rounded-2xl p-8 shadow-[0_0_24px_rgba(0,0,0,0.25)] h-full">
                  <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center text-white/60 mb-6">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {currentGroup.title}
                  </h3>

                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {currentGroup.intro}
                  </p>

                  <ul className="space-y-3">
                    {currentGroup.points.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                        <span className="text-sm text-urak-text-secondary leading-relaxed">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {targetGroups.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-8 bg-urak-accent-blue"
                    : "w-2 bg-white/20 hover:bg-white/30"
                }`}
                aria-label={`Siirry kohtaan ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

