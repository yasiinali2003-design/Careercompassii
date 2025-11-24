# ❓ Urakompassi - Usein Kysytyt Kysymykset (FAQ)

Täältä löydät vastaukset yleisimpiin kysymyksiin Urakompassista.

---

## 🚀 Aloittaminen

### Miten saan opettajakoodin?
Ota yhteyttä sähköpostitse: **tuki@urakompassi.fi**  
Lähetä pyyntö opettajakoodista, ja saat koodin 1-2 arkipäivän kuluessa.

### Mihin kirjaudun sisään?
Kirjaudu osoitteessa: **careercompassi.vercel.app/teacher/login**  
Käytä saatamaasi opettajakoodia.

### Kuinka monta luokkaa voin luoda?
Voit luoda **rajoittamattoman määrän** luokkia. Jokainen luokka on itsenäinen, joten voit järjestää eri luokille, eri ajanjaksoille jne.

### Voiko sama oppilas tehdä testin useamman kerran?
Kyllä, oppilas voi tehdä testin uudelleen eri luokkaan. Jokainen PIN-koodi voi kuitenkin käyttää vain **kerran**, joten uutta testiä varten tarvitaan uusi PIN-koodi.

---

## 🔐 Turvallisuus ja Tietosuoja

### Missä oppilaiden nimet tallennetaan?
**Nimet tallennetaan VAIN sinun omaan tietokoneeseesi.** Nimet eivät koskaan lähetetä palvelimelle, joten ne eivät poistu selaimestasi. Jos vaihdat tietokonetta, nimet eivät siirry automaattisesti.

### Miten nimet salataan?
Nimet salataan paikallisesti selaimessasi käyttäen AES-GCM -salausmenetelmää. Vientitiedostot ovat salattuja, joten voit viedä ja tuoda nimiä turvallisesti.

### Mitä tietoja palvelimelle tallennetaan?
Palvelimelle tallennetaan:
- ✅ Testin tulokset (anonyymisti, ilman nimiä)
- ✅ PIN-koodit ja luokan tiedot
- ✅ Opettajan perustiedot (nimi, email, koulu)

**EI tallenneta:**
- ❌ Oppilaiden nimiä
- ❌ Henkilökohtaisia tunnistetietoja
- ❌ IP-osoitteita (vain hash, GDPR-yhteensopiva)

### Ovatko tulokset GDPR-yhteensöviä?
Kyllä! CareerCompass on suunniteltu noudattamaan GDPR-säädöksiä:
- Nimet eivät koskaan palvelimella
- IP-osoitteet hashataan (ei tunnistettavaa dataa)
- Rajoitettu datan säilyttäminen
- Voit pyytää tietojesi poistamisen milloin tahansa

---

## 🧪 Testin tekeminen

### Kuinka kauan testi kestää?
Testi kestää noin **10-15 minuuttia** per oppilas. Testissä on 30 kysymystä.

### Miten monta oppilasta voi tehdä testin samaan aikaan?
**Rajoittamatonta määrää!** Jokainen oppilas käyttää omaa PIN-koodiaan, joten testit ovat itsenäisiä.

### Voivatko oppilaat tehdä testin kotona?
Kyllä! Testi toimii kaikilla laitteilla (puhelin, tablet, tietokone) ja missä tahansa, missä on internet-yhteys.

### Tarvitseeko oppilaat rekisteröityä?
Ei! Oppilaat eivät tarvitse käyttäjätiliä. He syöttävät vain PIN-koodin ja tekevät testin.

### Miksi oppilaan täytyy syöttää PIN-koodi?
PIN-koodi linkittää testin oikeaan luokkaan ja opettajaan. Ilman PIN-koodia emme voi varmistaa, että tulos menee oikeaan paikkaan.

### Voiko oppilas tehdä testin uudelleen?
Sama PIN-koodi toimii vain kerran. Uutta testiä varten oppilaalla on oltava uusi PIN-koodi (joka luodaan uuteen luokkaan tai uudelleenPIN-generointi - jos tämä ominaisuus on käytössä).

---

## 📊 Tulokset ja Analysointi

### Milloin näen tulokset?
Tulokset näkyvät heti, kun oppilas on suorittanut testin. Tulokset päivittyvät automaattisesti opettajan hallintapaneelissa.

### Mitä tietoja tuloksissa näkyy?
Jokaisesta oppilaasta näet:
- ✅ Henkilökohtaisen profiilin
- ✅ Top 5 ammattisuositukset
- ✅ Dimensioiden tulokset (kiinnostukset, arvot, työtapa, konteksti)
- ✅ Koulutuspolkujen suositukset (YLA-opiskelijoille: lukio/ammattikoulu/kansanopisto)
- ✅ "Tarvitsee tukea" -merkintä (jos oppilas tarvitsee ohjausta)

### Mitä "Tarvitsee tukea" -merkintä tarkoittaa?
Se tarkoittaa, että oppilaan tulokset ovat alhaiset kaikissa ulottuvuuksissa tai keskimääräinen pistemäärä on alle 50%. Nämä oppilaat tarvitsevat erityistä ohjausta ja keskustelua.

### Miten luokan keskiarvot lasketaan?
Luokan keskiarvot näyttävät:
- Yleisimmät koulutuspolut (lukio/ammattikoulu/kansanopisto)
- Yleisimmät ammatit (top 5)
- Dimensioiden keskiarvot (kiinnostukset, arvot, työtapa, konteksti)

### Voiko oppilas nähdä oman tuloksensa?
Kyllä! Oppilas näkee oman tuloksensa heti testin jälkeen. Hän voi tallentaa tuloksen tai tulostaa sen.

---

## 💾 Vienti ja Raportointi

### Miten voin viedä tulokset?
Voit viedä tulokset kahdella tavalla:
1. **CSV-tiedosto (yksityiskohtainen):** Kaikki oppilaat yhdessä tiedostossa
2. **Yksittäiset raportit:** Jokaisesta oppilaasta erillinen tekstitiedosto

### Miksi en voi viedä PDF-muodossa?
PDF-vienti on Premium-paketin ominaisuus (2,000€/vuosi). Yläaste-paketissa (1,200€/vuosi) on CSV-vienti ja yksittäiset tekstitiedostot. Jos haluat PDF-raportit, ota yhteyttä tutustuaksesi Premium-pakettiin.

### Voiko CSV-tiedosto avata Excelissä?
Kyllä! CSV-tiedosto avautuu suoraan Excelissä, Google Sheetsissä tai muissa taulukkolaskentaohjelmissa.

### Miten jakaa tulokset oppilaiden vanhemmille?
Voit:
1. Ladata yksittäiset raportit
2. Tulostaa ne tai lähettää sähköpostitse
3. Jakaa CSV-tiedoston (jos nimet on mappattu)

**Muista:** Tietosuoja - varmista että jaat tiedot turvallisesti ja vain oikeille henkilöille.

---

## 🎓 Koulutuspolkujen suositukset

### Kenelle koulutuspolkujen suositus annetaan?
Koulutuspolkujen suositus (lukio/ammattikoulu/kansanopisto) annetaan **vain YLA-oppilaille** (yläaste, 7.-9. luokat).

### Miksi TASO2 ja NUORI -oppilaat eivät saa suositusta?
He ovat jo toisen asteen opiskelijoita tai aikuisia, joten koulutuspolkuvalinta on jo tehty. He saavat ammattisuosituksia.

### Miten suositus lasketaan?
Suositus perustuu oppilaan vastauksiin ensimmäisiin 15 kysymykseen, jotka käsittelevät:
- Oppimistapaa (teoria vs. käytäntö)
- Tulevaisuuden suunnitelmia
- Kiinnostusta yliopistoon
- Halua työskennellä nopeasti

### Onko suositus 100% varma?
Ei. Suositus on indikaatio oppilaan profiilin perusteella. On tärkeää keskustella oppilaan kanssa ja kuunnella hänen omia ajatuksiaan.

---

## 🔧 Tekniset kysymykset

### Mitä selaimia voin käyttää?
CareerCompass toimii kaikilla moderneilla selaimilla:
- ✅ Google Chrome (suositus)
- ✅ Safari
- ✅ Microsoft Edge
- ✅ Firefox

### Toimiiko testi tablet-laitteilla?
Kyllä! Testi toimii hyvin tablet-laitteilla. Se on suunniteltu kosketusnäyttölaitteita varten.

### Mitä jos internet-yhteys katkeaa testin aikana?
Jos yhteys katkeaa, oppilas voi:
1. Sulkea selaimen
2. Avaa linkin uudelleen
3. Syöttää PIN-koodin uudelleen
4. Testi jatkuu siitä mihin jäi (jos selain on tallentanut edistymisen)

**Huom:** Joissain tapauksissa testi voi alkaa alusta.

### Miksi PIN-koodi ei toimi?
Mahdolliset syyt:
1. PIN-koodi on jo käytetty (jokainen PIN toimii vain kerran)
2. PIN-koodi kuuluu eri luokkaan
3. PIN-koodi on kirjoitettu väärin
4. Luokka on poistettu

**Ratkaisu:** Tarkista PIN-koodi opettajan hallintapaneelista ja varmista että käytät oikeaa luokan linkkiä.

### Miksi tulokset eivät näy?
Mahdolliset syyt:
1. Testi ei ole vielä valmis (odota muutama sekunti)
2. Päivitä sivu (F5 tai Cmd+R)
3. Tarkista että olet oikeassa luokassa

---

## 📋 Käyttörajoitukset

### Montako oppilasta voin testata?
**Rajoittamatonta määrää!** Voit luoda niin monta PIN-koodia kuin tarvitset.

### Montako testiä oppilas voi tehdä päivässä?
Jokainen PIN-koodi toimii vain **kerran**. Uutta testiä varten oppilaalla on oltava uusi PIN-koodi uudesta luokasta.

**Tärkeää:** Tämä on tietoturvaominaisuus - varmistaa että testi tehdään kerran rehellisesti.

### Onko testausrajoituksia?
Ei oppilasmäärän osalta, mutta **rate limiting** rajoittaa:
- 10 testiä tunnissa per IP-osoite
- 50 testiä vuorokaudessa per IP-osoite

Tämä estää väärinkäytön ja varmistaa järjestelmän sujuvan toiminnan.

---

## 💰 Hinnoittelu ja Paketit

### Mitä eroaa Yläaste- ja Premium-paketissa?

**Yläaste-paketti (1,200€/vuosi) sisältää:**
- Opettajan hallintapaneelin
- PIN-koodien generoinnin
- CSV-viennin
- Yksinkertaiset analyysit
- Sähköpostituen
- 1 vuoden datan säilytyksen

**Premium-paketti (2,000€/vuosi) lisää:**
- PDF-raporttien generoinnin
- Vertailuanalyysit (luokat/ajanjaksot)
- 5 vuoden datan säilytyksen
- Nopean tuen ja käyttöohjeistuksen
- API-pääsyn

### Voiko pakettia päivittää myöhemmin?
Kyllä! Voit päivittää pakettia milloin tahansa. Ota yhteyttä: tuki@urakompassi.fi

### Voiko pakettia alentaa?
Jos haluat vaihtaa halvempaan pakettiin, ota yhteyttä tukeen. Muista että tämä voi rajoittaa käytettävissä olevia ominaisuuksia.

### Mitä maksaa "Ilmainen" -paketti?
Ilmainen-paketti on täysin ilmainen yksityishenkilöille. Se sisältää:
- Perus-urapolku-testin
- Henkilökohtaiset tulokset
- EI opettajan hallintapaneelia

---

## 🆘 Ongelmat ja Tuki

### Mihin otan yhteyttä jos minulla on ongelma?
**Sähköposti:** tuki@urakompassi.fi  
**Vastausaika:** 1-2 arkipäivää

Kerro ongelmasta mahdollisimman tarkasti:
- Mitä yritit tehdä?
- Mitä tapahtui sen sijaan?
- Näyttääkö virheilmoitus? Jos kyllä, mitä siinä sanotaan?

### Voiko tukea tulla tavata videopuhelussa?
Kyllä, voimme järjestää videopuhelun tarvittaessa. Pyydä tätä sähköpostitse.

### Onko käyttöohjeistus videona?
Käyttöohjevideot ovat tulossa. Tällä hetkellä parhaiten löydät ohjeet tästä FAQ-dokumentista ja Teacher Setup Guide -dokumentista.

---

## 🎯 Parhaat käytännöt

### Milloin kannattaa järjestää testi?
Suositukset:
- **Yläaste (9. luokka):** Syksyllä ennen hakujen alkua
- **Toinen aste:** Alussa ohjauksen suunnittelua varten
- **Nuoret aikuiset:** Milloin tahansa uraohjauksen tarpeen mukaan

### Miten valmistan oppilaat testiin?
1. Kerro että testissä ei ole oikeita tai väärää vastauksia
2. Muistuta vastaamaan rehellisesti
3. Kerro että testi kestää noin 15 minuuttia
4. Varmista että oppilailla on PIN-koodit valmiina

### Miten keskustelen tuloksista oppilaiden kanssa?
1. Aloita positiivisesti - korosta oppilaan vahvuuksia
2. Käytä profiilisummaa keskustelun aloituksena
3. Kysy oppilaan omia ajatuksia
4. Anna aikaa pohtia

### Miten käytän "Tarvitsee tukea" -merkintää?
Nämä oppilaat hyötyvät:
- Yksilöllisestä ohjauksesta
- Lisäkeskustelusta urasuunnittelusta
- Mahdollisesti vanhempien osallistumisesta

---

## 📚 Lisätietoja

### Missä voin lukea lisää?
- **Asennusoppas:** Teacher Setup Guide
- **Hinnoittelu:** /kouluille -sivulta
- **Yhteydenotto:** tuki@urakompassi.fi

### Onko videotutorialeja tulossa?
Kyllä! Videotutorialit ovat kehitysvaiheessa. Ilmoitamme niistä sähköpostitse kun ne ovat valmiit.

### Voiko järjestelmää käyttää ilman internet-yhteyttä?
Ei. CareerCompass vaatii internet-yhteyden toimiaakseen, koska se on pilvipohjainen palvelu.

---

## ❓ Jos kysymystäsi ei vastattu?

Ota rohkeasti yhteyttä!  
**Sähköposti:** tuki@urakompassi.fi

Autamme mielellämme ja vastaamme myös uusiin kysymyksiin, joita voimme lisätä tähän FAQ:ään myöhemmin.

---

**Viimeksi päivitetty:** 2025-01-29  
**Versio:** 1.0  
**Ylläpito:** CareerCompass Team






