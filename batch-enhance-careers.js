#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// =============================================================================
// ENHANCEMENT DATA - Extracted from REMAINING_CAREER_ENHANCEMENTS_GUIDE.md
// =============================================================================

const enhancements = {
  // Tech/Startup Careers (3 remaining)
  "solutions-architect": {
    short_description: "Ratkaisuarkkitehti suunnittelee kokonaisvaltaisia teknologiaratkaisuja liiketoiminnan tarpeisiin yhdistäen teknisen osaamisen ja liiketoimintaymmärryksen. Helsingissä kysytty senior-tason rooli, joka tarjoaa erinomaisen palkan (5000-8500€/kk), hybridityön ja mahdollisuuden vaikuttaa merkittäviin teknologiavalintoihin.",
    impact: [
      "Mahdollistaa skaalautuvat IT-ratkaisut, jotka palvelevat tuhansia käyttäjiä Helsingin alueella ja kansainvälisesti",
      "Yhdistää liiketoimintatavoitteet moderniin pilviteknologiaan ja säästää satoja tuhansia euroja infrastruktuurikustannuksia",
      "Ohjaa organisaation digitaalitransformaatiota ja teknologiavalintoja pitkälle tulevaisuuteen"
    ],
    typical_employers: [
      "Wolt, Supercell, Nokia",
      "Reaktor, Accenture (Helsinki), Gofore",
      "Nordea, OP, Kela",
      "Suuryritykset ja julkinen sektori"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "kohtalaisesti",
      environment: "Toimisto, etänä, asiakkaiden luona"
    }
  },

  "platform-engineer": {
    short_description: "Platform Engineer rakentaa ja ylläpitää kehittäjäalustoja ja internal developer platforms (IDP), jotka mahdollistavat tiimien tehokkaan työskentelyn. Helsingissä kasvava kysyntä erityisesti skaalautuvissa yrityksissä - tarjoaa hyvän palkan (4500-7000€/kk), etätyön ja mahdollisuuden vaikuttaa satojen kehittäjien työhön.",
    impact: [
      "Mahdollistaa satojen kehittäjien tehokkaan työskentelyn yhtenäisillä työkaluilla ja prosesseilla",
      "Nopeuttaa uusien palveluiden lanseeraamista viikoista päiviin automatisoitujen alustojen avulla",
      "Vähentää infrastruktuurikustannuksia 30-50% optimoiduilla pilviratkaisuilla"
    ],
    typical_employers: [
      "Wolt, Supercell, Aiven",
      "Smartly.io, Unity, F-Secure",
      "Nordcloud, Reaktor, Futurice",
      "Kasvavat teknologiayritykset"
    ],
    work_conditions: {
      remote: "Kyllä",
      shift_work: false,
      travel: "vähän"
    }
  },

  "api-developer": {
    short_description: "API-kehittäjä suunnittelee ja toteuttaa rajapintoja, jotka yhdistävät järjestelmiä ja mahdollistavat integraatiot. Helsingissä kasvava kysyntä API-talouden myötä - RESTful ja GraphQL -osaaminen avaa ovia SaaS-yrityksiin. Tarjoaa etätyön, joustavan työajan ja palkan 4000-6500€/kk.",
    impact: [
      "Luo rajapintoja, jotka palvelevat miljoonia API-kutsuja päivittäin luotettavasti ja nopeasti",
      "Mahdollistaa integraatiot satoihin ulkoisiin järjestelmiin ja laajentaa tuotteen arvoa",
      "Parantaa kehittäjäkokemusta hyvin dokumentoiduilla ja helppokäyttöisillä API:lla"
    ],
    typical_employers: [
      "Wolt, Supermetrics, Smartly.io",
      "Reaktor, Futurice, Vincit",
      "SaaS-yritykset ja API-alustat",
      "Fintech ja integraatioyritykset"
    ],
    work_conditions: {
      remote: "Kyllä",
      shift_work: false,
      travel: "vähän"
    }
  },

  // Creative/Media Careers (12 careers)
  "content-strategist": {
    short_description: "Sisältöstrategisti suunnittelee ja johtaa organisaation sisältötuotantoa tavoitteellisesti yhdistäen markkinoinnin, brändin ja käyttäjäymmärryksen. Helsingissä kasvava kysyntä erityisesti digitaalisissa yrityksissä ja mediatalolissa. Tarjoaa hybridi/etätyön, luovan työympäristön ja palkan 3500-5500€/kk.",
    impact: [
      "Luo sisältöstrategioita, jotka tavoittavat satoja tuhansia ihmisiä digitaalisissa kanavissa",
      "Kasvattaa brändin näkyvyyttä ja sitoutumista 30-50% strategisen sisällön avulla",
      "Ohjaa sisältötuotantoa data-ohjautuvasti ja optimoi sisällön ROI:ta jatkuvasti"
    ],
    typical_employers: [
      "Wolt, Sanoma Media, Alma Media",
      "Mainostoimistot: hasan & partners, TBWA, Bob the Robot",
      "Digitaaliset viestintätoimistot",
      "Startup-yritykset ja kasvuyhtiöt"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "social-media-manager": {
    short_description: "Some-asiantuntija vastaa yrityksen sosiaalisen median strategiasta, sisällöntuotannosta ja yhteisöjen hallinnasta kaikissa kanavissa. Helsingissä kysytty rooli, joka yhdistää luovuuden, datan ja yhteisöymmärryksen. Tarjoaa hybridityön, vapaan sisällöntuotannon ja palkan 3200-5000€/kk.",
    impact: [
      "Rakentaa ja kasvattaa sosiaalisen median yhteisöjä kymmeniin tai satoihin tuhansiin seuraajiin",
      "Luo sisältöä, joka tavoittaa miljoonia näyttökertoja ja lisää bränditietoisuutta merkittävästi",
      "Kasvattaa sitoutumista 40-60% strategisella yhteisöhallinnalla ja vuorovaikutuksella"
    ],
    typical_employers: [
      "Wolt, Sanoma Media, Yle",
      "Mainostoimistot ja some-toimistot",
      "Brand-yritykset ja verkkokaupat",
      "Influencer-markkinointitoimistot"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "podcast-producer": {
    short_description: "Podcast-tuottaja vastaa podcast-sarjojen konseptoinnista, tuotannosta ja julkaisemisesta sekä äänilaadun varmistamisesta. Helsingissä kasvava podcast-markkina luo mahdollisuuksia - rooli yhdistää tarinankerronnan, äänitaiteen ja mediatuotannon. Tarjoaa vapaan työajan, etätyön ja freelance-mahdollisuuksia.",
    impact: [
      "Tuottaa podcasteja, joita kuunnellaan tuhansia kertoja viikossa Suomessa ja kansainvälisesti",
      "Luo äänisisältöä, joka sitoutaa kuulijoita ja rakentaa uskollisia yhteisöjä",
      "Mahdollistaa brändeille ja mediatalloille modernin tavan tavoittaa yleisöjä audiokanavisssa"
    ],
    typical_employers: [
      "Yle, Sanoma, Alma Media",
      "Supla, Podme, Acast",
      "Tuotantoyhtiöt ja mainostoimistot",
      "Freelance ja omat projektit"
    ],
    work_conditions: {
      remote: "Kyllä",
      shift_work: false,
      travel: "vähän"
    }
  },

  "video-editor": {
    short_description: "Videoleikkaaja leikkaa ja editoi videoita erilaisiin käyttötarkoituksiin yhdistäen teknisen osaamisen ja luovan tarinankerronnan. Helsingissä jatkuva kysyntä some-sisällölle, mainoksille ja streaming-sisällölle. Tarjoaa freelance-vapauden, luovan työn ja palkan 3000-5000€/kk.",
    impact: [
      "Luo videoita, jotka tavoittavat miljoonia katselukertoja YouTubessa, TikTokissa ja Instagramissa",
      "Tuottaa markkinointivideoita, jotka kasvattavat konversiota 30-50% visuaalisen storytellingin avulla",
      "Mahdollistaa brändeille modernin visuaalisen ilmaisun ja erottumisen sosiaalisessa mediassa"
    ],
    typical_employers: [
      "Yle, Sanoma, Alma Media",
      "Tuotantoyhtiöt: MRP, Solar Films",
      "Mainostoimistot ja some-toimistot",
      "Freelance-projektit ja YouTube-kanavat"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "community-manager": {
    short_description: "Community Manager rakentaa ja ylläpitää verkkoyhteisöjä, moderoi keskusteluja ja luo yhteisöllisyyttä brändin ympärille. Helsingissä kysytty rooli gaming-, SaaS- ja lifestyle-yrityksissä, jotka arvostavat yhteisöjään. Tarjoaa etätyön, vapaan aikataulun ja palkan 3200-4800€/kk.",
    impact: [
      "Rakentaa aktiivisia verkkoyhteisöjä, joissa tuhannet jäsenet jakavat kokemuksia ja auttavat toisiaan",
      "Kasvattaa yhteisön sitoutumista ja brändiuskollisuutta keskustelujen ja tapahtumien avulla",
      "Vähentää asiakaspalvelukuormaa 20-40% aktiivisen peer-to-peer-tuen mahdollistamisella"
    ],
    typical_employers: [
      "Supercell, Rovio, Unity",
      "Wolt, Swappie, suomalaiset startupit",
      "Discord-yhteisöt ja pelifirmat",
      "SaaS-yritykset ja lifestyle-brändit"
    ],
    work_conditions: {
      remote: "Kyllä",
      shift_work: false,
      travel: "vähän"
    }
  },

  "brand-designer": {
    short_description: "Brändisuunnittelija luo ja kehittää visuaalisia brändi-identiteettejä, logoja ja designkieliä. Helsingissä kysytty rooli mainostoimistoissa ja startupeissa - yhdistää strategisen ajattelun ja visuaalisen suunnittelun. Tarjoaa luovan työympäristön, portfolion kasvun ja palkan 3200-5500€/kk.",
    impact: [
      "Luo visuaalisia identiteettejä brändeille, jotka tavoittavat satoja tuhansia ihmisiä päivittäin",
      "Erottaa yritykset kilpailijoista vahvalla brändi-ilmeellä ja nostaa brändiarvoa",
      "Mahdollistaa johdonmukaisen visuaalisen viestinnän kaikissa kosketuspisteissä"
    ],
    typical_employers: [
      "Mainostoimistot: hasan & partners, TBWA, Bob the Robot",
      "Design-toimistot: Werklig, Kuudes, Everpress",
      "Startup-yritykset ja kasvuyhtiöt",
      "Freelance ja omat projektit"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "copywriter": {
    short_description: "Mainoskirjoittaja kirjoittaa vaikuttavia ja myyviä tekstejä mainoksiin, verkkosivuille ja markkinointikampanjoihin. Helsingissä jatkuva kysyntä digitaalisen markkinoinnin kasvun myötä - luovat tekstintaidot avaavat ovia mainostoimistoihin. Tarjoaa luovan työn, hybridityön ja palkan 3200-5200€/kk.",
    impact: [
      "Kirjoittaa markkinointitekstejä, jotka tavoittavat miljoonia ihmisiä ja kasvattavat myyntiä",
      "Luo kampanjoita, jotka parantavat konversiota 20-50% vaikuttavalla copylla",
      "Rakentaa brändiääntä ja viestii kohdeyleisölle resonoivalla tavalla"
    ],
    typical_employers: [
      "Mainostoimistot: hasan & partners, TBWA, Bob the Robot",
      "Digitoimistot: Kuulu, Idean, Avaus",
      "Sisällöntuotantoyritykset",
      "Freelance ja omat projektit"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "motion-graphics-designer": {
    short_description: "Motion graphics -suunnittelija luo animoituja graafisia elementtejä videoihin, mainoksiin ja digitaaliseen sisältöön. Helsingissä kasvava kysyntä erityisesti some-sisällölle ja streaming-palveluihin. Tarjoaa luovan työympäristön, teknisen osaamisen kehityksen ja palkan 3200-5500€/kk.",
    impact: [
      "Luo animoituja grafiikkoja, jotka nähdään miljoonissa videoissa YouTubessa, TV:ssä ja streamingissä",
      "Parantaa visuaalista storytellingiä ja tekee monimutkaisista asioista ymmärrettäviä animaatioilla",
      "Kasvattaa videon katselumääriä 30-50% houkuttelevilla motion graphics -elementeillä"
    ],
    typical_employers: [
      "Yle, MTV, Sanoma Media",
      "Tuotantoyhtiöt ja mainostoimistot",
      "Peliyhtiöt ja teknologiayritykset",
      "Freelance ja omat projektit"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "ui-ux-designer": {
    short_description: "UI/UX-suunnittelija suunnittelee käyttöliittymiä, jotka ovat sekä visuaalisesti houkuttelevia että helppokäyttöisiä. Helsingissä erittäin kysytty osaaja - Figma-taidot ja portfolio avaavat ovia startup-maailmaan. Tarjoaa etätyön, luovan vapauden ja palkan 3500-6000€/kk.",
    impact: [
      "Suunnittelee käyttöliittymiä, joita miljoonat ihmiset käyttävät päivittäin Suomessa ja kansainvälisesti",
      "Parantaa käyttäjäkokemusta ja konversiota 40-60% intuitiivisella suunnittelulla",
      "Säästää kehitysaikaa ja -kustannuksia huolellisella suunnittelulla ennen toteutusta"
    ],
    typical_employers: [
      "Wolt, Supercell, Smartly.io",
      "Reaktor, Futurice, Vincit, Nordkapp",
      "Digitoimistot ja UX-studiot",
      "Startup-yritykset ja kasvuyhtiöt"
    ],
    work_conditions: {
      remote: "Kyllä",
      shift_work: false,
      travel: "vähän"
    }
  },

  "content-creator": {
    short_description: "Sisällöntuottaja luo monipuolista sisältöä sosiaaliseen mediaan, blogihin ja muihin digitaalisiin kanaviin. Helsingissä kasvava creator economy luo mahdollisuuksia - voit työskennellä brändeille tai rakentaa omaa yleisöä. Tarjoaa luovan vapauden, joustavan työajan ja ansaintapotentiaalia.",
    impact: [
      "Luo sisältöä, joka tavoittaa kymmeniä tai satoja tuhansia seuraajia sosiaalisessa mediassa",
      "Rakentaa brändipartnerships-tuloja ja creator-taloutta Suomessa",
      "Vaikuttaa yleisön ostopäätöksiin ja trendeihin autenttisella sisällöllä"
    ],
    typical_employers: [
      "Brändit yhteistyökumppaneina",
      "Influencer-markkinointitoimistot",
      "Mediayhtiöt ja julkaisijat",
      "Freelance ja oma yritystoiminta"
    ],
    work_conditions: {
      remote: "Kyllä",
      shift_work: false,
      travel: "vähän"
    }
  },

  "influencer-marketing-specialist": {
    short_description: "Vaikuttajamarkkinoinnin asiantuntija suunnittelee ja toteuttaa influencer-kampanjoita brändeille sekä hallitsee yhteistyökumppanuuksia. Helsingissä kasvava ala - rooli yhdistää markkinoinnin, somen ja ihmissuhteet. Tarjoaa hybridityön, luovan työn ja palkan 3200-5200€/kk.",
    impact: [
      "Luo influencer-kampanjoita, jotka tavoittavat miljoonia ihmisiä orgaanisesti sosiaalisessa mediassa",
      "Kasvattaa bränditietoisuutta 50-100% autenttisten influencer-yhteistöiden kautta",
      "Tuottaa paremman ROI:n kuin perinteinen mainonta kohdennetulla influencer-markkinoinnilla"
    ],
    typical_employers: [
      "Mediayhtiöt: United Influencers, Yksi Helsinki",
      "Brändit: IVYREVEL, Lindex, Finnair",
      "Mainostoimistot ja digitoimistot",
      "Startup-yritykset ja lifestyle-brändit"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "digital-content-producer": {
    short_description: "Digitaalisen sisällön tuottaja koordinoi ja tuottaa monipuolista digitaalista sisältöä eri kanaviin ja formaatteihin. Helsingissä kasvava kysyntä mediatalloissa ja yrityksissä, jotka panostavat sisältömarkkinointiin. Tarjoaa monipuolisen työn, hybridityön ja palkan 3200-5000€/kk.",
    impact: [
      "Tuottaa digitaalista sisältöä, joka tavoittaa satoja tuhansia ihmisiä kuukausittain",
      "Koordinoi sisältötuotantoprojekteja, jotka tukevat liiketoimintatavoitteita ja brändiä",
      "Kasvattaa sivuston liikennettä 30-50% strategisella sisältötuotannolla"
    ],
    typical_employers: [
      "Sanoma Media, Alma Media, Yle",
      "Brändit: IVYREVEL, Fazer, Paulig",
      "Digitoimistot ja sisältötoimistot",
      "Verkkokaupat ja mediayritykset"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  // Business/Consulting Careers (10 careers)
  "management-consultant": {
    short_description: "Liikkeenjohdon konsultti auttaa yrityksiä ratkaisemaan strategisia haasteita, parantamaan toimintaa ja kasvamaan. Helsingissä kysytty rooli Big4- ja strategiakonsulttitaloissa - tarjoaa nopean urakehityksen, kansainvälisiä projekteja ja hyvän palkan (4000-7000€/kk).",
    impact: [
      "Auttaa yrityksiä tekemään miljoonien eurojen päätöksiä strategian ja liiketoiminnan kehittämisessä",
      "Ratkaisee monimutkaisia liiketoimintahaasteita data-analyysillä ja parhailla käytännöillä",
      "Mahdollistaa organisaatiomuutoksia, jotka parantavat tehokkuutta 20-40%"
    ],
    typical_employers: [
      "McKinsey & Company (Helsinki)",
      "Boston Consulting Group (Helsinki)",
      "Deloitte, PwC, KPMG, EY",
      "Accenture, Gofore, Reaktor"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "paljon"
    }
  },

  "business-analyst": {
    short_description: "Liiketoiminta-analyytikko analysoi liiketoimintaprosesseja, kerää vaatimuksia ja yhdistää liiketoiminnan ja IT:n. Helsingissä kasvava kysyntä digitalisaatioprojekteissa - rooli yhdistää datan, prosessit ja ihmissuhteet. Tarjoaa etä/hybridityön ja palkan 3800-5500€/kk.",
    impact: [
      "Tunnistaa tehostamismahdollisuuksia, jotka säästävät satoja tuhansia euroja vuosittain",
      "Yhdistää liiketoimintatarpeet teknisiin ratkaisuihin ja varmistaa projektien onnistumisen",
      "Parantaa liiketoimintaprosesseja data-analyysillä ja parhailla käytännöillä"
    ],
    typical_employers: [
      "Wolt, Supercell, kasvuyhtiöt",
      "Konsultit: Gofore, Solita, Tietoevry",
      "Nordea, OP, S-ryhmä, K-ryhmä",
      "Julkinen sektori ja suuryritykset"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "strategy-consultant": {
    short_description: "Strategiakonsultti auttaa yrityksiä määrittelemään pitkän aikavälin strategioita ja tekemään kriittisiä liiketoimintapäätöksiä. Helsingissä huippurooli, joka vaatii korkeakoulututkinnon ja erinomaista analyyttistä ajattelua. Tarjoaa nopean urakehityksen, haastavat projektit ja palkan 4500-8000€/kk.",
    impact: [
      "Ohjaa yritysten strategisia päätöksiä, jotka vaikuttavat miljooniin euroihin ja tuhansiin työntekijöihin",
      "Analysoi markkinoita ja kilpailijoita tukemaan menestyksekästä liiketoimintaa",
      "Mahdollistaa uusien liiketoimintamahdollisuuksien tunnistamisen ja kasvun"
    ],
    typical_employers: [
      "McKinsey & Company (Helsinki)",
      "Boston Consulting Group (Helsinki)",
      "Bain & Company (Helsinki)",
      "Strategy& (PwC), Deloitte Strategy"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "paljon"
    }
  },

  "sales-development-representative": {
    short_description: "SDR (Sales Development Representative) generoi liidejä, kvalifioi prospekteja ja varaa tapaamisia myyntitiimille. Helsingissä kysytty aloitusrooli SaaS-yrityksissä - tarjoaa hyvät ansaintamahdollisuudet bonuksilla (3000-5000€/kk) ja nopean polun myyntiin.",
    impact: [
      "Generoi satoja kvalifioituja liidejä kuukausittain, jotka muuttuvat arvokkaaksi asiakkuuksiksi",
      "Mahdollistaa myyntitiimin fokuksen sulkemiseen ja kasvattaa myyntituloksia",
      "Rakentaa myyntipipelineä, joka tukee yrityksen kasvutavoitteita"
    ],
    typical_employers: [
      "Wolt, Supermetrics, Smartly.io",
      "SaaS-startupit ja kasvuyhtiöt",
      "HubSpot, Salesforce (Helsinki)",
      "B2B-teknologiayritykset"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "account-executive": {
    short_description: "Account Executive vastaa B2B-myynnistä, asiakassuhteiden rakentamisesta ja kauppojen sulkemisesta. Helsingissä kysytty rooli SaaS- ja tech-yrityksissä - tarjoaa erinomaisen palkan bonuksilla (4000-8000€/kk), etätyön ja selkeän urakehityksen.",
    impact: [
      "Myy ratkaisuja, jotka tuottavat satoja tuhansia euroja vuosittaisia sopimuksia",
      "Rakentaa pitkäaikaisia asiakassuhteita ja luo arvoa molemmille osapuolille",
      "Kasvattaa yrityksen liikevaihtoa 20-50% menestyksellisellä myynnillä"
    ],
    typical_employers: [
      "Wolt, Supermetrics, Smartly.io",
      "HubSpot, Salesforce, Zendesk",
      "SaaS-yritykset ja kasvuyhtiöt",
      "B2B-teknologiayritykset"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "operations-manager": {
    short_description: "Operations Manager vastaa liiketoiminnan operatiivisesta johtamisesta, prosessien kehittämisestä ja tehokkuudesta. Helsingissä kysytty rooli kasvuyhtiöissä, jotka skaalautuvat nopeasti. Tarjoaa monipuolisen työn, vastuuta ja palkan 4500-7000€/kk.",
    impact: [
      "Optimoi liiketoimintaprosesseja, jotka palvelevat tuhansia asiakkaita päivittäin",
      "Parantaa operatiivista tehokkuutta 20-40% ja säästää merkittäviä kustannuksia",
      "Mahdollistaa yrityksen skaalautumisen hallitusti ja kestävästi"
    ],
    typical_employers: [
      "Wolt, Swappie, kasvuyhtiöt",
      "Verkkokaupat ja logistics-yritykset",
      "Konsultit: Gofore, Solita",
      "Suuryritykset ja julkinen sektori"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "business-development-manager": {
    short_description: "Business Development Manager etsii uusia liiketoimintamahdollisuuksia, kumppanuuksia ja kasvukanavia. Helsingissä kysytty rooli startup- ja kasvuyhtiöissä, jotka laajentuvat. Tarjoaa strategisen roolin, kansainväliset mahdollisuudet ja palkan 4000-7000€/kk.",
    impact: [
      "Tunnistaa ja luo uusia liiketoimintamahdollisuuksia, jotka tuottavat miljoonia euroja",
      "Rakentaa strategisia kumppanuuksia, jotka laajentavat yrityksen markkina-aluetta",
      "Kasvattaa liiketoimintaa 30-100% vuodessa uusien kanavien ja markkinoiden kautta"
    ],
    typical_employers: [
      "Wolt, Swappie, Supermetrics",
      "Startup-yritykset ja kasvuyhtiöt",
      "SaaS-yritykset ja teknologiayritykset",
      "Kansainväliset yritykset (Helsinki)"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "paljon"
    }
  },

  "project-coordinator": {
    short_description: "Projektikoordinaattori koordinoi projekteja, aikatauluja ja resursseja varmistaen että projektit valmistuvat ajallaan ja budjetissa. Helsingissä kysytty aloitusrooli, joka tarjoaa polun projektipäällikkyteen. Tarjoaa monipuolisen työn, hybridityön ja palkan 3200-4500€/kk.",
    impact: [
      "Koordinoi projekteja, jotka tuottavat satoja tuhansia euroja arvoa yritykselle",
      "Varmistaa että projektit valmistuvat ajallaan ja budjetissa tehokkaalla koordinoinnilla",
      "Mahdollistaa tiimien tehokkaan yhteistyön ja viestinnän"
    ],
    typical_employers: [
      "Konsultit: Gofore, Solita, Reaktor",
      "Rakennusala: YIT, Skanska",
      "IT-yritykset ja digitoimistot",
      "Julkinen sektori ja suuryritykset"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "digital-transformation-consultant": {
    short_description: "Digitaalisen transformaation konsultti auttaa yrityksiä modernisoimaan toimintaansa ja ottamaan käyttöön digitaalisia ratkaisuja. Helsingissä kasvava kysyntä julkisella ja yksityisellä sektorilla - rooli yhdistää strategian, teknologian ja muutosjohtamisen. Tarjoaa haastavat projektit ja palkan 4500-7500€/kk.",
    impact: [
      "Ohjaa organisaatioiden digitaalitransformaatioita, jotka vaikuttavat tuhansiin työntekijöihin",
      "Modernisoi prosesseja ja järjestelmiä, jotka parantavat tehokkuutta 30-50%",
      "Mahdollistaa uusien digitaalisten palveluiden käyttöönoton ja liiketoimintamallit"
    ],
    typical_employers: [
      "Accenture, Deloitte, KPMG",
      "Gofore, Solita, Tietoevry",
      "McKinsey Digital, BCG Digital",
      "Suuryritykset ja julkinen sektori"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "paljon"
    }
  },

  "change-management-specialist": {
    short_description: "Muutoksenhallinnan asiantuntija tukee organisaatioita suurissa muutoksissa, kouluttaa työntekijöitä ja varmistaa muutosten onnistumisen. Helsingissä kysyntää julkisella sektorilla ja suuryrityksissä - rooli yhdistää psykologian, viestinnän ja projektinhallinnan. Tarjoaa merkityksellisen työn ja palkan 3800-5800€/kk.",
    impact: [
      "Tukee tuhansia työntekijöitä muutoksissa ja vähentää muutosvastarintaa",
      "Varmistaa että organisaatiomuutokset onnistuvat ja tuottavat halutun tuloksen",
      "Parantaa muutosten läpimenoa 40-60% systemaattisella change managementilla"
    ],
    typical_employers: [
      "Konsultit: Deloitte, KPMG, Gofore",
      "Suuryritykset: Nokia, Elisa, Fortum",
      "Julkinen sektori: Kela, Valtiokonttori",
      "Organisaatiomuutosprojektit"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  // Health/Wellness Careers (6 careers)
  "mental-health-counselor": {
    short_description: "Mielenterveystyön ammattilainen tarjoaa terapiaa, neuvontaa ja tukea mielenterveyshaasteissa kärsiville. Helsingissä kasvava tarve erityisesti nuorille aikuisille suunnatuissa palveluissa. Tarjoaa merkityksellisen työn, joustavan työajan ja palkan 3200-4800€/kk.",
    impact: [
      "Auttaa satoja ihmisiä vuosittain mielenterveyshaasteiden kanssa ja parantaa heidän elämänlaatuaan",
      "Tarjoaa terapiaa ja tukea, joka vähentää ahdistusta, masennusta ja stressiä",
      "Mahdollistaa ihmisten palaamisen työelämään ja arkeen mielenterveyden parantumisen myötä"
    ],
    typical_employers: [
      "Helsingin kaupunki, HUS",
      "Yksityiset terapiakeskukset: Psykologikeskus Vastaamo, Terveystalo",
      "Työterveyspalvelut: Mehiläinen, Terveystalo",
      "Yksityinen vastaanotto"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "wellness-coach": {
    short_description: "Hyvinvointivalmentaja tukee asiakkaita tekemään terveellisiä elämäntapamuutoksia liikunnassa, ravinnossa ja stressinhallinnassa. Helsingissä kasvava wellness-trendi luo mahdollisuuksia - voit työskennellä yrityksille tai freelancerina. Tarjoaa joustavan työajan, merkityksellisen työn ja ansaintapotentiaalia.",
    impact: [
      "Auttaa satoja asiakkaita vuosittain tekemään kestäviä elämäntapamuutoksia ja parantamaan terveyttä",
      "Tukee työhyvinvointia yrityksissä ja vähentää sairauspoissaoloja 15-30%",
      "Mahdollistaa ihmisten terveellisemmän ja energisemmän elämän"
    ],
    typical_employers: [
      "Työterveyspalvelut: Mehiläinen, Terveystalo",
      "Wellness-yritykset: Frank Body, Urban Sports Club",
      "Yritykset hyvinvointipalveluina",
      "Freelance ja oma yritystoiminta"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "occupational-health-specialist": {
    short_description: "Työterveyshuollon ammattilainen huolehtii työntekijöiden terveydestä ja työhyvinvoinnista yrityksissä. Helsingissä jatkuva kysyntä erityisesti kasvuyhtiöissä, jotka panostavat henkilöstön hyvinvointiin. Tarjoaa vakaan työn, monipuoliset tehtävät ja palkan 3500-5000€/kk.",
    impact: [
      "Huolehtii tuhansien työntekijöiden terveydestä ja työhyvinvoinnista Helsingin alueella",
      "Vähentää sairauspoissaoloja 20-40% ennaltaehkäisevällä työterveyshuollolla",
      "Mahdollistaa terveellisemmän työympäristön ja paremman työkyvyn"
    ],
    typical_employers: [
      "Mehiläinen Työterveyspalvelut",
      "Terveystalo, Pihlajalinna",
      "Helsingin kaupunki",
      "Suuryritykset (sisäinen työterveyshuolto)"
    ],
    work_conditions: {
      remote: "Ei",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "health-data-analyst": {
    short_description: "Terveysdatan analyytikko analysoi terveydenhuollon dataa parantaakseen hoitoprosesseja, potilasturvallisuutta ja päätöksentekoa. Helsingissä kasvava kysyntä julkisella ja yksityisellä terveydenhuollolla - rooli yhdistää data-analytiikan ja terveydenhuollon. Tarjoaa etätyön, merkityksellisen työn ja palkan 3800-5500€/kk.",
    impact: [
      "Analysoi dataa, joka parantaa tuhansien potilaiden hoitoa ja turvallisuutta",
      "Tunnistaa tehostamismahdollisuuksia, jotka säästävät satoja tuhansia euroja terveydenhuollossa",
      "Tukee evidenssipohjaista päätöksentekoa ja parantaa hoitotuloksia"
    ],
    typical_employers: [
      "HUS, Helsingin kaupunki",
      "Mehiläinen, Terveystalo, Pihlajalinna",
      "Kela, THL",
      "Terveysteknologiayritykset"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "nutrition-specialist": {
    short_description: "Ravitsemusasiantuntija neuvoo asiakkaita terveellisessä ravitsemuksessa ja auttaa saavuttamaan terveystavoitteita. Helsingissä kasvava kysyntä yksityisellä sektorilla ja wellness-toimialalla. Tarjoaa joustavan työajan, asiakastyön ja ansaintapotentiaalia.",
    impact: [
      "Auttaa satoja asiakkaita vuosittain saavuttamaan terveystavoitteita ravitsemuksen avulla",
      "Tukee kroonisten sairauksien hallintaa ja ehkäisyä terveellisellä ruokavaliolla",
      "Mahdollistaa terveellisemmän elämäntavan ja paremman energiatason"
    ],
    typical_employers: [
      "Terveystalo, Mehiläinen",
      "Yksityinen vastaanotto",
      "Urheiluseurat ja wellness-keskukset",
      "Freelance ja ravitsemusneuvonta"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "healthcare-coordinator": {
    short_description: "Terveydenhuollon koordinaattori koordinoi hoitoprosesseja, aikatauluja ja potilaspolkuja varmistaen sujuvan hoidon. Helsingissä kysyntää julkisella ja yksityisellä sektorilla - rooli yhdistää asiakaspalvelun, koordinoinnin ja terveydenhuollon. Tarjoaa vakaan työn ja palkan 3000-4200€/kk.",
    impact: [
      "Koordinoi hoitopolkuja tuhansille potilaille vuosittain ja varmistaa sujuvan hoidon",
      "Parantaa potilaskokemusta 30-50% tehokkaalla koordinoinnilla ja viestinnällä",
      "Vähentää odotusaikoja ja tehostaa hoitoresurssien käyttöä"
    ],
    typical_employers: [
      "HUS, Helsingin kaupunki",
      "Mehiläinen, Terveystalo, Pihlajalinna",
      "Yksityiset sairaalat ja klinikat",
      "Erikoissairaanhoidon yksiköt"
    ],
    work_conditions: {
      remote: "Ei",
      shift_work: false,
      travel: "vähän"
    }
  },

  // International/Remote Careers (6 careers)
  "international-sales-manager": {
    short_description: "Kansainvälisen myynnin päällikkö vastaa myynnistä kansainvälisillä markkinoilla, kumppanuuksista ja markkinalaajenuksesta. Helsingissä kysytty rooli kasvuyhtiöissä, jotka kansainvälistyvät - tarjoaa matkustusmahdollisuudet (20-40%), kielitaidon hyödyntämisen ja palkan 5000-8000€/kk.",
    impact: [
      "Kasvattaa kansainvälistä myyntiä ja tuo miljoonia euroja liikevaihtoa uusilta markkinoilta",
      "Rakentaa strategisia kumppanuuksia, jotka avaavat uusia markkina-alueita",
      "Mahdollistaa yrityksen kansainvälisen kasvun ja laajentumisen"
    ],
    typical_employers: [
      "Wolt, Supercell, Smartly.io",
      "Suomalaiset kasvuyhtiöt (kv-ekspansio)",
      "Kansainväliset yritykset (Helsinki-toimisto)",
      "Export-yritykset ja SaaS-yritykset"
    ],
    work_conditions: {
      remote: "Kyllä",
      shift_work: false,
      travel: "paljon"
    }
  },

  "remote-team-lead": {
    short_description: "Etätiimin vetäjä johtaa hajautettua tiimiä, koordinoi työtä ja varmistaa tiimin tuottavuuden ja hyvinvoinnin. Helsingissä kasvava rooli, kun yhä useammat yritykset toimivat etänä tai hybridinä. Tarjoaa täyden etätyön, joustavan työajan ja palkan 4500-7000€/kk.",
    impact: [
      "Johtaa hajautettua tiimiä, joka palvelee tuhansia asiakkaita tai käyttäjiä päivittäin",
      "Varmistaa tiimin tuottavuuden ja motivaation etätyöympäristössä",
      "Mahdollistaa tehokkaan globaalin yhteistyön ja innovaation"
    ],
    typical_employers: [
      "Wolt, Smartly.io, kansainväliset yritykset",
      "Remote-first startupit",
      "GitLab, Toggl, Buffer (Helsinki-työntekijät)",
      "Konsultit: Reaktor, Futurice"
    ],
    work_conditions: {
      remote: "Kyllä",
      shift_work: false,
      travel: "vähän"
    }
  },

  "localization-specialist": {
    short_description: "Lokalisointiasiantuntija mukauttaa tuotteita, sisältöjä ja käyttöliittymiä eri kielille ja kulttuureille. Helsingissä kysyntää peliyhtiöissä ja kansainvälisissä SaaS-yrityksissä - rooli yhdistää kielet, teknologian ja kulttuuriymmärryksen. Tarjoaa etätyön, kielten hyödyntämisen ja palkan 3500-5500€/kk.",
    impact: [
      "Lokalisoi tuotteita, jotka tavoittavat miljoonia käyttäjiä ympäri maailmaa",
      "Mahdollistaa tuotteiden menestyksen uusilla markkinoilla kulttuurisesti sopivalla lokalisoinnilla",
      "Parantaa käyttäjäkokemusta 30-50% paikallisesti relevanteilla käännöksillä ja sisällöllä"
    ],
    typical_employers: [
      "Supercell, Rovio, Remedy Entertainment",
      "Wolt, Smartly.io (kansainväliset markkinat)",
      "Käännöstoimistot: AAC Global, Semantix",
      "SaaS-yritykset ja peliyhtiöt"
    ],
    work_conditions: {
      remote: "Kyllä",
      shift_work: false,
      travel: "vähän"
    }
  },

  "global-partnerships-manager": {
    short_description: "Globaalien kumppanuuksien päällikkö rakentaa ja hallitsee strategisia kumppanuuksia kansainvälisesti. Helsingissä kysytty rooli kasvuyhtiöissä, jotka laajentuvat - tarjoaa kansainväliset matkat (30-50%), verkostoitumisen ja palkan 5500-8500€/kk.",
    impact: [
      "Rakentaa globaaleja kumppanuuksia, jotka tuottavat miljoonia euroja lisäarvoa",
      "Laajentaa yrityksen markkina-aluetta strategisten kumppanuuksien kautta",
      "Mahdollistaa kansainvälisen kasvun ja uudet liiketoimintamahdollisuudet"
    ],
    typical_employers: [
      "Wolt, Supercell, Smartly.io",
      "Slush, Business Finland",
      "Kansainväliset yritykset (Helsinki)",
      "Kasvuyhtiöt ja startup-yritykset"
    ],
    work_conditions: {
      remote: "Kyllä",
      shift_work: false,
      travel: "paljon"
    }
  },

  "technical-support-specialist": {
    short_description: "Teknisen tuen asiantuntija auttaa asiakkaita teknisten ongelmien ratkaisemisessa ja tuotteiden käytössä. Helsingissä jatkuva kysyntä SaaS- ja tech-yrityksissä - tarjoaa etätyön, joustavan työajan ja palkan 3000-4500€/kk.",
    impact: [
      "Auttaa tuhansia asiakkaita vuosittain ratkaisemaan teknisiä ongelmia ja parantaa asiakastyytyväisyyttä",
      "Vähentää asiakaspoistumaa 20-30% nopealla ja laadukkaalla tuella",
      "Kerää arvokasta asiakaspalautetta tuotekehitykseen"
    ],
    typical_employers: [
      "Wolt, Supermetrics, Smartly.io",
      "SaaS-yritykset ja teknologiayritykset",
      "Kansainväliset yritykset (Helsinki-tuki)",
      "Verkkokaupat ja digitaaliset palvelut"
    ],
    work_conditions: {
      remote: "Kyllä",
      shift_work: false,
      travel: "vähän"
    }
  },

  "translation-project-manager": {
    short_description: "Käännösprojektipäällikkö koordinoi käännösprojekteja, hallitsee kääntäjiä ja varmistaa laadun ja aikataulut. Helsingissä kysyntää käännöstoimistoissa ja kansainvälisissä yrityksissä - tarjoaa etätyön, kielten hyödyntämisen ja palkan 3500-5000€/kk.",
    impact: [
      "Koordinoi käännösprojekteja, jotka mahdollistavat tuotteiden lanseeraamisen uusille markkinoille",
      "Varmistaa laadukkaat käännökset, jotka tukevat brändiä ja liiketoimintatavoitteita",
      "Hallitsee monimutkaisia monikielisiä projekteja tehokkaasti"
    ],
    typical_employers: [
      "Käännöstoimistot: AAC Global, Semantix",
      "Supercell, Rovio, peliyhtiöt",
      "Kansainväliset yritykset (Helsinki)",
      "EU-toimielimet ja kansainväliset organisaatiot"
    ],
    work_conditions: {
      remote: "Kyllä",
      shift_work: false,
      travel: "vähän"
    }
  },

  // Social Impact Careers (8 careers)
  "diversity-and-inclusion-specialist": {
    short_description: "Monimuotoisuuden ja osallisuuden asiantuntija edistää tasa-arvoa ja inklusiivisuutta työpaikoilla sekä kehittää D&I-strategioita. Helsingissä kasvava kysyntä erityisesti kansainvälisissä yrityksissä ja startup-sektorilla. Tarjoaa merkityksellisen työn, hybridityön ja palkan 3500-5500€/kk.",
    impact: [
      "Edistää tasa-arvoa ja inklusiivisuutta organisaatioissa, jotka työllistävät tuhansia ihmisiä",
      "Rakentaa monimuotoisempia tiimejä, jotka ovat 35% innovatiivisempia tutkimusten mukaan",
      "Luo työkulttuureja, joissa kaikki voivat olla oma itsensä ja menestyä"
    ],
    typical_employers: [
      "Wolt, Supercell, kansainväliset yritykset",
      "Konsultit: Deloitte, KPMG, Accenture",
      "Startup-yritykset ja kasvuyhtiöt",
      "Julkinen sektori ja järjestöt"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "social-justice-advocate": {
    short_description: "Sosiaalisen oikeudenmukaisuuden aktivisti edistää yhteiskunnallista oikeudenmukaisuutta, ihmisoikeuksia ja tasa-arvoa. Helsingissä mahdollisuuksia järjestöissä ja sosiaalisen sektorin organisaatioissa. Tarjoaa merkityksellisen työn, yhteiskunnallisen vaikuttamisen ja palkan 2800-4200€/kk.",
    impact: [
      "Edistää sosiaalista oikeudenmukaisuutta ja ihmisoikeuksia Suomessa ja kansainvälisesti",
      "Tukee haavoittuvassa asemassa olevia ryhmiä ja auttaa tuhansia ihmisiä vuosittain",
      "Vaikuttaa yhteiskunnalliseen keskusteluun ja politiikkaan"
    ],
    typical_employers: [
      "Amnesty International Suomi",
      "Plan International Finland",
      "Suomen Punainen Risti",
      "Kansalaisjärjestöt ja sosiaaliset yritykset"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "community-organizer": {
    short_description: "Yhteisöorganisaattori rakentaa ja mobilisoi yhteisöjä, järjestää tapahtumia ja edistää yhteiskunnallista muutosta. Helsingissä mahdollisuuksia järjestöissä, sosiaalisissa liikkeissä ja kaupunkiaktivismissa. Tarjoaa merkityksellisen työn, verkostoitumisen ja palkan 2800-4000€/kk.",
    impact: [
      "Mobilisoi satoja tai tuhansia ihmisiä yhteisten tavoitteiden puolesta",
      "Rakentaa vahvoja paikallisyhteisöjä ja edistää yhteiskunnallista muutosta",
      "Järjestää tapahtumia ja kampanjoita, jotka tavoittavat laajat yleisöt"
    ],
    typical_employers: [
      "Kansalaisjärjestöt",
      "Poliittiset liikkeet ja puolueet",
      "Kaupunkiaktiivisuus ja yhteisötalot",
      "Sosiaaliset yritykset"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "nonprofit-program-coordinator": {
    short_description: "Järjestöjen ohjelmakoordinaattori koordinoi ja toteuttaa voittoa tavoittelemattomien järjestöjen ohjelmia ja projekteja. Helsingissä mahdollisuuksia laajassa järjestökentässä - rooli yhdistää projektinhallinnan ja yhteiskunnallisen vaikuttamisen. Tarjoaa merkityksellisen työn ja palkan 3000-4500€/kk.",
    impact: [
      "Koordinoi ohjelmia, jotka auttavat tuhansia haavoittuvassa asemassa olevia ihmisiä",
      "Toteuttaa projekteja, jotka edistävät sosiaalista oikeudenmukaisuutta ja hyvinvointia",
      "Luo konkreettista muutosta yhteiskuntaan järjestötoiminnan kautta"
    ],
    typical_employers: [
      "Suomen Punainen Risti",
      "Plan International Finland",
      "Kansainväliset kehitysjärjestöt",
      "Sosiaaliset järjestöt ja yhteisöt"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "human-rights-researcher": {
    short_description: "Ihmisoikeustutkija tutkii ihmisoikeusloukkauksia, laatii raportteja ja edistää ihmisoikeuksia tutkimuksen kautta. Helsingissä mahdollisuuksia yliopistoilla, järjestöissä ja tutkimuslaitoksilla. Tarjoaa merkityksellisen työn, akateemisen ympäristön ja palkan 3000-4500€/kk.",
    impact: [
      "Tutkii ihmisoikeusloukkauksia ja tuottaa tietoa, joka vaikuttaa politiikkaan ja lainsäädäntöön",
      "Edistää ihmisoikeuksia globaalisti tutkimuksen ja raportoinnin kautta",
      "Tukee kansainvälisiä ihmisoikeusjärjestöjä evidenssipohjaisella tiedolla"
    ],
    typical_employers: [
      "Helsingin yliopisto, Åbo Akademi",
      "Amnesty International",
      "Ihmisoikeusliitto, Ihmisoikeuskeskus",
      "Tutkimuslaitokset ja järjestöt"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "accessibility-consultant": {
    short_description: "Saavutettavuuskonsultti auttaa organisaatioita tekemään tuotteista, palveluista ja ympäristöistä saavutettavia kaikille. Helsingissä kasvava kysyntä digitaalisen saavutettavuuden ja esteettömyyden saralla. Tarjoaa merkityksellisen työn, etätyön ja palkan 3500-5500€/kk.",
    impact: [
      "Tekee tuotteista ja palveluista saavutettavia miljoonille käyttäjille, myös vammaisille",
      "Edistää digitaalista inklusiivisuutta ja tasa-arvoa WCAG-standardien mukaisesti",
      "Auttaa yrityksiä täyttämään saavutettavuusvaatimukset ja laajentamaan käyttäjäkuntaa"
    ],
    typical_employers: [
      "Wolt, digitaaliset palveluyritykset",
      "Julkinen sektori: Kela, Digi- ja väestötietovirasto",
      "Konsultit: Gofore, Solita",
      "Saavutettavuuskonsulttitalot"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "gender-equality-advisor": {
    short_description: "Tasa-arvoneuvoja edistää sukupuolten tasa-arvoa organisaatioissa, laatii tasa-arvosuunnitelmia ja kouluttaa henkilöstöä. Helsingissä kysyntää julkisella sektorilla ja suuryrityksissä - rooli yhdistää tasa-arvotyön ja organisaatiokehittämisen. Tarjoaa merkityksellisen työn ja palkan 3200-4800€/kk.",
    impact: [
      "Edistää sukupuolten tasa-arvoa organisaatioissa, jotka työllistävät tuhansia ihmisiä",
      "Vähentää palkkaeroja ja edistää naisten urakehtystä johtotehtäviin",
      "Luo tasa-arvoisempia ja inklusiivisempia työkulttuureja"
    ],
    typical_employers: [
      "Helsingin kaupunki, ministeriöt",
      "Suuryritykset ja kansainväliset yritykset",
      "Tasa-arvovaltuutetun toimisto",
      "Konsultit ja järjestöt"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "youth-empowerment-coordinator": {
    short_description: "Nuorten voimaannuttamisen koordinaattori tukee nuoria kehittymään, löytämään vahvuutensa ja saavuttamaan tavoitteensa. Helsingissä mahdollisuuksia nuorisotyössä, järjestöissä ja kouluissa. Tarjoaa merkityksellisen työn, nuorten kanssa työskentelyn ja palkan 2800-4000€/kk.",
    impact: [
      "Tukee satoja nuoria vuosittain löytämään tiensä ja voimaantumaan",
      "Edistää nuorten hyvinvointia, kouluttautumista ja työllistymistä",
      "Luo turvallisia tiloja ja yhteisöjä, joissa nuoret voivat kasvaa ja kehittyä"
    ],
    typical_employers: [
      "Helsingin kaupunki (nuorisopalvelut)",
      "Nuorisotyön järjestöt: Allianssi, NMKY",
      "Koulut ja oppilaitokset",
      "Sosiaaliset yritykset ja yhteisöt"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  // Sustainability Careers (7 careers)
  "sustainable-fashion-designer": {
    short_description: "Kestävän muodin suunnittelija suunnittelee vaatteita ja tuotteita, jotka ovat ekologisia, eettisiä ja kestäviä. Helsingissä kasvava sustainable fashion -sektori - rooli yhdistää muotoilun, kestävyyden ja etiikan. Tarjoaa luovan työn, yhteiskunnallisen vaikuttamisen ja ansaintapotentiaalia.",
    impact: [
      "Suunnittelee kestäviä vaatteita ja tuotteita, jotka vähentävät muotiteollisuuden ympäristövaikutuksia",
      "Edistää circular fashion -taloutta ja vastuullista kulutusta",
      "Luo ekologisia ja eettisiä brändejä, jotka inspiroivat muutokseen"
    ],
    typical_employers: [
      "Suomalaiset sustainable fashion -brändit: Makia, Pure Waste",
      "Lindex (Conscious Collection), H&M (Conscious)",
      "Freelance ja omat brändit",
      "Kiertotalousyritykset"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "circular-economy-specialist": {
    short_description: "Kiertotalouden asiantuntija kehittää kiertotaloussratkaisuja, auttaa yrityksiä siirtymään kiertotalouteen ja edistää resurssitehokkuutta. Helsingissä kasvava kysyntä erityisesti julkisella sektorilla ja kestävyysyrityksissä. Tarjoaa merkityksellisen työn, innovoinnin ja palkan 3500-5500€/kk.",
    impact: [
      "Kehittää kiertotaloussratkaisuja, jotka vähentävät jätettä ja resurssien kulutusta merkittävästi",
      "Auttaa yrityksiä säästämään satoja tuhansia euroja resurssitehokkuudella",
      "Edistää Suomen kiertotaloustavoitteita ja ilmastotavoitteita"
    ],
    typical_employers: [
      "Sitra, Motiva, Suomen ympäristökeskus",
      "Helsingin kaupunki, valtio",
      "Kiertotalousyritykset ja konsultit",
      "Yritykset (kestävyysosastot)"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "ethical-brand-strategist": {
    short_description: "Eettisen brändin strategisti auttaa yrityksiä rakentamaan vastuullisia brändejä, jotka huomioivat ihmiset, ympäristön ja etiikan. Helsingissä kasvava kysyntä kuluttajien arvostaessa vastuullisuutta. Tarjoaa luovan työn, vaikuttamisen ja palkan 3500-5500€/kk.",
    impact: [
      "Rakentaa vastuullisia brändejä, jotka vaikuttavat satoihin tuhansiin kuluttajiin",
      "Edistää eettistä liiketoimintaa ja vastuullista kulutusta",
      "Ohjaa yrityksiä kohti kestävämpää ja eettisempää toimintaa"
    ],
    typical_employers: [
      "Mainostoimistot ja brändikonsultit",
      "Vastuullisuusyritykset ja -järjestöt",
      "Startup-yritykset ja kasvuyhtiöt",
      "Freelance ja omat projektit"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "green-building-designer": {
    short_description: "Vihreän rakentamisen suunnittelija suunnittelee energiatehokkaita ja kestäviä rakennuksia ja tiloja. Helsingissä jatkuva kysyntä erityisesti uudisrakentamisessa ja remonteissa - rooli yhdistää arkkitehtuurin ja kestävyyden. Tarjoaa merkityksellisen työn ja palkan 3800-6000€/kk.",
    impact: [
      "Suunnittelee energiatehokkaita rakennuksia, jotka vähentävät hiilijalanjälkeä 50-70%",
      "Luo terveellisiä ja kestäviä tiloja, joissa tuhannet ihmiset asuvat ja työskentelevät",
      "Edistää Suomen ilmastotavoitteita rakennusten energiatehokkuudella"
    ],
    typical_employers: [
      "Arkkitehtitoimistot: Verstas, JKMM, Aalto University",
      "Rakennusliikkeet: YIT, Skanska, NCC",
      "Helsingin kaupunki (kaupunkisuunnittelu)",
      "Kestävän rakentamisen konsultit"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "zero-waste-consultant": {
    short_description: "Zero waste -konsultti auttaa yrityksiä ja organisaatioita vähentämään jätettä ja siirtymään kohti nollajatetavoitetta. Helsingissä kasvava kiinnostus zero waste -elämäntapaan - rooli yhdistää kestävyyden ja liiketoiminnan. Tarjoaa merkityksellisen työn, vaikuttamisen ja ansaintapotentiaalia.",
    impact: [
      "Auttaa yrityksiä vähentämään jätettä 70-90% ja säästämään merkittäviä kustannuksia",
      "Edistää circular economy -tavoitteita ja nollajatetavoitetta",
      "Inspiroi satoja ihmisiä ottamaan zero waste -elämäntavan käyttöön"
    ],
    typical_employers: [
      "Kiertotalousyritykset",
      "Ravintolat ja hotellit (kestävyysneuvonta)",
      "Helsingin kaupunki, jätehuoltoyritykset",
      "Freelance ja omat projektit"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "sustainable-product-designer": {
    short_description: "Kestävän tuotesuunnittelun suunnittelija kehittää tuotteita, jotka ovat ekologisia, kierrätettäviä ja eettisesti tuotettuja. Helsingissä kasvava kysyntä erityisesti muotoilutoimistoissa ja kestävissä brändeissä. Tarjoaa luovan työn, innovoinnin ja palkan 3200-5500€/kk.",
    impact: [
      "Suunnittelee kestäviä tuotteita, joita tuhannet ihmiset käyttävät ja jotka vähentävät ympäristövaikutuksia",
      "Edistää circular design -periaatteita ja tuotteiden kierrätettävyyttä",
      "Luo innovatiivisia ratkaisuja, jotka yhdistävät design ja kestävyyden"
    ],
    typical_employers: [
      "Muotoilutoimistot: Aivan, Fjord, Idean",
      "Kestävät brändit: Artek, Iittala, Marimekko",
      "Startup-yritykset ja kiertotalousyritykset",
      "Freelance ja omat projektit"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "ethical-sourcing-manager": {
    short_description: "Eettisen hankinnan päällikkö vastaa yrityksen hankinnoista varmistaen, että tuotteet ja materiaalit hankitaan eettisesti ja kestävästi. Helsingissä kysyntää kaupan alalla ja suuryrityksissä. Tarjoaa vastuullisen työn, kansainväliset kontaktit ja palkan 4000-6500€/kk.",
    impact: [
      "Varmistaa että yrityksen hankintaketjut ovat eettisiä ja kestäviä globaalisti",
      "Parantaa työoloja tuhansille työntekijöille kehittyvissä maissa",
      "Edistää vastuullista liiketoimintaa ja Fair Trade -periaatteita"
    ],
    typical_employers: [
      "S-ryhmä, K-ryhmä, Kesko",
      "Reima, Marimekko, Lindex",
      "Suuryritykset (hankinnat)",
      "Fair Trade -organisaatiot"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "paljon"
    }
  },

  // Multicultural/Creative Impact Careers (10 careers)
  "inclusive-content-creator": {
    short_description: "Inklusiivinen sisällöntuottaja luo sisältöä, joka edustaa monimuotoisuutta ja inklusiivisuutta sekä tavoittaa laajat yleisöt. Helsingissä kasvava kysyntä erityisesti mediatalloissa ja brändeissä, jotka arvostavat diversiteettiä. Tarjoaa luovan työn, vaikuttamisen ja ansaintapotentiaalia.",
    impact: [
      "Luo inklusiivista sisältöä, joka tavoittaa satoja tuhansia ihmisiä ja edistää representaatiota",
      "Haastaa stereotypioita ja lisää monimuotoisuutta mediassa",
      "Mahdollistaa aliedustettujen ryhmien näkyvyyden ja äänen kuulumisen"
    ],
    typical_employers: [
      "Yle, Sanoma Media, Alma Media",
      "Brändit: IVYREVEL, Lindex",
      "Mainostoimistot ja sisältötoimistot",
      "Freelance ja omat kanavat"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "cultural-sensitivity-consultant": {
    short_description: "Kulttuurisen sensitiivisyyden konsultti auttaa yrityksiä ymmärtämään kulttuurieroja ja kommunikoimaan kulttuurisesti sopivalla tavalla. Helsingissä kysyntää erityisesti kansainvälisissä yrityksissä ja kv-ekspansiossa. Tarjoaa kansainvälisen työn, kulttuurien ymmärtämisen ja palkan 3500-5500€/kk.",
    impact: [
      "Auttaa yrityksiä välttämään kulttuurisia väärinymmärryksiä ja kommunikoimaan tehokkaasti globaalisti",
      "Edistää kulttuurista inklusiivisuutta ja monimuotoisuutta organisaatioissa",
      "Mahdollistaa menestyksekkään kansainvälisen liiketoiminnan"
    ],
    typical_employers: [
      "Kansainväliset yritykset (Helsinki)",
      "Konsultit: Deloitte, KPMG, Accenture",
      "Käännöstoimistot ja lokalisointiyritykset",
      "Freelance ja kulttuurikonsultit"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "representation-editor": {
    short_description: "Representaatioeditori varmistaa että media-sisältö edustaa monimuotoisuutta autenttisets ja edustaa aliedustettuja ryhmiä. Helsingissä nouseva rooli mediatalloissa ja tuotantoyhtiöissä. Tarjoaa merkityksellisen työn, vaikuttamisen ja palkan 3200-5000€/kk.",
    impact: [
      "Varmistaa että media-sisältö edustaa monimuotoisuutta ja tavoittaa satoja tuhansia katsojia",
      "Lisää aliedustettujen ryhmien näkyvyyttä televisossa, elokuvissa ja mediassa",
      "Haastaa stereotypioita ja edistää positiivista representaatiota"
    ],
    typical_employers: [
      "Yle, MTV, Sanoma Media",
      "Tuotantoyhtiöt: Solar Films, MRP",
      "Suoratoistopalvelut: Netflix, HBO Nordic",
      "Mediayhtiöt ja elokuvatuotannot"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "vähän"
    }
  },

  "documentary-filmmaker-social-issues": {
    short_description: "Sosiaalisten aiheiden dokumentaristi tekee dokumentteja yhteiskunnallisista aiheista, ihmisoikeuksista ja sosiaalisesta oikeudenmukaisuudesta. Helsingissä mahdollisuuksia mediatalloissa, tuotantoyhtiöissä ja freelancerina. Tarjoaa merkityksellisen työn, tarinankerronnan ja ansaintapotentiaalia.",
    impact: [
      "Luo dokumentteja, jotka tavoittavat satoja tuhansia katsojia ja herättävät yhteiskunnallista keskustelua",
      "Nostaa esiin tärkeitä sosiaalisia aiheita ja antaa äänen aliedustetuille",
      "Vaikuttaa poliittiseen päätöksentekoon ja yhteiskunnalliseen muutokseen"
    ],
    typical_employers: [
      "Yle, MTV",
      "Tuotantoyhtiöt: Oktober, Bufo",
      "Kansainväliset dokumenttihankkeet",
      "Freelance ja omat tuotannot"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "paljon"
    }
  },

  "multicultural-marketing-specialist": {
    short_description: "Monikulttuurisen markkinoinnin asiantuntija suunnittelee markkinointikampanjoita, jotka tavoittavat monikulttuurisia yleisöjä ja huomioivat kulttuurierot. Helsingissä kasvava kysyntä kansainvälistyvissä yrityksissä. Tarjoaa kansainvälisen työn, luovuuden ja palkan 3500-5500€/kk.",
    impact: [
      "Luo markkinointikampanjoita, jotka tavoittavat satoja tuhansia monikulttuurisia kuluttajia",
      "Edistää inklusiivista markkinointia ja monimuotoisuutta mainonnassa",
      "Mahdollistaa brändien menestyksen monikulttuurisilla markkinoilla"
    ],
    typical_employers: [
      "Mainostoimistot: hasan & partners, TBWA",
      "Kansainväliset brändit (Helsinki)",
      "Digitoimistot ja markkinointitoimistot",
      "Freelance ja konsultit"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "public-art-coordinator": {
    short_description: "Julkisen taiteen koordinaattori organisoi ja koordinoi julkisia taideteoksia, muraaleja ja taide-installaatioita kaupunkitilassa. Helsingissä mahdollisuuksia kaupungin taidepalveluissa, kulttuurijärjestöissä ja kaupunkiaktiivisuudessa. Tarjoaa luovan työn, yhteisöllisyyden ja palkan 3000-4500€/kk.",
    impact: [
      "Koordinoi julkisia taideteoksia, jotka tavoittavat tuhansia ihmisiä päivittäin kaupungilla",
      "Tekee taiteesta saavutettavaa kaikille ja demokratisoi taidekokemuksen",
      "Luo viihtyisämpää ja inspiroivampaa kaupunkiympäristöä"
    ],
    typical_employers: [
      "Helsingin kaupunki (kulttuuripalvelut)",
      "Taidejärjestöt ja -säätiöt",
      "Kaupunkiaktiivisuus ja yhteisötalot",
      "Festivaalit ja tapahtumat"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "cultural-events-producer": {
    short_description: "Kulttuuritapahtumien tuottaja suunnittelee ja toteuttaa kulttuuritapahtumia, festivaaleja ja esityksiä. Helsingissä runsas tapahtumatarjonta luo mahdollisuuksia - rooli yhdistää luovuuden, tuotannon ja ihmissuhteet. Tarjoaa dynaamisen työn, verkostoitumisen ja palkan 3200-5000€/kk.",
    impact: [
      "Tuottaa kulttuuritapahtumia, jotka tavoittavat tuhansia tai kymmeniä tuhansia kävijöitä",
      "Tuo taidetta ja kulttuuria laajalle yleisölle ja edistää kulttuurista elämää",
      "Luo yhteisöllisyyttä ja kohtaamispaikkoja ihmisille"
    ],
    typical_employers: [
      "Helsingin kaupunki (kulttuuripalvelut)",
      "Festivaalit: Flow Festival, Ruisrock, Provinssi",
      "Kulttuuritalot: Savoy, Korjaamo, Oranssi",
      "Tapahtumatuotantoyhtiöt"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "art-therapy-facilitator": {
    short_description: "Taideterapeutti käyttää taidetta terapeuttisena työvälineenä auttaakseen ihmisiä käsittelemään tunteita ja traumoja. Helsingissä kysyntää terapiakeskuksissa, sairaaloissa ja kuntoutuksessa. Tarjoaa merkityksellisen työn, luovuuden ja palkan 3000-4500€/kk.",
    impact: [
      "Auttaa satoja ihmisiä vuosittain käsittelemään tunteita ja traumoja taiteen avulla",
      "Tukee mielenterveyttä ja hyvinvointia luovilla menetelmillä",
      "Tarjoaa vaihtoehtoisen terapeuttisen lähestymistavan haavoittuville ryhmille"
    ],
    typical_employers: [
      "HUS, Helsingin kaupunki",
      "Terapiakeskukset ja kuntoutuslaitokset",
      "Mielenterveysorganisaatiot",
      "Yksityinen vastaanotto"
    ],
    work_conditions: {
      remote: "Ei",
      shift_work: false,
      travel: "vähän"
    }
  },

  "community-arts-director": {
    short_description: "Yhteisötaiteen ohjaaja johtaa yhteisötaideprojekteja, jotka tuovat taidetta yhteisöihin ja osallistavat ihmisiä luovaan prosessiin. Helsingissä mahdollisuuksia yhteisötalloissa, kulttuurijärjestöissä ja kaupungilla. Tarjoaa merkityksellisen työn, luovuuden ja palkan 3000-4500€/kk.",
    impact: [
      "Johtaa yhteisötaideprojekteja, jotka osallistavat satoja ihmisiä luovaan prosessiin",
      "Luo yhteisöllisyyttä ja vahvistaa yhteisöjä taiteen avulla",
      "Tekee taiteesta saavutettavaa kaikille ja edistää kulttuurista demokratiaa"
    ],
    typical_employers: [
      "Helsingin kaupunki (kulttuuripalvelut)",
      "Yhteisötalot: Stoa, Kanneltalo, Vuotalo",
      "Taidejärjestöt ja -säätiöt",
      "Nuorisotyön organisaatiot"
    ],
    work_conditions: {
      remote: "Hybridi",
      shift_work: false,
      travel: "jonkin verran"
    }
  },

  "museum-education-specialist": {
    short_description: "Museopedagogi suunnittelee ja toteuttaa opetus- ja opastusohjelmia museoissa sekä tekee taiteesta ja kulttuurista saavutettavaa kaikille. Helsingissä mahdollisuuksia lukuisissa museoissa ja kulttuurilaitoksissa. Tarjoaa merkityksellisen työn, taiteen parissa työskentelyn ja palkan 3000-4500€/kk.",
    impact: [
      "Opettaa ja innostaa tuhansia kävijöitä vuosittain taiteesta ja kulttuurista",
      "Tekee kulttuuriperinnöstä saavutettavaa ja ymmärrettävää kaikille ikäryhmille",
      "Edistää kulttuurista sivistystä ja taidekasvatusta Suomessa"
    ],
    typical_employers: [
      "Kansallisgalleria (Ateneum, Kiasma)",
      "Helsingin kaupunginmuseo",
      "Suomen kansallismuseo",
      "Yksityiset museot ja taidegalleriat"
    ],
    work_conditions: {
      remote: "Ei",
      shift_work: false,
      travel: "vähän"
    }
  }
};

// =============================================================================
// SCRIPT LOGIC
// =============================================================================

const CAREERS_FILE = path.join(__dirname, 'data/careers-fi.ts');
const BACKUP_FILE = path.join(__dirname, 'data/careers-fi.ts.backup');

console.log('='.repeat(80));
console.log('BATCH CAREER ENHANCEMENT SCRIPT');
console.log('='.repeat(80));
console.log();

// Read the careers file
console.log('Reading careers-fi.ts...');
let fileContent = fs.readFileSync(CAREERS_FILE, 'utf-8');

// Create backup
console.log('Creating backup...');
fs.writeFileSync(BACKUP_FILE, fileContent);
console.log(`Backup saved to: ${BACKUP_FILE}`);
console.log();

// Track statistics
const stats = {
  total: Object.keys(enhancements).length,
  updated: 0,
  failed: [],
  skipped: []
};

console.log(`Total careers to enhance: ${stats.total}`);
console.log('='.repeat(80));
console.log();

// Process each career
for (const [careerId, enhancement] of Object.entries(enhancements)) {
  console.log(`Processing: ${careerId}`);

  try {
    // Find the career object in the file
    // Updated regex to handle both middle careers and the last career in the array
    const careerRegex = new RegExp(
      `(\\{\\s*id:\\s*"${careerId}"[\\s\\S]*?)(?=\\}\\s*(?:,\\s*\\{\\s*id:|\\s*\\]\\s*as))`,
      'm'
    );

    const match = fileContent.match(careerRegex);

    if (!match) {
      console.log(`  ❌ Career "${careerId}" not found in file`);
      stats.failed.push(careerId);
      continue;
    }

    let careerBlock = match[1];
    const originalBlock = careerBlock;

    // 1. Replace short_description
    careerBlock = careerBlock.replace(
      /short_description:\s*"[^"]*"/,
      `short_description: "${enhancement.short_description}"`
    );

    // 2. Replace impact array
    const impactStr = enhancement.impact
      .map(item => `      "${item}"`)
      .join(',\n');
    careerBlock = careerBlock.replace(
      /impact:\s*\[\s*(?:"[^"]*"(?:,\s*)?)*\s*\]/,
      `impact: [\n${impactStr}\n    ]`
    );

    // 3. Replace typical_employers array
    const employersStr = enhancement.typical_employers
      .map(item => `      "${item}"`)
      .join(',\n');
    careerBlock = careerBlock.replace(
      /typical_employers:\s*\[\s*(?:"[^"]*"(?:,\s*)?)*\s*\]/,
      `typical_employers: [\n${employersStr}\n    ]`
    );

    // 4. Replace work_conditions object
    const workConditionsEntries = Object.entries(enhancement.work_conditions)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}: "${value}"`;
        } else if (typeof value === 'boolean') {
          return `${key}: ${value}`;
        }
        return `${key}: ${JSON.stringify(value)}`;
      })
      .join(', ');

    careerBlock = careerBlock.replace(
      /work_conditions:\s*\{[^}]*\}/,
      `work_conditions: { ${workConditionsEntries} }`
    );

    // Replace the career block in the file content
    fileContent = fileContent.replace(originalBlock, careerBlock);

    stats.updated++;
    console.log(`  ✓ Successfully enhanced`);

  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    stats.failed.push(careerId);
  }

  console.log();
}

// Write the updated file
console.log('Writing updated file...');
fs.writeFileSync(CAREERS_FILE, fileContent, 'utf-8');
console.log('✓ File written successfully');
console.log();

// Print summary
console.log('='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total careers: ${stats.total}`);
console.log(`✓ Successfully updated: ${stats.updated}`);
console.log(`❌ Failed: ${stats.failed.length}`);
console.log(`⊘ Skipped: ${stats.skipped.length}`);
console.log();

if (stats.failed.length > 0) {
  console.log('Failed careers:');
  stats.failed.forEach(id => console.log(`  - ${id}`));
  console.log();
}

if (stats.skipped.length > 0) {
  console.log('Skipped careers:');
  stats.skipped.forEach(id => console.log(`  - ${id}`));
  console.log();
}

console.log('='.repeat(80));
console.log('DONE!');
console.log('='.repeat(80));
console.log();
console.log(`Backup file: ${BACKUP_FILE}`);
console.log(`Updated file: ${CAREERS_FILE}`);
console.log();

// Exit with appropriate code
process.exit(stats.failed.length > 0 ? 1 : 0);
