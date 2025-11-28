import Link from "next/link"
import { headers } from "next/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import CategoryCard from "@/components/CategoryCard"
import Logo from "@/components/Logo"
import CallToActionSection from "@/components/CallToActionSection"
import StatsSection from "@/components/StatsSection"
import { getAllCategories } from "@/lib/categories"
import {
  Sparkles,
  Target,
  Users,
  ArrowRight,
  Zap,
  Heart,
  Lightbulb,
  TrendingUp,
  Hammer,
  Leaf,
  GraduationCap,
  Eye,
  ClipboardList,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

export default function HomePage() {
  const categories = getAllCategories();
  const headersList = headers();
  const hostname = headersList.get('host') || '';
  const isLocalhost = hostname === 'localhost:3000' || hostname === '127.0.0.1:3000';

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="#miten"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Miten toimii
            </Link>
            <Link
              href="/ammatit"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Urakirjasto
            </Link>
            <Link
              href="/meista"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Meistä
            </Link>
            {isLocalhost && (
              <Link
                href="/todistuspistelaskuri"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Todistuspistelaskuri
              </Link>
            )}
            <Link
              href="/teacher/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Opettajille
            </Link>
            {/* Kouluille link hidden from public - only visible in localhost via middleware */}
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Link href="/test">Aloita testi</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-16 md:py-24 overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            {/* Accent line above heading */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 w-12 bg-gradient-to-r from-transparent via-primary to-primary rounded-full"></div>
              <div className="h-1 w-12 bg-primary rounded-full"></div>
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-slate-900 leading-tight">
              Löydä ura, joka sopii
              <span className="text-primary"> juuri sinulle</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Vastaa 30 kysymykseen ja saat henkilökohtaiset urasuositukset 361 ammatin joukosta.
              Luotettava, maksuton ja nopea – vain 5 minuuttia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button
                size="lg"
                asChild
                className="text-lg h-14 px-8 bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl"
              >
                <Link href="/test">Aloita ilmainen testi</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg h-14 px-8 border-2 border-slate-200 hover:border-primary hover:bg-slate-50 font-semibold"
              >
                <Link href="/ammatit">Selaa ammatteja</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 text-sm text-slate-600 flex-wrap">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                Maksuton
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                5 minuuttia
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                Tekoälypohjainen
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Kahdeksan persoonallisuustyyppiä
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Löydä tyyppi, joka kuvaa parhaiten sinua ja töitä, jotka sopivat sinulle
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index} />
          ))}
        </div>
      </section>

      <section id="miten" className="relative py-20 bg-slate-50/50 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(43, 95, 117) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center mb-16">
            {/* Accent decoration */}
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-secondary rounded-full"></div>
              <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Prosessi</span>
              <div className="w-8 h-0.5 bg-secondary rounded-full"></div>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Miten Urakompassi toimii?
            </h2>
            <p className="text-lg text-slate-600">
              Kolme yksinkertaista vaihetta urasi löytämiseen
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-md hover:border-primary/30 transition-all group">
              {/* Step connector line - hidden on mobile */}
              <div className="hidden md:block absolute top-12 -right-8 w-16 h-0.5 bg-gradient-to-r from-primary/20 to-transparent"></div>

              <div className="flex items-center justify-center mb-6">
                <div className="relative h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <span className="absolute text-4xl font-bold text-primary/30 -top-2 -left-2">01</span>
                  <Eye className="h-12 w-12 text-primary" />
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center group-hover:text-primary transition-colors">
                Vastaa kysymyksiin
              </h3>
              <p className="text-slate-600 leading-relaxed text-center">
                Käy läpi 30 huolellisesti laadittua kysymystä, jotka kartoittavat kiinnostuksen kohteitasi, arvojasi ja vahvuuksiasi.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-md hover:border-primary/30 transition-all group">
              {/* Step connector line - hidden on mobile */}
              <div className="hidden md:block absolute top-12 -right-8 w-16 h-0.5 bg-gradient-to-r from-primary/20 to-transparent"></div>

              <div className="flex items-center justify-center mb-6">
                <div className="relative h-16 w-16 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/15 transition-colors">
                  <span className="absolute text-4xl font-bold text-secondary/30 -top-2 -left-2">02</span>
                  <ClipboardList className="h-12 w-12 text-secondary" />
                  <div className="absolute inset-0 rounded-xl bg-secondary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center group-hover:text-secondary transition-colors">
                Tekoäly analysoi vastauksesi
              </h3>
              <p className="text-slate-600 leading-relaxed text-center">
                Edistynyt algoritmi analysoi profiilisi ja vertaa sitä 361 ammatin vaatimuksiin ja ominaisuuksiin.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-md hover:border-primary/30 transition-all group">
              <div className="flex items-center justify-center mb-6">
                <div className="relative h-16 w-16 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
                  <span className="absolute text-4xl font-bold text-accent/30 -top-2 -left-2">03</span>
                  <TrendingUp className="h-12 w-12 text-accent" />
                  <div className="absolute inset-0 rounded-xl bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 text-center group-hover:text-accent transition-colors">
                Saat henkilökohtaiset suositukset
              </h3>
              <p className="text-slate-600 leading-relaxed text-center">
                Saat räätälöidyt urasuositukset ja selkeät ohjeet koulutuspoluista sekä seuraavista askeleista.
              </p>
            </div>
          </div>
        </div>
      </section>

      

      <section id="kenelle" className="relative py-24 bg-gradient-to-b from-white via-slate-50/30 to-white overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(43, 95, 117) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }}></div>
        
        {/* Accent shapes */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/3 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center mb-20">
            {/* Different header style - more prominent */}
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-1 w-16 bg-gradient-to-r from-transparent via-accent to-accent rounded-full"></div>
                <span className="text-sm font-bold text-accent uppercase tracking-[0.15em] px-4 py-2 bg-accent/10 rounded-full">Kohderyhmät</span>
                <div className="h-1 w-16 bg-gradient-to-r from-accent via-accent to-transparent rounded-full"></div>
              </div>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-slate-900 leading-tight">
              Kenelle Urakompassi on tarkoitettu?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Tuki urasuunnitteluun kaikissa elämänvaiheissa
            </p>
          </div>
          
          {/* Redesigned cards with distinct visual style */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Yläasteen oppilaat */}
            <div className="group relative">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full flex flex-col">
                {/* Icon with colored background */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 group-hover:from-primary/25 group-hover:to-primary/10 transition-all duration-300">
                    <GraduationCap className="h-10 w-10 text-primary" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">
                  Yläasteen oppilaat
                </h3>
                
                <p className="text-slate-600 mb-6 leading-relaxed text-base">
                  Löydä suunta toisen asteen opintoihin ja tutki eri urapolkuja.
                </p>
                
                {/* Benefits with checkmark icons */}
                <ul className="space-y-4 mt-auto">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-slate-700 leading-relaxed">Tutustu laajaan valikoimaan uroja ja ammatteja</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-slate-700 leading-relaxed">Tunnista omat vahvuutesi ja kiinnostuksen kohteesi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-slate-700 leading-relaxed">Saat selkeän kuvan erilaisista koulutuspoluista</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Toisen asteen opiskelijat */}
            <div className="group relative">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full flex flex-col">
                {/* Icon with colored background */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary/15 to-secondary/5 group-hover:from-secondary/25 group-hover:to-secondary/10 transition-all duration-300">
                    <Target className="h-10 w-10 text-secondary" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-secondary transition-colors">
                  Toisen asteen opiskelijat
                </h3>
                
                <p className="text-slate-600 mb-6 leading-relaxed text-base">
                  Tarkenna urasuunnitelmaasi ja löydä polku jatko-opintoihin.
                </p>
                
                {/* Benefits with checkmark icons */}
                <ul className="space-y-4 mt-auto">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-slate-700 leading-relaxed">Selvitä, mihin ammattialoihin kiinnostuksesi johtavat</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-slate-700 leading-relaxed">Vertaile eri koulutusvaihtoehtoja ja urapolkuja</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-slate-700 leading-relaxed">Tee tietoon perustuvia päätöksiä tulevaisuudestasi</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Nuoret aikuiset */}
            <div className="group relative">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 h-full flex flex-col">
                {/* Icon with colored background */}
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 group-hover:from-accent/25 group-hover:to-accent/10 transition-all duration-300">
                    <Users className="h-10 w-10 text-accent" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-accent transition-colors">
                  Nuoret aikuiset
                </h3>
                
                <p className="text-slate-600 mb-6 leading-relaxed text-base">
                  Harkitse uudelleenkouluttautumista tai uran vaihtoa luottavaisin mielin.
                </p>
                
                {/* Benefits with checkmark icons */}
                <ul className="space-y-4 mt-auto">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-slate-700 leading-relaxed">Tutki uusia uramahdollisuuksia ja aloja</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-slate-700 leading-relaxed">Hahmota oma vahvuusprofiilisi ja soveltuvuutesi</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-0.5">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <span className="text-slate-700 leading-relaxed">Löydä seuraava askel selkeän analyysin avulla</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-10">
              <div className="flex items-start gap-6">
                <div className="hidden sm:block w-1 h-24 bg-primary rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                    Miten testiä tulisi käyttää
                  </h3>
                  <div className="space-y-4 text-base text-slate-600 leading-relaxed">
                    <p>
                      Urakompassi on suunniteltu <strong className="text-slate-900">ohjaamaan ja inspiroimaan</strong> uravalinnassasi.
                      Testi analysoi vahvuutesi ja kiinnostuksesi, antaen sinulle henkilökohtaisia suosituksia.
                    </p>
                    <p>
                      Tulokset ovat <strong className="text-slate-900">lähtökohta keskustelulle</strong> – käytä niitä
                      pohtiessasi omaa tulevaisuuttasi yhdessä opettajien, opinto-ohjaajien ja perheen kanssa.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials section - only visible on localhost */}
      {isLocalhost && (
        <section id="testimonials" className="py-20 mb-12 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">Mitä muut sanoo</h2>
              <p className="text-base sm:text-lg text-muted-foreground">Katso miten muut löysi oman juttunsa</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              <Card className="bg-gradient-to-br from-slate-50 to-teal-50/30 border border-primary/20 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
                <CardContent className="p-8">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-6 font-medium leading-relaxed tracking-wide max-w-sm">
                        &quot;En tiennyt mitä haluan tehdä kun valmistun yläasteesta. Tää testi auttoi ymmärtämään mun vahvuuksia ja näyttää kiinnostavia opintovaihtoehtoja. Nyt tuntuu että mulla on selkeämpi kuva tulevaisuudesta!&quot;
                      </p>
                      <p className="font-semibold text-neutral-200 text-sm">Emma, 15</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-slate-50 to-teal-50/30 border border-primary/20 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
                <CardContent className="p-8">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-6 font-medium leading-relaxed tracking-wide max-w-sm">
                        &quot;Olin epävarma mihin haluan hakea jatko-opintoihin. Testi selvensi mun ura-suuntaa ja antoi itseluottamusta tehdä päätöksiä. Nyt tiedän että olen valinnut oikean polun!&quot;
                      </p>
                      <p className="font-semibold text-neutral-200 text-sm">Marcus, 17</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-slate-50 to-teal-50/30 border border-primary/20 rounded-2xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-in-out">
                <CardContent className="p-8">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-6 font-medium leading-relaxed tracking-wide max-w-sm">
                        &quot;Olin töissä alalla joka ei tuntunut omalta. Tää testi avasi silmäni uusiin mahdollisuuksiin ja auttoi löytämään uran joka oikeesti sopii mulle. Elämäni on muuttunut parempaan suuntaan!&quot;
                      </p>
                      <p className="font-semibold text-neutral-200 text-sm">Sofia, 23</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

        <CallToActionSection />

      <footer className="border-t border-border/50 py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="flex flex-col gap-2">
              <Logo className="h-8 w-auto" />
              <div className="flex gap-4 text-sm">
                {isLocalhost && (
                  <Link href="/kouluille" className="text-muted-foreground hover:text-foreground transition-colors">
                    Kouluille
                  </Link>
                )}
                {process.env.NEXT_PUBLIC_SHOW_ADMIN === 'true' && (
                  <Link href="/admin/teachers" className="text-muted-foreground hover:text-foreground transition-colors">
                    Admin
                  </Link>
                )}
              </div>
            </div>
            <div className="text-sm">
              <p className="font-semibold mb-2">Laki ja tietosuoja</p>
              <ul className="space-y-1">
                <li><a href="/legal/kayttoehdot" className="text-primary hover:underline">Käyttöehdot</a></li>
                <li><a href="/legal/tietosuojaseloste" className="text-primary hover:underline">Tietosuojaseloste</a></li>
                <li><a href="/legal/immateriaalioikeus-ja-kilpailijasuoja" className="text-primary hover:underline">Immateriaalioikeus- ja kilpailijansuoja</a></li>
              </ul>
            </div>
            <div className="text-sm">
              <p className="font-semibold mb-2">Tuki</p>
              <p><a href="mailto:support@urakompassi.com" className="text-primary hover:underline">support@urakompassi.com</a></p>
              <p className="text-muted-foreground mt-4">Tulevaisuus alkaa itsensä löytämisestä • © 2025 Urakompassi</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

