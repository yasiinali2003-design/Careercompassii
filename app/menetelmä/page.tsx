import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/Logo"
import { CheckCircle, ArrowRight, Target, Users, Brain, TrendingUp, Shield, Database } from "lucide-react"

export default function MethodologyPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="nav-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-all duration-300">
            <Logo className="h-10 w-auto" />
          </Link>
          <Link href="/test">
            <Button className="bg-neutral-900 hover:bg-neutral-800 text-white">
              Aloita testi
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Miten Urakompassi toimii?
          </h1>
          <p className="text-xl text-neutral-300 leading-relaxed">
            Läpinäkyvä selitys menetelmästämme ja siitä,
            miten saat luotettavia urasuosituksia
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Overview */}
          <Card className="border-2 border-white/20 bg-[#11161D]">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Brain className="h-8 w-8 text-blue-400" />
                Yleiskatsaus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-neutral-300 leading-relaxed">
              <p>
                Urakompassi on <strong className="text-white">tieteelliseen psykologiaan perustuva uraohjaustyökalu</strong>,
                joka auttaa oppilaita ja nuoria löytämään heille sopivat urapolut Suomen työmarkkinoilla.
              </p>
              <p>
                Emme käytä tekoälyä suositusten generointiin. Sen sijaan käytämme <strong className="text-white">tutkittua menetelmää</strong>,
                joka perustuu persoonallisuuspsykologiaan, urapsykologiaan ja reaaliaikaiseen dataan Suomen työmarkkinoista.
              </p>
            </CardContent>
          </Card>

          {/* Step-by-Step Process */}
          <Card className="border-2 border-white/20 bg-[#11161D]">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Target className="h-8 w-8 text-green-400" />
                Prosessin vaiheet
              </CardTitle>
              <CardDescription>Miten testin tulos syntyy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Step 1 */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm">1</span>
                  Vastaat 30 kysymykseen
                </h3>
                <p className="text-neutral-300 mb-4">
                  Kysymykset on suunniteltu <strong className="text-white">ikäryhmittäin</strong> (13-15v, 16-19v, 20+v),
                  ja ne kartoittavat:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                    <span className="text-urak-text-secondary"><strong className="text-white">Kiinnostukset:</strong> Mitkä aihepiirit ja tehtävät motivoivat sinua (esim. teknologia, ihmiset, luovuus)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                    <span className="text-urak-text-secondary"><strong className="text-white">Arvot:</strong> Mitä pidät tärkeänä urallasi (esim. palkka, turvallisuus, vaikuttavuus)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                    <span className="text-urak-text-secondary"><strong className="text-white">Työtapa:</strong> Miten tykkäät työskennellä (esim. itsenäisesti vs. tiimissä, käytännössä vs. teoriassa)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                    <span className="text-urak-text-secondary"><strong className="text-white">Työympäristö:</strong> Missä olosuhteissa viihdyt (esim. toimisto, kenttä, etätyö)</span>
                  </li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-sm">2</span>
                  Laskemme vahvuusprofiilisi
                </h3>
                <p className="text-neutral-300 mb-4">
                  Vastauksesi muunnetaan <strong className="text-white">monidimensionaaliseksi profiiliksi</strong>,
                  joka kuvaa:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span className="text-neutral-300">Missä ulottuvuuksissa (interests, values, workstyle, context) olet vahva</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span className="text-neutral-300">Mitkä ala-ulottuvuudet (esim. teknologia, luovuus, organisointi) ovat sinulle tärkeitä</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span className="text-neutral-300">Mikä 8 persoonallisuustyypistä (Innovoija, Auttaja, Luova, Johtaja, Rakentaja, Järjestäjä, Visionääri, Ympäristön puolustaja) kuvaa sinua parhaiten</span>
                  </li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500 text-white text-sm">3</span>
                  Vertailemme profiiliasi satoihin ammatteihin
                </h3>
                <p className="text-neutral-300 mb-4">
                  Meillä on <strong className="text-white">yli 700 suomalaista ammattia</strong> tietokannassa.
                  Jokaisella ammatilla on oma profiili, joka kuvaa:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span className="text-neutral-300">Mitä vahvuuksia ammatti vaatii (esim. analyyttinen ajattelu, empatia, luovuus)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span className="text-neutral-300">Millainen työympäristö on (esim. toimisto, tehdas, kenttä)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span className="text-neutral-300">Mitä arvoja ammatti korostaa (esim. turvallisuus, vaikuttavuus, luovuus)</span>
                  </li>
                </ul>
                <p className="text-neutral-300 mt-4">
                  Käytämme <strong className="text-white">vektoripohjaista vastaavuuslaskentaa</strong> (matemaattinen menetelmä,
                  joka mittaa kuinka samankaltaisia kaksi profiilia ovat). Mitä korkeampi vastaavuuspisteet,
                  sitä paremmin ammatti sopii sinulle.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white text-sm">4</span>
                  Valitsemme parhaat suositukset
                </h3>
                <p className="text-neutral-300 mb-4">
                  Näytämme sinulle <strong className="text-white">5-10 parasta ammattia</strong> vastaavuuspisteiden perusteella,
                  ja lisäksi:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span className="text-neutral-300"><strong className="text-white">Selitämme miksi</strong> ammatti sopii sinulle (mitä vahvuuksiasi se hyödyntää)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span className="text-neutral-300"><strong className="text-white">Näytämme todelliset tiedot</strong> Suomen työmarkkinoista (palkka, työllisyysnäkymät, koulutuspolut)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-400 mt-0.5">•</span>
                    <span className="text-neutral-300"><strong className="text-white">Esittelemme koulutuspolkuja</strong> (lukio/ammattikoulu/yliopisto/AMK), joihin voit tutustua iän ja vastaustesi perusteella</span>
                  </li>
                </ul>
              </div>

            </CardContent>
          </Card>

          {/* Data Sources */}
          <Card className="border-2 border-white/20 bg-[#11161D]">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Database className="h-8 w-8 text-yellow-400" />
                Mistä data tulee?
              </CardTitle>
              <CardDescription>Luotettavat lähteet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-neutral-300 leading-relaxed">
                Kaikki ammattitiedot perustuvat <strong className="text-white">todellisiin tietoihin</strong> Suomen työmarkkinoista:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
                  <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Opintopolku.fi</strong>
                    <p className="text-sm text-urak-text-secondary mt-1">Koulutuspolut ja jatko-opintovaihtoehdot</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
                  <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                  <div>
                    <strong className="text-white">TES-sopimukset</strong>
                    <p className="text-sm text-urak-text-secondary mt-1">Todelliset palkkatasot Suomessa</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
                  <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Tilastokeskus & TE-palvelut</strong>
                    <p className="text-sm text-urak-text-secondary mt-1">Työllisyysnäkymät ja työmarkkinatrendit</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-white/5 rounded-lg p-4">
                  <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                  <div>
                    <strong className="text-white">Tutkittu urapsykologia</strong>
                    <p className="text-sm text-urak-text-secondary mt-1">Holland-malli, Big Five -persoonallisuusteoria, Strong Interest Inventory</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Trust & Privacy */}
          <Card className="border-2 border-white/20 bg-[#11161D]">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-400" />
                Luottamus ja yksityisyys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-neutral-300 leading-relaxed">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                  <span className="text-urak-text-secondary"><strong className="text-white">Vastauksiasi ei tallenneta pysyvästi</strong> (vain väliaikaisesti selaimeen, jotta voit jatkaa myöhemmin)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                  <span className="text-urak-text-secondary"><strong className="text-white">Ei henkilötietoja</strong> – et anna nimeä, sähköpostia tai muita tunnistetietoja</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                  <span className="text-urak-text-secondary"><strong className="text-white">GDPR-yhteensopiva</strong> – noudatamme EU:n tietosuoja-asetusta</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 mt-[2px] text-urak-accent-blue/70 flex-shrink-0" />
                  <span className="text-urak-text-secondary"><strong className="text-white">Ei myyntia kolmansille osapuolille</strong> – dataa ei jaeta</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Limitations */}
          <Card className="border-2 border-yellow-200/50 bg-[#11161D]">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-yellow-400" />
                Rajoitukset ja rehellisyys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-neutral-300 leading-relaxed">
              <p>
                <strong className="text-white">Urakompassi on työkalu, ei lopullinen vastaus.</strong> On tärkeää ymmärtää menetelmän rajoitukset:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 bg-yellow-500/10 rounded-lg p-4">
                  <span className="text-yellow-400 text-xl flex-shrink-0">⚠️</span>
                  <div>
                    <strong className="text-white">Testi ei tunne sinua henkilökohtaisesti</strong>
                    <p className="text-sm text-neutral-300 mt-1">Testi perustuu vain 30 kysymykseen. Se ei tunne elämäntilannettasi, perhettäsi, taloudellista tilannettasi tai muita henkilökohtaisia tekijöitä.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-yellow-500/10 rounded-lg p-4">
                  <span className="text-yellow-400 text-xl flex-shrink-0">⚠️</span>
                  <div>
                    <strong className="text-white">Tulokset ovat suuntaa-antavia</strong>
                    <p className="text-sm text-neutral-300 mt-1">Testi auttaa löytämään vaihtoehtoja, mutta lopullinen päätös on aina sinun (ja keskustele opinto-ohjaajan, opettajan tai vanhempiesi kanssa).</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-yellow-500/10 rounded-lg p-4">
                  <span className="text-yellow-400 text-xl flex-shrink-0">⚠️</span>
                  <div>
                    <strong className="text-white">Urasi voi muuttua</strong>
                    <p className="text-sm text-neutral-300 mt-1">On täysin normaalia vaihtaa alaa myöhemmin. Tämä testi on vain lähtökohta – et ole sidottu tuloksiin loppuelämäksi.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center pt-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Valmis löytämään urapolkusi?
            </h2>
            <p className="text-xl text-neutral-300 mb-8">
              Testi kestää noin 5 minuuttia ja on täysin maksuton
            </p>
            <Link href="/test">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
                Aloita testi nyt
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

    </div>
  )
}
