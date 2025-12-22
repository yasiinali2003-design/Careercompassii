import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TietosuojaPage() {
  return (
    <div className="min-h-screen text-white flex flex-col">
      {/* Back Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-urak-bg/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white hover:opacity-80">
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
          <p className="text-sm text-neutral-400 mb-8">Versio 4.0 • Viimeksi päivitetty: 12.2025 • Y‑tunnus: 3579081-5</p>
          <div className="space-y-6 leading-relaxed text-base">
          <pre className="whitespace-pre-wrap font-sans text-[15px] text-neutral-200">
{`## 1. Rekisterinpitäjä ja yhteystiedot
Urakompassi Oy, Säterintie 6, 00720 Helsinki, Finland
Y-tunnus: 3579081-5
Sähköposti: info@urakompassi.fi

## 2. Käsittelyn tarkoitus ja oikeusperuste
Käsittely koskee urapolku‑testipalvelua. Oikeusperusteet (GDPR 6 art.): suostumus (a), sopimus (b), lakisääteinen velvoite (c), oikeutettu etu (f) (esim. tietoturva ja väärinkäytösten estäminen).

## 3. Käsiteltävät henkilötiedot
3.1 Kerättävät tiedot: testivastaukset, pisteytykset ja tulokset pseudonymisoituna; suoritusajankohta; laite-/selaintiedot; valittu ikäryhmä.
3.2 Ei kerätä: nimiä, sähköposteja, syntymäaikoja tai muita suoraan tunnistavia tietoja.

## 4. Käyttötarkoitukset
Testin toteutus ja tulosten laskenta; palvelun toiminnan, laadun ja turvallisuuden varmistaminen; algoritmien ja suositusten kehittäminen; anonymisoitu trendi‑ja tilastodata. Ei markkinointia ilman nimenomaista suostumusta.

## 5. Datan omistajuus
Käyttäjä omistaa omat testituloksensa. Aggregoitu anonymisoitu data ja algoritmit ovat Urakompassin omaisuutta.

## 6. Luovutukset ja alikäsittelijät
Tietoja ei luovuteta kolmansille, paitsi: käytämme turvallisia kolmannen osapuolen pilvipalveluja tietojen tallentamiseen (kaikki tiedot tallennetaan salattuina EU-alueen palvelimille ja niitä suojataan alan standardien mukaisilla turvatoimilla); lakisääteiset velvoitteet; oikeudellisten vaatimusten puolustaminen. Ajantasainen alikäsittelijälista on saatavilla pyynnöstä: info@urakompassi.fi. Tietoja ei siirretä EU/ETA‑alueen ulkopuolelle ilman asianmukaista suojamekanismia (esim. SCC).

## 7. EU/ETA-alueen ulkopuoliset siirrot
Urakompassi ei siirrä henkilötietoja EU/ETA-alueen ulkopuolelle ilman asianmukaista siirtoperustetta. Mikäli siirto on välttämätön, käytämme Euroopan komission hyväksymiä vakiosopimuslausekkeita (SCC), tietoturvavaatimusten mukaista suojaustasoa sekä dokumentoitua siirtovaikutusten arviointia (TIA/TI).

## 8. Säilytys ja poistaminen
Testitulokset säilytetään enintään 3 vuotta suorituspäivästä. Aggregoitu anonymisoitu data voidaan säilyttää toistaiseksi. Poistopyynnöt voi lähettää osoitteeseen info@urakompassi.fi.

## 9. Rekisteröidyn oikeudet
Oikeus saada tietoa, tarkastaa, oikaista, poistaa, rajoittaa tai vastustaa käsittelyä sekä siirtää tiedot. Koska tiedot ovat pseudonymisoituja, kaikkia oikeuksia ei aina voida kohdentaa yksittäiseen henkilöön. Yhteydenotot: info@urakompassi.fi.

## 10. Automaattinen päätöksenteko ja profilointi (GDPR 22)
Palvelu hyödyntää automatisoitua analyysiä testivastauksista tuottaakseen käyttäjälle suuntaa-antavia koulutus- ja urasuosituksia. Analyysi perustuu tutkittuun persoonallisuus- ja urapsykologiaan sekä ennalta määriteltyyn algoritmiseen pisteytysmenetelmään.

Automaattisen analyysin tulokset ovat ohjeellisia eivätkä muodosta oikeusvaikutuksia tai sitovia päätöksiä käyttäjää koskien.

Käyttäjällä on oikeus:
• pyytää selitys siitä, miten hänen tietojaan on käsitelty
• saada yleiskuva algoritmisesta logiikasta
• vastustaa profilointia
• pyytää manuaalista arviointia

Yhteydenotot: info@urakompassi.fi

## 11. Turvallisuustoimenpiteet
TLS 1.3, AES‑256 levossa, vähimmän oikeuden periaate, käyttö- ja pääsylokit, säännölliset varmuuskopiot ja haavoittuvuustestaukset, tietoturvapolitiikan auditointi vuosittain. Tietoturvaloukkauksista ilmoitetaan ilman aiheetonta viivytystä ja tarvittaessa 72 h kuluessa.

## 12. Evästeet ja seuranta
Käytetään vain välttämättömiä evästeitä (esim. istuntoevästeet). Ei kolmannen osapuolen seurantaa. Selainkohtaiset asetukset (esim. viimeisimmät testitulokset) tallennetaan selaimen localStorageen käyttäjän päätelaitteelle; tietoja ei lähetetä palvelimelle. Jos analytiikka otetaan käyttöön, siitä ilmoitetaan erillisessä evästekäytännössä.

## 13. Lasten tietosuoja
Palvelu on tarkoitettu vähintään 13‑vuotiaille. Alle 13‑vuotiaat voivat käyttää Palvelua vain huoltajan valvonnassa.

## 14. Valvontaviranomainen ja valitusoikeus
Tietosuojavaltuutetun toimisto, Lintulahdenkatu 4, 00530 Helsinki, https://tietosuoja.fi.

## 15. Muutokset selosteeseen
Voimme päivittää tätä selostetta (esim. lakimuutokset, tekniset muutokset). Uusi versio julkaistaan verkkosivuilla ja päiväys päivitetään.

## 16. Sovellettava laki ja kieli
Sovellettava laki: Suomen laki. Virallinen kieli on suomi; ristiriitatilanteessa suomenkielinen versio on ensisijainen.

## 17. Yhteystiedot
Urakompassi Oy, Säterintie 6, 00720 Helsinki, Finland
Y-tunnus: 3579081-5
Sähköposti: info@urakompassi.fi`}
          </pre>
        </div>
        </div>
      </main>
    </div>
  )
}



