import Link from 'next/link';

export default function IpSuojaPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-primary">IMMATERIAALIOIKEUS- JA KILPAILIJASUOJA — CareerCompassi Oy</h1>
          <p className="text-sm text-muted-foreground mb-8">Versio 3.2 • Viimeksi päivitetty: [päivämäärä] • Y‑tunnus: [täydennä] • Rekisteröity tavaramerkki: [täydennä]</p>
          <div className="space-y-6 leading-relaxed text-base">
          <pre className="whitespace-pre-wrap font-sans text-[15px]">
{`## 1 Tarkoitus
Tämä dokumentti täydentää Käyttöehtoja ja Tietosuojaselostetta. Se kuvaa, miten CareerCompassi Oy suojaa immateriaalioikeudellisen omaisuutensa, tekniset ratkaisunsa ja liiketoimintamallinsa sekä estää luvattoman kopioinnin, hyödyntämisen tai kilpailevan jäljittelyn. Perustuu mm. tekijänoikeuslakiin, tavaramerkkilakiin ja liikesalaisuuslakiin.

## 2 Soveltamisala ja omistusoikeus
Dokumentti koskee kaikkia CareerCompassin palveluja ja sisältöjä. Kaikki aineistot, kysymykset, algoritmit, ohjelmistokoodi, käyttöliittymät, grafiikat ja liiketoimintalogiikka ovat CareerCompassin omaisuutta. Käyttöoikeus ei siirrä omistus‑ tai uusintamisoikeuksia.

## 3 Suojattu aineisto
3.1 Testi‑ ja sisältöaineisto: testikysymykset, vastausvaihtoehdot, pisteytyslogiikka, kysymysten rakenne ja järjestys, sisältöjen valintaperusteet.
3.2 Algoritmit ja tekninen ratkaisu: pisteytys‑ ja suositusalgoritmit, tietokantarakenteet ja rajapinnat, käyttöliittymän toteutus ja käyttölogiikka.
3.3 Liiketoimintadata ja analytiikka: aggregoidut tilastot, trendianalyysit ja palvelun optimoinnissa käytettävät pseudonymisoidut tietoaineistot. Kaikki edellä mainittu on CareerCompassin liikesalaisuutta.

## 4 Kielletty toiminta
Ilman kirjallista lupaa on kiellettyä: (i) kopioida, tallentaa tai julkaista aineistoja, (ii) purkaa, muokata tai käänteisesti tutkia (“reverse engineerata”) koodia tai algoritmeja muutoin kuin pakottavan lain (esim. yhteentoimivuus) sallimissa rajoissa, (iii) automatisoida tiedonkeruuta (scraping, botit, data‑louhinta), (iv) hyödyntää Palvelua kilpailevan tuotteen tai tutkimuksen kehittämiseen, (v) kiertää turva‑ tai käyttörajoituksia, (vi) integroida Palvelua tai sen osia muihin järjestelmiin ilman erillistä sopimusta.

## 5 Tekniset suojatoimet
Kysymysten ja vastausten satunnaistus, kohtuulliset käyttörajoitukset, IP‑tason väärinkäytösten tunnistus, lokit teknisenä todisteena, palvelinpuoliset algoritmi- ja datarakennesuojaukset. Julkiset rajapinnat vain sopimuksella.

## 6 API ja integraatiot
API ei ole oletuksena saatavilla. Premium‑oppilaitoksille voidaan myöntää rajattu luku‑API erillissopimuksella (API‑avaimet, käyttörajoitukset, tietoturva, auditoitavuus).

## 7 Rikkomusten seuraamukset
7.1 Välittömät toimet: pääsyn rajoitus/esto, tilin tai IP‑osoitteen jäädytys, käyttöoikeuden poisto, oikeudelliset toimet.
7.2 Oikeudelliset toimet: vahingonkorvaus tekijänoikeuden/liikesalaisuuden loukkauksesta, kieltohakemus, rikosilmoitus lain sallimissa rajoissa, kulujen korvaus.
7.3 Todisteet: tekniset lokit, IP‑tiedot ja käyttöhistoria muodostavat hyväksyttävän todisteaineiston.

## 8 Aggregoitu data ja tilastot
Yksittäinen käyttäjä omistaa omat testituloksensa. Aggregoitu ja anonymisoitu data sekä analytiikka ovat CareerCompassin omaisuutta. Koulut saavat hyödyntää luokkakohtaisia anonymisoituja tuloksia opetustoiminnan tukena. Aggregoitua dataa ei saa jakaa kilpaileville toimijoille tai käyttää tuotekehityksessä ilman CareerCompassin lupaa.

## 9 Tietojen säilyttäminen rikkomustilanteissa
Rikkomusepäilyihin liittyviä lokitietoja säilytetään vähintään 2 vuotta havainnosta. Oikeudellisissa menettelyissä tietoja säilytetään lain tai viranomaismääräysten edellyttämän ajan.

## 10 Sovellettava laki ja riidanratkaisu
Suomen laki. Riidat ensisijaisesti neuvotteluin; jos sovintoa ei synny, B2B‑asiat Helsingin käräjäoikeus. Kuluttaja‑asiat: Kuluttajariitalautakunta tai Helsingin käräjäoikeus.

## 11 Kieli ja suhde muihin dokumentteihin
Virallinen kieli on suomi; ristiriitatilanteissa suomenkielinen versio on ensisijainen. Tämä dokumentti on erottamaton osa Käyttöehtoja. Ristiriidassa sovelletaan säännöstä, joka ei riko pakottavaa lakia ja turvaa laillisesti CareerCompassin immateriaalioikeudet laajasti.

## 12 Muutokset
CareerCompassi voi päivittää tätä dokumenttia teknisten tai oikeudellisten muutosten yhteydessä. Uusi versio tulee voimaan julkaisupäivästä ja korvaa aiemman.

## 13 Yhteystiedot
CareerCompassi Oy, Säterintie 6 C, [postinumero ja kaupunki], Finland
Sähköposti: support@careercompassi.com`}
          </pre>
        </div>
        </div>
      </main>
      <footer className="border-t border-gray-200 py-6 bg-gray-50 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <Link 
              href="/" 
              className="text-primary hover:underline font-medium"
            >
              ← Palaa etusivulle
            </Link>
            <div className="flex items-center gap-4 text-gray-600">
              <Link href="/legal/kayttoehdot" className="hover:text-gray-900 hover:underline">
                Käyttöehdot
              </Link>
              <Link href="/legal/tietosuojaseloste" className="hover:text-gray-900 hover:underline">
                Tietosuojaseloste
              </Link>
            </div>
            <p className="text-gray-500">© 2025 CareerCompassi</p>
          </div>
        </div>
      </footer>
    </div>
  )
}



