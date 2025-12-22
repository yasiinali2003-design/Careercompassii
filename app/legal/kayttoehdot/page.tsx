import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KayttoehdotPage() {
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
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-white">KÄYTTÖEHDOT — Urakompassi Oy</h1>
          <p className="text-sm text-neutral-400 mb-8">Versio 4.0 • Viimeksi päivitetty: 12.2025 • Y‑tunnus: 3579081-5</p>
          <div className="space-y-6 leading-relaxed text-base">
          <pre className="whitespace-pre-wrap font-sans text-[15px] text-neutral-200">
{`## 1 Johdanto

Nämä käyttöehdot ("Ehdot") säätelevät Urakompassi Oy:n ("Urakompassi", "me") tarjoaman verkkopalvelun ("Palvelu") käyttöä. Käyttämällä Palvelua hyväksyt nämä Ehdot kulloinkin voimassa olevina. Jos et hyväksy Ehtoja, älä käytä Palvelua. Palvelu on tutkimuspohjainen urasuunnittelutyökalu; tulokset ovat ohjeellisia eivätkä takaa tiettyä lopputulosta.

## 2 Määritelmät
"Palvelu": Urakompassin verkkopalvelu ja sen osat.
"Käyttäjä": henkilö, joka käyttää Palvelua.
"Sopimus": nämä Ehdot sekä Tietosuojaseloste ja Immateriaalioikeus- ja Kilpailijasuoja.

## 3 Käyttöoikeus ja ikäraja
Palvelua voivat käyttää vähintään 13‑vuotiaat. Alle 13‑vuotiaiden käyttö edellyttää huoltajan suostumusta ja valvontaa.

## 4 Sallitut käyttötarkoitukset
Palvelu on tarkoitettu henkilökohtaiseen urasuunnitteluun ja ammatilliseen ohjaukseen. Muu kaupallinen hyödyntäminen ilman Urakompassin kirjallista lupaa on kielletty.

## 5 Käyttöoikeuden sisältö
Myönnämme ei‑yksinomaisen ja ei‑siirrettävän käyttöoikeuden Palveluun näiden Ehtojen mukaisesti. Käyttöoikeus ei anna omistusoikeutta Palvelun sisältöihin tai aineistoihin.

## 6 Immateriaalioikeudet
Palvelun sisältö, testikysymykset, algoritmit, käyttöliittymä ja dokumentaatio ovat Urakompassi Oy:n omaisuutta ja suojattuja lain mukaan. Yksityiskohtainen suoja on kuvattu Immateriaalioikeus- ja Kilpailijasuoja‑dokumentissa, joka on osa näitä Ehtoja. Reverse engineering ja datalouhinta on kielletty siltä osin kuin se ei perustu pakottavaan lakiin.

## 7 Kielletty toiminta
Käyttäjä sitoutuu olemaan: (i) kopioimatta tai tallentamatta testisisältöä, (ii) analysoimatta tai muokkaamatta algoritmeja, (iii) käyttämättä automatisoituja työkaluja (scraping, botit, data‑louhinta), (iv) hyödyntämättä Palvelua kilpailevan palvelun kehittämiseen, (v) kiertämättä teknisiä suojausmekanismeja.

## 8 Tekniset käyttörajoitukset
Urakompassi voi asettaa kohtuullisia käyttörajoituksia väärinkäytön estämiseksi. Ajantasaiset rajoitukset ilmoitetaan Palvelussa ja niitä voidaan päivittää perustellusti.

## 9 Tietojen käsittely
Tietosuojakäytännöt on kuvattu Tietosuojaselosteessa, joka on osa näitä Ehtoja. Urakompassi toimii rekisterinpitäjänä käyttäjätiedoille.

## 10 Palvelun saatavuus ja tuki
Palvelu tarjotaan "best effort" ‑periaatteella. Suunnitelluista huoltotöistä ilmoitetaan etukäteen. Tuki vastaa sähköpostitse kohtuullisessa ajassa.

## 11 Palvelun muutokset ja keskeytykset
Voimme päivittää tai keskeyttää Palvelun tilapäisesti tai pysyvästi. Merkittävistä muutoksista ilmoitetaan kohtuullisessa ajassa Palvelussa tai sähköpostitse.

## 12 Vastuunrajoitus
Palvelu tarjotaan "sellaisenaan". Emme takaa keskeytyksetöntä toimintaa tai tiettyä lopputulosta. Rajoitus ei koske pakottavaa kuluttajansuojaa.

## 13 Kuluttajien erityiset oikeudet
Kuluttaja‑asiakkaalla on oikeus peruuttaa sopimus 14 päivän kuluessa sekä tehdä valitus kuluttajaviranomaiselle.

## 14 Sovellettava laki ja riidanratkaisu
Sovellettava laki: Suomen laki. Riidat pyritään ratkaisemaan neuvotteluin. Kuluttaja‑asiat: Kuluttajariitalautakunta tai Helsingin käräjäoikeus. Ehtojen kieli on suomi; ristiriitatilanteessa suomenkielinen versio on ensisijainen.

## 15 Tietojen säilytys
Testitulokset säilytetään enintään 3 vuotta testin suorituspäivästä. Selainkohtaiset asetukset säilytetään käyttäjän omassa laitteessa eikä niitä toimiteta Urakompassille.

## 16 Tietoturvapoikkeamat
Ilmoitamme tietoturvaloukkauksista ilman aiheetonta viivytystä ja viimeistään 72 tunnin kuluessa, mikäli sovellettava laki sitä edellyttää.

## 17 EU/ETA-alueen ulkopuoliset siirrot
Urakompassi ei siirrä henkilötietoja EU/ETA-alueen ulkopuolelle ilman asianmukaista siirtoperustetta.

## 18 Ehtojen muutokset
Voimme päivittää Ehtoja; uudet Ehdot tulevat voimaan ilmoitetusta päivästä. Palvelun käyttö muutosten jälkeen merkitsee hyväksymistä.

## 19 Yhteystiedot
Urakompassi Oy
Säterintie 6, 00720 Helsinki, Finland
Y‑tunnus: 3579081-5
Sähköposti: info@urakompassi.fi`}
          </pre>
        </div>
        </div>
      </main>
    </div>
  )
}
