import Link from 'next/link';

export default function IpSuojaPage() {
  return (
    <div className="min-h-screen text-white flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-white">IMMATERIAALIOIKEUS- JA KILPAILIJASUOJA — Urakompassi Oy</h1>
          <p className="text-sm text-neutral-400 mb-8">Versio 3.2 • Viimeksi päivitetty: 7.11.2025 • Y‑tunnus: 3579081-5 • Rekisteröity tavaramerkki: [täydennä]</p>
          <div className="space-y-6 leading-relaxed text-base">
          <pre className="whitespace-pre-wrap font-sans text-[15px] text-neutral-200">
{`## 1 Tarkoitus
Tämä dokumentti täydentää Käyttöehtoja ja Tietosuojaselostetta. Se kuvaa, miten Urakompassi Oy suojaa immateriaalioikeudellisen omaisuutensa, tekniset ratkaisunsa ja liiketoimintamallinsa sekä estää luvattoman kopioinnin, hyödyntämisen tai kilpailevan jäljittelyn. Perustuu mm. tekijänoikeuslakiin, tavaramerkkilakiin ja liikesalaisuuslakiin.

## 2 Soveltamisala ja omistusoikeus
Dokumentti koskee kaikkia Urakompassin palveluja ja sisältöjä. Kaikki aineistot, kysymykset, algoritmit, ohjelmistokoodi, käyttöliittymät, grafiikat ja liiketoimintalogiikka ovat Urakompassin omaisuutta. Käyttöoikeus ei siirrä omistus‑ tai uusintamisoikeuksia.

## 3 Suojattu aineisto
3.1 Testi‑ ja sisältöaineisto: testikysymykset, vastausvaihtoehdot, pisteytyslogiikka, kysymysten rakenne ja järjestys, sisältöjen valintaperusteet.
3.2 Algoritmit ja tekninen ratkaisu: pisteytys‑ ja suositusalgoritmit, tietokantarakenteet ja rajapinnat, käyttöliittymän toteutus ja käyttölogiikka.
3.3 Liiketoimintadata ja analytiikka: aggregoidut tilastot, trendianalyysit ja palvelun optimoinnissa käytettävät pseudonymisoidut tietoaineistot. Kaikki edellä mainittu on Urakompassin liikesalaisuutta.

## 4 Käytön valvonta ja opettajavastuu

Oppilaitoksen henkilöstö (kuten opettajat) vastaa siitä, että oppilaat eivät tallenna, kopioi, analysoi tai jaa Palvelun sisältöjä ilman lupaa. Kaikki luvaton kopiointi, testaamisen manipulointi ja algoritmien kehittämiseen tähtäävä käyttö on kielletty. Urakompassilla on oikeus estää käyttö tai sulkea tili väärinkäytösepäilyissä.

## 5 Kielletty toiminta
Ilman kirjallista lupaa on kiellettyä: (i) kopioida, tallentaa tai julkaista aineistoja, (ii) purkaa, muokata tai käänteisesti tutkia (“reverse engineerata”) koodia tai algoritmeja muutoin kuin pakottavan lain (esim. yhteentoimivuus) sallimissa rajoissa, (iii) automatisoida tiedonkeruuta (scraping, botit, data‑louhinta), (iv) hyödyntää Palvelua kilpailevan tuotteen tai tutkimuksen kehittämiseen, (v) kiertää turva‑ tai käyttörajoituksia, (vi) integroida Palvelua tai sen osia muihin järjestelmiin ilman erillistä sopimusta.

## 6 Tekniset suojatoimet
Kysymysten ja vastausten satunnaistus, kohtuulliset käyttörajoitukset, IP‑tason väärinkäytösten tunnistus, lokit teknisenä todisteena, palvelinpuoliset algoritmi- ja datarakennesuojaukset. Julkiset rajapinnat vain sopimuksella.

## 7 API ja integraatiot
API ei ole oletuksena saatavilla. Premium‑oppilaitoksille voidaan myöntää rajattu luku‑API erillissopimuksella (API‑avaimet, käyttörajoitukset, tietoturva, auditoitavuus).

## 8 Rikkomusten seuraamukset
8.1 Välittömät toimet: pääsyn rajoitus/esto, tilin tai IP‑osoitteen jäädytys, käyttöoikeuden poisto, oikeudelliset toimet.
8.2 Oikeudelliset toimet: vahingonkorvaus tekijänoikeuden/liikesalaisuuden loukkauksesta, kieltohakemus, rikosilmoitus lain sallimissa rajoissa, kulujen korvaus.
8.3 Todisteet: tekniset lokit, IP‑tiedot ja käyttöhistoria muodostavat hyväksyttävän todisteaineiston.

## 9 Aggregoitu data ja tilastot
Yksittäinen käyttäjä omistaa omat testituloksensa. Aggregoitu ja anonymisoitu data sekä analytiikka ovat Urakompassin omaisuutta. Koulut saavat hyödyntää luokkakohtaisia anonymisoituja tuloksia opetustoiminnan tukena. Aggregoitua dataa ei saa jakaa kilpaileville toimijoille tai käyttää tuotekehityksessä ilman Urakompassin lupaa.

## 10 Tietojen säilyttäminen rikkomustilanteissa
Rikkomusepäilyihin liittyviä lokitietoja säilytetään vähintään 2 vuotta havainnosta. Oikeudellisissa menettelyissä tietoja säilytetään lain tai viranomaismääräysten edellyttämän ajan.

## 11 Sovellettava laki ja riidanratkaisu
Suomen laki. Riidat ensisijaisesti neuvotteluin; jos sovintoa ei synny, B2B‑asiat Helsingin käräjäoikeus. Kuluttaja‑asiat: Kuluttajariitalautakunta tai Helsingin käräjäoikeus.

## 12 Kieli ja suhde muihin dokumentteihin
Virallinen kieli on suomi; ristiriitatilanteissa suomenkielinen versio on ensisijainen. Tämä dokumentti on erottamaton osa Käyttöehtoja. Ristiriidassa sovelletaan säännöstä, joka ei riko pakottavaa lakia ja turvaa laillisesti Urakompassin immateriaalioikeudet laajasti.

## 13 Muutokset
Urakompassi voi päivittää tätä dokumenttia teknisten tai oikeudellisten muutosten yhteydessä. Uusi versio tulee voimaan julkaisupäivästä ja korvaa aiemman.

## 14 Yhteystiedot
Urakompassi Oy, Säterintie 6, 00720 Helsinki, Finland
Y-tunnus: 3579081-5
Sähköposti: support@urakompassi.fi`}
          </pre>
        </div>
        </div>
      </main>
      <footer className="border-t border-white/10 py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <Link 
              href="/" 
              className="text-white hover:text-neutral-300 hover:underline font-medium"
            >
              ← Palaa etusivulle
            </Link>
            <div className="flex items-center gap-4 text-neutral-300">
              <Link href="/legal/kayttoehdot" className="hover:text-white hover:underline">
                Käyttöehdot
              </Link>
              <Link href="/legal/tietosuojaseloste" className="hover:text-white hover:underline">
                Tietosuojaseloste
              </Link>
            </div>
            <p className="text-neutral-400">© 2025 Urakompassi</p>
          </div>
        </div>
      </footer>
    </div>
  )
}



