"use strict";
/**
 * PERSONALIZED MINI-ESSAY GENERATOR
 * Creates flowing, narrative-style analysis (900-1000 characters)
 * Makes users feel understood through cohesive storytelling
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePersonalizedAnalysis = generatePersonalizedAnalysis;
// ========== HELPER FUNCTIONS ==========
function getTopDimensions(scores) {
    return Object.entries(scores)
        .map(function (_a) {
        var dimension = _a[0], score = _a[1];
        return ({ dimension: dimension, score: score });
    })
        .sort(function (a, b) { return b.score - a.score; });
}
function getScoreLevel(score) {
    if (score >= 0.7)
        return 'high';
    if (score >= 0.4)
        return 'medium';
    return 'low';
}
function getTopSubdimensions(detailedScores, dimension, limit) {
    if (limit === void 0) { limit = 2; }
    var scores = detailedScores[dimension];
    if (!scores || typeof scores !== 'object')
        return [];
    return Object.entries(scores)
        .filter(function (_a) {
        var score = _a[1];
        return typeof score === 'number' && score > 0.5;
    })
        .sort(function (a, b) { return b[1] - a[1]; })
        .slice(0, limit)
        .map(function (_a) {
        var key = _a[0];
        return key;
    });
}
// ========== ESSAY OPENING (Sets the tone & validates user) ==========
var ESSAY_OPENINGS = {
    YLA: {
        interests_high: [
            "Vastauksistasi huomaa heti, että olet utelias ja innokas oppimaan uusia asioita. Tämä on hieno lähtökohta tulevaisuutta ajatellen, sillä maailma tarjoaa loputtomasti mahdollisuuksia niille, jotka haluavat tutkia ja kokeilla.",
            "Sinussa on vahva halu tutustua erilaisiin asioihin ja kokeilla uutta. Juuri sellainen asenne vie pitkälle. Vastauksistasi piirtyy kuva nuoresta, joka ei pelkää tarttua uusiin haasteisiin.",
            "On hienoa nähdä, kuinka monipuolisesti kiinnostuksesi jakautuvat. Tämä uteliaisuus eri asioita kohtaan on vahvuus, joka avaa monia ovia tulevaisuudessa."
        ],
        workstyle_high: [
            "Vastauksesi kertovat, että pidät käytännön tekemisestä ja siitä, että pääset heti toimintaan. Olet selvästi ihminen, joka haluaa nähdä työnsä tulokset konkreettisesti. Tämä käytännönläheinen ote on arvokas piirre.",
            "Huomaa selvästi, että nautit aktiivisesta työskentelystä ja konkreettisista tehtävistä. Olet energinen tekijä, joka varmasti tulee viihtymään töissä, joissa pääsee liikkeelle ja tekemään asioita oikeasti.",
            "Vastauksistasi välittyy, että olet toiminnallinen ja käytännöllinen. Pidät siitä, kun asiat etenevät ja näet tuloksia. Tämä on juuri sellainen asenne, jota työelämässä arvostetaan."
        ],
        values_high: [
            "Vastauksistasi huomaa, että sinulle on tärkeää tehdä asioita, joilla on merkitystä. On hienoa, että jo nuorena mietit, minkälainen työ tuntuisi omalta ja vastaisi arvojasi. Tämä on viisautta.",
            "Sinulle on selvästi tärkeää, että tekemäsi asiat tuntuvat oikeilta ja merkityksellisiltä. Tämä arvomaailma ohjaa sinua kohti uravalintoja, jotka tulevat varmasti tuntumaan aidosti omilta.",
            "Vastauksistasi välittyy, että haluat tehdä asioita, jotka vastaavat omia arvojasi. Tämä kyky kuunnella itseään on tärkeä taito, joka auttaa sinua löytämään oman polkusi."
        ]
    },
    TASO2: {
        interests_high: [
            "Vastauksistasi näkyy selkeä suunta ja vahva motivaatio kehittyä. Tämä tavoitteellisuus yhdistettynä kiinnostukseesi eri aloja kohtaan luo hyvän pohjan tulevaisuuden urasuunnittelulle.",
            "On hienoa nähdä, kuinka selkeästi olet jo miettinyt omia kiinnostuksen kohteitasi. Tämä itsensä tunteminen on arvokas lähtökohta, kun suunnittelet jatko-opintoja ja tulevaa urapolkuasi.",
            "Vastauksistasi välittyy kypsä suhtautuminen omaan tulevaisuuteen. Sinulla on selkeä käsitys siitä, mitkä alueet kiinnostavat sinua, mikä helpottaa merkittävästi tulevien valintojen tekemistä."
        ],
        workstyle_high: [
            "Vastauksesi kertovat, että sinulla on jo hyvä käsitys omasta työskentelytavastasi ja sen vahvuuksista. Tämä itsetuntemus on todella tärkeää, kun etsit paikkaa, jossa voit kehittyä ja menestyä.",
            "Huomaa, että osaat organisoida tehtäviä ja työskennellä tavoitteellisesti. Nämä ovat taitoja, joita tarvitaan sekä opinnoissa että työelämässä, ja sinulla näyttää olevan niistä jo hyvä pohja.",
            "Vastauksistasi välittyy järjestelmällinen ja tavoitteellinen ote. Tiedät, miten työskentelet parhaiten, ja tämä tieto auttaa sinua valitsemaan sopivan oppimisympäristön ja työpaikan."
        ],
        values_high: [
            "Vastauksistasi välittyy vahva arvomaailma, joka ohjaa sinua kohti uravalintoja, jotka tuntuvat oikeilta. On tärkeää, että etsit uraa, joka on linjassa omien periaatteidesi kanssa. Tämä tuo pitkäaikaista työtyytyväisyyttä.",
            "Sinulle on selvästi tärkeää, että tuleva urasi vastaa arvojasi ja periaatteitasi. Tämä tietoinen suhtautuminen urasuunnitteluun auttaa sinua tekemään valintoja, joita et tule katumaan.",
            "Vastauksistasi huomaa, että mietit työn merkityksellisyyttä ja sen yhteyttä omiin arvoihisi. Tämä pohdiskeleva ote on merkki kypsyydestä ja auttaa sinua rakentamaan uran, joka tuntuu aidosti omalta."
        ]
    },
    NUORI: {
        interests_high: [
            "Vastauksistasi välittyy selkeä ammatillinen suunta ja vahva motivaatio kehittää osaamistasi. Tämä tietoisuus omista kiinnostuksen kohteista on arvokas lähtökohta uran rakentamiselle ja antaa sinulle selkeän kilpailuedun työmarkkinoilla.",
            "On hienoa nähdä, kuinka hyvin tunnet omat kiinnostuksen kohteesi ja osaamisalueesi. Tämä itsetuntemus yhdistettynä motivaatioosi kehittyä luo vahvan perustan menestykselle valitsemallasi alalla.",
            "Vastauksistasi huomaa, että sinulla on selkeä visio siitä, mihin suuntaan haluat kehittyä. Tämä tavoitteellisuus ja ammatillinen suuntautuminen ovat tärkeitä tekijöitä uran rakentamisessa ja antavat sinulle vahvan lähtökohdan."
        ],
        workstyle_high: [
            "Vastauksesi osoittavat, että sinulla on vahva ymmärrys omasta työskentelytavastasi ja sen vahvuuksista. Tämä itsetuntemus on keskeistä työelämässä menestymiselle. Tiedät, missä ympäristössä ja millaisissa tehtävissä loistat parhaiten.",
            "Huomaa selvästi, että osaat hyödyntää vahvuuksiasi tehokkaasti ja työskennellä tavoitteellisesti. Nämä ovat ominaisuuksia, joita työnantajat arvostavat erityisesti, sillä ne kertovat kyvystäsi tuottaa tuloksia ja kehittää toimintaa.",
            "Vastauksistasi välittyy kypsä ja ammattimainen ote työhön. Tiedostat omat vahvuutesi ja osaat soveltaa niitä käytäntöön. Tämä reflektiivinen kyky on merkki korkean tason ammattilaisuudesta."
        ],
        values_high: [
            "Vastauksistasi välittyy selkeä ja harkittu arvomaailma, joka ohjaa uravalintojasi. On tärkeää, että etsit uraa, joka on linjassa periaatteidesi kanssa. Tämä on avain pitkäaikaiseen työtyytyväisyyteen ja motivaatioon.",
            "Sinulle on selvästi tärkeää, että urasi vastaa henkilökohtaisia arvojasi ja mahdollistaa niiden toteutumisen käytännössä. Tämä arvolähtöinen lähestymistapa uraan luo vahvan perustan merkitykselliselle ja palkitsevalle työuralle.",
            "Vastauksistasi huomaa, että mietit syvällisesti työn merkitystä ja sen yhteyttä omiin periaatteisiisi. Tämä tietoinen suhtautuminen on merkki kypsyydestä ja auttaa sinua rakentamaan uran, joka tuo todellista tyydytystä."
        ]
    }
};
// ========== CONNECTING NARRATIVES (Links dimensions together) ==========
var NARRATIVE_CONNECTORS = {
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
var STRENGTH_NARRATIVES = {
    YLA: {
        with_subdimensions: [
            "Kun katsoo tarkemmin, mitä vastauksistasi nousee esiin, {strengths} erottuvat erityisen vahvoina alueina. Olet selvästi ihminen, joka {subdim_quality}. Nämä taidot täydentävät toisiaan hienosti ja avaavat ovia monenlaisiin ammatteihin, joissa pääset hyödyntämään juuri näitä vahvuuksia.",
            "Erityisen vahvasti profiilissasi korostuvat {strengths}. Kun yhdistät nämä vahvuudet siihen, että {subdim_quality}, sinulla on todella hyvät edellytykset menestyä monenlaisissa tehtävissä. Nämä ovat taitoja, joita arvostetaan yhä enemmän työelämässä.",
            "Vahvuutesi {strengths} nousevat selvästi esiin. On hienoa, että {subdim_quality}. Tämä yhdistelmä on todella arvokas ja antaa sinulle hyvät mahdollisuudet monilla eri aloilla. Kannattaa ehdottomasti hyödyntää näitä vahvuuksia tulevaisuuden valinnoissa."
        ],
        without_subdimensions: [
            "Vahvuutesi {strengths} nousevat selvästi esiin vastauksistasi. Nämä taidot auttavat sinua monissa erilaisissa tehtävissä ja avaavat ovia monenlaisiin ammatteihin tulevaisuudessa.",
            "Profiilissasi korostuvat erityisesti {strengths}. Nämä ovat taitoja, joita arvostetaan yhä enemmän, ja sinulla on hienot edellytykset kehittää niitä edelleen.",
            "Erityisen vahvasti esiin nousevat {strengths}. On hienoa, että nämä vahvuudet ovat jo nyt selkeästi tunnistettavissa. Ne tulevat olemaan tärkeitä tulevaisuudessa."
        ]
    },
    TASO2: {
        with_subdimensions: [
            "Kun tarkastellaan tarkemmin profiiliasi, {strengths} nousevat vahvimmin esiin. Sinulla on selvästi kyky {subdim_quality}, mikä erottaa sinut positiivisesti muista. Nämä vahvuudet antavat sinulle kilpailuetua sekä jatko-opinnoissa että tulevassa työelämässä, ja niiden avulla voit rakentaa vahvan uran valitsemallesi alalle.",
            "Erityisen vahvoina alueina profiilissasi korostuvat {strengths}. Se, että {subdim_quality}, tekee sinusta arvokkaan työntekijän monilla aloilla. Nämä ovat juuri niitä ominaisuuksia, joita työnantajat etsivät, ja kannattaa nostaa niitä esiin myös hakemuksissa ja haastatteluissa.",
            "Vahvuutesi {strengths} erottuvat selvästi. Kykysi {subdim_quality} on erityisen arvokasta, sillä se yhdistää useita tärkeitä osa-alueita. Nämä vahvuudet antavat sinulle hyvän pohjan monille urapoluillle ja auttavat sinua menestymään valitsemallasi alalla."
        ],
        without_subdimensions: [
            "Profiilissasi korostuvat vahvimmin {strengths}. Nämä ovat tärkeitä vahvuuksia, jotka antavat sinulle hyvän pohjan monille urapoluillle ja auttavat erottumaan hakijajoukosta.",
            "Vahvuutesi {strengths} nousevat selvästi esiin. Nämä ovat juuri niitä ominaisuuksia, joita työelämässä arvostetaan, ja kannattaa nostaa niitä esiin myös hakemuksissa.",
            "Erityisesti {strengths} erottuvat vahvuuksina. Nämä taidot tulevat olemaan tärkeitä sekä jatko-opinnoissa että tulevassa työelämässä."
        ]
    },
    NUORI: {
        with_subdimensions: [
            "Kun analysoidaan profiiliasi syvällisemmin, {strengths} nousevat selvästi vahvimmiksi alueiksi. Kykysi {subdim_quality} on erityisen arvokas työmarkkinoilla ja antaa sinulle merkittävän kilpailuedun. Nämä vahvuudet yhdistettynä ammatilliseen motivaatioosi luovat vankan perustan menestykselle ja mahdollistavat merkittävän urakehityksen valitsemallasi alalla.",
            "Erityisen vahvoina alueina profiilissasi korostuvat {strengths}. Se, että {subdim_quality}, tekee sinusta erittäin arvokaan työntekijän ja asiantuntijan. Työnantajat arvostavat ja etsivät aktiivisesti juuri näitä ominaisuuksia, ja niiden avulla voit rakentaa merkittävän ja vaikuttavan uran.",
            "Vahvuutesi {strengths} erottuvat selvästi ja vahvasti. Kykysi {subdim_quality} on harvinainen ja arvokas yhdistelmä, joka avaa ovia vaativiin ja palkitseviin tehtäviin. Nämä vahvuudet antavat sinulle mahdollisuuden kehittyä asiantuntijaksi omalla alallasi ja vaikuttaa laajemmin."
        ],
        without_subdimensions: [
            "Profiilissasi korostuvat vahvimmin {strengths}. Nämä ovat arvostettuja vahvuuksia työmarkkinoilla ja antavat sinulle kilpailuetua urapolulla.",
            "Vahvuutesi {strengths} nousevat selvästi esiin. Nämä ovat juuri niitä ominaisuuksia, joita työnantajat arvostavat ja etsivät, ja niiden avulla voit rakentaa menestyksekkään uran.",
            "Erityisesti {strengths} erottuvat vahvuuksina. Nämä taidot ovat keskeisiä nykyisillä työmarkkinoilla ja auttavat sinua menestymään valitsemallasi alalla."
        ]
    }
};
// ========== FUTURE-ORIENTED ADVICE (Action steps) ==========
var FUTURE_ADVICE = {
    YLA: [
        "Kun mietit tulevaisuuden valintoja, kannattaa etsiä oppilaitoksia ja aloja, joissa pääset hyödyntämään näitä vahvuuksia. Tulevaisuudessa voit kehittää niitä entisestään valitsemalla sopivat opinnot, harrastukset ja ensimmäiset työtehtävät.",
        "Näiden vahvuuksien pohjalta voit rakentaa mielenkiintoisen urapolun, joka tuntuu aidosti omalta. Kannattaa pitää mielessä, että polkuja on monia, ja voit yhdistää kiinnostuksen kohteesi luovasti tulevaisuudessa.",
        "On hienoa, että olet jo nyt tutustumassa erilaisiin ammattimahdollisuuksiin ja omiin vahvuuksiisi. Tämä itsetuntemus auttaa sinua tekemään valintoja, jotka vievät sinua kohti uraa, joka tuntuu oikealta."
    ],
    TASO2: [
        "Kun suunnittelet jatko-opintoja ja tulevaa urapolkua, kannattaa etsiä paikkoja ja aloja, joissa pääset hyödyntämään näitä vahvuuksia täysimääräisesti. Omien vahvuuksien tunnistaminen on tärkeä osa urasuunnittelua ja auttaa sinua tekemään oikeita valintoja.",
        "Näitä vahvuuksia voit hyödyntää sekä jatko-opinnoissa että ensimmäisissä työtehtävissäsi. Kun tiedät vahvuutesi, voit suunnata hakemuksesi ja opiskelusi niihin aloihin, joissa pääset loistamaan ja kehittymään.",
        "Kannattaa nostaa nämä vahvuudet esiin myös hakemuksissa, CV:ssä ja haastatteluissa. Ne ovat juuri niitä ominaisuuksia, joita oppilaitokset ja työnantajat etsivät, ja niiden tiedostaminen antaa sinulle selvän edun."
    ],
    NUORI: [
        "Kun rakennat urapolkuasi ja teet seuraavia valintoja, kannattaa etsiä tehtäviä ja organisaatioita, joissa pääset hyödyntämään näitä vahvuuksia strategisesti. Vahvuutesi antavat sinulle kilpailuedun työmarkkinoilla ja auttavat erottumaan muista ehdokkaista positiivisella tavalla.",
        "Näiden vahvuuksien tiedostaminen auttaa sinua suuntaamaan urasi sellaisille poluille, joissa voit hyödyntää potentiaaliasi täysimääräisesti. Kun tunnistat omat vahvuutesi, voit rakentaa uraa strategisesti ja tehdä valintoja, jotka tukevat pitkän aikavälin tavoitteitasi.",
        "Kannattaa hyödyntää näitä vahvuuksia aktiivisesti työhakemuksissa, verkostoitumisessa ja urakehityksessä. Ne ovat juuri niitä ominaisuuksia, joita organisaatiot arvostavat johtotehtävissä ja asiantuntija rooleissa, ja niiden avulla voit rakentaa merkittävän uran."
    ]
};
// ========== CLOSING WITH RECOMMENDATIONS (Smooth transition) ==========
var RECOMMENDATION_INTROS = {
    YLA: [
        "Näiden vahvuuksien ja kiinnostusten pohjalta alla näet muutamia ammatteja, jotka voisivat sopia sinulle. Muista, että nämä ovat vain ideoita ja esimerkkejä. Sinä päätät oman polkusi, ja tulevaisuudessa voit yhdistää kiinnostuksen kohteesi monin eri tavoin!",
        "Olemme valinneet alla sinulle tutustuttavaksi muutamia ammatteja, jotka sopivat profiiliisi. Nämä ovat ehdotuksia, ei valmiita ratkaisuja. Tutki rohkeasti myös muita vaihtoehtoja ja anna itsellesi aikaa löytää se polku, joka tuntuu juuri sinun omalta!",
        "Alla näet ammattiehdotuksia, jotka perustuvat vastauksiin. Ne on valittu sen mukaan, missä pääsisit hyödyntämään vahvuuksiasi. Pidä nämä suuntaa-antavina ideoina. Lopullinen valinta ja päätös omasta tulevaisuudesta on aina sinun!"
    ],
    TASO2: [
        "Näiden vahvuuksien ja ominaisuuksien pohjalta alla näet ammattiehdotuksia, jotka vastaavat profiiliasi. Nämä ovat suosituksia, joita voit käyttää oman urasuunnittelusi tukena ja inspiraationa. Ne voivat auttaa hahmottamaan, millaisilla aloilla pääsisit hyödyntämään vahvuuksiasi parhaiten.",
        "Alla olevat ammatit on valittu vastaamaan profiiliasi ja vahvuuksiasi. Ne voivat olla sopiva lähtökohta oman urapolun kartoittamiseen ja jatko-opintojen suunnitteluun. Lopullinen päätös on tietenkin aina sinun, ja nämä toimivat parhaiten ideoina ja suuntaviivoina.",
        "Olemme koonneet alla ammattiehdotuksia, jotka sopivat vahvuuksiisi ja kiinnostuksen kohteisiisi. Käytä niitä urasuunnittelun tukena ja inspiraationa. Tutki myös muita mielenkiintoisia vaihtoehtoja. Polkuja on monia, ja voit löytää juuri sinulle sopivan yhdistelmän!"
    ],
    NUORI: [
        "Näiden vahvuuksien ja ammatillisen profiilisi pohjalta alla näet urasuosituksia, jotka vastaavat ominaisuuksiasi. Nämä ovat ammatteja, joissa pääsisit hyödyntämään potentiaaliasi täysimääräisesti ja rakentamaan merkityksellistä uraa. Ne toimivat lähtökohtana urapolkusi suunnittelulle, mutta lopullinen valinta on luonnollisesti aina sinun.",
        "Alla näet ammattiehdotuksia, jotka vastaavat profiiliasi ja vahvuuksiasi. Nämä ovat suosituksia urasuunnittelun ja seuraavien urasiirtojen tueksi, ei lopullisia ratkaisuja. Ne voivat auttaa hahmottamaan, millaisilla poluilla voisit hyödyntää osaamistasi parhaiten ja rakentaa uraa, joka on linjassa arvojesi kanssa.",
        "Olemme valinneet alla urasuosituksia, jotka perustuvat vahvuuksiisi ja ammatilliseen profiiliisi. Ne tarjoavat suuntaa uravalinnalle ja seuraavien askelten suunnitteluun. Käytä niitä inspiraationa ja tutki myös muita kiinnostavja mahdollisuuksia. Päätös on aina sinun käsissäsi, ja voit rakentaa uraa strategisesti omien tavoitteidesi mukaan."
    ]
};
// ========== SUBDIMENSION QUALITY DESCRIPTIONS ==========
var SUBDIMENSION_QUALITIES = {
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
function generatePersonalizedAnalysis(userProfile, cohort) {
    var dimensionScores = userProfile.dimensionScores, detailedScores = userProfile.detailedScores, topStrengths = userProfile.topStrengths;
    // Get top dimensions
    var topDims = getTopDimensions(dimensionScores);
    var primaryDim = topDims[0], secondaryDim = topDims[1];
    // Determine score levels
    var primaryLevel = getScoreLevel(primaryDim.score);
    var secondaryLevel = getScoreLevel(secondaryDim.score);
    // Build essay sections
    var sections = [];
    // 1. OPENING (150-200 chars) - Sets tone & validates user
    var openingKey = "".concat(primaryDim.dimension, "_").concat(primaryLevel);
    var openings = ESSAY_OPENINGS[cohort][openingKey];
    if (openings && openings.length > 0) {
        var opening = openings[Math.floor(Math.random() * openings.length)];
        sections.push(opening);
    }
    // 2. NARRATIVE CONNECTOR (100-150 chars) - Links dimensions
    var connectorKey = "".concat(primaryDim.dimension, "_to_").concat(secondaryDim.dimension);
    var connectors = NARRATIVE_CONNECTORS[cohort][connectorKey];
    if (connectors && connectors.length > 0) {
        var connector = connectors[Math.floor(Math.random() * connectors.length)];
        // Add secondary dimension description
        var secondaryKey = "".concat(secondaryDim.dimension, "_").concat(secondaryLevel);
        var secondaryDescs = ESSAY_OPENINGS[cohort][secondaryKey];
        if (secondaryDescs && secondaryDescs.length > 0) {
            var secondaryDesc = secondaryDescs[Math.floor(Math.random() * secondaryDescs.length)];
            sections.push("".concat(connector, " ").concat(secondaryDesc));
        }
    }
    // 3. STRENGTHS & SUBDIMENSIONS (300-400 chars) - Deep dive into what makes them unique
    if (topStrengths && topStrengths.length > 0 && detailedScores) {
        var strengthsText = topStrengths.slice(0, 2).join(' ja ');
        // Get top subdimensions for quality description
        var topSubs = __spreadArray(__spreadArray([], getTopSubdimensions(detailedScores, 'interests', 2), true), getTopSubdimensions(detailedScores, 'workstyle', 2), true);
        var subdimQuality = '';
        if (topSubs.length > 0) {
            var subKey = topSubs.length === 1
                ? "".concat(topSubs[0], "_high")
                : 'multiple_high';
            var quality = SUBDIMENSION_QUALITIES[subKey];
            if (quality) {
                subdimQuality = quality[cohort];
            }
        }
        var hasSubdims = subdimQuality.length > 0;
        var narrativeType = hasSubdims ? 'with_subdimensions' : 'without_subdimensions';
        var narratives = STRENGTH_NARRATIVES[cohort][narrativeType];
        if (narratives && narratives.length > 0) {
            var narrative = narratives[Math.floor(Math.random() * narratives.length)];
            narrative = narrative.replace('{strengths}', strengthsText.toLowerCase());
            if (hasSubdims) {
                narrative = narrative.replace('{subdim_quality}', subdimQuality);
            }
            sections.push(narrative);
        }
    }
    // 4. FUTURE ADVICE (150-200 chars) - Action steps
    var advices = FUTURE_ADVICE[cohort];
    if (advices && advices.length > 0) {
        var advice = advices[Math.floor(Math.random() * advices.length)];
        sections.push(advice);
    }
    // 5. TRANSITION TO RECOMMENDATIONS (150-200 chars) - Smooth closing with disclaimer
    var intros = RECOMMENDATION_INTROS[cohort];
    if (intros && intros.length > 0) {
        var intro = intros[Math.floor(Math.random() * intros.length)];
        sections.push(intro);
    }
    // Create 2-3 paragraph structure for better readability
    // Group sections into logical paragraphs
    var paragraphs = [];
    if (sections.length >= 3) {
        // Paragraph 1: Opening + connector (validation & traits)
        paragraphs.push(sections.slice(0, 2).join(' '));
        // Paragraph 2: Strengths (deep dive)
        if (sections[2]) {
            paragraphs.push(sections[2]);
        }
        // Paragraph 3: Future advice + transition (action & recommendations)
        paragraphs.push(sections.slice(3).join(' '));
    }
    else {
        // Fallback: just use all sections
        paragraphs.push.apply(paragraphs, sections);
    }
    // Join paragraphs with double line breaks for clean separation
    return paragraphs.join('\n\n');
}
