import Link from "next/link"
import { headers } from "next/headers"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CategoryCard from "@/components/CategoryCard"
import Logo from "@/components/Logo"
import CallToActionSection from "@/components/CallToActionSection"
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

      <section className="container mx-auto px-4 py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 gradient-animate opacity-30 blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 text-balance leading-tight text-primary">
            Tulevaisuutesi alkaa oivalluksesta.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            Luotettava testi, joka auttaa sinua ymmärtämään vahvuuksiasi ja uramahdollisuuksia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Link href="/test">
                Aloita testi
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base sm:text-lg h-12 sm:h-14 px-6 sm:px-8 border border-primary hover:bg-primary/10 font-semibold"
            >
              <Link href="#miten">Lue lisää</Link>
            </Button>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-6 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
              30 kysymystä
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
              Maksuton
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
              Tekoäly-powered
            </span>
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">Mikä on sun vibe?</h2>
          <p className="text-base sm:text-lg text-muted-foreground">Löydä persoonallisuustyyppi, joka vastaa sun energiaa</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section id="miten" className="py-20 bg-gradient-to-b from-transparent to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">Miten se toimii?</h2>
            <p className="text-base sm:text-lg text-muted-foreground">Kolme helppoa askelta unelma-urasi löytämiseen</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-slate-100 group-hover:bg-primary group-hover:scale-105 text-slate-600 group-hover:text-white flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-4 sm:mb-6 transition-all duration-300 ease-out">
                1
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Tee testi</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Vastaa kysymyksiin kiinnostuksistasi, arvoistasi ja persoonallisuudestasi.
              </p>
            </div>
            <div className="text-center group">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-slate-100 group-hover:bg-primary group-hover:scale-105 text-slate-600 group-hover:text-white flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-4 sm:mb-6 transition-all duration-300 ease-out">
                2
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Tekoäly analysoi sut</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Meidän älykäs tekoäly matchaa sun uniikin profiilin uroihin, jotka oikeesti sopii sulle.
              </p>
            </div>
            <div className="text-center group">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-slate-100 group-hover:bg-primary group-hover:scale-105 text-slate-600 group-hover:text-white flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-4 sm:mb-6 transition-all duration-300 ease-out">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Saat sun polun</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Saat personoidut urasuositukset ja konkreettiset seuraavat askeleet. Sun tulevaisuus alkaa tästä.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="kenelle" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">Kenelle tämä on?</h2>
            <p className="text-base sm:text-lg text-muted-foreground">Jos mietit sun tulevaisuutta, oot oikeessa paikassa</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            <Card className="group border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5 hover:border-primary/50 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out">
              <CardContent className="p-6 sm:p-8">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-3 sm:mb-4">
                  <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">Yläasteen oppilaat</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">Löydä suunta, joka tuntuu omalta.</p>
                <ul className="space-y-2 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Tutustu eri uravaihtoehtoihin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Ymmärrä vahvuutesi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Löydä opintopolku, joka tuntuu oikealta</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="group border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5 hover:border-primary/50 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out">
              <CardContent className="p-6 sm:p-8">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-3 sm:mb-4">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">Toisen asteen opiskelijat</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">Selvitä, mihin kiinnostuksesi johtavat.</p>
                <ul className="space-y-2 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Tunnista kiinnostuksen kohteesi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Selvitä, mihin ammattialoihin ne liittyvät</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Tee päätöksiä, jotka tuntuvat varmoilta</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="group border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5 hover:border-primary/50 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out">
              <CardContent className="p-6 sm:p-8">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-3 sm:mb-4">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3">Nuoret aikuiset (20–25v)</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                  Tutustu uusiin mahdollisuuksiin ja löydä oma polkusi ilman stressiä.
                </p>
                <ul className="space-y-2 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Tutustu uusiin mahdollisuuksiin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Hahmota oma vahvuusprofiilisi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Löydä seuraava askel ilman stressiä</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      <section className="py-20 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out">
              <CardContent className="p-6 sm:p-10">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                    <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Opinto-ohjaajille</h2>
                    <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-4">
                      Tämä testi on kehitetty tukemaan opinto-ohjauksen työtä. Ohjaajat voivat hyödyntää tuloksia
                      keskustelun pohjana, kun opiskelija pohtii vahvuuksiaan ja tulevaisuuden vaihtoehtoja.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-lg sm:text-xl">✓</span>
                        <span className="text-xs sm:text-base text-muted-foreground">
                          Auttaa opiskelijoita tunnistamaan vahvuuksiaan ja kiinnostuksen kohteitaan
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-lg sm:text-xl">✓</span>
                        <span className="text-xs sm:text-base text-muted-foreground">
                          Tarjoaa konkreettisen pohjan uraohjauskeskusteluille
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-lg sm:text-xl">✓</span>
                        <span className="text-xs sm:text-base text-muted-foreground">Säästää aikaa ja tekee ohjauksesta tehokkaampaa</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-accent/30 bg-gradient-to-br from-card to-accent/5">
              <CardContent className="p-6 sm:p-10">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4">
                      Tärkeä huomautus
                    </h2>
                    <div className="space-y-3 text-xs sm:text-base text-muted-foreground leading-relaxed">
                      <p>
                        Tämä testi on tarkoitettu <strong>ohjaukseen ja inspiraatioksi</strong>, ei lopulliseksi
                        päätökseksi urastasi.
                      </p>
                      <p>
                        Tulokset auttavat sinua pohtimaan vahvuuksiasi ja kiinnostuksen kohteitasi, mutta{" "}
                        <strong>lopulliset valinnat ovat aina sinun</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 mb-12 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">Mitä muut sanoo</h2>
              <p className="text-base sm:text-lg text-muted-foreground">Katso miten muut löysi oman juttunsa</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100/80 border border-purple-200/50 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
                <CardContent className="p-8">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-purple-200/60 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-6 font-medium leading-relaxed tracking-wide max-w-sm">
                        "En tiennyt mitä haluan tehdä kun valmistun yläasteesta. Tää testi auttoi ymmärtämään mun vahvuuksia ja näyttää kiinnostavia opintovaihtoehtoja. Nyt tuntuu että mulla on selkeämpi kuva tulevaisuudesta!"
                      </p>
                      <p className="font-semibold text-gray-700 text-sm">Emma, 15</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100/80 border border-purple-200/50 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
                <CardContent className="p-8">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-purple-200/60 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-6 font-medium leading-relaxed tracking-wide max-w-sm">
                        "Olin epävarma mihin haluan hakea jatko-opintoihin. Testi selvensi mun ura-suuntaa ja antoi itseluottamusta tehdä päätöksiä. Nyt tiedän että olen valinnut oikean polun!"
                      </p>
                      <p className="font-semibold text-gray-700 text-sm">Marcus, 17</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100/80 border border-purple-200/50 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
                <CardContent className="p-8">
                  <div className="flex items-start gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-purple-200/60 flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-6 font-medium leading-relaxed tracking-wide max-w-sm">
                        "Olin töissä alalla joka ei tuntunut omalta. Tää testi avasi silmäni uusiin mahdollisuuksiin ja auttoi löytämään uran joka oikeesti sopii mulle. Elämäni on muuttunut parempaan suuntaan!"
                      </p>
                      <p className="font-semibold text-gray-700 text-sm">Sofia, 23</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <CallToActionSection />

      <footer className="border-t border-border/50 py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="flex flex-col gap-2">
              <Logo className="h-8 w-auto" />
              <div className="flex gap-4 text-sm">
                <Link href="/ammatit" className="text-muted-foreground hover:text-foreground transition-colors">
                  Urakirjasto
                </Link>
                {isLocalhost && (
                  <Link href="/kouluille" className="text-muted-foreground hover:text-foreground transition-colors">
                    Kouluille
                  </Link>
                )}
                <Link href="/teacher/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Opettajille
                </Link>
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
              <p><a href="mailto:support@careercompassi.com" className="text-primary hover:underline">support@careercompassi.com</a></p>
              <p className="text-muted-foreground mt-4">Tulevaisuus alkaa itsensä löytämisestä • © 2025 CareerCompassi</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


