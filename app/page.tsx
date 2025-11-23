import Link from "next/link"
import { headers } from "next/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CategoryCard from "@/components/CategoryCard"
import Logo from "@/components/Logo"
import CallToActionSection from "@/components/CallToActionSection"
import StatsSection from "@/components/StatsSection"
import SnakeSteps from "@/components/SnakeSteps"
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
    <div className="min-h-screen bg-gradient-to-b from-[#0f1419] via-[#1a1d23] to-[#0f1419]">
      {/* Navigation - Modern glass morphism style with animation */}
      <nav className="nav-blur sticky top-0 z-50 animate-fade-in-down">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-all duration-300 hover:scale-105">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-8">
            <Link
              href="#miten"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-all duration-300 hover:scale-105 hidden sm:block"
            >
              Miten toimii
            </Link>
            <Link
              href="/ammatit"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-all duration-300 hover:scale-105 hidden sm:block"
            >
              Urakirjasto
            </Link>
            <Link
              href="/meista"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-all duration-300 hover:scale-105 hidden sm:block"
            >
              Meistä
            </Link>
            <Link
              href="/teacher/login"
              className="text-sm font-medium text-neutral-300 hover:text-white transition-all duration-300 hover:scale-105 hidden sm:block"
            >
              Opettajille
            </Link>
            <Button
              asChild
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium px-6 h-10 rounded-full transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-2xl hover:-translate-y-0.5"
            >
              <Link href="/test">Aloita testi</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Premium animated design */}
      <section className="relative container mx-auto px-6 pt-20 md:pt-32 pb-16 md:pb-24 overflow-hidden">
        {/* Animated floating elements with morphing */}
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-[#2B5F75]/10 to-[#4A7C59]/10 blur-3xl animate-float animate-morph"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-[#E8994A]/10 to-[#2B5F75]/10 blur-3xl animate-float animate-morph" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#4A7C59]/5 to-transparent blur-3xl animate-pulse-glow"></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(43 95 117) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }}></div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            {/* Badge with animation */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 animate-fade-in-up">
              <Sparkles className="h-4 w-4 text-[#E8994A] animate-pulse-glow" />
              <span className="text-sm font-medium text-neutral-200">361 ammattia • 8 persoonallisuustyyppiä</span>
            </div>

            {/* Main headline with staggered animation */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 text-white leading-[1.1] tracking-tight">
              <span className="block animate-fade-in-up opacity-0 animation-delay-100" style={{animationFillMode: 'forwards'}}>Löydä ura, joka</span>
              <span className="gradient-text block animate-fade-in-up opacity-0 animation-delay-200" style={{animationFillMode: 'forwards'}}>sopii sinulle</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-neutral-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up opacity-0 animation-delay-300" style={{animationFillMode: 'forwards'}}>
              Tekoälypohjainen uratesti auttaa sinua löytämään oikean suunnan.
              <span className="block mt-2">Vastaa 30 kysymykseen ja saat henkilökohtaiset suositukset.</span>
            </p>

            {/* CTAs - Premium animated buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-up opacity-0 animation-delay-400" style={{animationFillMode: 'forwards'}}>
              <Button
                size="lg"
                asChild
                className="group h-14 px-10 bg-neutral-900 hover:bg-neutral-800 text-white text-lg font-semibold rounded-full shadow-2xl hover:shadow-neutral-900/30 hover:scale-105 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
              >
                <Link href="/test" className="flex items-center gap-2 relative z-10">
                  Aloita ilmainen testi
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="h-14 px-10 bg-neutral-900 hover:bg-neutral-800 text-white text-lg font-semibold rounded-full shadow-2xl hover:shadow-neutral-900/30 hover:scale-105 hover:-translate-y-1 transition-all duration-500"
              >
                <Link href="/ammatit">Selaa ammatteja</Link>
              </Button>
            </div>

            {/* Trust indicators with staggered animation */}
            <div className="flex items-center justify-center gap-8 text-sm text-neutral-400 flex-wrap animate-fade-in-up opacity-0 animation-delay-500" style={{animationFillMode: 'forwards'}}>
              <span className="flex items-center gap-2 hover:text-neutral-200 transition-colors duration-300">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse-glow"></div>
                Maksuton
              </span>
              <span className="flex items-center gap-2 hover:text-neutral-200 transition-colors duration-300">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse-glow"></div>
                5 minuuttia
              </span>
              <span className="flex items-center gap-2 hover:text-neutral-200 transition-colors duration-300">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse-glow"></div>
                Tekoälypohjainen
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Category Section - Modern card grid */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-sm font-semibold text-[#E8994A] uppercase tracking-wider mb-4 block">Persoonallisuustyypit</span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
            Kahdeksan ainutlaatuista<br/>tyyppiä
          </h2>
          <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto">
            Löydä tyyppi, joka kuvaa parhaiten sinua ja töitä, jotka sopivat sinulle
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {categories.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index} />
          ))}
        </div>
      </section>

      {/* How it works - Snake Steps with animated path */}
      <section id="miten" className="relative py-12 bg-gradient-to-b from-[#0f1419]/50 to-[#0f1419] overflow-hidden">
        <SnakeSteps />
      </section>

      {/* Target audience - Modern card design */}
      <section id="kenelle" className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <span className="text-sm font-semibold text-[#4A7C59] uppercase tracking-wider mb-4 block">Kohderyhmät</span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Kenelle Urakompassi<br/>on tarkoitettu?
            </h2>
            <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl mx-auto">
              Tuki urasuunnitteluun kaikissa elämänvaiheissa
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Student categories */}
            <div className="content-box rounded-3xl p-10 card-hover">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2B5F75]/10 to-[#2B5F75]/5">
                  <GraduationCap className="h-8 w-8 text-[#2B5F75]" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                Yläasteen oppilaat
              </h3>

              <p className="text-neutral-300 mb-6 leading-relaxed">
                Löydä suunta toisen asteen opintoihin ja tutki eri urapolkuja.
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#2B5F75] flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300 text-sm">Tutustu laajaan valikoimaan uroja ja ammatteja</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#2B5F75] flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300 text-sm">Tunnista omat vahvuutesi ja kiinnostuksen kohteesi</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#2B5F75] flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300 text-sm">Saat selkeän kuvan erilaisista koulutuspoluista</span>
                </li>
              </ul>
            </div>

            <div className="content-box rounded-3xl p-10 card-hover">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8994A]/10 to-[#E8994A]/5">
                  <Target className="h-8 w-8 text-[#E8994A]" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                Toisen asteen opiskelijat
              </h3>

              <p className="text-neutral-300 mb-6 leading-relaxed">
                Tarkenna urasuunnitelmaasi ja löydä polku jatko-opintoihin.
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#E8994A] flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300 text-sm">Selvitä, mihin ammattialoihin kiinnostuksesi johtavat</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#E8994A] flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300 text-sm">Vertaile eri koulutusvaihtoehtoja ja urapolkuja</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#E8994A] flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300 text-sm">Tee tietoon perustuvia päätöksiä tulevaisuudestasi</span>
                </li>
              </ul>
            </div>

            <div className="content-box rounded-3xl p-10 card-hover">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A7C59]/10 to-[#4A7C59]/5">
                  <Users className="h-8 w-8 text-[#4A7C59]" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                Nuoret aikuiset
              </h3>

              <p className="text-neutral-300 mb-6 leading-relaxed">
                Harkitse uudelleenkouluttautumista tai uran vaihtoa luottavaisin mielin.
              </p>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#4A7C59] flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300 text-sm">Tutki uusia uramahdollisuuksia ja aloja</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#4A7C59] flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300 text-sm">Hahmota oma vahvuusprofiilisi ja soveltuvuutesi</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#4A7C59] flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-300 text-sm">Löydä seuraava askel selkeän analyysin avulla</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer section - Minimal design */}
      <section className="py-20 bg-gradient-to-b from-[#0f1419] to-[#1a1d23]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="content-box rounded-3xl p-10 sm:p-12">
              <div className="flex items-start gap-6">
                <div className="hidden sm:block w-1 h-24 bg-gradient-to-b from-[#2B5F75] to-[#4A7C59] rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Miten testiä tulisi käyttää
                  </h3>
                  <div className="space-y-4 text-base text-neutral-300 leading-relaxed">
                    <p>
                      Urakompassi on suunniteltu <strong className="text-white font-semibold">ohjaamaan ja inspiroimaan</strong> uravalinnassasi.
                      Testi analysoi vahvuutesi ja kiinnostuksesi, antaen sinulle henkilökohtaiset suositukset.
                    </p>
                    <p>
                      Tulokset ovat <strong className="text-white font-semibold">lähtökohta keskustelulle</strong> – käytä niitä
                      pohtiessasi omaa tulevaisuuttasi yhdessä opettajien, opinto-ohjaajien ja perheen kanssa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToActionSection />

      {/* Footer - Clean, minimal */}
      <footer className="border-t border-white/10 py-12 bg-[#0f1419]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="flex flex-col gap-2">
              <Logo className="h-8 w-auto" />
              <div className="flex gap-4 text-sm mt-4">
                {isLocalhost && (
                  <Link href="/kouluille" className="text-neutral-400 hover:text-white transition-colors">
                    Kouluille
                  </Link>
                )}
                {process.env.NEXT_PUBLIC_SHOW_ADMIN === 'true' && (
                  <Link href="/admin/teachers" className="text-neutral-400 hover:text-white transition-colors">
                    Admin
                  </Link>
                )}
              </div>
            </div>
            <div className="text-sm">
              <p className="font-semibold mb-3 text-white">Laki ja tietosuoja</p>
              <ul className="space-y-2">
                <li><a href="/legal/kayttoehdot" className="text-neutral-400 hover:text-white transition-colors">Käyttöehdot</a></li>
                <li><a href="/legal/tietosuojaseloste" className="text-neutral-400 hover:text-white transition-colors">Tietosuojaseloste</a></li>
                <li><a href="/legal/immateriaalioikeus-ja-kilpailijasuoja" className="text-neutral-400 hover:text-white transition-colors">Immateriaalioikeus- ja kilpailijansuoja</a></li>
              </ul>
            </div>
            <div className="text-sm">
              <p className="font-semibold mb-3 text-white">Tuki</p>
              <p><a href="mailto:support@urakompassi.com" className="text-neutral-400 hover:text-white transition-colors">support@urakompassi.com</a></p>
              <p className="text-neutral-500 mt-6">Tulevaisuus alkaa itsensä löytämisestä • © 2025 Urakompassi</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
