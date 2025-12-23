/**
 * PERSONALIZED MINI-ESSAY GENERATOR
 * Creates flowing, narrative-style analysis (1200-1500 characters)
 * Makes users feel understood through cohesive storytelling
 */

import { Cohort, DimensionScores, UserProfile, DetailedDimensionScores } from './types';

// ========== HELPER FUNCTIONS ==========

function getTopDimensions(scores: DimensionScores): Array<{ dimension: keyof DimensionScores; score: number }> {
  return (Object.entries(scores) as [keyof DimensionScores, number][])
    .map(([dimension, score]) => ({ dimension, score }))
    .sort((a, b) => b.score - a.score);
}

function getScoreLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 0.7) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
}

function getTopSubdimensions(detailedScores: DetailedDimensionScores, dimension: keyof DetailedDimensionScores, limit: number = 2): string[] {
  const scores = detailedScores[dimension];
  if (!scores || typeof scores !== 'object') return [];
  
  return Object.entries(scores)
    .filter(([, score]) => typeof score === 'number' && score > 0.5)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, limit)
    .map(([key]) => key);
}

// ========== ESSAY OPENING (Sets the tone & validates user) ==========

const ESSAY_OPENINGS = {
  YLA: {
    interests_high: [
      "Vastauksistasi huomaa heti, että olet utelias ja innokas oppimaan uusia asioita. Tämä on hieno lähtökohta tulevaisuutta ajatellen, sillä maailma tarjoaa loputtomasti mahdollisuuksia niille, jotka haluavat tutkia ja kokeilla. Sinulla on selvä halu ymmärtää, miten asiat toimivat, ja tämä uteliaisuus tulee olemaan arvokas voimavara koko elämäsi ajan. Monet menestyneet ammattilaiset ovat kertoneet, että juuri tämänkaltainen avoin ja tutkiva asenne on ollut heidän uransa perusta.",
      "Sinussa on vahva halu tutustua erilaisiin asioihin ja kokeilla uutta. Juuri sellainen asenne vie pitkälle. Vastauksistasi piirtyy kuva nuoresta, joka ei pelkää tarttua uusiin haasteisiin ja joka haluaa oppia jatkuvasti lisää. Tämä on erityisen tärkeä ominaisuus nykymaailmassa, jossa ammattien sisällöt muuttuvat nopeasti ja elinikäinen oppiminen on avain menestykseen. Sinulla on hyvät edellytykset sopeutua muutoksiin ja löytää uusia kiinnostavia polkuja.",
      "On hienoa nähdä, kuinka monipuolisesti kiinnostuksesi jakautuvat. Tämä uteliaisuus eri asioita kohtaan on vahvuus, joka avaa monia ovia tulevaisuudessa. Et ole rajoittunut vain yhteen suuntaan, vaan sinussa on kapasiteettia monenlaisiin uravalintoihin. Tämä joustavuus on arvokas ominaisuus, sillä se antaa sinulle vapauden valita erilaisia polkuja elämäsi eri vaiheissa. Maailma on täynnä mahdollisuuksia, ja sinulla on halu tutkia niitä."
    ],
    workstyle_high: [
      "Vastauksesi kertovat, että pidät käytännön tekemisestä ja siitä, että pääset heti toimintaan. Olet selvästi ihminen, joka haluaa nähdä työnsä tulokset konkreettisesti. Tämä käytännönläheinen ote on arvokas piirre, joka vie sinut pitkälle. Sinä et tyydy vain suunnittelemaan ja pohtimaan, vaan haluat myös toteuttaa ja nähdä, miten asiat toimivat käytännössä. Tämänkaltainen tekemisen meininki on juuri sitä, mitä monet työnantajat arvostavat.",
      "Huomaa selvästi, että nautit aktiivisesta työskentelystä ja konkreettisista tehtävistä. Olet energinen tekijä, joka varmasti tulee viihtymään töissä, joissa pääsee liikkeelle ja tekemään asioita oikeasti. Sinulle sopivat tehtävät, joissa näet käsiesi tai ajatustesi jäljen välittömästi. Tämä toiminnallisuus on vahvuus, joka auttaa sinua saamaan asioita aikaan tehokkaasti. Monet käytännönläheiset ammatit tarjoavat sinulle mahdollisuuden hyödyntää tätä energiaa.",
      "Vastauksistasi välittyy, että olet toiminnallinen ja käytännöllinen. Pidät siitä, kun asiat etenevät ja näet tuloksia. Tämä on juuri sellainen asenne, jota työelämässä arvostetaan korkealle. Et jää jumiin pohtimaan liikaa, vaan tartut toimeen ja saat asioita aikaan. Tämä tekemisen kulttuuri tulee olemaan sinulle voimavara kaikissa tulevissa tehtävissäsi, olipa kyse sitten opiskelusta, harrastuksista tai työelämästä."
    ],
    values_high: [
      "Vastauksistasi huomaa, että sinulle on tärkeää tehdä asioita, joilla on merkitystä. On hienoa, että jo nuorena mietit, minkälainen työ tuntuisi omalta ja vastaisi arvojasi. Tämä on viisautta, joka auttaa sinua rakentamaan elämän, johon olet tyytyväinen. Monet aikuiset toivovat, että olisivat nuorempana ymmärtäneet pohtia näitä asioita yhtä syvällisesti. Sinulla on kyky kuunnella itseäsi ja tunnistaa, mikä on sinulle tärkeää.",
      "Sinulle on selvästi tärkeää, että tekemäsi asiat tuntuvat oikeilta ja merkityksellisiltä. Tämä arvomaailma ohjaa sinua kohti uravalintoja, jotka tulevat varmasti tuntumaan aidosti omilta. Et tyydy vain mihin tahansa työhön, vaan haluat löytää polun, joka vastaa periaatteitasi. Tämä on erittäin tärkeä lähtökohta urasuunnittelulle, sillä arvojen mukainen työ tuo pitkäaikaista työtyytyväisyyttä ja motivaatiota.",
      "Vastauksistasi välittyy, että haluat tehdä asioita, jotka vastaavat omia arvojasi. Tämä kyky kuunnella itseään on tärkeä taito, joka auttaa sinua löytämään oman polkusi elämässä. Sinussa on kypsyyttä, joka näkyy siinä, miten pohdit asioiden merkitystä. Tämä arvolähtöinen ajattelu tulee ohjaamaan sinua kohti valintoja, joista voit olla ylpeä myös vuosien päästä. Se on lahja itsellesi."
    ]
  },
  TASO2: {
    interests_high: [
      "Vastauksistasi näkyy selkeä suunta ja vahva motivaatio kehittyä. Tämä tavoitteellisuus yhdistettynä kiinnostukseesi eri aloja kohtaan luo hyvän pohjan tulevaisuuden urasuunnittelulle. Olet jo päässyt pidemmälle kuin monet ikäisesi siinä, että tiedät mitä haluat tutkia lisää. Tämä tietoisuus omista kiinnostuksen kohteista on arvokas lähtökohta, joka auttaa sinua tekemään perusteltuja valintoja jatko-opinnoista ja tulevasta urastasi. Sinulla on hyvät edellytykset rakentaa urapolku, joka vastaa aitoja kiinnostuksen kohteitasi.",
      "On hienoa nähdä, kuinka selkeästi olet jo miettinyt omia kiinnostuksen kohteitasi. Tämä itsensä tunteminen on arvokas lähtökohta, kun suunnittelet jatko-opintoja ja tulevaa urapolkuasi. Monelle tämä selkeys tulee vasta myöhemmin, mutta sinä olet jo nyt ymmärtänyt, mikä sinua motivoi. Tämä antaa sinulle etulyöntiaseman, kun teet valintoja opinnoista ja työpaikoista. Pystyt suuntaamaan energiasi niihin asioihin, jotka todella kiinnostavat sinua ja joissa voit kehittyä parhaaksi versioksi itsestäsi.",
      "Vastauksistasi välittyy kypsä suhtautuminen omaan tulevaisuuteen. Sinulla on selkeä käsitys siitä, mitkä alueet kiinnostavat sinua, mikä helpottaa merkittävästi tulevien valintojen tekemistä. Et ole vain ajelehtimassa, vaan tiedät suunnan johon haluat mennä. Tämä on tärkeää, sillä se auttaa sinua keskittymään olennaiseen ja rakentamaan osaamista niillä alueilla, jotka todella merkitsevät sinulle. Tulevaisuuden työmarkkinat arvostavat ihmisiä, jotka tietävät vahvuutensa."
    ],
    workstyle_high: [
      "Vastauksesi kertovat, että sinulla on jo hyvä käsitys omasta työskentelytavastasi ja sen vahvuuksista. Tämä itsetuntemus on todella tärkeää, kun etsit paikkaa, jossa voit kehittyä ja menestyä. Tiedät, millaisissa olosuhteissa pääset parhaimpaasi ja millaiset tehtävät sopivat sinulle parhaiten. Tämä on arvokasta tietoa, jota voit hyödyntää sekä opinnoissa että työelämässä. Oikeanlainen ympäristö voi moninkertaistaa tuottavuutesi ja tyytyväisyytesi.",
      "Huomaa, että osaat organisoida tehtäviä ja työskennellä tavoitteellisesti. Nämä ovat taitoja, joita tarvitaan sekä opinnoissa että työelämässä, ja sinulla näyttää olevan niistä jo hyvä pohja. Et jätä asioita viime tippaan, vaan osaat suunnitella ja priorisoida. Tämänkaltainen järjestelmällisyys on harvinaisempaa kuin luulisi, ja työnantajat arvostavat sitä korkealle. Se kertoo luotettavuudesta ja kyvystä hoitaa vastuut hyvin.",
      "Vastauksistasi välittyy järjestelmällinen ja tavoitteellinen ote. Tiedät, miten työskentelet parhaiten, ja tämä tieto auttaa sinua valitsemaan sopivan oppimisympäristön ja työpaikan. Sinussa on sisäinen motivaatio saada asioita valmiiksi ja tehdä ne hyvin. Tämä ei ole itsestäänselvyys, vaan vahvuus, joka erottaa sinut eduksesi. Kun yhdistät tämän työskentelytavan kiinnostuksen kohteisiisi, voit saavuttaa paljon haluamallasi alalla."
    ],
    values_high: [
      "Vastauksistasi välittyy vahva arvomaailma, joka ohjaa sinua kohti uravalintoja, jotka tuntuvat oikeilta. On tärkeää, että etsit uraa, joka on linjassa omien periaatteidesi kanssa. Tämä tuo pitkäaikaista työtyytyväisyyttä ja merkityksellisyyden tunnetta. Monet tutkimukset osoittavat, että arvojen mukainen työ lisää sekä motivaatiota että hyvinvointia. Sinulla on kyky tunnistaa, mikä on sinulle tärkeää, ja tämä ohjaa sinua kohti oikeanlaisia valintoja.",
      "Sinulle on selvästi tärkeää, että tuleva urasi vastaa arvojasi ja periaatteitasi. Tämä tietoinen suhtautuminen urasuunnitteluun auttaa sinua tekemään valintoja, joita et tule katumaan. Et tyydy vain mihin tahansa työhön tai opiskelupaikkaan, vaan haluat löytää polun, joka tuntuu oikealta syvemmällä tasolla. Tämä on viisas lähestymistapa, sillä työ on iso osa elämää ja sen tulisi tuntua merkitykselliseltä.",
      "Vastauksistasi huomaa, että mietit työn merkityksellisyyttä ja sen yhteyttä omiin arvoihisi. Tämä pohdiskeleva ote on merkki kypsyydestä ja auttaa sinua rakentamaan uran, joka tuntuu aidosti omalta. Et etsi vain työpaikkaa, vaan tapaa elää arvojesi mukaisesti. Tämä syvällinen pohdinta tulee kantamaan hedelmää, kun löydät uran, jossa voit olla ylpeä siitä, mitä teet ja miten sen teet."
    ]
  },
  NUORI: {
    interests_high: [
      "Vastauksistasi välittyy selkeä ammatillinen suunta ja vahva motivaatio kehittää osaamistasi. Tämä tietoisuus omista kiinnostuksen kohteista on arvokas lähtökohta uran rakentamiselle ja antaa sinulle selkeän kilpailuedun työmarkkinoilla. Olet jo tunnistanut ne alueet, joilla haluat syventää osaamistasi, ja tämä fokus auttaa sinua tekemään strategisia valintoja urakehityksessäsi. Nykyisillä työmarkkinoilla arvostetaan ihmisiä, jotka tietävät vahvuutensa ja osaavat kehittää niitä määrätietoisesti.",
      "On hienoa nähdä, kuinka hyvin tunnet omat kiinnostuksen kohteesi ja osaamisalueesi. Tämä itsetuntemus yhdistettynä motivaatioosi kehittyä luo vahvan perustan menestykselle valitsemallasi alalla. Et ole sattumanvaraisesti ajautunut tiettyyn suuntaan, vaan olet tietoisesti valinnut polkusi. Tämä intentionaalisuus on harvinainen ja arvokas ominaisuus, joka tulee näkymään urasi kehityksessä positiivisesti. Työnantajat arvostavat ihmisiä, jotka tietävät mitä haluavat.",
      "Vastauksistasi huomaa, että sinulla on selkeä visio siitä, mihin suuntaan haluat kehittyä. Tämä tavoitteellisuus ja ammatillinen suuntautuminen ovat tärkeitä tekijöitä uran rakentamisessa ja antavat sinulle vahvan lähtökohdan. Tiedät, missä haluat olla tulevaisuudessa, ja tämä näkemys ohjaa päätöksiäsi oikeaan suuntaan. Tällainen strateginen ajattelu on arvokasta kaikilla aloilla ja auttaa sinua navigoimaan työelämän haasteissa tehokkaasti."
    ],
    workstyle_high: [
      "Vastauksesi osoittavat, että sinulla on vahva ymmärrys omasta työskentelytavastasi ja sen vahvuuksista. Tämä itsetuntemus on keskeistä työelämässä menestymiselle. Tiedät, missä ympäristössä ja millaisissa tehtävissä loistat parhaiten, ja osaat hakeutua niihin tilanteisiin. Tämä kyky tunnistaa omat optimaaliset työskentelyolosuhteet on merkittävä etu, sillä se auttaa sinua valitsemaan työpaikkoja ja projekteja, joissa voit todella menestyä ja tuottaa arvoa.",
      "Huomaa selvästi, että osaat hyödyntää vahvuuksiasi tehokkaasti ja työskennellä tavoitteellisesti. Nämä ovat ominaisuuksia, joita työnantajat arvostavat erityisesti, sillä ne kertovat kyvystäsi tuottaa tuloksia ja kehittää toimintaa. Et vain tee töitä, vaan teet niitä älykkäästi ja tehokkaasti. Tämä kyky priorisoida ja keskittyä olennaiseen on harvinainen vahvuus, joka erottaa menestyjät muista. Olet oppinyt työskentelemään omien vahvuuksiesi kautta.",
      "Vastauksistasi välittyy kypsä ja ammattimainen ote työhön. Tiedostat omat vahvuutesi ja osaat soveltaa niitä käytäntöön eri tilanteissa. Tämä reflektiivinen kyky on merkki korkean tason ammattilaisuudesta ja jatkuvasta itsensä kehittämisestä. Et jää jumiin vanhoihin toimintatapoihin, vaan mukautat lähestymistapaasi tilanteen mukaan. Tämä joustavuus yhdistettynä vahvaan itsetuntemukseen tekee sinusta arvokkaan tekijän missä tahansa organisaatiossa."
    ],
    values_high: [
      "Vastauksistasi välittyy selkeä ja harkittu arvomaailma, joka ohjaa uravalintojasi. On tärkeää, että etsit uraa, joka on linjassa periaatteidesi kanssa. Tämä on avain pitkäaikaiseen työtyytyväisyyteen ja motivaatioon. Työ, joka vastaa arvojasi, ei tunnu pelkältä työltä, vaan merkitykselliseltä kutsumukselta. Olet ymmärtänyt, että menestys ei ole vain ulkoisia saavutuksia, vaan myös sisäistä tyytyväisyyttä siihen, mitä teet ja miten sen teet.",
      "Sinulle on selvästi tärkeää, että urasi vastaa henkilökohtaisia arvojasi ja mahdollistaa niiden toteutumisen käytännössä. Tämä arvolähtöinen lähestymistapa uraan luo vahvan perustan merkitykselliselle ja palkitsevalle työuralle. Et mittaa menestystä vain rahalla tai tittelillä, vaan myös sillä, kuinka hyvin työsi sopii yhteen elämänkatsomuksesi kanssa. Tämä kokonaisvaltainen näkemys urasta on merkki kypsyydestä ja itsetuntemuksesta.",
      "Vastauksistasi huomaa, että mietit syvällisesti työn merkitystä ja sen yhteyttä omiin periaatteisiisi. Tämä tietoinen suhtautuminen on merkki kypsyydestä ja auttaa sinua rakentamaan uran, joka tuo todellista tyydytystä. Et tyydy pinnalliseen menestykseen, vaan haluat kokea, että työsi on linjassa sen kanssa, kuka olet ja mitä arvostat. Tämä syvällinen pohdinta maksaa itsensä takaisin pitkällä aikavälillä, kun rakennat uraa, joka kestää."
    ]
  }
};

// ========== CONNECTING NARRATIVES (Links dimensions together) ==========

const NARRATIVE_CONNECTORS = {
  YLA: {
    interests_to_workstyle: [
      "Tämä uteliaisuutesi yhdistyy mielenkiintoisella tavalla siihen, miten tykkäät työskennellä.",
      "Kiinnostuksesi eri asioita kohtaan näkyy myös siinä, miten lähestyt tehtäviä.",
      "On mielenkiintoista, miten tämä asenne näkyy myös tavassasi toimia."
    ],
    interests_to_values: [
      "Tämä kiinnostus eri asioita kohtaan yhdistyy siihen, mitä pidät tärkeänä.",
      "Kiinnostavaa on, miten tämä uteliaisuus sopii yhteen sen kanssa, millaista työtä haet.",
      "Tämä asenne näkyy myös siinä, minkälaisia asioita arvostat."
    ],
    workstyle_to_values: [
      "Tämä käytännöllinen otteesi sopii hyvin yhteen sen kanssa, mitä pidät tärkeänä.",
      "Tapasi toimia heijastaa myös sitä, minkälaista työtä haet.",
      "On hienoa nähdä, miten työskentelytapasi tukee arvojasi."
    ]
  },
  TASO2: {
    interests_to_workstyle: [
      "Tämä tavoitteellisuutesi näkyy myös siinä, miten organisoit tehtäviäsi ja työskentelet.",
      "Kiinnostuksesi yhdistyy luontevasti siihen, miten lähestyt eri tehtäviä ja haasteita.",
      "On mielenkiintoista, miten tämä motivaatio heijastuu myös työskentelytapaasi."
    ],
    interests_to_values: [
      "Tämä kiinnostus yhdistyy vahvasti siihen, mitä pidät tärkeänä tulevassa urassasi.",
      "Kiinnostavaa on, miten tämä suuntautuminen sopii yhteen arvomaailmasi kanssa.",
      "Tämä motivaatio heijastaa myös sitä, minkälaista merkitystä haet työstäsi."
    ],
    workstyle_to_values: [
      "Tämä järjestelmällinen otteesi tukee hyvin sitä, mitä pidät tärkeänä työelämässä.",
      "Tapasi työskennellä heijastaa myös arvojasi ja sitä, minkälaista uraa tavoittelet.",
      "On hienoa nähdä, miten työskentelytapasi on linjassa periaatteidesi kanssa."
    ]
  },
  NUORI: {
    interests_to_workstyle: [
      "Tämä ammatillinen suuntautumisesi heijastuu vahvasti myös siihen, miten organisoit tehtäviäsi ja kehität osaamistasi.",
      "Kiinnostuksesi yhdistyy luontevasti siihen, miten lähestyt työtehtäviä ja hyödynnät vahvuuksiasi käytännössä.",
      "On selvästi nähtävissä, miten tämä motivaatio näkyy myös järjestelmällisessä ja tavoitteellisessa työskentelytavassasi."
    ],
    interests_to_values: [
      "Tämä ammatillinen suuntautumisesi on vahvasti linjassa arvojesi ja periaatteidesi kanssa.",
      "Kiinnostavaa on, miten tämä selkeä uravisio tukee sitä, mitä pidät tärkeänä ja merkityksellisenä.",
      "Tämä motivaatio heijastaa myös sitä, minkälaista merkitystä ja vaikuttavuutta haet työstäsi."
    ],
    workstyle_to_values: [
      "Tämä ammattimainen ja tavoitteellinen otteesi työskentelyyn tukee vahvasti arvomaailmaasi ja pitkän aikavälin tavoitteitasi.",
      "Tapasi hyödyntää vahvuuksiasi heijastaa myös sitä, minkälaista uraa tavoittelet ja mihin haluat vaikuttaa.",
      "On selvästi nähtävissä, miten työskentelytapasi ja periaatteesi tukevat toisiaan luoden vahvan perustan urallesi."
    ]
  }
};

// ========== STRENGTHS & SUBDIMENSIONS (Deeper dive) ==========

const STRENGTH_NARRATIVES = {
  YLA: {
    with_subdimensions: [
      "Kun katsoo tarkemmin, mitä vastauksistasi nousee esiin, {strengths} erottuvat erityisen vahvoina alueina. Olet selvästi ihminen, joka {subdim_quality}. Nämä taidot täydentävät toisiaan hienosti ja avaavat ovia monenlaisiin ammatteihin, joissa pääset hyödyntämään juuri näitä vahvuuksia. Mielenkiintoista on, miten nämä vahvuudet toimivat yhdessä: ne luovat sinulle ainutlaatuisen profiilin, jollaista ei ole muilla. Tämä yhdistelmä voi olla avain uraan, joka tuntuu todella omalta.",
      "Erityisen vahvasti profiilissasi korostuvat {strengths}. Kun yhdistät nämä vahvuudet siihen, että {subdim_quality}, sinulla on todella hyvät edellytykset menestyä monenlaisissa tehtävissä. Nämä ovat taitoja, joita arvostetaan yhä enemmän työelämässä. Erityisen arvokasta on, että sinulla on useampi vahvuus, jotka tukevat toisiaan. Harvalla on näin selkeä ja monipuolinen vahvuusprofiili jo tässä vaiheessa.",
      "Vahvuutesi {strengths} nousevat selvästi esiin. On hienoa, että {subdim_quality}. Tämä yhdistelmä on todella arvokas ja antaa sinulle hyvät mahdollisuudet monilla eri aloilla. Kannattaa ehdottomasti hyödyntää näitä vahvuuksia tulevaisuuden valinnoissa. Ne ovat kuin työkalupakki, joka auttaa sinua ratkaisemaan erilaisia haasteita ja menestymään erilaisissa tehtävissä. Pidä nämä vahvuudet mielessäsi, kun mietit, mikä sinua kiinnostaa."
    ],
    without_subdimensions: [
      "Vahvuutesi {strengths} nousevat selvästi esiin vastauksistasi. Nämä taidot auttavat sinua monissa erilaisissa tehtävissä ja avaavat ovia monenlaisiin ammatteihin tulevaisuudessa. Ne ovat perusta, jolle voit rakentaa monipuolisen osaamisen. Kun tiedostat nämä vahvuudet, voit valita sellaisia polkuja, joissa pääset käyttämään niitä täysimääräisesti. Tämä itsetuntemus on arvokasta myös myöhemmin elämässä.",
      "Profiilissasi korostuvat erityisesti {strengths}. Nämä ovat taitoja, joita arvostetaan yhä enemmän, ja sinulla on hienot edellytykset kehittää niitä edelleen. Ne eivät ole sattumaa, vaan heijastavat sitä, kuka olet ja mikä sinua kiinnostaa. Kun jatkat näiden vahvuuksien kehittämistä, ne tulevat kantamaan sinua pitkälle elämässä ja uralla.",
      "Erityisen vahvasti esiin nousevat {strengths}. On hienoa, että nämä vahvuudet ovat jo nyt selkeästi tunnistettavissa. Ne tulevat olemaan tärkeitä tulevaisuudessa, sillä ne ovat ominaisuuksia, joita työelämässä arvostetaan. Pidä näistä vahvuuksista kiinni ja etsi tapoja kehittää niitä edelleen. Ne ovat osa sitä, mikä tekee sinusta ainutlaatuisen."
    ]
  },
  TASO2: {
    with_subdimensions: [
      "Kun tarkastellaan tarkemmin profiiliasi, {strengths} nousevat vahvimmin esiin. Sinulla on selvästi kyky {subdim_quality}, mikä erottaa sinut positiivisesti muista. Nämä vahvuudet antavat sinulle kilpailuetua sekä jatko-opinnoissa että tulevassa työelämässä, ja niiden avulla voit rakentaa vahvan uran valitsemallesi alalle. Erityisen mielenkiintoista on, miten nämä vahvuudet täydentävät toisiaan ja luovat sinulle ainutlaatuisen osaamisprofiilin. Tämä yhdistelmä on jotain, mitä työnantajat arvostavat.",
      "Erityisen vahvoina alueina profiilissasi korostuvat {strengths}. Se, että {subdim_quality}, tekee sinusta arvokkaan työntekijän monilla aloilla. Nämä ovat juuri niitä ominaisuuksia, joita työnantajat etsivät, ja kannattaa nostaa niitä esiin myös hakemuksissa ja haastatteluissa. Kun osaat kertoa näistä vahvuuksistasi konkreettisten esimerkkien kautta, erotut eduksesi muista hakijoista. Nämä vahvuudet ovat sinun henkilökohtainen brändisi.",
      "Vahvuutesi {strengths} erottuvat selvästi. Kykysi {subdim_quality} on erityisen arvokasta, sillä se yhdistää useita tärkeitä osa-alueita. Nämä vahvuudet antavat sinulle hyvän pohjan monille urapoluillle ja auttavat sinua menestymään valitsemallasi alalla. On harvinaista, että joku tässä vaiheessa elämää on jo kehittänyt näin vahvan profiilin. Tämä on merkki siitä, että olet oikealla tiellä."
    ],
    without_subdimensions: [
      "Profiilissasi korostuvat vahvimmin {strengths}. Nämä ovat tärkeitä vahvuuksia, jotka antavat sinulle hyvän pohjan monille urapoluillle ja auttavat erottumaan hakijajoukosta. Ne ovat ominaisuuksia, jotka kantavat pitkälle työelämässä ja auttavat sinua menestymään erilaisissa tehtävissä. Pidä näistä vahvuuksista kiinni ja kehitä niitä edelleen. Ne ovat arvokkaita aarteita.",
      "Vahvuutesi {strengths} nousevat selvästi esiin. Nämä ovat juuri niitä ominaisuuksia, joita työelämässä arvostetaan, ja kannattaa nostaa niitä esiin myös hakemuksissa. Kun tiedostat nämä vahvuudet, voit hakeutua sellaisiin tehtäviin ja ympäristöihin, joissa pääset hyödyntämään niitä täysimääräisesti. Tämä itsetuntemus on avain onnistumiseen.",
      "Erityisesti {strengths} erottuvat vahvuuksina. Nämä taidot tulevat olemaan tärkeitä sekä jatko-opinnoissa että tulevassa työelämässä. Ne ovat ominaisuuksia, joiden avulla voit erottua muista ja rakentaa menestyksekkään uran. Älä aliarvioi näiden vahvuuksien merkitystä. Ne ovat osa sitä, kuka olet."
    ]
  },
  NUORI: {
    with_subdimensions: [
      "Kun analysoidaan profiiliasi syvällisemmin, {strengths} nousevat selvästi vahvimmiksi alueiksi. Kykysi {subdim_quality} on erityisen arvokas työmarkkinoilla ja antaa sinulle merkittävän kilpailuedun. Nämä vahvuudet yhdistettynä ammatilliseen motivaatioosi luovat vankan perustan menestykselle ja mahdollistavat merkittävän urakehityksen valitsemallasi alalla. Tämä on harvinainen yhdistelmä, joka erottaa sinut eduksesi ja avaa ovia korkeisiin asemiin ja vastuullisiin tehtäviin.",
      "Erityisen vahvoina alueina profiilissasi korostuvat {strengths}. Se, että {subdim_quality}, tekee sinusta erittäin arvokaan työntekijän ja asiantuntijan. Työnantajat arvostavat ja etsivät aktiivisesti juuri näitä ominaisuuksia, ja niiden avulla voit rakentaa merkittävän ja vaikuttavan uran. Nämä vahvuudet ovat jo nyt näkyvissä, ja niiden tietoinen kehittäminen vie sinut pitkälle. Olet selvästi investoinut itsesi kehittämiseen.",
      "Vahvuutesi {strengths} erottuvat selvästi ja vahvasti. Kykysi {subdim_quality} on harvinainen ja arvokas yhdistelmä, joka avaa ovia vaativiin ja palkitseviin tehtäviin. Nämä vahvuudet antavat sinulle mahdollisuuden kehittyä asiantuntijaksi omalla alallasi ja vaikuttaa laajemmin ympärilläsi. Tämänkaltainen profiili ei synny sattumalta, vaan se on merkki siitä, että olet tehnyt tietoisia valintoja itsesi kehittämiseksi."
    ],
    without_subdimensions: [
      "Profiilissasi korostuvat vahvimmin {strengths}. Nämä ovat arvostettuja vahvuuksia työmarkkinoilla ja antavat sinulle kilpailuetua urapolulla. Ne ovat ominaisuuksia, joita organisaatiot etsivät ja joiden avulla voit edetä urallasi merkittäviin tehtäviin. Kun osaat viestiä näistä vahvuuksistasi tehokkaasti, avaat ovia uusiin mahdollisuuksiin.",
      "Vahvuutesi {strengths} nousevat selvästi esiin. Nämä ovat juuri niitä ominaisuuksia, joita työnantajat arvostavat ja etsivät, ja niiden avulla voit rakentaa menestyksekkään uran. Ne eivät ole itsestäänselvyyksiä, vaan vahvuuksia, jotka olet kehittänyt ja jotka tekevät sinusta arvokkaan asiantuntijan. Hyödynnä niitä tietoisesti.",
      "Erityisesti {strengths} erottuvat vahvuuksina. Nämä taidot ovat keskeisiä nykyisillä työmarkkinoilla ja auttavat sinua menestymään valitsemallasi alalla. Ne ovat osa ammatillista identiteettiäsi ja antavat sinulle pohjan, jolle voit rakentaa jatkuvasti kehittyvän uran. Älä epäröi tuoda niitä esiin."
    ]
  }
};

// ========== FUTURE-ORIENTED ADVICE (Action steps) ==========

const FUTURE_ADVICE = {
  YLA: [
    "Yläkoulu on aikaa, jolloin voit kokeilla monenlaista ja löytää omat juttusi. Kannattaa valita harrastuksia ja valinnaisia aineita, jotka kiinnostavat sinua aidosti. Myös kaverit voivat auttaa löytämään uusia kiinnostuksen kohteita. Tulevaisuudessa voit kehittää näitä vahvuuksia edelleen, kun valitset jatko-opinnot lukioon tai ammattikouluun. Älä rajoita itseäsi liikaa, vaan kokeile rohkeasti erilaisia asioita.",
    "Nyt yläkoulussa sinulla on mahtava tilaisuus testata eri asioita harrastusten ja koulun kautta. Näiden vahvuuksien pohjalta voit rakentaa mielenkiintoisen polun kohti uraa, joka tuntuu aidosti omalta. Kannattaa jutella myös kavereiden ja opettajien kanssa siitä, mikä sinua kiinnostaa. Ei ole yhtä oikeaa tietä, vaan monia hyviä vaihtoehtoja jatko-opiskeluun ja tulevaisuuteen.",
    "On hienoa, että olet jo yläkoulussa tutustumassa erilaisiin ammattimahdollisuuksiin ja omiin vahvuuksiisi. Koulu ja harrastukset antavat sinulle mahdollisuuksia kokeilla erilaisia asioita. Muista, että opinto- ja uravalinnat eivät ole lopullisia päätöksiä. Voit aina suunnata uudelleen lukion tai ammattikoulun jälkeen. Tärkeintä on, että opit tuntemaan itsesi ja omat vahvuutesi."
  ],
  TASO2: [
    "Kun suunnittelet jatko-opintoja ja tulevaa urapolkua, kannattaa etsiä paikkoja ja aloja, joissa pääset hyödyntämään näitä vahvuuksia täysimääräisesti. Omien vahvuuksien tunnistaminen on tärkeä osa urasuunnittelua ja auttaa sinua tekemään oikeita valintoja. Pohdi, missä ympäristössä nämä vahvuutesi pääsevät parhaiten esiin, ja hae sinne määrätietoisesti. Sinulla on jo nyt selkeä käsitys siitä, missä voit loistaa.",
    "Näitä vahvuuksia voit hyödyntää sekä jatko-opinnoissa että ensimmäisissä työtehtävissäsi. Kun tiedät vahvuutesi, voit suunnata hakemuksesi ja opiskelusi niihin aloihin, joissa pääset loistamaan ja kehittymään. Älä pelkää tuoda vahvuuksiasi esiin. Ne ovat sinun kilpailuetusi, ja niiden avulla erotut muista hakijoista. Työnantajat arvostavat hakijoita, jotka tuntevat itsensä.",
    "Kannattaa nostaa nämä vahvuudet esiin myös hakemuksissa, CV:ssä ja haastatteluissa. Ne ovat juuri niitä ominaisuuksia, joita oppilaitokset ja työnantajat etsivät, ja niiden tiedostaminen antaa sinulle selvän edun. Mieti konkreettisia esimerkkejä tilanteista, joissa olet käyttänyt näitä vahvuuksia. Tarinat jäävät mieleen paremmin kuin pelkät luettelot."
  ],
  NUORI: [
    "Nämä vahvuudet voivat antaa uusia näkökulmia siihen, millaisissa ympäristöissä saattaisit viihtyä. Ne eivät rajoita valintojasi, vaan avaavat mahdollisuuksia pohtia erilaisia tehtäviä ja organisaatioita. Kun tiedostat omat vahvuutesi, voit hakeutua sellaisiin rooleihin, joissa pääset hyödyntämään niitä täysimääräisesti. Tämä lisää sekä työtyytyväisyyttä että menestystä urallasi.",
    "Näiden vahvuuksien tiedostaminen voi auttaa sinua pohtimaan erilaisia urapolkuja. Kun tunnistat omat vahvuutesi, voit miettiä, millaisissa ympäristöissä ne saattaisivat tulla hyödyksi. Voit myös pohtia, miten voisit kehittää näitä vahvuuksia edelleen ja laajentaa osaamisaluettasi niiden pohjalta. Vahvuudet eivät ole staattisia, vaan ne kehittyvät, kun käytät niitä.",
    "Nämä vahvuudet voivat olla hyödyksi työhakemuksissa, verkostoitumisessa ja urakehityksessä. Ne ovat ominaisuuksia, joita monet organisaatiot arvostavat, ja niiden avulla voit pohtia erilaisia uramahdollisuuksia. Kun osaat kertoa vahvuuksistasi vakuuttavasti, avaat ovia uusiin mahdollisuuksiin ja rakennat ammatillista identiteettiäsi vahvemmaksi."
  ]
};

// ========== CLOSING WITH RECOMMENDATIONS (Smooth transition) ==========

const RECOMMENDATION_INTROS = {
  YLA: [
    "Vastaustesi perusteella profiilistasi nousee esiin seuraavia vahvuuksia ja kiinnostuksia. Alla näet muutamia esimerkkejä ammateista, jotka voivat sopia yhteen profiilisi kanssa. Nämä ovat esimerkkejä — ei listoja ammateista, joita sinun tulisi hakea.",
    "Valitsimme muutamia esimerkkejä ammateista, jotka voivat sopia yhteen profiilisi kanssa. Nämä voivat antaa uusia näkökulmia siihen, millaisissa ympäristöissä saattaisit viihtyä. Ne eivät rajoita valintojasi.",
    "Alla näet ammattiehdotuksia, jotka perustuvat vastauksiin. Ne on valittu sen mukaan, missä vahvuutesi saattaisivat tulla hyödyksi. Pidä nämä keskustelun avaavina ideoina. Mikään yksittäinen polku ei ole 'oikea' tai 'väärä'. Tarkoitus on avata uusia näkökulmia."
  ],
  TASO2: [
    "Vastaustesi perusteella profiilistasi nousee esiin seuraavia vahvuuksia ja kiinnostuksia. Alla näet ammattiehdotuksia, jotka voivat sopia yhteen profiilisi kanssa. Nämä ovat esimerkkejä — ei listoja ammateista, joita sinun tulisi hakea. Ne voivat auttaa hahmottamaan, millaisilla aloilla vahvuutesi saattaisivat tulla hyödyksi.",
    "Valitsimme muutamia esimerkkejä ammateista, jotka voivat sopia yhteen profiilisi kanssa. Ne voivat antaa uusia näkökulmia siihen, millaisissa ympäristöissä saattaisit viihtyä. Ne eivät rajoita valintojasi. Mikään yksittäinen polku ei ole 'oikea' tai 'väärä'. Tarkoitus on avata uusia näkökulmia.",
    "Alla näet ammattiehdotuksia, jotka perustuvat vastauksiin. Ne voivat olla keskustelun avaavia ideoita urasuunnittelun ja jatko-opintojen pohtimiseen. Tutki myös muita mielenkiintoisia vaihtoehtoja. Polkuja on monia, ja voit pohtia erilaisia yhdistelmiä."
  ],
  NUORI: [
    "Vastaustesi perusteella profiilistasi nousee esiin seuraavia vahvuuksia ja kiinnostuksia. Alla näet muutamia esimerkkejä ammateista, jotka voivat sopia yhteen profiilisi kanssa. Nämä ovat esimerkkejä — ei listoja ammateista, joita sinun tulisi hakea. Ne voivat antaa uusia näkökulmia siihen, millaisissa ympäristöissä saattaisit viihtyä.",
    "Valitsimme muutamia esimerkkejä ammateista, jotka voivat sopia yhteen profiilisi kanssa. Ne voivat olla keskustelun avaavia ideoita urasuunnittelun pohtimiseen. Ne eivät rajoita valintojasi. Ne voivat auttaa hahmottamaan, millaisilla poluilla vahvuutesi saattaisivat tulla hyödyksi.",
    "Alla näet ammattiehdotuksia, jotka perustuvat vastauksiin. Ne voivat tarjota näkökulmia uravalinnan pohtimiseen. Käytä niitä keskustelun avaavina ideoina ja tutki myös muita kiinnostavia mahdollisuuksia. Mikään yksittäinen polku ei ole 'oikea' tai 'väärä'. Tarkoitus on avata uusia näkökulmia."
  ]
};

// ========== SUBDIMENSION QUALITY DESCRIPTIONS ==========

const SUBDIMENSION_QUALITIES = {
  // Teamwork
  teamwork_high: {
    YLA: "osaat työskennellä hyvin muiden kanssa ja tuot positiivista energiaa ryhmään",
    TASO2: "osaat toimia tehokkaasti tiimissä ja edistää yhteisiä tavoitteita",
    NUORI: "osaat rakentaa tehokkaita tiimejä ja edistää yhteistyötä organisaatiossa"
  },
  // Leadership
  leadership_high: {
    YLA: "otat luontevasti vastuuta ja rohkaiset muita toimimaan",
    TASO2: "osaat ottaa vastuuta projekteista ja ohjata muita kohti tavoitteita",
    NUORI: "osaat johtaa muita, rakentaa visiota ja viedä muutoksia läpi"
  },
  // Problem solving
  problem_solving_high: {
    YLA: "nautit ongelmien ratkaisemisesta ja uusien ratkaisujen keksimisestä",
    TASO2: "osaat analysoida haasteita ja kehittää käytännöllisiä ratkaisuja",
    NUORI: "osaat ratkaista monimutkaisia ongelmia ja kehittää innovatiivisia lähestymistapoja"
  },
  // Technology
  technology_high: {
    YLA: "olet kiinnostunut teknologiasta ja digitaalisista ratkaisuista",
    TASO2: "osaat hyödyntää teknologiaa ja digitaalisia työkaluja tehokkaasti",
    NUORI: "osaat hyödyntää teknologiaa strategisesti ja ymmärrät digitaalisen muutoksen mahdollisuudet"
  },
  // Creativity
  creativity_high: {
    YLA: "pidät luovasta ajattelusta ja uusien ideoiden kehittämisestä",
    TASO2: "osaat tuottaa luovia ratkaisuja ja ajatella epätavallisista näkökulmista",
    NUORI: "osaat yhdistää luovuuden strategiseen ajatteluun ja innovoida rohkeasti"
  },
  // People skills
  people_skills_high: {
    YLA: "osaat olla vuorovaikutuksessa muiden kanssa ja välität ihmisistä",
    TASO2: "osaat lukea tilanteita, kommunikoida tehokkaasti ja rakentaa suhteita",
    NUORI: "osaat johtaa ihmisiä, rakentaa verkostoja ja vaikuttaa positiivisesti organisaatiokulttuuriin"
  },
  // Communication/Writing
  writing_high: {
    YLA: "osaat ilmaista ajatuksiasi selkeästi ja ymmärrettävästi",
    TASO2: "osaat kommunikoida tehokkaasti ja tuottaa selkeää sisältöä",
    NUORI: "osaat viestiä strategisesti ja tuottaa vaikuttavaa sisältöä eri yleisöille"
  },
  // Default for multiple or unknown
  multiple_high: {
    YLA: "yhdistät useita tärkeitä taitoja ja osaat soveltaa niitä käytännössä",
    TASO2: "yhdistät useita vahvuuksia tavalla, joka tekee sinusta monipuolisen osaajan",
    NUORI: "yhdistät useita vahvuuksia strategisesti tavalla, joka tekee sinusta arvokaan asiantuntijan"
  }
};

// ========== MAIN ESSAY GENERATOR ==========

export function generatePersonalizedAnalysis(
  userProfile: UserProfile,
  cohort: Cohort
): string {
  const { dimensionScores, detailedScores, topStrengths } = userProfile;
  
  // Get top dimensions
  const topDims = getTopDimensions(dimensionScores);
  const [primaryDim, secondaryDim] = topDims;
  
  // Determine score levels
  const primaryLevel = getScoreLevel(primaryDim.score);
  const secondaryLevel = getScoreLevel(secondaryDim.score);
  
  // Build essay sections
  const sections: string[] = [];
  
  // 1. OPENING (150-200 chars) - Sets tone & validates user
  const openingKey = `${primaryDim.dimension}_${primaryLevel}` as keyof typeof ESSAY_OPENINGS[typeof cohort];
  const openings = ESSAY_OPENINGS[cohort][openingKey];
  if (openings && openings.length > 0) {
    const opening = openings[Math.floor(Math.random() * openings.length)];
    sections.push(opening);
  }
  
  // 2. NARRATIVE CONNECTOR (100-150 chars) - Links dimensions
  const connectorKey = `${primaryDim.dimension}_to_${secondaryDim.dimension}` as keyof typeof NARRATIVE_CONNECTORS[typeof cohort];
  const connectors = NARRATIVE_CONNECTORS[cohort][connectorKey];
  if (connectors && connectors.length > 0) {
    const connector = connectors[Math.floor(Math.random() * connectors.length)];
    
    // Add secondary dimension description
    const secondaryKey = `${secondaryDim.dimension}_${secondaryLevel}` as keyof typeof ESSAY_OPENINGS[typeof cohort];
    const secondaryDescs = ESSAY_OPENINGS[cohort][secondaryKey];
    if (secondaryDescs && secondaryDescs.length > 0) {
      const secondaryDesc = secondaryDescs[Math.floor(Math.random() * secondaryDescs.length)];
      sections.push(`${connector} ${secondaryDesc}`);
    }
  }
  
  // 3. STRENGTHS & SUBDIMENSIONS (300-400 chars) - Deep dive into what makes them unique
  if (topStrengths && topStrengths.length > 0 && detailedScores) {
    const strengthsText = topStrengths.slice(0, 2).join(' ja ');
    
    // Get top subdimensions for quality description
    const topSubs = [
      ...getTopSubdimensions(detailedScores!, 'interests', 2),
      ...getTopSubdimensions(detailedScores!, 'workstyle', 2)
    ];
    
    let subdimQuality = '';
    if (topSubs.length > 0) {
      const subKey = topSubs.length === 1 
        ? `${topSubs[0]}_high` as keyof typeof SUBDIMENSION_QUALITIES
        : 'multiple_high';
      const quality = SUBDIMENSION_QUALITIES[subKey];
      if (quality) {
        subdimQuality = quality[cohort];
      }
    }
    
    const hasSubdims = subdimQuality.length > 0;
    const narrativeType = hasSubdims ? 'with_subdimensions' : 'without_subdimensions';
    const narratives = STRENGTH_NARRATIVES[cohort][narrativeType];
    
    if (narratives && narratives.length > 0) {
      let narrative = narratives[Math.floor(Math.random() * narratives.length)];
      narrative = narrative.replace('{strengths}', strengthsText.toLowerCase());
      if (hasSubdims) {
        narrative = narrative.replace('{subdim_quality}', subdimQuality);
      }
      sections.push(narrative);
    }
  }
  
  // 4. FUTURE ADVICE (150-200 chars) - Action steps
  const advices = FUTURE_ADVICE[cohort];
  if (advices && advices.length > 0) {
    const advice = advices[Math.floor(Math.random() * advices.length)];
    sections.push(advice);
  }
  
  // 5. TRANSITION TO RECOMMENDATIONS (150-200 chars) - Smooth closing with disclaimer
  const intros = RECOMMENDATION_INTROS[cohort];
  if (intros && intros.length > 0) {
    const intro = intros[Math.floor(Math.random() * intros.length)];
    sections.push(intro);
  }
  
  // Create 2-3 paragraph structure for better readability
  // Group sections into logical paragraphs
  const paragraphs: string[] = [];
  
  if (sections.length >= 3) {
    // Paragraph 1: Opening + connector (validation & traits)
    paragraphs.push(sections.slice(0, 2).join(' '));
    
    // Paragraph 2: Strengths (deep dive)
    if (sections[2]) {
      paragraphs.push(sections[2]);
    }
    
    // Paragraph 3: Future advice + transition (action & recommendations)
    paragraphs.push(sections.slice(3).join(' '));
  } else {
    // Fallback: just use all sections
    paragraphs.push(...sections);
  }
  
  // Join paragraphs with double line breaks for clean separation
  return paragraphs.join('\n\n');
}
