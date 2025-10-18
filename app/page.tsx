import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CategoryCard from "@/components/CategoryCard"
import AboutUs from "@/components/AboutUs"
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              CareerCompassi
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="#miten"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Miten toimii
            </Link>
            <Link
              href="#kenelle"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Kenelle
            </Link>
            <Link
              href="/meista"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Meistä
            </Link>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-sm mb-6 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">Tekoälypohjainen urasuunnittelu</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-balance leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent gradient-animate">
              Löydä tulevaisuutesi vibe.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            Luotettava testi, joka auttaa sinua ymmärtämään vahvuuksiasi ja uramahdollisuuksia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="text-lg h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              <Link href="/test">
                Aloita testi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg h-14 px-8 border border-primary hover:bg-primary/10 font-semibold"
            >
              <Link href="#miten">Lue lisää</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6 flex items-center justify-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Zap className="h-4 w-4 text-secondary" />
              30 kysymystä
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-secondary" />
              100% ilmainen
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-secondary" />
              Tekoäly-powered
            </span>
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Mikä on sun vibe?</h2>
          <p className="text-lg text-muted-foreground">Löydä persoonallisuustyyppi, joka vastaa sun energiaa</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      <section id="miten" className="py-20 bg-gradient-to-b from-transparent to-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Miten se toimii?</h2>
            <p className="text-lg text-muted-foreground">Kolme helppoa askelta unelma-urasi löytämiseen</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="h-20 w-20 rounded-lg bg-slate-100 group-hover:bg-primary group-hover:scale-105 text-slate-600 group-hover:text-white flex items-center justify-center text-3xl font-bold mx-auto mb-6 transition-all duration-300 ease-out">
                1
              </div>
              <h3 className="text-2xl font-bold mb-3">Tee testi</h3>
              <p className="text-muted-foreground leading-relaxed">
                Vastaa kysymyksiin kiinnostuksistasi, arvoistasi ja persoonallisuudestasi.
              </p>
            </div>
            <div className="text-center group">
              <div className="h-20 w-20 rounded-lg bg-slate-100 group-hover:bg-primary group-hover:scale-105 text-slate-600 group-hover:text-white flex items-center justify-center text-3xl font-bold mx-auto mb-6 transition-all duration-300 ease-out">
                2
              </div>
              <h3 className="text-2xl font-bold mb-3">Tekoäly analysoi sut</h3>
              <p className="text-muted-foreground leading-relaxed">
                Meidän älykäs tekoäly matchaa sun uniikin profiilin uroihin, jotka oikeesti sopii sulle.
              </p>
            </div>
            <div className="text-center group">
              <div className="h-20 w-20 rounded-lg bg-slate-100 group-hover:bg-primary group-hover:scale-105 text-slate-600 group-hover:text-white flex items-center justify-center text-3xl font-bold mx-auto mb-6 transition-all duration-300 ease-out">
                3
              </div>
              <h3 className="text-2xl font-bold mb-3">Saat sun polun</h3>
              <p className="text-muted-foreground leading-relaxed">
                Saat personoidut urasuositukset ja konkreettiset seuraavat askeleet. Sun tulevaisuus alkaa tästä.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="kenelle" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Kenelle tämä on?</h2>
            <p className="text-lg text-muted-foreground">Jos mietit sun tulevaisuutta, oot oikeessa paikassa</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="group border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5 hover:border-primary/50 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out">
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Yläasteen oppilaat</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">Löydä suunta, joka tuntuu omalta.</p>
                <ul className="space-y-2 text-sm">
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
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Toisen asteen opiskelijat</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">Selvitä, mihin kiinnostuksesi johtavat.</p>
                <ul className="space-y-2 text-sm">
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
              <CardContent className="p-8">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Nuoret aikuiset (20–25v)</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Tutustu uusiin mahdollisuuksiin ja löydä oma polkusi ilman stressiä.
                </p>
                <ul className="space-y-2 text-sm">
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

      <section className="py-20 bg-gradient-to-b from-transparent via-muted/20 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Keitä me olemme</h2>
            <p className="text-lg text-muted-foreground">Kolme nuorta, yksi yhteinen tavoite</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <AboutUs />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-card to-primary/5">
              <CardContent className="p-10">
                <div className="flex items-start gap-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-4">Opinto-ohjaajille</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                      Tämä testi on kehitetty tukemaan opinto-ohjauksen työtä. Ohjaajat voivat hyödyntää tuloksia
                      keskustelun pohjana, kun opiskelija pohtii vahvuuksiaan ja tulevaisuuden vaihtoehtoja.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-xl">✓</span>
                        <span className="text-muted-foreground">
                          Auttaa opiskelijoita tunnistamaan vahvuuksiaan ja kiinnostuksen kohteitaan
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-xl">✓</span>
                        <span className="text-muted-foreground">
                          Tarjoaa konkreettisen pohjan uraohjauskeskusteluille
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary text-xl">✓</span>
                        <span className="text-muted-foreground">Säästää aikaa ja tekee ohjauksesta tehokkaampaa</span>
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
              <CardContent className="p-10">
                <div className="flex items-start gap-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Tärkeä huomautus
                    </h2>
                    <div className="space-y-3 text-muted-foreground leading-relaxed">
                      <p>
                        Tämä testi on tarkoitettu <strong>ohjaukseen ja inspiraatioksi</strong>, ei lopulliseksi
                        päätökseksi urastasi.
                      </p>
                      <p>
                        Tulokset auttavat sinua pohtimaan vahvuuksiasi ja kiinnostuksen kohteitasi, mutta{" "}
                        <strong>lopulliset valinnat ovat aina sinun</strong>.
                      </p>
                      <p>Emme tarjoa virallista ura- tai koulutusneuvontaa.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Mitä muut sanoo</h2>
            <p className="text-lg text-muted-foreground">Katso miten muut löysi oman juttunsa</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 italic leading-relaxed">
                  "Mul ei ollu mitään hajuu mitä haluun tehä. Tää testi näytti mulle urii, joita en ollu ees ajatellu.
                  Nyt opiskelen graafista suunnittelua ja rakastan sitä!"
                </p>
                <p className="font-semibold">- Emma, 18</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-secondary/5 border-secondary/20">
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 italic leading-relaxed">
                  "Vihdoin jotain mikä ymmärtää mua. Tulokset oli ihan spot on ja antoivat mulle varmuutta hakee sitä
                  mitä oikeesti kiinnostaa."
                </p>
                <p className="font-semibold">- Marcus, 19</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-accent/5 border-accent/20">
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 italic leading-relaxed">
                  "Olin jumissa viiden eri polun välillä. Tää auttoi näkemään mikä oikeesti sopii mun persoonalle. Game
                  changer."
                </p>
                <p className="font-semibold">- Sofia, 17</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto bg-gradient-to-br from-primary via-secondary to-accent border-0 glow-effect">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Valmiina löytämään sun vibe?</h2>
              <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
                Sun tuleva minä odottaa. Tee testi nyt ja löydä urat, jotka matchaa sen kuka sä oikeesti oot.
              </p>
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="text-lg h-14 px-8 font-semibold hover:scale-105 transition-transform bg-white text-primary hover:bg-white/90"
              >
                <Link href="/test">
                  Aloita testi
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <p className="text-sm text-white/70 mt-4">Ei rekisteröitymistä • 30 kysymystä • 100% ilmainen</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border/50 py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                CareerCompassi
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Tulevaisuus alkaa itsensä löytämisestä • © 2025 CareerCompassi
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
