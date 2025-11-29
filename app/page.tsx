"use client";

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Surface } from "@/components/ui/surface"
import ScrollNav from "@/components/ScrollNav"
import CallToActionSection from "@/components/CallToActionSection"
import SnakeSteps from "@/components/SnakeSteps"
import { WhySection } from "@/components/WhySection"
import { getAllCategories } from "@/lib/categories"
import { AnimatedSection } from "@/components/ui/AnimatedSection"
import { AnimatedCard } from "@/components/ui/AnimatedCard"
import { PrimaryButton } from "@/components/ui/PrimaryButton"
import { SecondaryButton } from "@/components/ui/SecondaryButton"
import TargetGroupsStepper from "@/components/TargetGroupsStepper"
import {
  Target,
  Users,
  GraduationCap,
  Eye,
  ClipboardList,
  CheckCircle,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react"

export default function HomePage() {
  const categories = getAllCategories();

  return (
    <div className="min-h-screen bg-transparent">
      {/* Navigation - Transparent header that adapts on scroll */}
      <ScrollNav />

      {/* Hero Section - Premium Nordic SaaS Design */}
      <AnimatedSection className="relative mx-auto px-6 sm:px-8 pt-32 pb-32 bg-transparent">
        <div className="max-w-4xl mx-auto relative">
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            {/* Main headline */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ willChange: "opacity, transform" }}
              className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-8 text-urak-text-primary leading-[1.05] tracking-tight"
            >
              Löydä suunta, joka tuntuu omalta
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ willChange: "opacity, transform" }}
              className="text-lg md:text-xl text-urak-text-secondary mb-10 max-w-[720px] mx-auto leading-relaxed"
            >
              10–15 minuutin uratesti, joka perustuu tutkittuun psykologiaan ja auttaa tunnistamaan vahvuudet ja suuntautumisvaihtoehdot.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ willChange: "opacity, transform" }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8"
            >
              <PrimaryButton href="/test" className="group inline-flex items-center gap-2 px-8 py-4 text-base">
                Aloita testi
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </PrimaryButton>
              <SecondaryButton href="/ammatit" className="px-8 py-4 text-base">
                Selaa ammatteja
              </SecondaryButton>
            </motion.div>

            {/* Trust indicators - Compact single line */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ willChange: "opacity, transform" }}
              className="flex items-center justify-center gap-6 text-xs text-urak-text-muted"
            >
              <span className="flex items-center gap-1.5">
                <span className="text-urak-accent-green">✔</span>
                Maksuton
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-urak-accent-green">✔</span>
                10–15 min
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-urak-accent-green">✔</span>
                Tutkittu menetelmä
              </span>
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* How it works - Snake Steps with animated path */}
      <section id="miten" className="relative overflow-hidden">
        <SnakeSteps />
      </section>

      {/* Target audience - Stepper Component */}
      <TargetGroupsStepper />

      {/* Miten Urakompassi auttaa */}
      <WhySection />

      {/* Category Section - Two-Column Layout */}
      <AnimatedSection className="max-w-6xl mx-auto px-6 sm:px-8 py-32">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.1fr),minmax(0,1.9fr)] items-start">
          {/* Left Column: Heading and Description */}
          <div>
            <span className="text-sm font-semibold text-urak-accent-blue uppercase tracking-wider mb-3 block">Persoonallisuustyypit</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight text-left">
              Kahdeksan ainutlaatuista tyyppiä
            </h2>
            <p className="mb-4 text-sm md:text-base text-urak-text-secondary max-w-[520px]">
              Löydä tyyppi, joka kuvaa parhaiten sinua ja töitä, jotka sopivat sinulle
            </p>
            <p className="text-xs md:text-sm text-urak-text-muted max-w-[520px]">
              Jokainen tyyppi edustaa erilaista lähestymistapaa työhön ja uraan
            </p>
          </div>
          
          {/* Right Column: Types Panel */}
          <div className="rounded-3xl border border-white/5 bg-white/5 bg-gradient-to-b from-white/[0.05] to-white/0 backdrop-blur-xl divide-y divide-white/5">
            {categories.map((category, index) => {
              const formattedNumber = String(index + 1).padStart(2, '0');
              
              return (
                <button
                  key={category.slug}
                  className="group flex w-full items-center gap-4 px-6 py-5 md:px-8 md:py-6 text-left transition-colors hover:bg-white/5"
                >
                  {/* Number Pill */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-urak-bg text-xs font-semibold text-urak-text-secondary ring-1 ring-white/10 group-hover:text-urak-accent-blue group-hover:ring-urak-accent-blue/60 flex-shrink-0">
                    {formattedNumber}
                  </div>
                  
                  {/* Type Name and Descriptor */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm md:text-base font-semibold text-urak-text-primary">
                      {category.name_fi}
                    </div>
                    <div className="text-xs md:text-sm text-urak-text-secondary mt-1">
                      {category.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Editorial info block - Premium Nordic Design */}
      <AnimatedSection className="py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex items-start gap-8 max-w-[820px]">
            {/* Vertical accent line */}
            <div className="bg-urak-accent-green/40 w-1 rounded-full flex-shrink-0 self-stretch min-h-[140px]" />
            
            {/* Content */}
            <div className="flex-1 py-2">
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-8">
                Miten testiä tulisi käyttää
              </h3>
              <div className="text-base md:text-lg text-urak-text-secondary leading-relaxed space-y-6 max-w-[720px]">
                <p>
                  Urakompassi on suunniteltu <strong className="font-semibold text-white">ohjaamaan ja inspiroimaan</strong> uravalinnassasi.
                  Testi analysoi vahvuutesi ja kiinnostuksesi, antaen sinulle henkilökohtaiset suositukset.
                </p>
                <p>
                  Tulokset ovat <strong className="font-semibold text-white">lähtökohta keskustelulle</strong> – käytä niitä
                  pohtiessasi omaa tulevaisuuttasi yhdessä opettajien, opinto-ohjaajien ja perheen kanssa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <CallToActionSection />
    </div>
  )
}
