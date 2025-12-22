import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TietosuojaPage() {
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
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-white">TIETOSUOJASELOSTE — Urakompassi Oy</h1>
          <p className="text-sm text-neutral-400 mb-8">Versio 4.1 • Viimeksi päivitetty: 12.2025 • Y-tunnus: 3579081-5</p>
          <div className="space-y-6 leading-relaxed text-base">
          <pre className="whitespace-pre-wrap font-sans text-[15px] text-neutral-200">
{`1. Rekisterinpitäjä ja yhteystiedot
Urakompassi Oy, Helsinki, Finland
Y-tunnus: 3579081-5
Sähköposti: info@urakompassi.fi

2. Käsittelyn tarkoitus ja oikeusperuste
Käsittely koskee urapolkutestipalvelua ja yhteydenottolomaketta. Oikeusperusteet (GDPR 6 artikla): suostumus (a), sopimus (b), lakisääteinen velvoite (c) ja oikeutettu etu (f), kuten tietoturva ja väärinkäytösten estäminen.

3. Käsiteltävät henkilötiedot
3.1 Testipalvelu: testivastaukset, pisteytykset ja tulokset pseudonymisoituna, suoritusajankohta, laite- ja selaintiedot sekä valittu ikäryhmä. Testipalvelussa ei kerätä nimiä, sähköpostiosoitteita tai muita suoraan tunnistavia tietoja.
3.2 Yhteydenottolomake: nimi, sähköpostiosoite, organisaation nimi (valinnainen), organisaatiotyyppi (valinnainen), viestin sisältö, lähetysajankohta ja IP-osoite. Tietoja käytetään yhteydenottoihin vastaamiseen ja mahdolliseen yhteistyöhön liittyvään viestintään.

4. Käyttötarkoitukset
Testin toteutus ja tulosten laskenta, palvelun toiminnan, laadun ja turvallisuuden varmistaminen, algoritmien ja suositusten kehittäminen sekä anonymisoitu trendi- ja tilastodata. Markkinointia ei tehdä ilman nimenomaista suostumusta.

5. Datan omistajuus
Käyttäjä omistaa omat testituloksensa. Aggregoitu ja anonymisoitu data sekä algoritmit ovat Urakompassin omaisuutta.

6. Luovutukset ja alikäsittelijät
Tietoja ei luovuteta kolmansille osapuolille, paitsi seuraavissa tapauksissa: käytämme turvallisia kolmannen osapuolen pilvipalveluja tietojen tallentamiseen (kaikki tiedot tallennetaan salattuina EU-alueen palvelimille ja niitä suojataan alan standardien mukaisilla turvatoimilla), lakisääteisten velvoitteiden täyttäminen ja oikeudellisten vaatimusten puolustaminen. Ajantasainen alikäsittelijälista on saatavilla pyynnöstä osoitteesta info@urakompassi.fi. Tietoja ei siirretä EU/ETA-alueen ulkopuolelle ilman asianmukaista suojamekanismia, kuten vakiosopimuslausekkeita (SCC).

7. EU/ETA-alueen ulkopuoliset siirrot
Urakompassi ei siirrä henkilötietoja EU/ETA-alueen ulkopuolelle ilman asianmukaista siirtoperustetta. Mikäli siirto on välttämätön, käytämme Euroopan komission hyväksymiä vakiosopimuslausekkeita (SCC), tietoturvavaatimusten mukaista suojaustasoa sekä dokumentoitua siirtovaikutusten arviointia.

8. Säilytys ja poistaminen
Testitulokset säilytetään enintään kolme vuotta suorituspäivästä. Yhteydenottolomakkeen tiedot säilytetään enintään kaksi vuotta yhteydenoton käsittelyä ja mahdollista yhteistyötä varten. Aggregoitu ja anonymisoitu data voidaan säilyttää toistaiseksi. Poistopyynnöt voi lähettää osoitteeseen info@urakompassi.fi.

9. Rekisteröidyn oikeudet
Rekisteröidyllä on oikeus saada tietoa käsittelystä, tarkastaa tietonsa, oikaista virheelliset tiedot, poistaa tiedot, rajoittaa käsittelyä, vastustaa käsittelyä sekä siirtää tiedot toiselle rekisterinpitäjälle. Koska testitiedot ovat pseudonymisoituja, kaikkia oikeuksia ei aina voida kohdentaa yksittäiseen henkilöön. Yhteydenotot: info@urakompassi.fi.

10. Automaattinen päätöksenteko ja profilointi (GDPR 22 artikla)
Palvelu hyödyntää automatisoitua analyysiä testivastauksista tuottaakseen käyttäjälle suuntaa-antavia koulutus- ja urasuosituksia. Analyysi perustuu tutkittuun persoonallisuus- ja urapsykologiaan sekä ennalta määriteltyyn algoritmiseen pisteytysmenetelmään. Automaattisen analyysin tulokset ovat ohjeellisia eivätkä muodosta oikeusvaikutuksia tai sitovia päätöksiä käyttäjää koskien. Käyttäjällä on oikeus pyytää selitys siitä, miten hänen tietojaan on käsitelty, saada yleiskuva algoritmisesta logiikasta, vastustaa profilointia ja pyytää manuaalista arviointia.

11. Turvallisuustoimenpiteet
Käytämme TLS 1.3 -salausta tiedonsiirrossa ja AES-256-salausta levossa. Noudatamme vähimmän oikeuden periaatetta, ylläpidämme käyttö- ja pääsylokeja, teemme säännöllisiä varmuuskopioita ja haavoittuvuustestauksia sekä auditoimme tietoturvapolitiikan vuosittain. Tietoturvaloukkauksista ilmoitetaan ilman aiheetonta viivytystä ja tarvittaessa 72 tunnin kuluessa.

12. Evästeet ja seuranta
Käytämme vain välttämättömiä evästeitä, kuten istuntoevästeitä. Emme käytä kolmannen osapuolen seurantaa. Selainkohtaiset asetukset, kuten viimeisimmät testitulokset, tallennetaan selaimen localStorageen käyttäjän päätelaitteelle, eikä tietoja lähetetä palvelimelle. Jos analytiikka otetaan käyttöön, siitä ilmoitetaan erillisessä evästekäytännössä.

13. Lasten tietosuoja
Palvelu on tarkoitettu vähintään 13-vuotiaille. Alle 13-vuotiaat voivat käyttää palvelua vain huoltajan valvonnassa.

14. Valvontaviranomainen ja valitusoikeus
Tietosuojavaltuutetun toimisto, Lintulahdenkatu 4, 00530 Helsinki, https://tietosuoja.fi

15. Muutokset selosteeseen
Voimme päivittää tätä selostetta esimerkiksi lakimuutosten tai teknisten muutosten yhteydessä. Uusi versio julkaistaan verkkosivuilla ja päiväys päivitetään.

16. Sovellettava laki ja kieli
Sovellettava laki on Suomen laki. Virallinen kieli on suomi, ja ristiriitatilanteessa suomenkielinen versio on ensisijainen.

17. Yhteystiedot
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
