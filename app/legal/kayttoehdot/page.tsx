import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function KayttoehdotPage() {
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
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-white">KÄYTTÖEHDOT — Urakompassi Oy</h1>
          <div className="space-y-6 leading-relaxed text-base">
          <pre className="whitespace-pre-wrap font-sans text-[15px] text-neutral-200">
{`1. Johdanto
Nämä käyttöehdot säätelevät Urakompassi Oy:n tarjoaman verkkopalvelun käyttöä. Käyttämällä palvelua hyväksyt nämä ehdot. Jos et hyväksy ehtoja, älä käytä palvelua.

2. Määritelmät
"Palvelu" tarkoittaa Urakompassin verkkopalvelua ja sen osia.
"Käyttäjä" tarkoittaa henkilöä, joka käyttää palvelua.
"Oppilaitos" tarkoittaa koulua tai oppilaitosta, joka käyttää Palvelua oppilaiden uraohjauksessa.
"Sopimus" tarkoittaa näitä käyttöehtoja, tietosuojaselostetta ja immateriaalioikeus- ja kilpailijasuojadokumenttia.

3. Käyttöoikeus ja ikäraja
Palvelua voivat käyttää vähintään 13-vuotiaat. Alle 13-vuotiaiden käyttö edellyttää huoltajan suostumusta ja valvontaa.

4. Oppilaitosten vastuu
Kun oppilaitos ottaa Palvelun käyttöön oppilaiden uraohjauksessa, oppilaitos vastaa:
• Tarvittavien suostumusten hankkimisesta huoltajilta ennen Palvelun käyttöä
• Oppilaiden ja huoltajien informoinnista Palvelun käytöstä ja tietojenkäsittelystä
• Ikärajojen noudattamisesta ja valvonnasta
• Palvelun käytön ohjeistamisesta oppilaille
• Tietosuoja-asetuksen (GDPR) mukaisten velvoitteiden täyttämisestä rekisterinpitäjänä
Oppilaitos toimii henkilötietojen rekisterinpitäjänä oppilaiden osalta, ja Urakompassi toimii henkilötietojen käsittelijänä. Oppilaitoksen tulee varmistaa, että sillä on asianmukainen oikeusperuste henkilötietojen käsittelylle.

5. Sallitut käyttötarkoitukset
Palvelu on tarkoitettu henkilökohtaiseen urasuunnitteluun ja ammatilliseen ohjaukseen. Muu kaupallinen hyödyntäminen ilman Urakompassin kirjallista lupaa on kielletty.

6. Käyttöoikeuden sisältö
Myönnämme käyttäjälle ei-yksinomaisen ja ei-siirrettävän käyttöoikeuden Palveluun näiden Ehtojen mukaisesti. Käyttöoikeus ei anna omistusoikeutta Palvelun sisältöihin tai aineistoihin.

7. Immateriaalioikeudet
Palvelun sisältö, testikysymykset, algoritmit, käyttöliittymä ja dokumentaatio ovat Urakompassi Oy:n omaisuutta ja suojattuja lain mukaan. Yksityiskohtainen suoja on kuvattu immateriaalioikeus- ja kilpailijasuojadokumentissa, joka on osa näitä ehtoja. Käänteinen suunnittelu (reverse engineering) ja datalouhinta ovat kiellettyjä siltä osin kuin ne eivät perustu pakottavaan lakiin.

8. Kielletty toiminta
Käyttäjä sitoutuu olemaan:
• kopioimatta tai tallentamatta testisisältöä
• analysoimatta tai muokkaamatta algoritmeja
• käyttämättä automatisoituja työkaluja (scraping, botit, datalouhinta)
• hyödyntämättä Palvelua kilpailevan palvelun kehittämiseen
• kiertämättä teknisiä suojausmekanismeja

9. Tekniset käyttörajoitukset
Urakompassi voi asettaa kohtuullisia käyttörajoituksia väärinkäytösten estämiseksi. Ajantasaiset rajoitukset ilmoitetaan Palvelussa, ja niitä voidaan päivittää perustellusti.

10. Tietojen käsittely
Tietosuojakäytännöt on kuvattu Tietosuojaselosteessa, joka on osa näitä Ehtoja. Urakompassi toimii rekisterinpitäjänä yksityiskäyttäjien tiedoille. Oppilaitosten käyttäessä Palvelua oppilaiden ohjauksessa, oppilaitos toimii rekisterinpitäjänä ja Urakompassi henkilötietojen käsittelijänä.

11. Palvelun saatavuus ja tuki
Palvelu tarjotaan parhaan kykymme mukaan (best effort -periaatteella). Suunnitelluista huoltotöistä ilmoitetaan etukäteen. Asiakastuki vastaa sähköpostitse kohtuullisessa ajassa.

12. Palvelun muutokset ja keskeytykset
Voimme päivittää tai keskeyttää Palvelun tilapäisesti tai pysyvästi. Merkittävistä muutoksista ilmoitetaan kohtuullisessa ajassa Palvelussa tai sähköpostitse.

13. Vastuunrajoitus
Palvelu tarjotaan sellaisenaan. Emme takaa keskeytyksetöntä toimintaa tai tiettyä lopputulosta. Tämä rajoitus ei koske pakottavaa kuluttajansuojalainsäädäntöä.

14. Kuluttajien erityiset oikeudet
Kuluttaja-asiakkaalla on oikeus peruuttaa sopimus 14 päivän kuluessa sekä tehdä valitus kuluttajaviranomaiselle.

15. Sovellettava laki ja riidanratkaisu
Sovellettava laki on Suomen laki. Riidat pyritään ratkaisemaan ensisijaisesti neuvotteluteitse. Kuluttaja-asioissa toimivaltainen taho on Kuluttajariitalautakunta tai Helsingin käräjäoikeus. Ehtojen virallinen kieli on suomi, ja ristiriitatilanteessa suomenkielinen versio on ensisijainen.

16. Tietojen säilytys
Testitulokset säilytetään enintään kolme vuotta testin suorituspäivästä. Selainkohtaiset asetukset säilytetään käyttäjän omassa laitteessa, eikä niitä toimiteta Urakompassille.

17. Tietoturvapoikkeamat
Ilmoitamme tietoturvaloukkauksista ilman aiheetonta viivytystä ja viimeistään 72 tunnin kuluessa, mikäli sovellettava laki sitä edellyttää.

18. EU/ETA-alueen ulkopuoliset siirrot
Urakompassi ei siirrä henkilötietoja EU/ETA-alueen ulkopuolelle ilman asianmukaista siirtoperustetta.

19. Ehtojen muutokset
Voimme päivittää näitä Ehtoja. Uudet Ehdot tulevat voimaan ilmoitetusta päivästä alkaen. Palvelun käyttö muutosten jälkeen merkitsee Ehtojen hyväksymistä.`}
          </pre>
        </div>
        </div>
      </main>
    </div>
  )
}
