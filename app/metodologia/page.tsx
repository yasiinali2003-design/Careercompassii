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
  { id: "teoreettinen-tausta", label: "Miten menetelmä toimii" },
  { id: "miten-testi", label: "Miten testi on rakennettu" },
  { id: "tulosten-tulkinta", label: "Tulosten tulkinta" },
  { id: "tietosuoja", label: "Tietosuoja" },
  { id: "yhteistyö", label: "Yhteistyö koulujen kanssa" },
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
                Metodologia
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Kiinnostuksiin perustuva menetelmä uravalintojen tueksi
              </h1>
              <p className="text-lg md:text-xl text-urak-text-secondary leading-relaxed max-w-3xl">
                UraKompassi kartoittaa nuoren kiinnostuksen kohteet ja vertaa niitä 760 ammatin vaatimuksiin Suomen työmarkkinoilla. Menetelmä ei korvaa opinto-ohjaajaa vaan kokoaa nuoren kiinnostuksen kohteet ja vahvuudet yhteen raporttiin, joka toimii lähtökohtana ohjauskeskustelulle.
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
              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <div>
                    <strong className="text-white font-semibold">Kiinnostuksen kohteet</strong> – Mitä aiheita, aloja ja tehtäviä nuori kokee mielenkiintoisiksi ja motivoiviksi.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <div>
                    <strong className="text-white font-semibold">Vahvuudet ja luontaiset taipumukset</strong> – Millaisia taitoja ja kykyjä nuorella on luonnostaan, ja miten hän työskentelee parhaiten.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <div>
                    <strong className="text-white font-semibold">Työskentelytapa</strong> – Miten nuori suhtautuu työhön, tiimityöhön, itsenäiseen työskentelyyn ja päätöksentekoon.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <div>
                    <strong className="text-white font-semibold">Toiveet tulevaisuudesta</strong> – Millaisia työympäristöjä, työtehtäviä ja elämäntilanteita nuori toivoo itselleen.
                  </div>
                </li>
              </ul>
              <p className="text-base text-urak-text-secondary leading-relaxed">
                Nämä neljä ulottuvuutta muodostavat yhdessä nuoren henkilökohtaisen profiilin, joka vertaillaan 760 ammatin vaatimuksiin ja ominaisuuksiin Suomen työmarkkinoilla.
              </p>
            </motion.section>
          </AnimatedSection>

          {/* Section: Teoreettinen tausta */}
          <AnimatedSection delay={0.3}>
            <motion.section
              id="teoreettinen-tausta"
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
                Miten menetelmä toimii?
              </h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Kiinnostuspohjaiset kysymykset
                  </h3>
                  <p className="text-base text-urak-text-secondary leading-relaxed mb-4">
                    UraKompassin kysymykset kartoittavat nuoren kiinnostuksen kohteita eri alueilla: analyyttinen ajattelu, luovuus, käytännön tekeminen, teknologia, ihmisten auttaminen, ympäristö ja johtaminen. Kysymykset on muotoiltu suoraan: "Kiinnostaako sinua...?" tai "Pidätkö...?".
                  </p>
                  <p className="text-base text-urak-text-secondary leading-relaxed">
                    Nuoren vastaukset muodostavat hänen henkilökohtaisen kiinnostusprofiilins, jota verrataan 760 ammatin vaatimuksiin ja ominaisuuksiin. Vertailu perustuu matemaattiseen samankaltaisuuden laskentaan, joka löytää parhaat vastineet nuoren profiilille.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Ikäryhmäkohtaiset testit
                  </h3>
                  <p className="text-base text-urak-text-secondary leading-relaxed mb-4">
                    UraKompassi käyttää kolmea eri testiä eri ikäryhmille:
                  </p>
                  <ul className="space-y-3 text-base text-urak-text-secondary leading-relaxed ml-4">
                    <li className="flex items-start gap-3">
                      <span className="text-urak-accent-blue mt-1">•</span>
                      <div>
                        <strong className="text-white">Yläaste (13-15 v):</strong> 30 kysymystä, jotka kartoittavat peruskiinnostuksen alueita ja oppimistyylejä
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-urak-accent-blue mt-1">•</span>
                      <div>
                        <strong className="text-white">Toisen asteen opiskelijat (16-18 v):</strong> 33 kysymystä, jotka keskittyvät tarkemmin uravalintoihin ja käytännön työtehtäviin
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-urak-accent-blue mt-1">•</span>
                      <div>
                        <strong className="text-white">Nuoret aikuiset (19-21 v):</strong> 30 kysymystä, jotka kartoittavat sekä kiinnostuksen kohteita että työelämän arvoja
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Positiivinen lähestymistapa
                  </h3>
                  <p className="text-base text-urak-text-secondary leading-relaxed">
                    Keskiössä on nuoren oma kokemus ja vahvuuksien tunnistaminen, ei puutteiden korostaminen. Tavoitteena on auttaa nuorta löytämään itselleen sopivia polkuja, ei rajoittaa vaihtoehtoja. Tulokset tarjoavat lähtökohdan keskustelulle, eivät lopullista vastausta.
                  </p>
                </div>
              </div>
            </motion.section>
          </AnimatedSection>

          {/* Section: Miten testi on rakennettu */}
          <AnimatedSection delay={0.4}>
            <motion.section
              id="miten-testi"
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
                Näin UraKompassi on kehitetty
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-urak-accent-blue/40 bg-urak-bg text-sm font-medium text-urak-accent-blue flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Tutkimuskirjallisuuden läpikäynti
                    </h3>
                    <p className="text-base text-urak-text-secondary leading-relaxed">
                      Aloitimme kattavalla kirjallisuuskatsauksella urapsykologian, persoonallisuustutkimuksen ja nuorten ohjauksen aloilta. Tarkastelimme, mitkä menetelmät toimivat parhaiten suomalaisessa kontekstissa.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-urak-accent-blue/40 bg-urak-bg text-sm font-medium text-urak-accent-blue flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Kysymysten luonnosvaihe
                    </h3>
                    <p className="text-base text-urak-text-secondary leading-relaxed">
                      Loimme alkuperäisen kysymyspankin, joka kartoittaa neljää ulottuvuutta: kiinnostukset, vahvuudet, työskentelytapa ja tulevaisuuden toiveet. Kysymykset suunniteltiin selkeiksi, neutraaleiksi ja helposti ymmärrettäviksi nuorille.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-urak-accent-blue/40 bg-urak-bg text-sm font-medium text-urak-accent-blue flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Sisäinen analyysi ja testaus
                    </h3>
                    <p className="text-base text-urak-text-secondary leading-relaxed">
                      Analysoimme vastauksia ja vertasimme niitä ammattiprofiileihin. Tarkistimme, että testi erottaa eri tyyppejä riittävän hyvin ja että tulokset ovat johdonmukaisia.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-urak-accent-blue/40 bg-urak-bg text-sm font-medium text-urak-accent-blue flex items-center justify-center">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Jatkuva kehittäminen
                    </h3>
                    <p className="text-base text-urak-text-secondary leading-relaxed">
                      Palvelu on käytössä ja kehittyy jatkuvasti käyttäjäpalautteen perusteella. Keräämme säännöllisesti palautetta käyttäjiltä ja opettajilta, ja päivitämme kysymyksiä ja analyysiä tarpeen mukaan.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>
          </AnimatedSection>

          {/* Section: Tulosten tulkinta */}
          <AnimatedSection delay={0.5}>
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
                Tulokset ovat keskustelun lähtökohta – eivät valmis päätös
              </h2>
              <p className="text-base text-urak-text-secondary leading-relaxed mb-6">
                UraKompassi ei korvaa opinto-ohjaajaa vaan kokoaa nuoren ajatukset, vahvuudet ja kiinnostuksen kohteet yhteen raporttiin, joka toimii lähtökohtana ohjauskeskustelulle. Testi ei anna nuorelle lopullista vastausta siihen, mitä hänen pitäisi opiskella tai työskennellä. Sen sijaan raportti:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <span className="text-base text-urak-text-secondary leading-relaxed">
                    Nostaa esiin nuoren vahvuuksia ja kiinnostuksen kohteita selkeällä tavalla
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <span className="text-base text-urak-text-secondary leading-relaxed">
                    Tarjoaa esimerkkialoja ja ammatteja, jotka voisivat sopia nuorelle
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <span className="text-base text-urak-text-secondary leading-relaxed">
                    Auttaa nuorta sanoittamaan itseään ja ajatuksiaan urapohdinnassa
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-urak-accent-blue mt-1">•</span>
                  <span className="text-base text-urak-text-secondary leading-relaxed">
                    Toimii lähtökohtana keskustelulle opinto-ohjaajan, opettajan tai huoltajan kanssa
                  </span>
                </li>
              </ul>
              <p className="text-base text-urak-text-secondary leading-relaxed">
                Suosittelemme, että nuori käy raportin läpi yhdessä opinto-ohjaajan, opettajan tai muun luotettavan aikuisen kanssa. Yhdessä voi pohtia, mitkä tulokset tuntuvat oikeilta, mitkä yllättävät ja mitkä kysymykset herättävät lisää pohdintaa.
              </p>
            </motion.section>
          </AnimatedSection>

          {/* Section: Tietosuoja */}
          <AnimatedSection delay={0.6}>
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
                Miten käsittelemme oppilaiden tietoja?
              </h2>
              <div className="space-y-4 text-base text-urak-text-secondary leading-relaxed">
                <p>
                  Oppilaan vastaukset ovat yksityisiä. Opettaja näkee oppilaan tulokset opettajan työpöydässä, mutta oppilas itse päättää, haluaako hän jakaa tuloksensa muille.
                </p>
                <p>
                  UraKompassi näkee vain anonymisoituja, aggregoituja tietoja (esim. &quot;45% yläasteen oppilaista vastasi näin&quot;). Emme myy eikä jaa oppilaiden henkilötietoja kolmansille osapuolille.
                </p>
                <p>
                  Opettajien työpöydässä käytetään PIN-koodeja, jotta oppilaat voivat kirjautua ilman henkilötietojen syöttämistä. Tämä varmistaa GDPR-yhteensopivuuden ja auttaa kouluja noudattamaan tietosuoja-asetusta.
                </p>
              </div>
            </motion.section>
          </AnimatedSection>

          {/* Section: Yhteistyö koulujen kanssa */}
          <AnimatedSection delay={0.7}>
            <motion.section
              id="yhteistyö"
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
                Yhteiskehittäminen koulujen kanssa
              </h2>
              <div className="space-y-4 text-base text-urak-text-secondary leading-relaxed">
                <p>
                  UraKompassi on kehitetty yhdessä suomalaisten koulujen kanssa. Olemme työskennelleet läheisesti opinto-ohjaajien ja opettajien kanssa varmistaaksemme, että menetelmä tukee suomalaista opetussuunnitelmaa ja koulujen ohjauskäytäntöjä.
                </p>
                <p>
                  Palvelu on käytössä ja kehittyy jatkuvasti käyttäjäpalautteen perusteella. Jatkamme yhteistyötä koulujen kanssa kehittääksemme palvelua eteenpäin.
                </p>
              </div>
            </motion.section>
          </AnimatedSection>

        </div>
      </main>
    </div>
  );
}

