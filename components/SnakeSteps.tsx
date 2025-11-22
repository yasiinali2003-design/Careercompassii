"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Step {
  number: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    number: 1,
    icon: "👁️",
    title: "Vastaa kysymyksiin",
    description: "30 huolellisesti laadittua kysymystä kartoittavat kiinnostuksen kohteitasi ja vahvuuksiasi.",
    color: "#2B5F75",
  },
  {
    number: 2,
    icon: "📋",
    title: "Tekoäly analysoi",
    description: "Edistynyt algoritmi vertaa profiilisi 361 ammatin vaatimuksiin ja ominaisuuksiin.",
    color: "#E8994A",
  },
  {
    number: 3,
    icon: "📈",
    title: "Saat suositukset",
    description: "Räätälöidyt urasuositukset ja selkeät ohjeet koulutuspoluista ja seuraavista askeleista.",
    color: "#4A7C59",
  },
];

export default function SnakeSteps() {
  const [activeStep, setActiveStep] = useState(1);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const activePathRef = useRef<SVGPathElement>(null);

  // Auto-progress animation when section comes into view
  useEffect(() => {
    if (isInView) {
      const sequence = async () => {
        setActiveStep(1);
        await new Promise(resolve => setTimeout(resolve, 800));
        setActiveStep(2);
        await new Promise(resolve => setTimeout(resolve, 800));
        setActiveStep(3);
      };
      sequence();
    }
  }, [isInView]);

  // Auto-loop when idle
  useEffect(() => {
    if (!isHovering && isInView) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev === 3 ? 1 : prev + 1));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isHovering, isInView]);

  // Update SVG path animation
  useEffect(() => {
    if (activePathRef.current) {
      const totalLength = activePathRef.current.getTotalLength();
      const progress = (activeStep - 1) / (steps.length - 1);
      activePathRef.current.style.strokeDasharray = `${totalLength}`;
      activePathRef.current.style.strokeDashoffset = `${totalLength * (1 - progress)}`;
    }
  }, [activeStep]);

  return (
    <section
      ref={sectionRef}
      className="relative max-w-7xl mx-auto px-4 py-20"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setHoveredStep(null);
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Kolme yksinkertaista vaihetta
        </h2>
        <p className="text-gray-400 text-lg">
          Vie hiiri vaiheen päälle nähdäksesi lisätietoja
        </p>
      </motion.div>

      {/* Snake Wrapper */}
      <div className="relative px-4 pb-6 pt-10" style={{ minHeight: '400px' }}>
        {/* SVG Snake Path */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
          viewBox="0 0 1200 260"
          preserveAspectRatio="none"
        >
          {/* Grey background path */}
          <path
            d="M80 210 C 260 80 420 80 600 210 S 940 340 1120 210"
            stroke="#222631"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active progress path */}
          <path
            ref={activePathRef}
            d="M80 210 C 260 80 420 80 600 210 S 940 340 1120 210"
            stroke="#4A7C59"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {/* Dots at card centers */}
          {[
            { cx: 80, cy: 210, step: 1 },
            { cx: 600, cy: 210, step: 2 },
            { cx: 1120, cy: 210, step: 3 },
          ].map(({ cx, cy, step }) => (
            <motion.circle
              key={step}
              cx={cx}
              cy={cy}
              r={activeStep >= step ? 14 : 12}
              fill="#020617"
              stroke={activeStep >= step ? "#4A7C59" : "#222631"}
              strokeWidth="4"
              animate={{
                r: activeStep >= step ? 14 : 12,
                stroke: activeStep >= step ? "#4A7C59" : "#222631",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </svg>

        {/* Cards Grid - now with dots */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {steps.map((step, index) => {
            const isExpanded = hoveredStep === step.number;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="flex items-center justify-center"
              >
                <motion.article
                  layout
                  onMouseEnter={() => {
                    setHoveredStep(step.number);
                    setActiveStep(step.number);
                  }}
                  onMouseLeave={() => setHoveredStep(null)}
                  onFocus={() => {
                    setHoveredStep(step.number);
                    setActiveStep(step.number);
                  }}
                  onBlur={() => setHoveredStep(null)}
                  tabIndex={0}
                  className={`
                    relative cursor-pointer rounded-full
                    bg-gradient-to-br from-[#1f2937] to-[#020617]
                    border transition-all duration-500
                    ${
                      isExpanded
                        ? "border-gray-500/80 shadow-2xl w-full md:w-80"
                        : "border-[#242938] w-24 h-24 hover:scale-110"
                    }
                  `}
                  style={{
                    borderColor: isExpanded ? step.color : undefined,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {!isExpanded ? (
                      /* Collapsed Dot State */
                      <motion.div
                        key="dot"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex flex-col items-center justify-center p-4"
                      >
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.5 }}
                          className="text-4xl mb-1"
                        >
                          {step.icon}
                        </motion.div>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{
                            backgroundColor: `${step.color}33`,
                            color: step.color,
                          }}
                        >
                          {step.number}
                        </div>
                      </motion.div>
                    ) : (
                      /* Expanded Card State */
                      <motion.div
                        key="card"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-7 rounded-3xl"
                      >
                        {/* Number Badge */}
                        <div
                          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-[#0f172a]/90 border backdrop-blur-xl"
                          style={{
                            color: step.color,
                            borderColor: `${step.color}66`,
                          }}
                        >
                          {step.number}
                        </div>

                        {/* Icon */}
                        <motion.div
                          initial={{ rotate: 0 }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-[#0f172a]/90 border border-gray-700/25"
                        >
                          <span className="text-3xl">{step.icon}</span>
                        </motion.div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold text-white mb-3">
                          {step.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {step.description}
                        </p>

                        {/* Active indicator bar */}
                        <motion.div
                          className="absolute bottom-0 left-0 h-1 rounded-full w-full"
                          style={{ backgroundColor: step.color }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-12"
      >
        <Link href="/test">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-[#2B5F75] to-[#4A7C59] rounded-2xl text-white text-lg font-semibold shadow-lg hover:shadow-2xl transition-all"
          >
            Aloita testi →
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
