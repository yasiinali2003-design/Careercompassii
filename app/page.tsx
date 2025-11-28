import Link from "next/link"
import { headers } from "next/headers"
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
  const headersList = headers();
  const hostname = headersList.get('host') || '';
  const isLocalhost = hostname === 'localhost:3000' || hostname === '127.0.0.1:3000';

  return (
    <div className="min-h-screen bg-transparent">
      {/* Navigation - Transparent header that adapts on scroll */}
      <ScrollNav />

      {/* Hero Section - Premium Nordic SaaS Design */}
      <section className="relative mx-auto px-6 pt-24 md:pt-32 pb-20 md:pb-28" style={{ background: 'transparent' }}>
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center">
            {/* Main headline */}
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-urak-text-primary leading-[1.05] tracking-tight">
              Löydä suunta, joka tuntuu omalta
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-urak-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
              10–15 minuutin uratesti, joka perustuu tutkittuun psykologiaan ja auttaa tunnistamaan vahvuudet ja suuntautumisvaihtoehdot.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                href="/test"
                className="group inline-flex items-center justify-center gap-2 bg-urak-accent-blue hover:bg-urak-accent-blue/90 text-urak-bg font-medium px-8 py-4 text-base rounded-[18px] transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Aloita testi
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/ammatit"
                className="inline-flex items-center justify-center border border-urak-border/50 hover:border-urak-border text-urak-text-secondary hover:text-urak-text-primary font-medium px-8 py-4 text-base rounded-[18px] transition-all duration-200 hover:bg-urak-surface/50"
              >
                Selaa ammatteja
              </Link>
            </div>

            {/* Trust indicators - Compact single line */}
            <div className="flex items-center justify-center gap-6 text-xs text-urak-text-muted">
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
            </div>
          </div>
        </div>
      </section>

      {/* Miten Urakompassi auttaa */}
      <WhySection />

      {/* Category Section - Premium Nordic SaaS Design */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h2 className="font-heading text-3xl font-semibold md:text-4xl text-white mb-2">
            Kahdeksan ainutlaatuista tyyppiä
          </h2>
          <p className="text-sm text-gray-400">
            Löydä tyyppi, joka kuvaa parhaiten sinua ja töitä, jotka sopivat sinulle
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index} />
          ))}
        </div>
      </section>

      {/* How it works - Snake Steps with animated path */}
      <section id="miten" className="relative py-12 overflow-hidden">
        <SnakeSteps />
      </section>

      {/* Target audience - Premium Nordic SaaS Design */}
      <section id="kenelle" className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="font-heading text-3xl font-semibold md:text-4xl text-white mb-2">
              Kenelle Urakompassi on tarkoitettu?
            </h2>
            <p className="text-sm text-gray-400">
              Tuki urasuunnitteluun kaikissa elämänvaiheissa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-6 mt-12">
            {/* Yläasteen oppilaat */}
            <article className="bg-[#11161f] ring-1 ring-white/5 rounded-xl p-8 shadow-[0_0_24px_rgba(0,0,0,0.25)]">
              <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center text-white/60 mb-6">
                <GraduationCap className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-semibold text-white">
                Yläasteen oppilaat
              </h3>

              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                Löydä suunta toisen asteen opintoihin ja tutki eri urapolkuja.
              </p>

              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-4 w-4 text-white/50 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-gray-400 leading-relaxed">Tutustu laajaan valikoimaan uroja ja ammatteja</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-4 w-4 text-white/50 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-gray-400 leading-relaxed">Tunnista omat vahvuutesi ja kiinnostuksen kohteesi</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-4 w-4 text-white/50 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-gray-400 leading-relaxed">Saat selkeän kuvan erilaisista koulutuspoluista</span>
                </li>
              </ul>
            </article>

            {/* Toisen asteen opiskelijat */}
            <article className="bg-[#11161f] ring-1 ring-white/5 rounded-xl p-8 shadow-[0_0_24px_rgba(0,0,0,0.25)]">
              <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center text-white/60 mb-6">
                <Target className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-semibold text-white">
                Toisen asteen opiskelijat
              </h3>

              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                Tarkenna urasuunnitelmaasi ja löydä polku jatko-opintoihin.
              </p>

              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-4 w-4 text-white/50 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-gray-400 leading-relaxed">Selvitä, mihin ammattialoihin kiinnostuksesi johtavat</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-4 w-4 text-white/50 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-gray-400 leading-relaxed">Vertaile eri koulutusvaihtoehtoja ja urapolkuja</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-4 w-4 text-white/50 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-gray-400 leading-relaxed">Tee tietoon perustuvia päätöksiä tulevaisuudestasi</span>
                </li>
              </ul>
            </article>

            {/* Nuoret aikuiset */}
            <article className="bg-[#11161f] ring-1 ring-white/5 rounded-xl p-8 shadow-[0_0_24px_rgba(0,0,0,0.25)]">
              <div className="h-12 w-12 rounded-lg bg-white/5 flex items-center justify-center text-white/60 mb-6">
                <Users className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-semibold text-white">
                Nuoret aikuiset
              </h3>

              <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                Harkitse uudelleenkouluttautumista tai uran vaihtoa luottavaisin mielin.
              </p>

              <ul className="mt-6 space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-4 w-4 text-white/50 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-gray-400 leading-relaxed">Tutki uusia uramahdollisuuksia ja aloja</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-4 w-4 text-white/50 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-gray-400 leading-relaxed">Hahmota oma vahvuusprofiilisi ja soveltuvuutesi</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-4 w-4 text-white/50 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-gray-400 leading-relaxed">Löydä seuraava askel selkeän analyysin avulla</span>
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Editorial info block - Premium Nordic Design */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-[#11161f] rounded-xl ring-1 ring-white/5 p-8 md:p-10 max-w-3xl mx-auto mt-16">
            <h3 className="text-2xl font-semibold text-white">
              Miten testiä tulisi käyttää
            </h3>
            <div className="text-base text-gray-400 mt-4 leading-relaxed space-y-4">
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
      </section>

      <CallToActionSection />
    </div>
  )
}
