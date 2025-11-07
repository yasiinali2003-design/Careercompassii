import Link from 'next/link';

export default function KayttoehdotPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-primary">KÄYTTÖEHDOT — CareerCompassi Oy</h1>
          <p className="text-sm text-muted-foreground mb-8">Versio 3.3 • Viimeksi päivitetty: 7.11.2025 • Y‑tunnus: [täydennä] • Rekisteröity tavaramerkki: [täydennä]</p>
          <div className="space-y-6 leading-relaxed text-base">
          <pre className="whitespace-pre-wrap font-sans text-[15px]">
{`## 1 Johdanto

Nämä käyttöehdot (“Ehdot”) säätelevät CareerCompassi Oy:n (“CareerCompassi”, “me”) tarjoaman verkkopalvelun (“Palvelu”) käyttöä. Käyttämällä Palvelua hyväksyt nämä Ehdot kulloinkin voimassa olevina. Jos et hyväksy Ehtoja, älä käytä Palvelua. Palvelu on tekoälypohjainen urasuunnittelu- ja testijärjestelmä; tulokset ovat ohjeellisia eivätkä takaa tiettyä lopputulosta.

## 2 Määritelmät
“Palvelu”: CareerCompassin verkkopalvelu ja sen osat.
“Käyttäjä”: henkilö tai oppilaitos, joka käyttää Palvelua.
“Opettaja”: oppilaitoksen valtuuttama henkilö, joka hallinnoi testejä.
“Oppilaitos”: koulu tai muu organisaatio, joka hankkii käyttöoikeuden Palveluun.
“Sopimus”: nämä Ehdot sekä Tietosuojaseloste ja Immateriaalioikeus- ja Kilpailijasuoja.

## 3 Käyttöoikeus ja ikäraja
Palvelua voivat käyttää vähintään 13‑vuotiaat. Alle 13‑vuotiaiden käyttö edellyttää huoltajan tai opettajan suostumusta ja valvontaa. Oppilaitos vastaa ikärajoista ja suostumuksista.

## 4 Sallitut käyttötarkoitukset
Palvelu on tarkoitettu (i) henkilökohtaiseen urasuunnitteluun, (ii) opetuskäyttöön opettajan valvonnassa ja (iii) ammatilliseen ohjaukseen. Muu kaupallinen hyödyntäminen ilman CareerCompassin kirjallista lupaa on kielletty.

## 5 Käyttöoikeuden sisältö
Myönnämme ei‑yksinomaisen ja ei‑siirrettävän käyttöoikeuden Palveluun näiden Ehtojen mukaisesti. Käyttöoikeus ei anna omistusoikeutta Palvelun sisältöihin tai aineistoihin.

## 6 Immateriaalioikeudet
Palvelun sisältö, testikysymykset, algoritmit, käyttöliittymä ja dokumentaatio ovat CareerCompassi Oy:n omaisuutta ja suojattuja lain mukaan. Yksityiskohtainen suoja on kuvattu Immateriaalioikeus- ja Kilpailijasuoja‑dokumentissa, joka on osa näitä Ehtoja. Reverse engineering ja datalouhinta on kielletty siltä osin kuin se ei perustu pakottavaan lakiin (esim. yhteentoimivuus).

## 7 Kielletty toiminta
Käyttäjä sitoutuu olemaan: (i) kopioimatta tai tallentamatta testisisältöä, (ii) analysoimatta tai muokkaamatta algoritmeja, (iii) käyttämättä automatisoituja työkaluja (scraping, botit, data‑louhinta), (iv) hyödyntämättä Palvelua kilpailevan palvelun kehittämiseen, (v) kiertämättä teknisiä suojausmekanismeja.

## 8 Tekniset käyttörajoitukset
CareerCompassi voi asettaa kohtuullisia käyttörajoituksia väärinkäytön estämiseksi. Ajantasaiset rajoitukset ilmoitetaan Palvelussa tai dokumentaatiossa ja niitä voidaan päivittää perustellusti (esim. kapasiteetti, väärinkäytökset).

## 9 Tietojen käsittely
Tietosuojakäytännöt on kuvattu Tietosuojaselosteessa, joka on osa näitä Ehtoja. Oppilaitos toimii oppilaiden tietojen rekisterinpitäjänä; CareerCompassi toimii tietojen käsittelijänä oppilaitoksen lukuun ja rekisterinpitäjänä omille käyttäjätiedoilleen. Testien luokkakoodit (class token) tallennetaan Supabase-postgres-tietokantaan hajautettuina ja PIN-koodit poistuvat automaattisesti 24 tunnin jälkeen.

## 10 Maksut ja laskutus
Maksullisen Palvelun osalta: maksuehto 14 pv netto laskun päiväyksestä. Viivästyskorko 8 % + viitekorko; muistutuskulut lain mukaisesti. CareerCompassi voi keskeyttää käyttöoikeuden, jos maksu viivästyy yli 14 päivää. Hinnat ALV‑käytännön mukaisesti. Maksettuja maksuja ei palauteta, paitsi pakottavan lain tai olennaisen palveluvirheen tapauksissa.

## 11 Palvelun saatavuus ja tuki
Palvelu tarjotaan “best effort” ‑periaatteella. Suunnitelluista huoltotöistä ilmoitetaan etukäteen. Tuki vastaa sähköpostitse kahden arkipäivän kuluessa. Mahdolliset Premium‑tason tukietuudet kuvataan erillisissä palvelukuvauksissa.

## 12 Palvelun muutokset ja keskeytykset
Voimme päivittää tai keskeyttää Palvelun tilapäisesti tai pysyvästi. Merkittävistä muutoksista ilmoitetaan kohtuullisessa ajassa Palvelussa tai sähköpostitse. Materiaalisiin sopimusehtoihin tehtävistä muutoksista ilmoitetaan 30 päivää etukäteen, ellei kyse ole lain tai tietoturvan edellyttämästä kiireellisestä muutoksesta.

## 13 Vastuunrajoitus
Palvelu tarjotaan “sellaisenaan”. Emme takaa keskeytyksetöntä toimintaa tai tiettyä lopputulosta. CareerCompassin kokonaisvastuu rajoittuu määrään, joka vastaa viimeisen 12 kuukauden aikana maksettuja lisenssimaksuja, kuitenkin enintään [katto, esim. 20 000 €]. Rajoitus ei koske pakottavaa kuluttajansuojaa.

## 14 Kuluttajien erityiset oikeudet
Kuluttaja‑asiakkaalla on oikeus peruuttaa sopimus 14 päivän kuluessa sekä tehdä valitus kuluttajaviranomaiselle. Nämä oikeudet eivät koske oppilaitos- tai yritysasiakkaita.

## 15 Sovellettava laki ja riidanratkaisu
Sovellettava laki: Suomen laki. Riidat pyritään ratkaisemaan neuvotteluin. Kuluttaja‑asiat: Kuluttajariitalautakunta tai Helsingin käräjäoikeus. B2B‑asiat: ensisijaisesti Helsingin käräjäoikeus. Ehtojen kieli on suomi; ristiriitatilanteessa suomenkielinen versio on ensisijainen.

## 16 Tietojen säilytys ja Premium‑ehdot
Testitulokset säilytetään 3 vuotta testin suorituspäivästä. Premium‑oppilaitoksille säilytysaika on 5 vuotta sopimuksen mukaisesti. Selainkohtaiset asetukset (esim. laskuri- ja testisyötteet) säilytetään käyttäjän omassa laitteessa localStoragessa eikä niitä toimiteta CareerCompassille. Pakettikohtaiset ehdot kuvataan hinnoittelusivulla ja/tai sopimuksessa.

## 17 API‑pääsy
API ei ole oletuksena saatavilla. Premium‑oppilaitoksille voidaan tarjota rajattu luku‑API erillisellä sopimuksella (API‑avaimet, käyttörajoitukset, tietoturvavaatimukset).

## 18 Tietoturvapoikkeamat
Ilmoitamme tietoturvaloukkauksista ilman aiheetonta viivytystä ja viimeistään 72 tunnin kuluessa, mikäli sovellettava laki sitä edellyttää ja tieto koskee rekisterinpitäjän vastuulla olevaa henkilötietoa.

## 19 Ehtojen muutokset
Voimme päivittää Ehtoja; uudet Ehdot tulevat voimaan ilmoitetusta päivästä. Palvelun käyttö muutosten jälkeen merkitsee hyväksymistä.

## 20 Yhteystiedot
CareerCompassi Oy
Säterintie 6 C, [postinumero ja kaupunki], Finland
Y‑tunnus: [täydennä]
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
              <Link href="/legal/tietosuojaseloste" className="hover:text-gray-900 hover:underline">
                Tietosuojaseloste
              </Link>
              <Link href="/legal/immateriaalioikeus-ja-kilpailijasuoja" className="hover:text-gray-900 hover:underline">
                Immateriaalioikeus- ja kilpailijansuoja
              </Link>
            </div>
            <p className="text-gray-500">© 2025 CareerCompassi</p>
          </div>
        </div>
      </footer>
    </div>
  )
}



