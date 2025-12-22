import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IpSuojaPage() {
  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* Back Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-urak-bg/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-sky-400 hover:opacity-80">
            Urakompassi
          </Link>
          <Button variant="outline" asChild className="border-urak-border/70 bg-urak-bg/70 hover:bg-urak-surface hover:border-urak-border">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Takaisin
            </Link>
          </Button>
        </div>
      </nav>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-white">IMMATERIAALIOIKEUS- JA KILPAILIJASUOJA — Urakompassi Oy</h1>
          <p className="text-sm text-neutral-400 mb-8">Versio 4.1 • Viimeksi päivitetty: 12.2025 • Y-tunnus: 3579081-5</p>
          <div className="space-y-6 leading-relaxed text-base">
          <pre className="whitespace-pre-wrap font-sans text-[15px] text-neutral-200">
{`1. Tarkoitus
Tämä dokumentti täydentää Käyttöehtoja ja Tietosuojaselostetta. Se kuvaa, miten Urakompassi Oy suojaa immateriaalioikeudellisen omaisuutensa, tekniset ratkaisunsa ja liiketoimintamallinsa sekä estää luvattoman kopioinnin, hyödyntämisen tai kilpailevan jäljittelyn. Dokumentti perustuu muun muassa tekijänoikeuslakiin, tavaramerkkilakiin ja liikesalaisuuslakiin.

2. Soveltamisala ja omistusoikeus
Dokumentti koskee kaikkia Urakompassin palveluja ja sisältöjä. Kaikki aineistot, kysymykset, algoritmit, ohjelmistokoodi, käyttöliittymät, grafiikat ja liiketoimintalogiikka ovat Urakompassin omaisuutta. Käyttöoikeus ei siirrä omistus- tai uusintamisoikeuksia.

3. Suojattu aineisto
3.1 Testi- ja sisältöaineisto: testikysymykset, vastausvaihtoehdot, pisteytyslogiikka, kysymysten rakenne ja järjestys sekä sisältöjen valintaperusteet.
3.2 Algoritmit ja tekninen ratkaisu: pisteytys- ja suositusalgoritmit, tietokantarakenteet ja rajapinnat sekä käyttöliittymän toteutus ja käyttölogiikka.
3.3 Liiketoimintadata ja analytiikka: aggregoidut tilastot, trendianalyysit ja palvelun optimoinnissa käytettävät pseudonymisoidut tietoaineistot. Kaikki edellä mainittu on Urakompassin liikesalaisuutta.

4. Käytön valvonta
Kaikki luvaton kopiointi, testaamisen manipulointi ja algoritmien kehittämiseen tähtäävä käyttö on kielletty. Urakompassilla on oikeus estää käyttö väärinkäytösepäilyissä.

5. Kielletty toiminta
Ilman kirjallista lupaa on kiellettyä:
• kopioida, tallentaa tai julkaista aineistoja
• purkaa, muokata tai käänteisesti tutkia (reverse engineering) koodia tai algoritmeja muutoin kuin pakottavan lain (esimerkiksi yhteentoimivuuden) sallimissa rajoissa
• automatisoida tiedonkeruuta (scraping, botit, datalouhinta)
• hyödyntää Palvelua kilpailevan tuotteen tai tutkimuksen kehittämiseen
• kiertää turva- tai käyttörajoituksia
• integroida Palvelua tai sen osia muihin järjestelmiin ilman erillistä sopimusta

6. Tekniset suojatoimet
Käytämme kysymysten ja vastausten satunnaistusta, kohtuullisia käyttörajoituksia, IP-tason väärinkäytösten tunnistusta, lokeja teknisenä todisteena sekä palvelinpuolisia algoritmi- ja datarakennesuojauksia.

7. Rikkomusten seuraamukset
7.1 Välittömät toimet: pääsyn rajoitus tai esto, IP-osoitteen jäädytys, käyttöoikeuden poisto ja oikeudelliset toimet.
7.2 Oikeudelliset toimet: vahingonkorvaus tekijänoikeuden tai liikesalaisuuden loukkauksesta, kieltohakemus, rikosilmoitus lain sallimissa rajoissa ja kulujen korvaus.
7.3 Todisteet: tekniset lokit, IP-tiedot ja käyttöhistoria muodostavat hyväksyttävän todisteaineiston.

8. Aggregoitu data ja tilastot
Yksittäinen käyttäjä omistaa omat testituloksensa. Aggregoitu ja anonymisoitu data sekä analytiikka ovat Urakompassin omaisuutta. Aggregoitua dataa ei saa jakaa kilpaileville toimijoille tai käyttää tuotekehityksessä ilman Urakompassin lupaa.

9. Tietojen säilyttäminen rikkomustilanteissa
Rikkomusepäilyihin liittyviä lokitietoja säilytetään vähintään kaksi vuotta havainnosta. Oikeudellisissa menettelyissä tietoja säilytetään lain tai viranomaismääräysten edellyttämän ajan.

10. Sovellettava laki ja riidanratkaisu
Sovellettava laki on Suomen laki. Riidat ratkaistaan ensisijaisesti neuvotteluteitse. Jos sovintoa ei synny, toimivaltainen tuomioistuin on Helsingin käräjäoikeus. Kuluttaja-asioissa toimivaltainen taho on Kuluttajariitalautakunta tai Helsingin käräjäoikeus.

11. Kieli ja suhde muihin dokumentteihin
Virallinen kieli on suomi, ja ristiriitatilanteissa suomenkielinen versio on ensisijainen. Tämä dokumentti on erottamaton osa Käyttöehtoja. Ristiriitatilanteessa sovelletaan säännöstä, joka ei riko pakottavaa lakia ja turvaa laillisesti Urakompassin immateriaalioikeudet laajasti.

12. Muutokset
Urakompassi voi päivittää tätä dokumenttia teknisten tai oikeudellisten muutosten yhteydessä. Uusi versio tulee voimaan julkaisupäivästä ja korvaa aiemman.

13. Yhteystiedot
Urakompassi Oy, Helsinki, Finland
Y-tunnus: 3579081-5
Sähköposti: info@urakompassi.fi`}
          </pre>
        </div>
        </div>
      </main>
    </div>
  )
}
