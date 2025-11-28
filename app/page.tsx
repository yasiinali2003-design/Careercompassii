"use client";

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Surface } from "@/components/ui/surface"
import CategoryCard from "@/components/CategoryCard"
import Logo from "@/components/Logo"
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
      <AnimatedSection className="relative mx-auto px-6 pt-24 md:pt-32 pb-20 md:pb-28 bg-transparent">
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
              className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-urak-text-primary leading-[1.05] tracking-tight"
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
              className="text-lg md:text-xl text-urak-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed"
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
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
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

      {/* Miten Urakompassi auttaa */}
      <WhySection />

      {/* Category Section - Premium Nordic SaaS Design */}
      <AnimatedSection className="mx-auto max-w-7xl px-6 py-16 md:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <span className="text-sm font-semibold text-[#E8994A] uppercase tracking-wider mb-2 block">Persoonallisuustyypit</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-white leading-tight">
            Kahdeksan ainutlaatuista<br/>tyyppiä
          </h2>
          <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto">
            Löydä tyyppi, joka kuvaa parhaiten sinua ja töitä, jotka sopivat sinulle
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index} />
          ))}
        </div>
      </AnimatedSection>

      {/* How it works - Snake Steps with animated path */}
      <section id="miten" className="relative overflow-hidden">
        <SnakeSteps />
      </section>

      {/* Target audience - Stepper Component */}
      <TargetGroupsStepper />

      {/* Editorial info block - Premium Nordic Design */}
      <AnimatedSection className="py-20 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-start gap-6 max-w-4xl">
            {/* Vertical accent line */}
            <div className="bg-urak-accent-green/40 w-[3px] rounded-full flex-shrink-0 self-stretch min-h-[120px]" />
            
            {/* Content */}
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                Miten testiä tulisi käyttää
              </h3>
              <div className="text-base md:text-lg text-urak-text-secondary leading-relaxed space-y-5 max-w-xl">
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
