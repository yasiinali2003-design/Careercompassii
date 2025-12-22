"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ScrollGradientBackground } from "@/components/ScrollGradientBackground";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const navigationItems = [
  { id: "mita-mittaamme", label: "Mitä mittaamme" },
  { id: "ikaryhmat", label: "Ikäryhmät" },
  { id: "tulosten-tulkinta", label: "Tulosten tulkinta" },
  { id: "tietosuoja", label: "Tietosuoja" },
];

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

export default function MetodologiaPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-transparent relative">
      {/* Background */}
      <ScrollGradientBackground
        fromColor="#0f172a"
        toColor="#0f766e"
        startRange={0}
        endRange={0.4}
        speed={0.4}
        intensity={0.6}
        noiseAmount={0.05}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 animate-fade-in-down border-b transition-all duration-300"
        style={{
          background: "transparent",
          backgroundColor: scrolled ? "rgba(11, 16, 21, 0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
          borderColor: scrolled ? "rgba(255, 255, 255, 0.1)" : "transparent",
        }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between relative z-10">
          <Logo />
          <Button
            variant="outline"
            asChild
            className="border-urak-border/70 bg-urak-bg/70 hover:bg-urak-surface hover:border-urak-border"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Takaisin
            </Link>
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-0 py-16 lg:py-24">
          {/* Hero Section */}
          <AnimatedSection>
            <section className="mb-16">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-urak-accent-blue mb-4">
                Tutkimuspohja
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Suomalainen urasuunnittelun työkalu
              </h1>
              <p className="text-lg md:text-xl text-urak-text-secondary leading-relaxed max-w-3xl">
                UraKompassi auttaa nuoria löytämään itselleen sopivia urapolkuja kartoittamalla heidän kiinnostuksensa, arvonsa ja vahvuutensa. Tuloksena syntyy henkilökohtainen raportti, joka toimii lähtökohtana urapohdinnalle.
              </p>
            </section>
          </AnimatedSection>

          {/* Navigation Pills */}
          <AnimatedSection delay={0.1}>
            <div className="mb-16 flex flex-wrap gap-2 justify-center">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="
                    px-4 py-2
                    rounded-full
                    border border-white/10
                    bg-white/5
                    backdrop-blur-sm
                    text-sm font-medium
                    text-urak-text-secondary
                    hover:text-white
                    hover:bg-white/10
                    hover:border-white/20
                    transition-all duration-200
                  "
                >
                  {item.label}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Section: Mitä mittaamme */}
          <AnimatedSection delay={0.2}>
            <motion.section
              id="mita-mittaamme"
              className="
                rounded-3xl
                border border-white/5
                bg-white/5
                backdrop-blur-xl
                shadow-[0_18px_50px_rgba(0,0,0,0.45)]
                p-8 md:p-10
                mb-12
                scroll-mt-24
              "
              role="article"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                Mitä UraKompassi kartoittaa?
              </h2>
              <p className="text-base text-urak-text-secondary leading-relaxed mb-6">
                UraKompassi perustuu tutkimuspohjaiseen lähestymistapaan, joka kartoittaa nuoren profiilia useasta näkökulmasta:
              </p>
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <div>
                    <strong className="text-white font-semibold">Kiinnostukset</strong> – Mitä aloja ja tehtäviä nuori kokee kiinnostaviksi ja motivoiviksi.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <div>
                    <strong className="text-white font-semibold">Arvot</strong> – Mikä on nuorelle tärkeää työelämässä ja tulevaisuudessa.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <div>
                    <strong className="text-white font-semibold">Työskentelytapa</strong> – Miten nuori työskentelee parhaiten ja millaisessa ympäristössä hän viihtyy.
                  </div>
                </li>
              </ul>
              <p className="text-base text-urak-text-secondary leading-relaxed">
                Näiden pohjalta UraKompassi etsii nuorelle sopivia ammatteja laajasta suomalaisesta ammattitietokannasta.
              </p>
            </motion.section>
          </AnimatedSection>

          {/* Section: Ikäryhmät */}
          <AnimatedSection delay={0.3}>
            <motion.section
              id="ikaryhmat"
              className="
                rounded-3xl
                border border-white/5
                bg-white/5
                backdrop-blur-xl
                shadow-[0_18px_50px_rgba(0,0,0,0.45)]
                p-8 md:p-10
                mb-12
                scroll-mt-24
              "
              role="article"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                Ikäryhmäkohtaiset testit
              </h2>
              <p className="text-base text-urak-text-secondary leading-relaxed mb-6">
                UraKompassi tarjoaa räätälöidyt testit eri ikäryhmille, koska nuoren elämäntilanne vaikuttaa siihen, millaisia kysymyksiä on mielekästä kysyä:
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-white font-semibold mb-2">Yläaste (13-16 v)</h4>
                  <p className="text-sm text-urak-text-secondary">Keskittyy peruskiinnostuksiin ja oppimistyyleihin. Sopii nuorille, jotka vasta tutustuvat eri aloihin.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-white font-semibold mb-2">Toinen aste (16-19 v)</h4>
                  <p className="text-sm text-urak-text-secondary">Erilliset testit lukio- ja ammattikouluopiskelijoille. Huomioi eri koulutuspolkujen erityispiirteet.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <h4 className="text-white font-semibold mb-2">Nuoret aikuiset (18-25 v)</h4>
                  <p className="text-sm text-urak-text-secondary">Kartoittaa laajemmin työelämän arvoja ja tulevaisuuden toiveita. Sopii jatko-opintoihin hakeville ja uran vaihtajille.</p>
                </div>
              </div>
            </motion.section>
          </AnimatedSection>

          {/* Section: Tulosten tulkinta */}
          <AnimatedSection delay={0.4}>
            <motion.section
              id="tulosten-tulkinta"
              className="
                rounded-3xl
                border border-white/5
                bg-white/5
                backdrop-blur-xl
                shadow-[0_18px_50px_rgba(0,0,0,0.45)]
                p-8 md:p-10
                mb-12
                scroll-mt-24
              "
              role="article"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                Miten tuloksia tulkitaan?
              </h2>
              <p className="text-base text-urak-text-secondary leading-relaxed mb-6">
                UraKompassin tulokset ovat suuntaa antavia, eivät lopullisia vastauksia. Raportti näyttää:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <span className="text-base text-urak-text-secondary leading-relaxed">
                    <strong className="text-white">Sopivimmat ammatit</strong> – Ammatteja, jotka vastaavat nuoren kiinnostuksia ja arvoja.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <span className="text-base text-urak-text-secondary leading-relaxed">
                    <strong className="text-white">Koulutuspolkusuositus</strong> – Suuntaa antava arvio sopivasta koulutuspolusta.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <span className="text-base text-urak-text-secondary leading-relaxed">
                    <strong className="text-white">Henkilökohtainen analyysi</strong> – Kuvaus nuoren vahvuuksista ja kiinnostuksista.
                  </span>
                </li>
              </ul>
              <p className="text-base text-urak-text-secondary leading-relaxed mb-4">
                Tulokset ovat keskustelun lähtökohta, eivät valmis päätös. Suosittelemme, että nuori käy tulokset läpi yhdessä luotettavan aikuisen kanssa.
              </p>
              <p className="text-base text-urak-text-secondary leading-relaxed">
                UraKompassi ei korvaa opinto-ohjaajaa, vaan tarjoaa työkalun itsetuntemuksen ja urapohdinnon tueksi.
              </p>
            </motion.section>
          </AnimatedSection>

          {/* Section: Tietosuoja */}
          <AnimatedSection delay={0.5}>
            <motion.section
              id="tietosuoja"
              className="
                rounded-3xl
                border border-white/5
                bg-white/5
                backdrop-blur-xl
                shadow-[0_18px_50px_rgba(0,0,0,0.45)]
                p-8 md:p-10
                mb-12
                scroll-mt-24
              "
              role="article"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
                Tietosuoja ja yksityisyys
              </h2>
              <div className="space-y-4 text-base text-urak-text-secondary leading-relaxed">
                <p>
                  <strong className="text-white">Ei henkilötietoja:</strong> UraKompassi ei vaadi rekisteröitymistä eikä kerää henkilötietoja. Testi voidaan tehdä täysin anonyymisti.
                </p>
                <p>
                  <strong className="text-white">Yksityisyys:</strong> Vastaukset käsitellään luottamuksellisesti eikä niitä yhdistetä henkilöön.
                </p>
                <p>
                  <strong className="text-white">Ei myyntiä kolmansille:</strong> Emme myy emmekä jaa käyttäjätietoja kolmansille osapuolille.
                </p>
                <p>
                  <strong className="text-white">GDPR-yhteensopivuus:</strong> Palvelu noudattaa EU:n yleistä tietosuoja-asetusta (GDPR).
                </p>
              </div>
            </motion.section>
          </AnimatedSection>

        </div>
      </main>
    </div>
  );
}
