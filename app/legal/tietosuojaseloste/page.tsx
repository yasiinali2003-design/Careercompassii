import Link from 'next/link';

export default function TietosuojaPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-primary">TIETOSUOJASELOSTE — Urakompassi Oy</h1>
          <p className="text-sm text-muted-foreground mb-8">Versio 3.3 • Viimeksi päivitetty: 7.11.2025 • Y‑tunnus: [täydennä] • Rekisteröity tavaramerkki: [täydennä]</p>
          <div className="space-y-6 leading-relaxed text-base">
          <pre className="whitespace-pre-wrap font-sans text-[15px]">
{`## 1. Rekisterinpitäjä ja yhteystiedot
Urakompassi Oy, Säterintie 6 C, [postinumero ja kaupunki], Finland
Sähköposti: support@urakompassi.com
Urakompassi toimii henkilötietojen käsittelijänä oppilaitosten puolesta sekä rekisterinpitäjänä omille käyttäjätiedoilleen. Oppilaitos on oppilaiden tietojen rekisterinpitäjä.

## 2. Käsittelyn tarkoitus ja oikeusperuste
Käsittely koskee urapolku‑testipalvelua. Oikeusperusteet (GDPR 6 art.): suostumus (a), sopimus (b), lakisääteinen velvoite (c), oikeutettu etu (f) (esim. tietoturva ja väärinkäytösten estäminen).

## 3. Käsiteltävät henkilötiedot
3.1 Kerättävät tiedot: testivastaukset, pisteytykset ja tulokset pseudonymisoituna; suoritusajankohta; laite-/selaintiedot; valittu kohortti (YLA/TASO2/NUORI); luokkakoodi (class token) hajautettuna (bcrypt/SHA-256) ja sen käyttölogit; opettajan nimi, sähköposti, koulun nimi (koulupaketti).
3.2 Ei kerätä: oppilaiden nimiä, sähköposteja, syntymäaikoja tai muita suoraan tunnistavia tietoja. Oppilaat käyttävät testissä vain opettajan antamaa PIN-koodia tai luokkakoodia.

## 4. Käyttötarkoitukset
Testin toteutus ja tulosten laskenta; palvelun toiminnan, laadun ja turvallisuuden varmistaminen; algoritmien ja suositusten kehittäminen; anonymisoitu trendi‑ja tilastodata. Ei markkinointia ilman nimenomaista suostumusta.

## 5. Datan omistajuus ja roolit
Oppilaitos omistaa oppilaidensa henkilötiedot. Urakompassi toimii käsittelijänä oppilaitoksen lukuun ja vastaa teknisestä tietoturvasta. Aggregoitu anonymisoitu data ja algoritmit ovat Urakompassin omaisuutta.

## 6. Luovutukset ja alikäsittelijät
Tietoja ei luovuteta kolmansille, paitsi: Supabase (EU/Irlanti) pilvitietokanta ja autentikointi; lakisääteiset velvoitteet; oikeudellisten vaatimusten puolustaminen. Ajantasainen alikäsittelijälista ja DPA on saatavilla pyynnöstä: support@urakompassi.com. Tietoja ei siirretä EU/ETA‑alueen ulkopuolelle ilman asianmukaista suojamekanismia (esim. SCC).

## 7. Säilytys ja poistaminen
Testitulokset: 3 vuotta suorituspäivästä; Premium‑oppilaitoksille 5 vuotta. Luokkakoodit (class token) ja testitulosten viittaukset säilytetään Supabase-postgres-tietokannassa hajautettuina; PIN-koodit poistuvat automaattisesti 24 tunnin jälkeen. Opettajien ja koulujen tiedot: käyttöoikeuden voimassaolo + 1 vuosi. Aggregoitu anonymisoitu data voidaan säilyttää toistaiseksi. Poistot toteutetaan automaattisissa sykleissä tai opettajan pyynnöstä luokkakohtaisesti.

## 8. Rekisteröidyn oikeudet
Oikeus saada tietoa, tarkastaa, oikaista, poistaa, rajoittaa tai vastustaa käsittelyä sekä siirtää tiedot. Oppilaat käyttävät oikeuksiaan oppilaitoksen kautta. Opettajat ja muut käyttäjät voivat olla suoraan yhteydessä tukeen. Koska oppilastiedot ovat pseudonymisoituja, kaikkia oikeuksia ei aina voida kohdentaa yksittäiseen henkilöön.

## 9. Turvallisuustoimenpiteet
TLS 1.3, AES‑256 levossa, vähimmän oikeuden periaate, käyttö- ja pääsylokit, säännölliset varmuuskopiot ja haavoittuvuustestaukset, tietoturvapolitiikan auditointi vuosittain. Tietoturvaloukkauksista ilmoitetaan ilman aiheetonta viivytystä ja tarvittaessa 72 h kuluessa.

## 10. Evästeet ja seuranta
Käytetään vain välttämättömiä evästeitä (esim. autentikointi- ja istuntoevästeet). Ei kolmannen osapuolen seurantaa. Selainkohtaiset asetukset (esim. viimeisimmät testitulokset, todistuspiste-laskurin syötteet ja skenaariotyökalun tila) tallennetaan selaimen localStorageen käyttäjän päätelaitteelle; tietoja ei lähetetä palvelimelle. Jos analytiikka otetaan käyttöön, siitä ilmoitetaan erillisessä evästekäytännössä.

## 11. Lasten tietosuoja
Palvelu on tarkoitettu vähintään 13‑vuotiaille. Alle 13‑vuotiaat voivat käyttää Palvelua vain huoltajan tai opettajan valvonnassa. Oppilaitos vastaa tarvittavista suostumuksista ja ohjeistuksesta.

## 12. Valvontaviranomainen ja valitusoikeus
Tietosuojavaltuutetun toimisto, Lintulahdenkatu 4, 00530 Helsinki, https://tietosuoja.fi.

## 13. Muutokset selosteeseen
Voimme päivittää tätä selostetta (esim. lakimuutokset, tekniset muutokset). Uusi versio julkaistaan verkkosivuilla ja päiväys päivitetään.

## 14. Sovellettava laki ja kieli
Sovellettava laki: Suomen laki. Virallinen kieli on suomi; ristiriitatilanteessa suomenkielinen versio on ensisijainen.

## 15. Yhteystiedot
Urakompassi Oy, Säterintie 6 C, [postinumero ja kaupunki], Finland
Sähköposti: support@urakompassi.com`}
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
              <Link href="/legal/immateriaalioikeus-ja-kilpailijasuoja" className="hover:text-gray-900 hover:underline">
                Immateriaalioikeus- ja kilpailijansuoja
              </Link>
            </div>
            <p className="text-gray-500">© 2025 Urakompassi</p>
          </div>
        </div>
      </footer>
    </div>
  )
}



