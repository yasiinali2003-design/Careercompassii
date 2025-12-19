/**
 * URAKOMPASSI - Realistic End-to-End YLA Cohort Testing
 *
 * Simulating REAL Finnish yläaste students (13-15v) with diverse personalities
 * Each student answers questions as a real child would - with their unique perspective
 */

const API_URL = 'http://localhost:3000/api/score';

// ============================================================
// YLA Question Mapping (Q0-Q29) - What each question asks
// ============================================================
const YLA_QUESTIONS = {
  0: { text: "Kiinnostaako sinua pelien tai sovellusten tekeminen?", subdim: 'technology' },
  1: { text: "Nautitko arvoitusten ja pulmien ratkaisemisesta?", subdim: 'problem_solving' },
  2: { text: "Tykkäätkö keksiä omia tarinoita, piirroksia tai musiikkia?", subdim: 'creative' },
  3: { text: "Onko sinusta kivaa rakentaa tai korjata jotain käsilläsi?", subdim: 'hands_on' },
  4: { text: "Haluaisitko tehdä jotain luonnon ja eläinten hyväksi?", subdim: 'environment' },
  5: { text: "Kiinnostaako sinua tietää, miten ihmiskeho toimii?", subdim: 'health' },
  6: { text: "Oletko koskaan myynyt tai vaihtanut jotain kavereiden kanssa?", subdim: 'business' },
  7: { text: "Haluaisitko tehdä kokeita ja selvittää miten asiat toimivat?", subdim: 'analytical' },
  8: { text: "Onko liikunta ja urheilu tärkeä osa elämääsi?", subdim: 'hands_on' },
  9: { text: "Tykkäätkö selittää asioita muille ja auttaa heitä ymmärtämään?", subdim: 'growth' },
  10: { text: "Kiinnostaako sinua ruoanlaitto ja uusien reseptien kokeilu?", subdim: 'creative' },
  11: { text: "Keksitkö usein uusia tapoja tehdä asioita?", subdim: 'innovation' },
  12: { text: "Haluaisitko auttaa kaveria, jolla on paha mieli?", subdim: 'people' },
  13: { text: "Pidätkö siitä, kun saat päättää mitä ryhmä tekee?", subdim: 'leadership' },
  14: { text: "Kiinnostaako sinua oppia vieraita kieliä?", subdim: 'analytical' },
  15: { text: "Tykkäätkö tehdä ryhmätöitä kavereiden kanssa?", subdim: 'teamwork' },
  16: { text: "Pidätkö siitä, kun tiedät tarkalleen mitä pitää tehdä?", subdim: 'organization' },
  17: { text: "Haluaisitko työskennellä mieluummin ulkona kuin sisällä?", subdim: 'outdoor' },
  18: { text: "Pystytkö keskittymään pitkään samaan tehtävään?", subdim: 'precision' },
  19: { text: "Pidätkö siitä, kun jokainen päivä on erilainen?", subdim: 'flexibility' },
  20: { text: "Pystytkö toimimaan hyvin, vaikka olisi kiire?", subdim: 'performance' },
  21: { text: "Uskaltaisitko puhua luokan edessä?", subdim: 'social' },
  22: { text: "Aloitatko usein itse uusia projekteja tai aktiviteetteja?", subdim: 'independence' },
  23: { text: "Onko sinulle tärkeää, että työsi auttaa yhteiskuntaa?", subdim: 'impact' },
  24: { text: "Haluaisitko ansaita paljon rahaa aikuisena?", subdim: 'financial' },
  25: { text: "Haluaisitko olla tunnettu jostain erityisestä?", subdim: 'advancement' },
  26: { text: "Onko sinulle tärkeää, että jää aikaa harrastuksille?", subdim: 'work_life_balance' },
  27: { text: "Haluaisitko olla oma pomosi joskus?", subdim: 'entrepreneurship' },
  28: { text: "Haluaisitko matkustaa työn takia eri maihin?", subdim: 'global' },
  29: { text: "Onko sinulle tärkeää tietää, mitä teet viiden vuoden päästä?", subdim: 'stability' }
};

// ============================================================
// REALISTIC YLA STUDENTS - Diverse Finnish teenagers
// Each answers questions as THEY would, not optimized for categories
// ============================================================
const REALISTIC_STUDENTS = [
  {
    name: "Veeti, 14v - Pelaaja ja koodaaja",
    description: "Introvertti poika joka pelaa Minecraftia ja CS2:ta, opettelee Pythonia YouTubesta. Ei tykkää ryhmätöistä, viettää paljon aikaa tietokoneella. Matematiikka on helppoa.",
    expectedCategory: "innovoija",
    // Answers as Veeti would think:
    answers: [
      5, // Q0: Pelit ja sovellukset? TOTTA KAI!
      5, // Q1: Pulmat? Joo, tykkään puzzle-peleistä
      2, // Q2: Tarinat/piirustukset? Ei kiinnosta, paitsi pelien tarinat
      3, // Q3: Rakentaa käsillä? Joo Minecraftissa, mutta ei oikeesti
      2, // Q4: Luonto ja eläimet? Ihan ok, mut en erityisemmin
      2, // Q5: Ihmiskeho? Ei oikeen kiinnosta
      2, // Q6: Myynyt kaverille? Joskus pelitavaroita
      5, // Q7: Kokeet ja selvittää? Joo! Tykkään testata asioita
      2, // Q8: Liikunta? En oo mikään urheilija
      3, // Q9: Selittää muille? Joskus autan kaveria koodissa
      1, // Q10: Ruoanlaitto? Ei kiinnosta
      5, // Q11: Uusia tapoja? Joo, optimoin kaiken
      3, // Q12: Auttaa kaveria? Joo jos pyytää
      2, // Q13: Päättää ryhmässä? En halua johtaa
      3, // Q14: Vieraat kielet? Englanti on ok peleistä
      1, // Q15: Ryhmätyöt? Inhoan niitä
      4, // Q16: Tietää mitä tehdä? Joo, selkeät ohjeet on hyviä
      1, // Q17: Ulkona? Ei kiitos
      5, // Q18: Keskittyä pitkään? Joo kun koodaan
      3, // Q19: Erilainen päivä? Ihan sama
      4, // Q20: Kiire? Pystyn, deadline motivoi
      1, // Q21: Puhua luokan edessä? EI
      4, // Q22: Aloittaa projekteja? Joo, omia koodiprojekteja
      2, // Q23: Auttaa yhteiskuntaa? En ajattele sellaista
      4, // Q24: Ansaita rahaa? Joo, IT-alalla on hyvä palkka
      3, // Q25: Olla tunnettu? Ehkä pelissä tai koodaajana
      5, // Q26: Aikaa harrastuksille? Pelaaminen on tärkeää!
      3, // Q27: Oma pomo? En tiedä
      2, // Q28: Matkustaa? Mieluummin kotona
      3  // Q29: Tietää 5v päästä? En mieti niin pitkälle
    ]
  },
  {
    name: "Ella, 15v - Luova some-tyttö",
    description: "Ekstrovertti tyttö joka tekee TikTokeja, piirtää fanartia ja haaveilee tubettajan urasta. Tykkää muodista ja meikkaamisesta. Koulussa hyvä äidinkielessä ja kuvataiteessa.",
    expectedCategory: "luova",
    answers: [
      3, // Q0: Pelit/sovellukset? Käytän somea, mut en koodaa
      2, // Q1: Pulmat? Ei jaksa
      5, // Q2: Tarinat/piirustukset? RAKASTAN piirtämistä!
      3, // Q3: Rakentaa? Teen joskus askarteluja
      3, // Q4: Luonto? Tykkään kauniista maisemista
      2, // Q5: Ihmiskeho? Meikkaaminen kiinnostaa enemmän
      3, // Q6: Myynyt? Joo piirustuksia!
      2, // Q7: Kokeet? Ei kiinnosta
      3, // Q8: Liikunta? Tanssiminen on kivaa
      4, // Q9: Selittää? Joo, teen tutoriaaleja
      4, // Q10: Ruoanlaitto? Tykkään leipoa ja kuvata sitä
      5, // Q11: Uusia tapoja? Kokeilen aina uusia tyylejä
      5, // Q12: Auttaa kaveria? Joo, aina!
      4, // Q13: Päättää ryhmässä? Joo, otan usein johdon
      3, // Q14: Vieraat kielet? Englanti somesta
      5, // Q15: Ryhmätyöt? Rakastan tehdä kavereiden kanssa!
      2, // Q16: Tietää mitä tehdä? En tykkää tiukoista säännöistä
      3, // Q17: Ulkona? Riippuu, kuvauksia varten joo
      3, // Q18: Keskittyä? Kun piirtää, mut muuten vaikea
      5, // Q19: Erilainen päivä? JOO! Rutiinit tylsyttää
      4, // Q20: Kiire? Toimii hyvin paineessa
      5, // Q21: Puhua edessä? Joo, olen tottunut kameraan
      5, // Q22: Aloittaa projekteja? Kokoajan uusia ideoita!
      3, // Q23: Auttaa yhteiskuntaa? Haluaisin inspiroida muita
      4, // Q24: Ansaita? Joo, tubettajat tienaa hyvin
      5, // Q25: Olla tunnettu? KYLLÄ! Haluan olla kuuluisa
      4, // Q26: Aikaa harrastuksille? Tärkeää
      5, // Q27: Oma pomo? Joo! Yrittäjänä
      4, // Q28: Matkustaa? Haluaisin vlogata maailmalla
      2  // Q29: Tietää 5v päästä? Katsotaan mitä tulee
    ]
  },
  {
    name: "Onni, 14v - Urheilija ja reilu kaveri",
    description: "Jalkapalloilija joka haaveilee ammattilaisurasta. Sosiaalinen, tykkää auttaa nuorempia joukkueessa. Koulu ei kiinnosta hirveästi, mutta on hyvä liikunnassa ja terveystiedossa.",
    expectedCategory: "auttaja",
    answers: [
      1, // Q0: Pelit? En paljoa
      2, // Q1: Pulmat? En jaksa
      2, // Q2: Tarinat? En oo luova
      3, // Q3: Rakentaa? Joskus isän kanssa
      3, // Q4: Luonto? Tykkään ulkona olemisesta
      4, // Q5: Ihmiskeho? Joo! Liikunta ja terveys kiinnostaa
      2, // Q6: Myynyt? En oikeastaan
      2, // Q7: Kokeet? Ei kiinnosta
      5, // Q8: Liikunta? ELÄMÄNI!
      5, // Q9: Selittää muille? Joo, autan nuorempia treenaamaan
      2, // Q10: Ruoanlaitto? Äiti tekee
      3, // Q11: Uusia tapoja? Joskus treeneissä
      5, // Q12: Auttaa kaveria? Totta kai! Aina
      4, // Q13: Päättää? Oon kapteeni joukkueessa
      2, // Q14: Vieraat kielet? Ei kiinnosta
      5, // Q15: Ryhmätyöt? Joukkuepelaaja!
      3, // Q16: Tietää mitä tehdä? Valmentaja kertoo
      5, // Q17: Ulkona? Joo! Kentällä
      4, // Q18: Keskittyä? Pelissä joo
      4, // Q19: Erilainen päivä? Tykkään vaihtelusta
      5, // Q20: Kiire? Pelipaine on tuttua
      4, // Q21: Puhua edessä? Oon tottunut
      3, // Q22: Aloittaa projekteja? En oo aloitteellinen
      4, // Q23: Auttaa yhteiskuntaa? Haluaisin olla esikuva
      4, // Q24: Ansaita? Ammattilaispalkka ois kiva
      4, // Q25: Olla tunnettu? Joo, futiksesta!
      3, // Q26: Aikaa harrastuksille? Futis ON harrastus
      2, // Q27: Oma pomo? En tiedä
      4, // Q28: Matkustaa? Joo, ulkomaan pelit!
      3  // Q29: Tietää 5v päästä? Toivottavasti pelaan
    ]
  },
  {
    name: "Aino, 15v - Hiljainen kirjatoukka",
    description: "Introvertti tyttö joka lukee paljon fantasiaa ja scifiä. Tykkää kirjoittaa omia tarinoita. Koulussa hyvä äidinkielessä ja historiassa. Vähän kavereita mutta läheisiä.",
    expectedCategory: "luova",
    answers: [
      2, // Q0: Pelit? Luen mieluummin
      4, // Q1: Pulmat? Tykkään mysteereistä kirjoissa
      5, // Q2: Tarinat? RAKASTAN kirjoittamista!
      1, // Q3: Rakentaa? En ollenkaan
      4, // Q4: Luonto? Tykkään kävellä metsässä ja miettiä
      2, // Q5: Ihmiskeho? Ei kiinnosta
      1, // Q6: Myynyt? En koskaan
      3, // Q7: Kokeet? Historia ja tutkimus kiinnostaa
      1, // Q8: Liikunta? Inhoan liikuntaa
      3, // Q9: Selittää? Vaikea, mut kirjoittamalla osaan
      2, // Q10: Ruoanlaitto? Tylsää
      4, // Q11: Uusia tapoja? Kirjoittaessa kokeilen
      4, // Q12: Auttaa kaveria? Joo, kuuntelen mielelläni
      1, // Q13: Päättää? En halua huomiota
      5, // Q14: Vieraat kielet? Rakastan! Haluan lukea alkukielellä
      2, // Q15: Ryhmätyöt? Vaikea, mieluummin yksin
      4, // Q16: Tietää mitä tehdä? Tykkään selkeistä ohjeista
      2, // Q17: Ulkona? Sisällä kirjan kanssa
      5, // Q18: Keskittyä? Tuntikausia kirjan parissa
      2, // Q19: Erilainen päivä? Tykkään rutiineista
      2, // Q20: Kiire? Stressaa
      1, // Q21: Puhua edessä? KAMALA ajatus
      3, // Q22: Aloittaa projekteja? Kirjoitusprojekteja
      4, // Q23: Auttaa yhteiskuntaa? Kirjoilla voi vaikuttaa
      2, // Q24: Ansaita? Ei tärkein
      3, // Q25: Olla tunnettu? Ehkä kirjailijana
      5, // Q26: Aikaa harrastuksille? Lukeminen on elämä
      2, // Q27: Oma pomo? En tiedä
      4, // Q28: Matkustaa? Nähdä kirjojen paikkoja!
      4  // Q29: Tietää 5v päästä? Haluaisin tietää
    ]
  },
  {
    name: "Aleksi, 14v - Mopoharrastaja",
    description: "Käytännöllinen poika joka rakentaa ja virittää mopoa. Isän kanssa korjaa autoja. Ei kiinnosta koulu paitsi käsityöt. Haaveilee automekaanikoksi.",
    expectedCategory: "rakentaja",
    answers: [
      2, // Q0: Pelit? Joskus ajosimua
      3, // Q1: Pulmat? Moottorin viat on pulmia
      1, // Q2: Tarinat? Ei kiinnosta
      5, // Q3: Rakentaa? JOKA PÄIVÄ! Mopon kanssa
      3, // Q4: Luonto? Ihan ok
      2, // Q5: Ihmiskeho? En välitä
      3, // Q6: Myynyt? Joo, mopon osia
      3, // Q7: Kokeet? Testaan onko moottori kunnossa
      3, // Q8: Liikunta? Ajolenkit mopolla
      2, // Q9: Selittää? En oo hyvä selittämään
      1, // Q10: Ruoanlaitto? Ei
      4, // Q11: Uusia tapoja? Viritys on luovaa!
      3, // Q12: Auttaa kaveria? Joo, korjaan kavereidenkin mopot
      2, // Q13: Päättää? En välitä
      1, // Q14: Vieraat kielet? Ei kiinnosta
      3, // Q15: Ryhmätyöt? Riippuu kenen kanssa
      3, // Q16: Tietää mitä tehdä? Ohjeet korjaukseen on hyvä
      5, // Q17: Ulkona? Joo! Tallissa tai ajelemassa
      4, // Q18: Keskittyä? Kun korjaan jotain
      4, // Q19: Erilainen päivä? Vaihtelua on kiva
      4, // Q20: Kiire? Toimii
      2, // Q21: Puhua edessä? En tykkää
      3, // Q22: Aloittaa projekteja? Mopoon liittyen joo
      2, // Q23: Auttaa yhteiskuntaa? En mieti sellaista
      4, // Q24: Ansaita? Mekaanikot tienaa ihan ok
      2, // Q25: Olla tunnettu? Ei kiinnosta
      5, // Q26: Aikaa harrastuksille? MOPO on tärkein!
      3, // Q27: Oma pomo? Ehkä oma korjaamo
      2, // Q28: Matkustaa? Kotona parempi
      3  // Q29: Tietää 5v päästä? Töissä korjaamolla
    ]
  },
  {
    name: "Sara, 15v - Eläinrakastaja",
    description: "Haaveilee eläinlääkäriksi. Käy ratsastamassa, hoitaa kotona koiria ja kaneja. Koulussa biologia on lempiaine. Empaattinen ja huolehtiva.",
    expectedCategory: "auttaja",
    answers: [
      2, // Q0: Pelit? Joskus eläinpelejä
      3, // Q1: Pulmat? Ihan ok
      3, // Q2: Tarinat? Joskus eläimistä
      3, // Q3: Rakentaa? Teen eläimille koteja
      5, // Q4: Luonto ja eläimet? ELÄMÄNI TARKOITUS!
      5, // Q5: Ihmiskeho? Joo, ja etenkin eläinten!
      2, // Q6: Myynyt? En
      4, // Q7: Kokeet? Biologia on parasta!
      4, // Q8: Liikunta? Ratsastus!
      4, // Q9: Selittää? Kerron mielelläni eläimistä
      3, // Q10: Ruoanlaitto? Teen eläimille ruokaa
      3, // Q11: Uusia tapoja? Eläinten hoitoon
      5, // Q12: Auttaa kaveria? Aina!
      2, // Q13: Päättää? En oo johtajatyyppi
      3, // Q14: Vieraat kielet? Ihan ok
      4, // Q15: Ryhmätyöt? Tykkään, jos kivat ihmiset
      3, // Q16: Tietää mitä tehdä? Ok
      5, // Q17: Ulkona? Tallilla ja luonnossa!
      4, // Q18: Keskittyä? Eläinten kanssa joo
      4, // Q19: Erilainen päivä? Eläinten kanssa vaihtelee
      3, // Q20: Kiire? Pystyn
      3, // Q21: Puhua edessä? Vaikea mutta pystyn
      3, // Q22: Aloittaa projekteja? Eläinprojekteja
      5, // Q23: Auttaa yhteiskuntaa? Haluan auttaa eläimiä!
      3, // Q24: Ansaita? Ei tärkein
      2, // Q25: Olla tunnettu? Ei kiinnosta
      4, // Q26: Aikaa harrastuksille? Eläimet tarvii aikaa
      2, // Q27: Oma pomo? En tiedä
      3, // Q28: Matkustaa? Ehkä safareille
      4  // Q29: Tietää 5v päästä? Eläinlääkäriopiskelija!
    ]
  },
  {
    name: "Leo, 14v - Luokan pelle",
    description: "Ekstrovertti ja hauska poika joka on luokan keskipiste. Tykkää esiintyä ja tehdä toiset nauramaan. Koulu ei kiinnosta, mutta on hyvä ilmaisussa. Haaveilee näyttelijäksi.",
    expectedCategory: "luova",
    answers: [
      2, // Q0: Pelit? Joskus
      2, // Q1: Pulmat? Tylsiä
      4, // Q2: Tarinat? Keksin sketsejä!
      2, // Q3: Rakentaa? En
      2, // Q4: Luonto? Ei kiinnosta
      2, // Q5: Ihmiskeho? Ei
      3, // Q6: Myynyt? Oon hyvä suostuttelemaan
      1, // Q7: Kokeet? Inhoan
      3, // Q8: Liikunta? Ihan ok
      5, // Q9: Selittää? RAKASTAN esiintyä ja selittää!
      2, // Q10: Ruoanlaitto? Ei
      5, // Q11: Uusia tapoja? Keksin aina uusia vitsejä!
      5, // Q12: Auttaa kaveria? Nauramalla!
      5, // Q13: Päättää ryhmässä? Joo, oon luontainen johtaja
      3, // Q14: Vieraat kielet? Englanti leffoista
      5, // Q15: Ryhmätyöt? Paras juttu!
      1, // Q16: Tietää mitä tehdä? Tylsää, improvisoin
      3, // Q17: Ulkona? Ihan sama
      1, // Q18: Keskittyä? VAIKEA, oon levoton
      5, // Q19: Erilainen päivä? KYLLÄ! Tylsyys tappaa
      4, // Q20: Kiire? Pystyn esittämään paineessa
      5, // Q21: Puhua edessä? RAKASTAN sitä!
      4, // Q22: Aloittaa projekteja? Joo, showprojekteja
      3, // Q23: Auttaa yhteiskuntaa? Nauru on parasta lääkettä
      4, // Q24: Ansaita? Näyttelijät tienaa hyvin
      5, // Q25: Olla tunnettu? KYLLÄ! Haluan olla julkkis
      3, // Q26: Aikaa harrastuksille? Joo
      4, // Q27: Oma pomo? Joo, oma näytelmäryhmä!
      5, // Q28: Matkustaa? Hollywood!
      1  // Q29: Tietää 5v päästä? Katsotaan!
    ]
  },
  {
    name: "Emma, 15v - Järjestelmällinen opiskelija",
    description: "Tunnollinen tyttö joka saa hyviä arvosanoja. Pitää listoista ja suunnittelusta. Haaveilee lakimieheksi. Vastuullinen, hoitaa luokan asioita.",
    expectedCategory: "jarjestaja",
    answers: [
      3, // Q0: Pelit? Joskus strategiapelejä
      4, // Q1: Pulmat? Tykkään loogisista tehtävistä
      2, // Q2: Tarinat? En oo luova
      2, // Q3: Rakentaa? En
      2, // Q4: Luonto? Ihan ok
      3, // Q5: Ihmiskeho? Kiinnostaa jonkin verran
      3, // Q6: Myynyt? Oon järjestänyt myyjäisiä
      4, // Q7: Kokeet? Tykkään tutkimuksesta
      2, // Q8: Liikunta? En oo urheilullinen
      4, // Q9: Selittää? Autan kavereitä kokeisiin
      2, // Q10: Ruoanlaitto? En
      3, // Q11: Uusia tapoja? Jos ne on tehokkaampia
      4, // Q12: Auttaa kaveria? Joo, oon luotettava
      4, // Q13: Päättää? Joo, järjestän usein
      4, // Q14: Vieraat kielet? Opiskelen ahkerasti
      4, // Q15: Ryhmätyöt? Tykkään kun oon vastuussa
      5, // Q16: Tietää mitä tehdä? RAKASTAN selkeitä ohjeita!
      2, // Q17: Ulkona? Mieluummin sisällä
      5, // Q18: Keskittyä? Pystyn opiskelemaan tunteja
      2, // Q19: Erilainen päivä? Tykkään rutiineista
      4, // Q20: Kiire? Suunnittelen etukäteen
      4, // Q21: Puhua edessä? Pystyn, oon valmistautunut
      4, // Q22: Aloittaa projekteja? Joo, ja suunnittelen ne hyvin
      4, // Q23: Auttaa yhteiskuntaa? Lait auttavat yhteiskuntaa
      4, // Q24: Ansaita? Lakimiehet tienaa hyvin
      3, // Q25: Olla tunnettu? Arvostettu, ei julkkis
      4, // Q26: Aikaa harrastuksille? Tasapaino on tärkeä
      3, // Q27: Oma pomo? Ehkä oma lakitoimisto
      3, // Q28: Matkustaa? Joskus
      5  // Q29: Tietää 5v päästä? HALUAN tietää!
    ]
  },
  {
    name: "Jesse, 14v - Ympäristöaktivisti",
    description: "Huolissaan ilmastonmuutoksesta. Järjestää kierrätyskampanjoita koulussa. Tykkää luonnossa liikkumisesta ja retkeilystä. Haaveilee ympäristötutkijaksi.",
    expectedCategory: "ympariston-puolustaja",
    answers: [
      3, // Q0: Pelit? Joskus
      4, // Q1: Pulmat? Ilmastonmuutos on pulma!
      3, // Q2: Tarinat? Kirjoitan ympäristöstä
      4, // Q3: Rakentaa? Teen linnunpönttöjä ja kierrätysasioita
      5, // Q4: Luonto? TÄRKEIN ASIA MAAILMASSA!
      3, // Q5: Ihmiskeho? Ihan ok
      3, // Q6: Myynyt? Kierrätysmyyjäisiä
      5, // Q7: Kokeet? Tutkimus on tärkeää ilmastolle!
      4, // Q8: Liikunta? Retkeily ja pyöräily!
      5, // Q9: Selittää? Kerron kaikille ilmastosta!
      4, // Q10: Ruoanlaitto? Vegaaniruokaa!
      5, // Q11: Uusia tapoja? Kestävämpiä tapoja!
      5, // Q12: Auttaa kaveria? Ja planeettaa!
      4, // Q13: Päättää? Järjestän kampanjoita
      3, // Q14: Vieraat kielet? Englanti on tärkeä aktivismiin
      4, // Q15: Ryhmätyöt? Yhdessä muutetaan maailmaa!
      3, // Q16: Tietää mitä tehdä? Riippuu
      5, // Q17: Ulkona? AINA kun mahdollista!
      4, // Q18: Keskittyä? Ympäristöasioihin kyllä
      4, // Q19: Erilainen päivä? Aktivismia eri tavoin
      4, // Q20: Kiire? Ilmastohätätila vaatii!
      5, // Q21: Puhua edessä? Joo, haluan vaikuttaa!
      5, // Q22: Aloittaa projekteja? Kokoajan uusia kampanjoita!
      5, // Q23: Auttaa yhteiskuntaa? TÄRKEIN ARVO!
      2, // Q24: Ansaita? Ei tärkein, kunhan auttaa
      3, // Q25: Olla tunnettu? Vaikuttajana
      3, // Q26: Aikaa harrastuksille? Aktivismi on harrastus
      4, // Q27: Oma pomo? Oma järjestö!
      5, // Q28: Matkustaa? Nähdä maailmaa jota suojelen
      4  // Q29: Tietää 5v päästä? Toivottavasti tutkijana
    ]
  },
  {
    name: "Sanni, 14v - Ujo matikanero",
    description: "Hiljainen tyttö joka on todella hyvä matematiikassa. Kilpailematikkaa harrastava. Ei paljon kavereita, viihtyy yksin tehtävien parissa. Ei tiedä mitä haluaa isona.",
    expectedCategory: "innovoija",
    answers: [
      4, // Q0: Pelit? Tykkään logiikkapeleistä
      5, // Q1: Pulmat? RAKASTAN matemaattisia pulmia!
      2, // Q2: Tarinat? En oo luova sillä tavalla
      1, // Q3: Rakentaa? En
      2, // Q4: Luonto? Ihan ok
      2, // Q5: Ihmiskeho? Ei kiinnosta
      1, // Q6: Myynyt? En koskaan
      5, // Q7: Kokeet? Matikassa testaan aina!
      1, // Q8: Liikunta? En tykkää
      3, // Q9: Selittää? Vaikea selittää miten ajattelen
      1, // Q10: Ruoanlaitto? Ei kiinnosta
      4, // Q11: Uusia tapoja? Matikassa löydän uusia ratkaisuja
      3, // Q12: Auttaa kaveria? Jos pyytää
      1, // Q13: Päättää? En halua johtaa
      3, // Q14: Vieraat kielet? Matikka on universaali kieli
      1, // Q15: Ryhmätyöt? Inhoan, teen mieluummin yksin
      5, // Q16: Tietää mitä tehdä? Selkeät ongelmat on parhaita
      1, // Q17: Ulkona? Sisällä parempi
      5, // Q18: Keskittyä? Tunteja matikan parissa
      2, // Q19: Erilainen päivä? Tykkään rutiinista
      3, // Q20: Kiire? Kilpailuissa on aikaa
      1, // Q21: Puhua edessä? KAMALA ajatus
      3, // Q22: Aloittaa projekteja? Matikkaprojekteja
      2, // Q23: Auttaa yhteiskuntaa? En ajattele sitä
      3, // Q24: Ansaita? Kai se on ok
      2, // Q25: Olla tunnettu? Matikkapiireissä ehkä
      4, // Q26: Aikaa harrastuksille? Matikka on harrastus
      2, // Q27: Oma pomo? En tiedä
      3, // Q28: Matkustaa? Matikkaolympialaisiin
      4  // Q29: Tietää 5v päästä? Yliopistossa opiskelemassa
    ]
  },
  {
    name: "Niklas, 15v - Bisnesmies",
    description: "Yrittäjähenkinen poika joka myy karkkia välitunnilla. Säästää rahaa ja sijoittaa. Haaveilee rikastumisesta. Hyvä puhumaan ja vakuuttamaan.",
    expectedCategory: "johtaja",
    answers: [
      3, // Q0: Pelit? Joskus bisnespelejä
      4, // Q1: Pulmat? Bisnespulmat on parhaita!
      2, // Q2: Tarinat? En oo luova
      2, // Q3: Rakentaa? En
      2, // Q4: Luonto? Ei kiinnosta
      2, // Q5: Ihmiskeho? Ei
      5, // Q6: Myynyt? JOKA PÄIVÄ! Se on mun juttu!
      3, // Q7: Kokeet? Markkinatutkimus kiinnostaa
      2, // Q8: Liikunta? En oo urheilija
      5, // Q9: Selittää? Oon hyvä myyntipuheissa!
      2, // Q10: Ruoanlaitto? Ei
      5, // Q11: Uusia tapoja? Innovaatio bisniksessä!
      3, // Q12: Auttaa kaveria? Jos siitä on hyötyä
      5, // Q13: Päättää? Oon luontainen johtaja!
      4, // Q14: Vieraat kielet? Englanti on bisniksen kieli
      4, // Q15: Ryhmätyöt? Kun MINÄ johdan
      4, // Q16: Tietää mitä tehdä? Suunnitelmallisuus on tärkeää
      2, // Q17: Ulkona? Toimistossa
      4, // Q18: Keskittyä? Kun on rahasta kyse
      4, // Q19: Erilainen päivä? Bisniksessä vaihtelee
      5, // Q20: Kiire? Pystyn! Paine motivoi
      5, // Q21: Puhua edessä? Oon loistava puhuja!
      5, // Q22: Aloittaa projekteja? Kokoajan uusia bisnesideoita!
      2, // Q23: Auttaa yhteiskuntaa? Yritykset luovat työpaikkoja
      5, // Q24: Ansaita? TÄRKEIN TAVOITE!
      5, // Q25: Olla tunnettu? Rikkaana ja menestyvänä!
      3, // Q26: Aikaa harrastuksille? Bisnes on harrastus
      5, // Q27: Oma pomo? EHDOTTOMASTI! Oma yritys!
      5, // Q28: Matkustaa? Bisnesmatkoja!
      4  // Q29: Tietää 5v päästä? Miljonääri!
    ]
  },
  {
    name: "Iida, 14v - Hoivaaja",
    description: "Empaattinen tyttö joka huolehtii kaikista. Auttaa pikkusisaruksia, hoitaa naapurin lapsia. Haaveilee lastentarhanopettajaksi tai sairaanhoitajaksi.",
    expectedCategory: "auttaja",
    answers: [
      2, // Q0: Pelit? En paljoa
      2, // Q1: Pulmat? Ei kiinnosta
      3, // Q2: Tarinat? Lapsille kerron tarinoita
      3, // Q3: Rakentaa? Teen lasten kanssa askarteluja
      4, // Q4: Luonto? Tykkään ulkoilla lasten kanssa
      4, // Q5: Ihmiskeho? Kiinnostaa, etenkin lasten terveys
      2, // Q6: Myynyt? En
      2, // Q7: Kokeet? Ei kiinnosta
      3, // Q8: Liikunta? Lasten kanssa leikkiminen
      5, // Q9: Selittää? RAKASTAN opettaa lapsille!
      4, // Q10: Ruoanlaitto? Teen lapsille välipaloja
      3, // Q11: Uusia tapoja? Keksin leikkejä lapsille
      5, // Q12: Auttaa kaveria? AINA! Se on mun juttu!
      3, // Q13: Päättää? En halua, mut lasten kanssa pitää
      3, // Q14: Vieraat kielet? Ihan ok
      4, // Q15: Ryhmätyöt? Tykkään tehdä yhdessä
      3, // Q16: Tietää mitä tehdä? Riippuu
      4, // Q17: Ulkona? Lasten kanssa leikkipuistossa
      3, // Q18: Keskittyä? Lasten kanssa pitää olla joustava
      4, // Q19: Erilainen päivä? Lasten kanssa vaihtelee
      3, // Q20: Kiire? Pystyn, mut lapset vaatii rauhaa
      3, // Q21: Puhua edessä? Vaikea mut pystyn
      3, // Q22: Aloittaa projekteja? Lasten kanssa
      5, // Q23: Auttaa yhteiskuntaa? Lapset ovat tulevaisuus!
      2, // Q24: Ansaita? Ei tärkein
      2, // Q25: Olla tunnettu? Ei kiinnosta
      4, // Q26: Aikaa harrastuksille? Lastenhoito on harrastus
      2, // Q27: Oma pomo? En tiedä
      2, // Q28: Matkustaa? Perhe on tärkeämpi
      4  // Q29: Tietää 5v päästä? Opiskelemassa lastentarhaopettajaksi
    ]
  }
];

// ============================================================
// API TESTING
// ============================================================

async function testStudent(student) {
  const answers = student.answers.map((score, index) => ({
    questionIndex: index,
    score: score
  }));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cohort: 'YLA', answers })
    });

    if (!response.ok) {
      return {
        student: student.name,
        passed: false,
        error: `HTTP ${response.status}`,
        description: student.description
      };
    }

    const data = await response.json();

    if (!data.success || !data.topCareers) {
      return {
        student: student.name,
        passed: false,
        error: 'Invalid response',
        description: student.description
      };
    }

    const topCareers = data.topCareers.slice(0, 5);
    const topCategory = topCareers[0]?.category || 'unknown';
    const topCategories = [...new Set(topCareers.map(c => c.category))];

    const categoryMatch = topCategory === student.expectedCategory ||
                          topCategories.includes(student.expectedCategory);

    return {
      student: student.name,
      description: student.description,
      expectedCategory: student.expectedCategory,
      topCategory: topCategory,
      topCategories: topCategories,
      categoryMatch: categoryMatch,
      passed: categoryMatch,
      topCareers: topCareers.map(c => ({
        title: c.title,
        score: c.score,
        category: c.category
      })),
      educationPath: data.educationPath,
      answers: student.answers
    };
  } catch (error) {
    return {
      student: student.name,
      passed: false,
      error: error.message,
      description: student.description
    };
  }
}

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('    URAKOMPASSI - REALISTIC YLA END-TO-END TESTING');
  console.log('    Testing with 12 diverse Finnish yläaste students');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const results = [];
  const analysis = {
    totalStudents: REALISTIC_STUDENTS.length,
    passed: 0,
    failed: 0,
    categoryBreakdown: {},
    failedStudents: [],
    insights: []
  };

  for (const student of REALISTIC_STUDENTS) {
    console.log(`\n─────────────────────────────────────────────────────────────────`);
    console.log(`  ${student.name}`);
    console.log(`─────────────────────────────────────────────────────────────────`);
    console.log(`📝 ${student.description}`);

    const result = await testStudent(student);
    results.push(result);

    if (result.error) {
      console.log(`\n❌ ERROR: ${result.error}`);
      analysis.failed++;
      analysis.failedStudents.push({ name: student.name, reason: result.error });
      continue;
    }

    // Track category stats
    if (!analysis.categoryBreakdown[student.expectedCategory]) {
      analysis.categoryBreakdown[student.expectedCategory] = { expected: 0, matched: 0 };
    }
    analysis.categoryBreakdown[student.expectedCategory].expected++;

    if (result.passed) {
      console.log(`\n✅ PASS - Category match!`);
      analysis.passed++;
      analysis.categoryBreakdown[student.expectedCategory].matched++;
    } else {
      console.log(`\n❌ FAIL - Category mismatch`);
      analysis.failed++;
      analysis.failedStudents.push({
        name: student.name,
        expected: student.expectedCategory,
        got: result.topCategory,
        topCategories: result.topCategories,
        topCareers: result.topCareers
      });
    }

    console.log(`\n   🎯 Expected category: ${student.expectedCategory}`);
    console.log(`   📊 Got category: ${result.topCategory} (top categories: ${result.topCategories.join(', ')})`);
    console.log(`   📚 Education path: ${result.educationPath}`);
    console.log(`\n   Top 5 career recommendations:`);
    result.topCareers?.forEach((career, i) => {
      const match = career.category === student.expectedCategory ? '✓' : '';
      console.log(`      ${i+1}. ${career.title} (${career.score}%) [${career.category}] ${match}`);
    });
  }

  // Print comprehensive analysis
  console.log('\n\n═══════════════════════════════════════════════════════════════');
  console.log('                    COMPREHENSIVE ANALYSIS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log(`📊 OVERALL RESULTS`);
  console.log(`   Total students tested: ${analysis.totalStudents}`);
  console.log(`   Passed: ${analysis.passed}/${analysis.totalStudents} (${Math.round(analysis.passed/analysis.totalStudents*100)}%)`);
  console.log(`   Failed: ${analysis.failed}/${analysis.totalStudents} (${Math.round(analysis.failed/analysis.totalStudents*100)}%)`);

  console.log(`\n📈 CATEGORY ACCURACY`);
  for (const [category, stats] of Object.entries(analysis.categoryBreakdown)) {
    const accuracy = Math.round(stats.matched/stats.expected*100);
    const status = accuracy === 100 ? '✅' : accuracy >= 50 ? '⚠️' : '❌';
    console.log(`   ${status} ${category}: ${stats.matched}/${stats.expected} (${accuracy}%)`);
  }

  if (analysis.failedStudents.length > 0) {
    console.log(`\n❌ FAILED STUDENTS - DETAILED ANALYSIS`);
    for (const failed of analysis.failedStudents) {
      if (failed.reason) {
        console.log(`\n   ${failed.name}: ${failed.reason}`);
      } else {
        console.log(`\n   ${failed.name}:`);
        console.log(`      Expected: ${failed.expected}`);
        console.log(`      Got: ${failed.got}`);
        console.log(`      All top categories: ${failed.topCategories.join(', ')}`);
        console.log(`      Top careers received:`);
        failed.topCareers?.slice(0, 3).forEach((c, i) => {
          console.log(`         ${i+1}. ${c.title} [${c.category}]`);
        });
      }
    }
  }

  // Generate insights
  console.log(`\n💡 INSIGHTS & RECOMMENDATIONS`);

  // Check which categories work well
  const workingCategories = [];
  const problematicCategories = [];
  for (const [category, stats] of Object.entries(analysis.categoryBreakdown)) {
    if (stats.matched === stats.expected) {
      workingCategories.push(category);
    } else {
      problematicCategories.push({ category, accuracy: Math.round(stats.matched/stats.expected*100) });
    }
  }

  if (workingCategories.length > 0) {
    console.log(`\n   ✅ WORKING WELL:`);
    workingCategories.forEach(c => console.log(`      - ${c}: 100% accuracy`));
  }

  if (problematicCategories.length > 0) {
    console.log(`\n   ⚠️ NEEDS IMPROVEMENT:`);
    problematicCategories.forEach(p => console.log(`      - ${p.category}: ${p.accuracy}% accuracy`));
  }

  // Analyze common misclassifications
  const misclassifications = {};
  for (const failed of analysis.failedStudents) {
    if (failed.expected && failed.got) {
      const key = `${failed.expected} → ${failed.got}`;
      misclassifications[key] = (misclassifications[key] || 0) + 1;
    }
  }

  if (Object.keys(misclassifications).length > 0) {
    console.log(`\n   📉 COMMON MISCLASSIFICATIONS:`);
    for (const [pattern, count] of Object.entries(misclassifications)) {
      console.log(`      - ${pattern}: ${count} time(s)`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════\n');

  return { results, analysis };
}

runAllTests().catch(console.error);
