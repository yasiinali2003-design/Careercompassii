"use strict";
/**
 * SCORING ENGINE
 * Core algorithm for matching users to careers
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.normalizeAnswer = normalizeAnswer;
exports.computeUserVector = computeUserVector;
exports.computeCareerFit = computeCareerFit;
exports.generateReasons = generateReasons;
exports.rankCareers = rankCareers;
exports.generateUserProfile = generateUserProfile;
var types_1 = require("./types");
var dimensions_1 = require("./dimensions");
var careerVectors_1 = require("./careerVectors");
var rankingConfig_1 = require("./rankingConfig");
var careers_fi_1 = require("@/data/careers-fi");
var personalizedAnalysis_1 = require("./personalizedAnalysis");
// ========== CATEGORY-SPECIFIC SUBDIMENSION WEIGHTS ==========
/**
 * Category-specific subdimension weights to improve filtering accuracy within categories
 * Weights are applied to subdimension scores before cosine similarity calculation
 */
var CATEGORY_SUBDIMENSION_WEIGHTS = {
    auttaja: {
        interests: {
            health: 2.8, // BOOSTED: Strong healthcare signal
            people: 2.5, // BOOSTED: People-oriented work
            education: 2.2, // BOOSTED: Teaching/education
        },
        workstyle: {
            teaching: 2.5, // BOOSTED: Teaching style
            teamwork: 2.0, // BOOSTED: Collaborative work
        },
        values: {
            social_impact: 2.5, // BOOSTED: Helping motivation
            impact: 2.2, // BOOSTED: Making a difference
        },
    },
    luova: {
        interests: {
            creative: 2.8, // BOOSTED: Strong creative signal
            arts_culture: 2.5, // BOOSTED: Arts/culture interest
            writing: 2.5, // BOOSTED: Writing/content
            technology: 1.8, // Moderate boost for digital creative
        },
        workstyle: {
            independence: 2.0, // BOOSTED: Autonomous work
        },
        values: {
            entrepreneurship: 1.8, // Moderate boost
        },
    },
    johtaja: {
        workstyle: {
            leadership: 3.0, // BOOSTED: Critical for leadership roles
            organization: 2.5, // BOOSTED: Organizational skills
            planning: 2.5, // BOOSTED: Strategic planning
        },
        values: {
            advancement: 2.2, // BOOSTED: Career ambition
            financial: 2.0, // BOOSTED: Salary motivation
        },
        interests: {
            business: 2.2, // BOOSTED: Business interest
        },
    },
    innovoija: {
        interests: {
            technology: 3.0, // BOOSTED: Critical tech signal
            innovation: 2.8, // BOOSTED: Innovation mindset
            analytical: 2.5, // BOOSTED: Analytical thinking
            business: 2.0, // BOOSTED: Business/tech combo
        },
        workstyle: {
            problem_solving: 2.8, // BOOSTED: Problem-solving ability
        },
        values: {
            entrepreneurship: 2.0, // BOOSTED: Startup mindset
        },
    },
    rakentaja: {
        interests: {
            hands_on: 2.8, // BOOSTED: Physical/manual work
            technology: 2.0, // BOOSTED: Technical skills
        },
        workstyle: {
            precision: 2.5, // BOOSTED: Attention to detail
            performance: 2.5, // BOOSTED: Results-oriented
        },
        values: {
            stability: 2.0, // BOOSTED: Job security
        },
    },
    'ympariston-puolustaja': {
        interests: {
            environment: 2.8, // BOOSTED: Environmental passion
            nature: 2.5, // BOOSTED: Nature connection
        },
        context: {
            outdoor: 2.5, // BOOSTED: Outdoor work preference
        },
        values: {
            social_impact: 2.5, // BOOSTED: Environmental impact
        },
        workstyle: {
            planning: 2.0, // BOOSTED: Systematic approach
        },
    },
    visionaari: {
        workstyle: {
            planning: 2.8, // BOOSTED: Strategic thinking
            leadership: 2.5, // BOOSTED: Visionary leadership
        },
        interests: {
            innovation: 2.8, // BOOSTED: Future-oriented
            analytical: 2.5, // BOOSTED: Data-driven decisions
        },
        values: {
            global: 2.5, // BOOSTED: Global perspective
            career_clarity: 2.0, // BOOSTED: Clear direction
        },
    },
    jarjestaja: {
        workstyle: {
            organization: 3.0, // BOOSTED: Critical organizational skills
            structure: 2.8, // BOOSTED: Systematic approach
            precision: 2.5, // BOOSTED: Detail-oriented
        },
        values: {
            stability: 2.5, // BOOSTED: Preference for structure
            career_clarity: 2.0, // BOOSTED: Clear career path
        },
        interests: {
            business: 2.0, // BOOSTED: Business operations
        },
    },
};
// ========== STEP 1: NORMALIZE ANSWERS ==========
/**
 * Convert Likert scale (1-5) to normalized score (0-1)
 */
function normalizeAnswer(score, reverse) {
    if (reverse === void 0) { reverse = false; }
    if (score < 1 || score > 5)
        return 0;
    var normalized = (score - 1) / 4; // 1→0, 3→0.5, 5→1
    return reverse ? 1 - normalized : normalized;
}
// ========== STEP 2: COMPUTE USER VECTOR ==========
/**
 * Aggregate user's answers into dimension scores
 */
function computeUserVector(answers, cohort) {
    var mappings = (0, dimensions_1.getQuestionMappings)(cohort);
    // Initialize scores
    var subdimensionScores = {};
    // Aggregate answers by subdimension
    answers.forEach(function (answer) {
        var mapping = mappings.find(function (m) { return m.q === answer.questionIndex; });
        if (!mapping)
            return;
        var normalizedScore = normalizeAnswer(answer.score, mapping.reverse);
        var key = "".concat(mapping.dimension, ":").concat(mapping.subdimension);
        if (!subdimensionScores[key]) {
            subdimensionScores[key] = { sum: 0, count: 0, weight: 0 };
        }
        // STRONG SIGNAL AMPLIFICATION: Boost high scores (4-5) to make them more prominent
        var effectiveWeight = mapping.weight;
        if (answer.score >= 4 && !mapping.reverse) {
            // Score 4 → 1.5x weight, Score 5 → 2.0x weight
            effectiveWeight = mapping.weight * (answer.score === 5 ? 2.0 : 1.5);
        }
        else if (answer.score <= 2 && mapping.reverse) {
            // For reverse questions, low scores are strong signals
            effectiveWeight = mapping.weight * (answer.score === 1 ? 2.0 : 1.5);
        }
        subdimensionScores[key].sum += normalizedScore * effectiveWeight;
        subdimensionScores[key].weight += effectiveWeight;
        subdimensionScores[key].count += 1;
    });
    // Calculate detailed scores (subdimension level)
    var detailedScores = {
        interests: {},
        values: {},
        workstyle: {},
        context: {}
    };
    Object.entries(subdimensionScores).forEach(function (_a) {
        var key = _a[0], data = _a[1];
        var _b = key.split(':'), dimension = _b[0], subdimension = _b[1];
        var avgScore = data.sum / data.weight;
        detailedScores[dimension][subdimension] = avgScore;
    });
    // Calculate main dimension scores (average of subdimensions)
    var dimensionScores = {
        interests: calculateDimensionAverage(detailedScores.interests),
        values: calculateDimensionAverage(detailedScores.values),
        workstyle: calculateDimensionAverage(detailedScores.workstyle),
        context: calculateDimensionAverage(detailedScores.context)
    };
    return { dimensionScores: dimensionScores, detailedScores: detailedScores };
}
function calculateDimensionAverage(scores) {
    var values = Object.values(scores);
    if (values.length === 0)
        return 0.5; // Default to neutral if no data
    return values.reduce(function (sum, val) { return sum + val; }, 0) / values.length;
}
// ========== STEP 3: MATCH CAREERS ==========
/**
 * Calculate similarity between user and career
 * Uses weighted dot product with category-specific subdimension weights
 */
function computeCareerFit(userDetailed, careerVector, cohort, category) {
    var weights = types_1.COHORT_WEIGHTS[cohort];
    // Get category-specific subdimension weights if category is provided
    var categoryWeights = category ? CATEGORY_SUBDIMENSION_WEIGHTS[category] : undefined;
    // Calculate dimension-level scores with category-specific weights
    var dimensionScores = {
        interests: calculateSubdimensionSimilarity(userDetailed.interests, careerVector.interests, categoryWeights === null || categoryWeights === void 0 ? void 0 : categoryWeights.interests),
        values: calculateSubdimensionSimilarity(userDetailed.values, careerVector.values, categoryWeights === null || categoryWeights === void 0 ? void 0 : categoryWeights.values),
        workstyle: calculateSubdimensionSimilarity(userDetailed.workstyle, careerVector.workstyle, categoryWeights === null || categoryWeights === void 0 ? void 0 : categoryWeights.workstyle),
        context: calculateSubdimensionSimilarity(userDetailed.context, careerVector.context, categoryWeights === null || categoryWeights === void 0 ? void 0 : categoryWeights.context)
    };
    // Weighted overall score
    var overallScore = (dimensionScores.interests * weights.interests +
        dimensionScores.values * weights.values +
        dimensionScores.workstyle * weights.workstyle +
        dimensionScores.context * weights.context) * 100; // Convert to 0-100
    return {
        overallScore: Math.round(overallScore),
        dimensionScores: {
            interests: Math.round(dimensionScores.interests * 100),
            values: Math.round(dimensionScores.values * 100),
            workstyle: Math.round(dimensionScores.workstyle * 100),
            context: Math.round(dimensionScores.context * 100)
        }
    };
}
/**
 * Calculate similarity between user and career subdimensions
 * Uses cosine similarity-like approach with enhanced matching for key subdimensions
 * Supports optional weights for category-specific prioritization
 */
function calculateSubdimensionSimilarity(userScores, careerScores, weights) {
    var allKeys = new Set(__spreadArray(__spreadArray([], Object.keys(userScores), true), Object.keys(careerScores), true));
    if (allKeys.size === 0)
        return 0.5; // Neutral if no data
    var dotProduct = 0;
    var userMagnitude = 0;
    var careerMagnitude = 0;
    // Track strong matches for bonus scoring
    var strongMatches = [];
    allKeys.forEach(function (key) {
        var weight = (weights === null || weights === void 0 ? void 0 : weights[key]) || 1.0; // Default weight is 1.0 if not specified
        var userScore = (userScores[key] || 0) * weight;
        var careerScore = (careerScores[key] || 0) * weight;
        // Track strong matches (both user and career have high scores)
        if (userScore >= 0.6 && careerScore >= 0.6) {
            strongMatches.push(key);
        }
        dotProduct += userScore * careerScore;
        userMagnitude += userScore * userScore;
        careerMagnitude += careerScore * careerScore;
    });
    userMagnitude = Math.sqrt(userMagnitude);
    careerMagnitude = Math.sqrt(careerMagnitude);
    if (userMagnitude === 0 || careerMagnitude === 0)
        return 0;
    var similarity = dotProduct / (userMagnitude * careerMagnitude);
    // ENHANCED MATCHING: Boost similarity when key subdimensions match strongly
    // This helps healthcare careers match better when user has health interest
    if (strongMatches.length > 0) {
        // Bonus for each strong match (especially important ones like health, people)
        var importantKeys_1 = ['health', 'people', 'technology', 'creative', 'education'];
        var importantMatches = strongMatches.filter(function (k) { return importantKeys_1.includes(k); });
        var bonus = Math.min(0.15, importantMatches.length * 0.05 + strongMatches.length * 0.02);
        similarity = Math.min(1.0, similarity + bonus);
    }
    return similarity;
}
// ========== STEP 4: GENERATE REASONS ==========
/**
 * Generate Finnish explanation for career match
 * Uses personality-based narrative style instead of technical answer-listing
 */
function generateReasons(career, careerFI, userDetailed, dimensionScores, cohort, answers) {
    var reasons = [];
    // Find top user strengths
    var topUserInterests = getTopScores(userDetailed.interests, 2);
    var topUserWorkstyle = getTopScores(userDetailed.workstyle, 2);
    var topUserValues = getTopScores(userDetailed.values, 2);
    // Find top career characteristics
    var topCareerInterests = getTopScores(career.interests, 2);
    var topCareerWorkstyle = getTopScores(career.workstyle, 2);
    // Reason 1: Interest match (personality-based narrative)
    if (dimensionScores.interests >= 70) {
        var matchedInterest = topUserInterests.find(function (_a) {
            var key = _a[0];
            return topCareerInterests.some(function (_a) {
                var careerKey = _a[0];
                return careerKey === key;
            });
        });
        if (matchedInterest) {
            var subdim = matchedInterest[0];
            reasons.push(generatePersonalityInterestReason(subdim, cohort));
        }
        else if (topCareerInterests.length > 0) {
            reasons.push(generatePersonalityInterestReason(topCareerInterests[0][0], cohort));
        }
    }
    // Reason 2: Workstyle match (personality-based narrative)
    if (dimensionScores.workstyle >= 65) {
        var matchedWorkstyle = topUserWorkstyle.find(function (_a) {
            var key = _a[0];
            return topCareerWorkstyle.some(function (_a) {
                var careerKey = _a[0];
                return careerKey === key;
            });
        });
        if (matchedWorkstyle) {
            var subdim = matchedWorkstyle[0];
            reasons.push(generatePersonalityWorkstyleReason(subdim, cohort));
        }
    }
    // Reason 3: Values match (if strong) - personality-based
    if (dimensionScores.values >= 65 && topUserValues.length > 0) {
        var topValue = topUserValues[0][0];
        reasons.push(generatePersonalityValuesReason(topValue, cohort));
    }
    // Reason 4: Career-specific benefit (personality-based)
    reasons.push(generatePersonalityCareerBenefit(careerFI, cohort));
    // Ensure we have at least 2 reasons
    if (reasons.length < 2) {
        reasons.push(generatePersonalityGenericReason(career.category, cohort));
    }
    return reasons.slice(0, 3); // Max 3 reasons
}
// ========== REASON TEMPLATES ==========
function generateInterestReason(subdimension, cohort) {
    var templates = {
        technology: [
            "Pääset työskentelemään teknologian ja digitaalisten ratkaisujen parissa.",
            "Vahva teknologiakiinnostuksesi sopii erinomaisesti tähän uraan.",
            "Voit hyödyntää kiinnostustasi teknologiaan päivittäin."
        ],
        people: [
            "Pääset auttamaan ja tukemaan muita ihmisiä.",
            "Voit työskennellä ihmisten kanssa ja tehdä merkityksellistä työtä.",
            "Saat hyödyntää vahvaa ihmissuhdetaitoasi."
        ],
        creative: [
            "Pääset toteuttamaan luovuuttasi ja ideoitasi.",
            "Voit ilmaista itseäsi luovasti ja kehittää uusia ratkaisuja.",
            "Luova ote on keskeinen osa tätä ammattia."
        ],
        analytical: [
            "Pääset analysoimaan ja tutkimaan asioita syvällisesti.",
            "Analyyttinen ajattelusi on vahvuus tässä työssä.",
            "Voit ratkaista monimutkaisia ongelmia."
        ],
        hands_on: [
            "Pääset tekemään konkreettista ja käytännönläheistä työtä.",
            "Näet työsi tulokset käytännössä.",
            "Käytännön tekeminen on tämän uran ydin."
        ],
        business: [
            "Pääset työskentelemään liiketoiminnan ja kaupallisen ajattelun parissa.",
            "Kiinnostuksesi liiketoimintaan sopii hyvin tähän uraan.",
            "Voit hyödyntää kaupallista osaamistasi."
        ],
        environment: [
            "Pääset vaikuttamaan ympäristön ja kestävän kehityksen hyväksi.",
            "Ympäristöasiat ovat keskeinen osa tätä työtä.",
            "Voit tehdä merkityksellistä työtä planeetan puolesta."
        ],
        health: [
            "Pääset edistämään ihmisten terveyttä ja hyvinvointia.",
            "Terveysala tarjoaa merkityksellistä ja palkitsevaa työtä.",
            "Voit auttaa ihmisiä voimaan paremmin."
        ],
        innovation: [
            "Pääset kehittämään uusia ratkaisuja ja innovaatioita.",
            "Innovatiivinen ajattelu on tämän uran vahvuus.",
            "Voit olla mukana luomassa tulevaisuutta."
        ],
        education: [
            "Pääset opettamaan ja jakamaan osaamistasi muille.",
            "Voit vaikuttaa nuorten tulevaisuuteen.",
            "Opettaminen ja ohjaaminen ovat tämän työn ytimessä."
        ],
        arts_culture: [
            "Pääset työskentelemään kulttuurin ja taiteen parissa.",
            "Kulttuurinen työ on merkityksellistä ja monipuolista.",
            "Voit edistää kulttuuria ja taiteellista ilmaisua."
        ],
        sports: [
            "Pääset yhdistämään liikunnan ja työn.",
            "Urheilu ja liikunta ovat keskeinen osa tätä ammattia.",
            "Voit edistää ihmisten terveyttä liikunnan kautta."
        ],
        nature: [
            "Pääset työskentelemään luonnon ja ulkoilman parissa.",
            "Luontotyö tarjoaa monipuolista ja terveellistä ympäristöä.",
            "Voit yhdistää työn ja luontoharrastuksen."
        ],
        writing: [
            "Pääset kirjoittamaan ja tuottamaan sisältöä.",
            "Kirjoittaminen on keskeinen taito tässä työssä.",
            "Voit ilmaista itseäsi tekstin kautta."
        ],
        // Workstyle subdimensions
        teamwork: [
            "Pääset työskentelemään tiimissä ja tekemään yhteistyötä.",
            "Tiimityö ja yhteistyötaidot ovat tärkeitä tässä ammatissa.",
            "Voit hyödyntää vahvoja tiimityötaitojasi."
        ],
        independence: [
            "Voit työskennellä itsenäisesti ja tehdä omia päätöksiä.",
            "Itsenäinen työskentely sopii sinulle erinomaisesti.",
            "Saat vapautta organisoida työsi haluamallasi tavalla."
        ],
        leadership: [
            "Pääset johtamaan ja ohjaamaan muita.",
            "Johtamiskykysi tulevat hyötykäyttöön tässä urassa.",
            "Voit vaikuttaa ja ohjata tiimejä."
        ],
        organization: [
            "Organisointitaitosi ovat tärkeitä tässä työssä.",
            "Pääset hyödyntämään vahvaa organisointikykyäsi.",
            "Järjestelmällisyys on keskeinen vahvuus tässä ammatissa."
        ],
        planning: [
            "Suunnittelutaitosi tulevat hyötykäyttöön päivittäin.",
            "Pääset suunnittelemaan ja organisoimaan työtä.",
            "Strateginen suunnittelu on olennainen osa tätä uraa."
        ],
        problem_solving: [
            "Pääset ratkaisemaan haasteellisia ongelmia.",
            "Ongelmanratkaisutaitosi ovat keskeisiä tässä työssä.",
            "Voit käyttää luovuutta ongelmien ratkaisemiseen."
        ],
        precision: [
            "Tarkkuus ja huolellisuus ovat tärkeitä tässä ammatissa.",
            "Pääset hyödyntämään tarkkaa työskentelytapaasi.",
            "Laatu ja tarkkuus ovat keskeisiä tässä urassa."
        ],
        performance: [
            "Pääset näyttämään osaamistasi ja suoriutumistasi.",
            "Vahva suorituskyky on arvostettua tässä työssä.",
            "Voit kehittyä ja menestyä suorituksen kautta."
        ],
        teaching: [
            "Pääset opettamaan ja kouluttamaan muita.",
            "Opetustaito on keskeinen osa tätä ammattia.",
            "Voit jakaa osaamistasi ja tukea muiden oppimista."
        ],
        motivation: [
            "Pääset motivoimaan ja innostamaan muita.",
            "Motivointikykysi on tärkeä vahvuus tässä työssä.",
            "Voit kannustaa ja tukea muita tavoitteiden saavuttamisessa."
        ],
        autonomy: [
            "Saat paljon autonomiaa ja vapautta työssäsi.",
            "Itsenäinen päätöksenteko on osa tätä uraa.",
            "Voit vaikuttaa omaan työtapaasi ja aikatauluihisi."
        ],
        social: [
            "Pääset olemaan sosiaalisessa ympäristössä.",
            "Sosiaalinen vuorovaikutus on keskeinen osa työtä.",
            "Voit hyödyntää vahvoja sosiaalisia taitojasi."
        ],
        structure: [
            "Työssä on selkeä rakenne ja rutiinit.",
            "Strukturoitu työskentely sopii sinulle hyvin.",
            "Selkeät prosessit ja säännöt ohjaavat työtä."
        ],
        flexibility: [
            "Työ tarjoaa joustavuutta ja vaihtelua.",
            "Voit työskennellä joustavasti ja mukauttaa työtapojasi.",
            "Muuttuva ja joustava työympäristö sopii sinulle."
        ],
        variety: [
            "Työssä on vaihtelua ja monipuolisuutta.",
            "Jokainen päivä on erilainen ja tarjoaa uusia haasteita.",
            "Monipuolinen työtehtävien kirjo pitää työn mielenkiintoisena."
        ],
        // Values subdimensions
        growth: [
            "Tämä ura tarjoaa jatkuvaa oppimista ja kehittymistä.",
            "Pääset kasvamaan ja kehittymään ammatillisesti.",
            "Urapolku mahdollistaa vahvan henkilökohtaisen kasvun."
        ],
        impact: [
            "Voit tehdä merkityksellistä työtä, jolla on todellista vaikutusta.",
            "Työsi vaikuttaa positiivisesti yhteiskuntaan.",
            "Pääset tekemään työtä, jolla on merkitystä."
        ],
        global: [
            "Pääset työskentelemään kansainvälisessä ympäristössä.",
            "Globaali näkökulma on osa tätä uraa.",
            "Voit vaikuttaa maailmanlaajuisesti."
        ],
        career_clarity: [
            "Tämä ura tarjoaa selkeän urapolun ja kehitysmahdollisuudet.",
            "Etenemismahdollisuudet ovat hyvin määriteltyjä.",
            "Voit edetä urallasi johdonmukaisesti."
        ],
        financial: [
            "Ura tarjoaa hyvät ansaintamahdollisuudet.",
            "Taloudellinen palkitsevuus on osa tätä uraa.",
            "Voit saavuttaa hyvän taloudellisen aseman."
        ],
        entrepreneurship: [
            "Voit hyödyntää yrittäjämäistä ajatteluasi.",
            "Yrittäjyys ja omaaloitteisuus ovat arvostettuja.",
            "Pääset kehittämään omia projektejasi ja ideoitasi."
        ],
        social_impact: [
            "Voit tehdä työtä, jolla on positiivinen sosiaalinen vaikutus.",
            "Yhteiskunnallinen vaikuttaminen on osa tätä uraa.",
            "Pääset auttamaan ja tukemaan yhteisöä."
        ],
        stability: [
            "Ura tarjoaa vakautta ja turvallisuutta.",
            "Työllisyystilanne on vakaa tällä alalla.",
            "Voit rakentaa pitkäjänteistä uraa."
        ],
        advancement: [
            "Etenemismahdollisuudet ovat erinomaiset.",
            "Voit edetä nopeasti urallasi.",
            "Ura tarjoaa jatkuvaa kehittymistä."
        ],
        work_life_balance: [
            "Työssä on hyvä tasapaino työn ja vapaa-ajan välillä.",
            "Voit yhdistää työn ja henkilökohtaisen elämän.",
            "Työajat ovat joustavat ja tasapainoiset."
        ],
        company_size: [
            "Voit valita itsellesi sopivan kokoisen työpaikan.",
            "Työllistymismahdollisuuksia on erikokoisissa yrityksissä.",
            "Pääset työskentelemään haluamassasi ympäristössä."
        ],
        // Context subdimensions
        outdoor: [
            "Pääset työskentelemään ulkona ja luonnossa.",
            "Ulkotyö tarjoaa terveellistä ja vaihtelevaa ympäristöä.",
            "Voit yhdistää työn ja ulkoilun."
        ],
        international: [
            "Pääset työskentelemään kansainvälisessä ympäristössä.",
            "Voit matkustaa ja työskennellä eri maissa.",
            "Kansainväliset kontaktit ovat osa työtä."
        ],
        work_environment: [
            "Työympäristö on miellyttävä ja sopii sinulle.",
            "Pääset työskentelemään inspiroivassa ympäristössä.",
            "Työskentelyolosuhteet ovat erinomaiset."
        ]
    };
    var options = templates[subdimension] || [];
    if (options.length === 0)
        return "";
    return options[Math.floor(Math.random() * options.length)];
}
function generateWorkstyleReason(subdimension, cohort) {
    var templates = {
        teamwork: [
            "Pääset työskentelemään tiimissä ja tekemään yhteistyötä.",
            "Yhteistyötaidot ovat vahvuus tässä ammatissa.",
            "Tiimityö on olennainen osa tätä uraa."
        ],
        independence: [
            "Pääset työskentelemään itsenäisesti ja omin päin.",
            "Saat paljon vapautta ja autonomiaa työssäsi.",
            "Itsenäinen työskentely sopii hyvin tähän uraan."
        ],
        leadership: [
            "Pääset johtamaan muita ja tekemään päätöksiä.",
            "Johtamistaidot ovat keskeisiä tässä työssä.",
            "Voit ottaa vastuuta ja johtaa projekteja."
        ],
        organization: [
            "Pääset organisoimaan ja koordinoimaan asioita.",
            "Järjestelmällisyys on vahvuus tässä ammatissa.",
            "Organisointitaidot ovat tärkeitä tässä työssä."
        ],
        problem_solving: [
            "Pääset ratkaisemaan monimutkaisia ongelmia.",
            "Ongelmanratkaisutaidot ovat keskeisiä tässä urassa.",
            "Voit käyttää analyyttistä ajatteluasi päivittäin."
        ]
    };
    var options = templates[subdimension] || [];
    if (options.length === 0)
        return "";
    return options[Math.floor(Math.random() * options.length)];
}
function generateCareerBenefit(careerFI, cohort) {
    var _a, _b, _c;
    // Use job outlook if available
    if (((_a = careerFI === null || careerFI === void 0 ? void 0 : careerFI.job_outlook) === null || _a === void 0 ? void 0 : _a.status) === "kasvaa") {
        return "Ala kasvaa Suomessa juuri nyt, joten työllistymisnäkymät ovat erinomaiset.";
    }
    if (((_b = careerFI === null || careerFI === void 0 ? void 0 : careerFI.job_outlook) === null || _b === void 0 ? void 0 : _b.status) === "vakaa") {
        return "Ala on vakaa ja työllistymismahdollisuudet säilyvät tasaisina myös talousvaihteluissa.";
    }
    // Use salary if above median
    if (((_c = careerFI === null || careerFI === void 0 ? void 0 : careerFI.salary_eur_month) === null || _c === void 0 ? void 0 : _c.median) >= 3500) {
        return "Ammatti tarjoaa hyvät ansiomahdollisuudet.";
    }
    // Generic benefits
    var genericBenefits = [
        "Ammatti tarjoaa monipuolisia mahdollisuuksia kehittyä.",
        "Ura tarjoaa vakaata työllistymistä.",
        "Työ on merkityksellistä ja palkitsevaa."
    ];
    return genericBenefits[Math.floor(Math.random() * genericBenefits.length)];
}
function generateGenericReason(category, cohort) {
    var categoryReasons = {
        luova: "Voit toteuttaa luovuuttasi ja nähdä ideoidesi toteutuvan.",
        johtaja: "Pääset johtamaan ja vaikuttamaan organisaation menestykseen.",
        innovoija: "Voit olla mukana kehittämässä uusia ratkaisuja.",
        rakentaja: "Näet työsi konkreettiset tulokset ja voit olla ylpeä aikaansaannoksista.",
        auttaja: "Voit tehdä merkityksellistä työtä ihmisten hyväksi.",
        "ympariston-puolustaja": "Pääset vaikuttamaan kestävään tulevaisuuteen.",
        visionaari: "Voit suunnitella tulevaisuutta ja luoda pitkän tähtäimen visioita.",
        jarjestaja: "Pääset luomaan järjestystä ja tehokkuutta."
    };
    return categoryReasons[category] || "Ammatti sopii vahvuuksiisi ja kiinnostukseesi.";
}
// ========== PERSONALITY-BASED REASON GENERATORS ==========
function generatePersonalityInterestReason(subdimension, cohort) {
    var templates = {
        technology: [
            "Sinussa on vahva teknologinen uteliaisuus ja halu oppia uusia digitaalisia ratkaisuja, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy teknologia-alalla.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii teknologian ratkaisemista ongelmista ja uusien innovaatioiden kehittämisestä.",
            "Olet sellainen henkilö, joka arvostaa teknologian mahdollisuuksia ja haluat olla mukana luomassa tulevaisuutta - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa."
        ],
        people: [
            "Sinussa on vahva halu auttaa ja tukea muita ihmisiä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy ihmisläheisessä työssä.",
            "Profiilistasi välittyy, että arvostat merkityksellistä vuorovaikutusta ja haluat tehdä eron ihmisten elämässä - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka nauttii siitä kun pääsee auttamaan ja tukemaan muita, mikä on juuri sitä mitä tämä ura tarjoaa."
        ],
        creative: [
            "Sinussa on vahva luova sielu ja halu ilmaista itseäsi, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa luovassa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii ideoiden kehittämisestä ja uusien ratkaisujen luomisesta - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa luovuutta ja haluat käyttää mielikuvitustasi työssä, mikä sopii erinomaisesti tähän uraan."
        ],
        analytical: [
            "Sinussa on vahva analyyttinen ajattelutapa ja halu tutkia asioita syvällisesti, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy analyyttisessä työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii monimutkaisten ongelmien ratkaisemisesta ja syvällisestä ajattelusta - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
            "Olet sellainen henkilö, joka arvostaa tarkkaa analyysiä ja haluat ymmärtää asioita perusteellisesti, mikä sopii erinomaisesti tähän uraan."
        ],
        hands_on: [
            "Sinussa on vahva halu tehdä asioita käytännössä ja nähdä konkreettisia tuloksia, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy käytännönläheisessä työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii konkreettisesta tekemisestä ja työskentelystä käsin - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa käytännön tekemistä ja haluat nähdä työsi tulokset heti, mikä sopii erinomaisesti tähän uraan."
        ],
        business: [
            "Sinussa on vahva liiketoimintaosaaminen ja halu vaikuttaa kaupallisiin päätöksiin, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy liiketoiminnassa.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii strategisesta ajattelusta ja liiketoiminnan kehittämisestä - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa kaupallista osaamista ja haluat vaikuttaa liiketoiminnan tuloksiin, mikä sopii erinomaisesti tähän uraan."
        ],
        environment: [
            "Sinussa on vahva halu vaikuttaa ympäristön hyväksi ja edistää kestävää kehitystä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy ympäristötyössä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa luontoa ja haluat tehdä merkityksellistä työtä planeetan puolesta - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka haluat yhdistää työn ja ympäristöasiat, mikä sopii erinomaisesti tähän uraan."
        ],
        health: [
            "Sinussa on vahva halu auttaa ihmisiä voimaan paremmin ja edistää terveyttä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy terveysalalla.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa terveyttä ja haluat tehdä merkityksellistä työtä ihmisten hyvinvoinnin eteen - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka haluat auttaa ihmisiä terveyden ja hyvinvoinnin kautta, mikä sopii erinomaisesti tähän uraan."
        ],
        innovation: [
            "Sinussa on vahva innovatiivinen ajattelutapa ja halu kehittää uusia ratkaisuja, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa innovaatiotyössä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii uusien ideoiden kehittämisestä ja tulevaisuuden luomisesta - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
            "Olet sellainen henkilö, joka arvostaa innovaatiota ja haluat olla mukana luomassa uutta, mikä sopii erinomaisesti tähän uraan."
        ],
        education: [
            "Sinussa on vahva halu jakaa osaamistasi ja auttaa muita oppimaan, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy opetustyössä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii siitä kun pääsee vaikuttamaan muiden oppimiseen ja kasvuun - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa opetusta ja haluat vaikuttaa nuorten tulevaisuuteen, mikä sopii erinomaisesti tähän uraan."
        ],
        arts_culture: [
            "Sinussa on vahva kulttuurinen kiinnostus ja halu edistää taidetta, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa kulttuurialalla.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii kulttuurin ja taiteen parissa työskentelystä - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa kulttuuria ja haluat edistää taiteellista ilmaisua, mikä sopii erinomaisesti tähän uraan."
        ],
        sports: [
            "Sinussa on vahva halu yhdistää liikunta ja työ, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy urheilu- ja liikunta-alalla.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii aktiivisesta työstä ja haluat edistää terveyttä liikunnan kautta - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka arvostaa liikuntaa ja haluat yhdistää sen työhön, mikä sopii erinomaisesti tähän uraan."
        ],
        nature: [
            "Sinussa on vahva yhteys luontoon ja halu työskennellä ulkoilussa, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy luontotyössä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii ulkoilusta ja luonnon parissa työskentelystä - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa luontoa ja haluat yhdistää työn ja ulkoilun, mikä sopii erinomaisesti tähän uraan."
        ],
        writing: [
            "Sinussa on vahva halu ilmaista itseäsi tekstin kautta ja jakaa ajatuksiasi, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa kirjoittamisessa.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii sanallisen ilmaisun ja sisällöntuotannon parissa työskentelystä - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa kirjoittamista ja haluat käyttää sanaasi työssä, mikä sopii erinomaisesti tähän uraan."
        ],
        // Workstyle subdimensions
        teamwork: [
            "Sinussa on vahva tiimityötaito ja halu tehdä yhteistyötä, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa tiimityössä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii yhteisestä tekemisestä ja tiimien kanssa työskentelystä - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
            "Olet sellainen henkilö, joka arvostaa yhteistyötä ja haluat työskennellä muiden kanssa, mikä sopii erinomaisesti tähän uraan."
        ],
        independence: [
            "Sinussa on vahva itsenäisyys ja halu tehdä omia päätöksiä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy itsenäisessä työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii vapaudesta ja autonomiasta työskentelyssä - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa itsenäisyyttä ja haluat organisoida työsi itse, mikä sopii erinomaisesti tähän uraan."
        ],
        leadership: [
            "Sinussa on vahva johtamiskyky ja halu vaikuttaa ja ohjata muita, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy johtotehtävissä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii vastuusta ja haluat ohjata muita kohti tavoitteita - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka arvostaa johtamista ja haluat vaikuttaa organisaation suuntaan, mikä sopii erinomaisesti tähän uraan."
        ],
        organization: [
            "Sinussa on vahva organisointikyky ja halu luoda selkeää rakennetta, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa organisoivassa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii järjestelmällisestä työskentelystä ja prosessien luomisesta - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
            "Olet sellainen henkilö, joka arvostaa järjestelmällisyyttä ja haluat luoda selkeän rakenteen työlle, mikä sopii erinomaisesti tähän uraan."
        ],
        planning: [
            "Sinussa on vahva suunnittelutaito ja halu ajatella strategisesti, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy suunnittelutyössä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii strategisesta ajattelusta ja pitkän tähtäimen suunnittelusta - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa suunnittelua ja haluat luoda selkeän tulevaisuuden visio, mikä sopii erinomaisesti tähän uraan."
        ],
        problem_solving: [
            "Sinussa on vahva ongelmanratkaisutaito ja halu löytää ratkaisuja haasteisiin, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa ongelmanratkaisussa.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii monimutkaisten ongelmien ratkaisemisesta ja luovasta ajattelusta - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
            "Olet sellainen henkilö, joka arvostaa ongelmanratkaisua ja haluat käyttää analyyttistä ajattelua työssä, mikä sopii erinomaisesti tähän uraan."
        ],
        precision: [
            "Sinussa on vahva tarkkuus ja halu tehdä asiat huolellisesti, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa tarkassa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii huolellisesta työskentelystä ja laadun tavoittelusta - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
            "Olet sellainen henkilö, joka arvostaa tarkkuutta ja haluat tehdä työn laadukkaasti, mikä sopii erinomaisesti tähän uraan."
        ],
        performance: [
            "Sinussa on vahva suorituskyky ja halu näyttää osaamistasi, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy suoritustyössä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii haasteista ja haluat kehittyä jatkuvasti - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka arvostaa suoritusta ja haluat näyttää vahvuutesi, mikä sopii erinomaisesti tähän uraan."
        ],
        teaching: [
            "Sinussa on vahva opetustaito ja halu jakaa osaamistasi, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa opetustyössä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii siitä kun pääsee tukemaan muiden oppimista ja kasvua - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa opetusta ja haluat vaikuttaa muiden kehitykseen, mikä sopii erinomaisesti tähän uraan."
        ],
        motivation: [
            "Sinussa on vahva motivointikyky ja halu kannustaa muita, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa motivointityössä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii siitä kun pääsee innostamaan ja kannustamaan muita - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
            "Olet sellainen henkilö, joka arvostaa motivointia ja haluat auttaa muita saavuttamaan tavoitteensa, mikä sopii erinomaisesti tähän uraan."
        ],
        autonomy: [
            "Sinussa on vahva halu itsenäisyyteen ja vapautta työskentelyssä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy autonomisessa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii vapaudesta tehdä omia päätöksiä ja organisoida työsi itse - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa autonomiaa ja haluat vaikuttaa omaan työtapaasi, mikä sopii erinomaisesti tähän uraan."
        ],
        social: [
            "Sinussa on vahva sosiaalinen luonne ja halu olla ihmisten kanssa, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa sosiaalisessa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii sosiaalisesta vuorovaikutuksesta ja ihmisten kanssa työskentelystä - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa sosiaalisuutta ja haluat työskennellä ihmisten kanssa, mikä sopii erinomaisesti tähän uraan."
        ],
        structure: [
            "Sinussa on vahva halu selkeään rakenteeseen ja rutiineihin, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy strukturoidussa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii selkeästä rakenteesta ja ennustettavista prosesseista - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa strukturoitua työskentelyä ja haluat selkeät rutiinit, mikä sopii erinomaisesti tähän uraan."
        ],
        flexibility: [
            "Sinussa on vahva halu joustavuuteen ja muutoksiin, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy joustavassa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii vaihtelusta ja haluat mukautua erilaisiin tilanteisiin - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa joustavuutta ja haluat työskennellä muuttuvissa olosuhteissa, mikä sopii erinomaisesti tähän uraan."
        ],
        variety: [
            "Sinussa on vahva halu vaihteluun ja monipuolisuuteen, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy monipuolisessa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii siitä että jokainen päivä on erilainen ja tarjoaa uusia haasteita - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka arvostaa vaihtelua ja haluat monipuolisia tehtäviä, mikä sopii erinomaisesti tähän uraan."
        ],
        // Values subdimensions
        growth: [
            "Sinussa on vahva halu kehittyä ja oppia jatkuvasti, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy kehitysmahdollisuuksia tarjoavassa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa oppimista ja haluat kasvaa ammatillisesti - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka haluat jatkuvaa kehitystä ja oppimista, mikä sopii erinomaisesti tähän uraan."
        ],
        impact: [
            "Sinussa on vahva halu tehdä merkityksellistä työtä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy vaikuttavuutta tarjoavassa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa työn merkitystä ja haluat vaikuttaa positiivisesti - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka haluat tehdä työtä jolla on todellista vaikutusta, mikä sopii erinomaisesti tähän uraan."
        ],
        global: [
            "Sinussa on vahva halu kansainvälisyyteen ja globaaliin näkökulmaan, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy kansainvälisessä työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa globaalia näkökulmaa ja haluat vaikuttaa laajemmin - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka haluat työskennellä kansainvälisesti ja vaikuttaa globaalisti, mikä sopii erinomaisesti tähän uraan."
        ],
        career_clarity: [
            "Sinussa on vahva halu selkeään urapolkuun ja etenemismahdollisuuksiin, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy selkeän polun tarjoavassa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa selkeää kehityspolkua ja haluat nähdä etenemismahdollisuudet - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka haluat selkeän urapolun ja etenemismahdollisuudet, mikä sopii erinomaisesti tähän uraan."
        ],
        financial: [
            "Sinussa on vahva halu hyviin ansaintamahdollisuuksiin, mikä tekee sinusta juuri sellaisen henkilön, joka arvostaa taloudellista palkitsevuutta.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa hyviä ansaintamahdollisuuksia ja haluat rakentaa vakaata taloudellista tulevaisuutta - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka haluat hyvät ansaintamahdollisuudet, mikä sopii erinomaisesti tähän uraan."
        ],
        entrepreneurship: [
            "Sinussa on vahva yrittäjämäisyys ja halu luoda omaa, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa yrittäjyydessä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa omaaloitteisuutta ja haluat luoda oman polun - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka haluat yrittäjämäisyyttä ja omaaloitteisuutta, mikä sopii erinomaisesti tähän uraan."
        ],
        social_impact: [
            "Sinussa on vahva halu tehdä sosiaalista vaikutusta, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy yhteiskunnallista vaikutusta tarjoavassa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa sosiaalista vaikuttamista ja haluat auttaa yhteisöä - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka haluat tehdä työtä jolla on positiivinen sosiaalinen vaikutus, mikä sopii erinomaisesti tähän uraan."
        ],
        stability: [
            "Sinussa on vahva halu vakauteen ja turvallisuuteen, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy vakaata työtä tarjoavassa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa vakautta ja haluat rakentaa pitkäjänteistä uraa - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka haluat vakaata ja turvallista työtä, mikä sopii erinomaisesti tähän uraan."
        ],
        advancement: [
            "Sinussa on vahva halu etenemismahdollisuuksiin, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy etenemismahdollisuuksia tarjoavassa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa kehitysmahdollisuuksia ja haluat edetä urallasi - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka haluat hyvät etenemismahdollisuudet, mikä sopii erinomaisesti tähän uraan."
        ],
        work_life_balance: [
            "Sinussa on vahva halu tasapainoon työn ja vapaa-ajan välillä, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy tasapainoisessa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa työn ja elämän tasapainoa ja haluat yhdistää ne hyvin - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka haluat hyvän työn ja elämän tasapainon, mikä sopii erinomaisesti tähän uraan."
        ],
        company_size: [
            "Sinussa on vahva halu löytää itsellesi sopiva työympäristö, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy erikokoisissa organisaatioissa.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa sopivaa työympäristöä ja haluat työskennellä haluamassasi ympäristössä - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka haluat löytää itsellesi sopivan työpaikan, mikä sopii erinomaisesti tähän uraan."
        ],
        // Context subdimensions
        outdoor: [
            "Sinussa on vahva halu työskennellä ulkona ja luonnossa, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy ulkotyössä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa ulkoilua ja haluat työskennellä luonnossa - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka haluat yhdistää työn ja ulkoilun, mikä sopii erinomaisesti tähän uraan."
        ],
        international: [
            "Sinussa on vahva halu kansainvälisyyteen ja matkustamiseen, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy kansainvälisessä työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa kansainvälisyyttä ja haluat työskennellä eri maissa - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka haluat työskennellä kansainvälisesti, mikä sopii erinomaisesti tähän uraan."
        ],
        work_environment: [
            "Sinussa on vahva halu inspiroivaan työympäristöön, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy miellyttävässä ympäristössä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa hyvää työympäristöä ja haluat työskennellä inspiroivassa paikassa - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka haluat miellyttävän työympäristön, mikä sopii erinomaisesti tähän uraan."
        ]
    };
    var options = templates[subdimension] || [];
    if (options.length === 0)
        return "";
    return options[Math.floor(Math.random() * options.length)];
}
function generatePersonalityWorkstyleReason(subdimension, cohort) {
    // Reuse the same templates as interests for workstyle, but adjust the wording
    return generatePersonalityInterestReason(subdimension, cohort);
}
function generatePersonalityValuesReason(subdimension, cohort) {
    // Reuse the same templates as interests for values, but adjust the wording
    return generatePersonalityInterestReason(subdimension, cohort);
}
function generatePersonalityCareerBenefit(careerFI, cohort) {
    var _a, _b;
    // Use job outlook if available
    if (((_a = careerFI === null || careerFI === void 0 ? void 0 : careerFI.job_outlook) === null || _a === void 0 ? void 0 : _a.status) === "kasvaa") {
        return "Tämä ammatti tarjoaa hyvät työllistymisnäkymät ja ala kasvaa, mikä tarkoittaa että löydät varmasti työpaikan tulevaisuudessa.";
    }
    // Use salary if above median
    if (((_b = careerFI === null || careerFI === void 0 ? void 0 : careerFI.salary_eur_month) === null || _b === void 0 ? void 0 : _b.median) >= 3500) {
        return "Ammatti tarjoaa hyvät ansiomahdollisuudet, mikä mahdollistaa vakaata taloudellista tulevaisuutta.";
    }
    // Generic benefits
    var genericBenefits = [
        "Tämä ammatti tarjoaa monipuolisia mahdollisuuksia kehittyä ja kasvaa ammatillisesti.",
        "Ura tarjoaa hyvät mahdollisuudet oppia uutta ja kehittää osaamistasi jatkuvasti.",
        "Ammatti mahdollistaa merkityksellisen työn tekemisen ja henkilökohtaista kasvua."
    ];
    return genericBenefits[Math.floor(Math.random() * genericBenefits.length)];
}
function generatePersonalityGenericReason(category, cohort) {
    var categoryReasons = {
        auttaja: [
            "Sinussa on vahva auttava persoonallisuus, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy auttavassa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka haluat tehdä merkityksellistä työtä ihmisten hyväksi - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa auttamista ja haluat vaikuttaa positiivisesti muiden elämään, mikä sopii erinomaisesti tähän uraan."
        ],
        luova: [
            "Sinussa on vahva luova sielu, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa luovassa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii luovasta ilmaisusta ja ideoiden kehittämisestä - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka arvostaa luovuutta ja haluat käyttää mielikuvitustasi työssä, mikä sopii erinomaisesti tähän uraan."
        ],
        johtaja: [
            "Sinussa on vahva johtamiskyky, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy johtotehtävissä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii vastuusta ja haluat ohjata muita kohti tavoitteita - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka arvostaa johtamista ja haluat vaikuttaa organisaation suuntaan, mikä sopii erinomaisesti tähän uraan."
        ],
        innovoija: [
            "Sinussa on vahva innovatiivinen ajattelutapa, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa innovaatiotyössä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii uusien ratkaisujen kehittämisestä ja teknologian hyödyntämisestä - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
            "Olet sellainen henkilö, joka arvostaa innovaatiota ja haluat olla mukana luomassa tulevaisuutta, mikä sopii erinomaisesti tähän uraan."
        ],
        rakentaja: [
            "Sinussa on vahva halu konkreettiseen tekemiseen, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy käytännönläheisessä työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii siitä kun pääsee tekemään asioita käsin ja näkemään konkreettisia tuloksia - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa käytännön tekemistä ja haluat nähdä työsi tulokset heti, mikä sopii erinomaisesti tähän uraan."
        ],
        'ympariston-puolustaja': [
            "Sinussa on vahva halu vaikuttaa ympäristön hyväksi, mikä tekee sinusta juuri sellaisen henkilön, joka viihtyy ympäristötyössä.",
            "Profiilistasi välittyy, että olet sellainen, joka arvostaa luontoa ja haluat tehdä merkityksellistä työtä planeetan puolesta - tämä on täsmälleen sitä mitä tämä ammatti mahdollistaa.",
            "Olet sellainen henkilö, joka haluat yhdistää työn ja ympäristöasiat, mikä sopii erinomaisesti tähän uraan."
        ],
        visionaari: [
            "Sinussa on vahva visionäärinen ajattelutapa, mikä tekee sinusta juuri sellaisen henkilön, joka menestyy strategisessa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii tulevaisuuden suunnittelusta ja strategisesta ajattelusta - tämä on täsmälleen sitä mitä tämä ammatti tarjoaa.",
            "Olet sellainen henkilö, joka arvostaa visionääristä ajattelua ja haluat vaikuttaa strategisiin päätöksiin, mikä sopii erinomaisesti tähän uraan."
        ],
        jarjestaja: [
            "Sinussa on vahva organisointikyky, mikä tekee sinusta juuri sellaisen henkilön, joka loistaa organisoivassa työssä.",
            "Profiilistasi välittyy, että olet sellainen, joka nauttii järjestelmällisestä työskentelystä ja prosessien luomisesta - tämä on täsmälleen sitä mitä tämä ammatti vaatii.",
            "Olet sellainen henkilö, joka arvostaa järjestelmällisyyttä ja haluat luoda selkeän rakenteen työlle, mikä sopii erinomaisesti tähän uraan."
        ]
    };
    var options = categoryReasons[category] || [
        "Ammatti sopii hyvin profiiliisi ja tarjoaa mahdollisuuden hyödyntää vahvuuksiasi.",
        "Voit hyödyntää vahvuuksiasi tässä työssä ja kehittyä ammatillisesti.",
        "Tämä ura tarjoaa hyvät mahdollisuudet kehittyä ja kasvaa henkilönä."
    ];
    return options[Math.floor(Math.random() * options.length)];
}
// ========== HELPER FUNCTIONS ==========
function getTopScores(scores, limit) {
    return Object.entries(scores)
        .filter(function (_a) {
        var score = _a[1];
        return score > 0.4;
    }) // Only meaningful scores
        .sort(function (_a, _b) {
        var a = _a[1];
        var b = _b[1];
        return b - a;
    })
        .slice(0, limit);
}
// ========== CATEGORY DETECTION ==========
/**
 * Determine user's dominant category based on their dimension scores
 * Maps subdimension scores to career categories
 */
function determineDominantCategory(detailedScores, cohort) {
    var interests = detailedScores.interests, values = detailedScores.values, workstyle = detailedScores.workstyle, context = detailedScores.context;
    // Calculate category scores based on subdimension patterns
    var categoryScores = {
        auttaja: 0,
        luova: 0,
        johtaja: 0,
        innovoija: 0,
        rakentaja: 0,
        'ympariston-puolustaja': 0,
        visionaari: 0,
        jarjestaja: 0
    };
    // auttaja: people interest, health interest, impact values, teaching/motivation workstyle (but NOT career_clarity or creative)
    categoryScores.auttaja += (interests.people || 0) * 1.2; // BOOSTED: Critical for helping professions
    categoryScores.auttaja += (interests.health || 0) * 1.5; // BOOSTED: Strong healthcare signal
    categoryScores.auttaja += (interests.education || 0) * 1.0; // BOOSTED: Teaching/education
    categoryScores.auttaja += (values.impact || 0) * 0.9; // BOOSTED: Making a difference
    categoryScores.auttaja += (workstyle.teaching || 0) * 0.8; // BOOSTED: Teaching style
    categoryScores.auttaja += (workstyle.motivation || 0) * 0.7;
    categoryScores.auttaja += (values.social_impact || 0) * 0.8; // BOOSTED: Social impact motivation
    // Penalize career_clarity and creative to avoid visionaari confusion
    categoryScores.auttaja -= (values.career_clarity || 0) * 0.3; // Penalize career_clarity to avoid visionaari confusion
    categoryScores.auttaja -= (interests.creative || 0) * 0.2; // Penalize creative to avoid visionaari confusion
    // luova: creative interest, arts_culture, writing (but NOT career_clarity or planning to avoid visionaari confusion)
    categoryScores.luova += (interests.creative || 0) * 1.3; // BOOSTED: Creative is key
    categoryScores.luova += (interests.arts_culture || 0) * 0.9; // BOOSTED: Arts/culture
    categoryScores.luova += (interests.writing || 0) * 0.8; // BOOSTED: Writing
    // Penalize career_clarity and planning to avoid visionaari confusion
    categoryScores.luova -= (values.career_clarity || 0) * 0.4; // Penalize career_clarity to avoid visionaari confusion
    categoryScores.luova -= (workstyle.planning || 0) * 0.3; // Penalize planning to avoid visionaari confusion
    // johtaja: leadership workstyle, planning, global values (but NOT analytical or organization to avoid jarjestaja confusion)
    categoryScores.johtaja += (workstyle.leadership || 0) * 1.3; // BOOSTED: Leadership is key
    categoryScores.johtaja += (workstyle.planning || 0) * 0.8; // BOOSTED: Planning for leadership
    categoryScores.johtaja += (values.global || 0) * 0.7; // BOOSTED: Global vision for leadership
    categoryScores.johtaja += (values.advancement || 0) * 0.8; // BOOSTED: Advancement for leadership
    categoryScores.johtaja += (values.entrepreneurship || 0) * 0.7; // Entrepreneurship can indicate leadership
    categoryScores.johtaja += (interests.leadership || 0) * 1.0; // Leadership interest
    // Penalize analytical, organization, and career_clarity to avoid jarjestaja/visionaari confusion
    categoryScores.johtaja -= (interests.analytical || 0) * 0.3; // Penalize analytical to avoid jarjestaja confusion
    categoryScores.johtaja -= (workstyle.organization || 0) * 0.2; // Slight penalty for organization to avoid jarjestaja confusion
    categoryScores.johtaja -= (values.career_clarity || 0) * 0.3; // Penalize career_clarity to avoid visionaari confusion
    // innovoija: technology interest, innovation, problem_solving (but NOT analytical or organization)
    categoryScores.innovoija += (interests.technology || 0) * 1.3; // BOOSTED: Technology is key
    categoryScores.innovoija += (interests.innovation || 0) * 0.9; // BOOSTED: Innovation interest
    categoryScores.innovoija += (workstyle.problem_solving || 0) * 0.7;
    categoryScores.innovoija += (values.entrepreneurship || 0) * 0.5; // Entrepreneurship can also indicate innovation
    // Penalize analytical and organization to avoid jarjestaja confusion
    categoryScores.innovoija -= (interests.analytical || 0) * 0.3; // Penalize analytical to avoid jarjestaja confusion
    categoryScores.innovoija -= (workstyle.organization || 0) * 0.3; // Penalize organization to avoid jarjestaja confusion
    // Cohort-specific penalties for NUORI to avoid visionaari confusion
    if (cohort === 'NUORI') {
        categoryScores.innovoija -= (values.global || 0) * 0.5; // Penalize global to avoid visionaari confusion (increased)
        categoryScores.innovoija -= (values.advancement || 0) * 0.4; // Penalize advancement to avoid visionaari confusion
        categoryScores.innovoija -= (values.growth || 0) * 0.4; // Penalize growth to avoid visionaari confusion
        categoryScores.innovoija -= (workstyle.flexibility || 0) * 0.3; // Penalize flexibility to avoid visionaari confusion
    }
    // rakentaja: hands_on interest, precision (but NOT career_clarity, creative, analytical, environment, or people)
    categoryScores.rakentaja += (interests.hands_on || 0) * 1.3; // BOOSTED: Hands-on is key
    categoryScores.rakentaja += (workstyle.precision || 0) * 0.8;
    categoryScores.rakentaja += (workstyle.performance || 0) * 0.6;
    // Penalize career_clarity, creative, analytical, environment, and people to avoid visionaari/jarjestaja/ympariston-puolustaja/auttaja confusion
    categoryScores.rakentaja -= (values.career_clarity || 0) * 0.4; // Penalize career_clarity to avoid visionaari confusion
    categoryScores.rakentaja -= (interests.creative || 0) * 0.3; // Penalize creative to avoid visionaari confusion
    categoryScores.rakentaja -= (interests.analytical || 0) * 0.4; // Penalize analytical to avoid jarjestaja confusion
    categoryScores.rakentaja -= (interests.environment || 0) * 0.4; // Penalize environment to avoid ympariston-puolustaja confusion
    categoryScores.rakentaja -= (interests.people || 0) * 0.4; // Penalize people to avoid auttaja confusion
    // ympariston-puolustaja: environment interest, nature, outdoor context, work_environment (but NOT career_clarity, analytical, organization, people, or health)
    categoryScores['ympariston-puolustaja'] += (interests.environment || 0) * 1.3; // BOOSTED: Environment is key
    categoryScores['ympariston-puolustaja'] += (interests.nature || 0) * 1.1; // BOOSTED: Nature interest
    categoryScores['ympariston-puolustaja'] += (((context === null || context === void 0 ? void 0 : context.outdoor) || 0) * 0.8); // BOOSTED: Outdoor context
    categoryScores['ympariston-puolustaja'] += (((context === null || context === void 0 ? void 0 : context.work_environment) || 0) * 1.2); // BOOSTED: Mobile/field work (outdoor context) - increased further for NUORI
    // Penalize career_clarity, analytical, organization, people, health, and hands_on to avoid visionaari/jarjestaja/auttaja/rakentaja confusion
    categoryScores['ympariston-puolustaja'] -= (values.career_clarity || 0) * 0.4; // Penalize career_clarity to avoid visionaari confusion
    categoryScores['ympariston-puolustaja'] -= (interests.analytical || 0) * 0.5; // Penalize analytical to avoid jarjestaja confusion (increased)
    categoryScores['ympariston-puolustaja'] -= (workstyle.organization || 0) * 0.5; // Penalize organization to avoid jarjestaja confusion (increased)
    categoryScores['ympariston-puolustaja'] -= (interests.people || 0) * 0.5; // Penalize people to avoid auttaja confusion
    categoryScores['ympariston-puolustaja'] -= (interests.health || 0) * 0.5; // Penalize health to avoid auttaja confusion
    categoryScores['ympariston-puolustaja'] -= (values.social_impact || 0) * 0.2; // Penalize social_impact slightly to avoid auttaja confusion
    categoryScores['ympariston-puolustaja'] -= (interests.hands_on || 0) * 0.5; // Penalize hands_on to avoid rakentaja confusion (increased)
    // Cohort-specific penalties for NUORI to avoid visionaari confusion
    if (cohort === 'NUORI') {
        categoryScores['ympariston-puolustaja'] -= (values.global || 0) * 0.6; // Penalize global to avoid visionaari confusion (increased)
        categoryScores['ympariston-puolustaja'] -= (values.advancement || 0) * 0.5; // Penalize advancement to avoid visionaari confusion
        categoryScores['ympariston-puolustaja'] -= (values.growth || 0) * 0.5; // Penalize growth to avoid visionaari confusion
        categoryScores['ympariston-puolustaja'] -= (workstyle.flexibility || 0) * 0.4; // Penalize flexibility to avoid visionaari confusion
    }
    // visionaari: planning workstyle, innovation, global values, career_clarity (but NOT leadership, analytical, hands-on, people, health, or creative)
    // Cohort-specific signals for Visionaari:
    // - YLA: career_clarity (values) - primary signal
    // - TASO2: entrepreneurship (values) + technology (interests) - alternative signals since no career_clarity
    // - NUORI: global (values) + advancement (values) + growth (values) + flexibility (workstyle) - alternative signals since no career_clarity
    categoryScores.visionaari += (workstyle.planning || 0) * 1.5; // BOOSTED: Planning is key for visionaari
    categoryScores.visionaari += (interests.innovation || 0) * 1.2; // BOOSTED: Innovation interest
    categoryScores.visionaari += (values.global || 0) * 1.3; // BOOSTED: Global values
    categoryScores.visionaari += (values.career_clarity || 0) * 2.5; // BOOSTED: Career clarity/planning (primary for YLA)
    // Cohort-specific alternative signals for TASO2 and NUORI
    if (cohort === 'TASO2') {
        // TASO2: entrepreneurship + technology (but not too strong to avoid innovoija/johtaja confusion)
        categoryScores.visionaari += (values.entrepreneurship || 0) * 1.2; // Entrepreneurship indicates vision/strategy
        categoryScores.visionaari += (interests.technology || 0) * 0.8; // Technology interest (but lower to avoid innovoija)
    }
    else if (cohort === 'NUORI') {
        // NUORI: global + advancement + growth + flexibility
        categoryScores.visionaari += (values.global || 0) * 0.5; // Additional boost for global (already boosted above)
        categoryScores.visionaari += (values.advancement || 0) * 1.0; // Advancement indicates vision/planning
        categoryScores.visionaari += (values.growth || 0) * 0.9; // Growth indicates vision/development
        categoryScores.visionaari += (workstyle.flexibility || 0) * 0.8; // Flexibility indicates adaptability/vision
    }
    // Explicitly reduce leadership, analytical, hands-on, people, health, and creative weights to differentiate from johtaja/jarjestaja/rakentaja/auttaja/luova
    categoryScores.visionaari -= (workstyle.leadership || 0) * 0.6; // Penalize leadership to avoid johtaja confusion (increased)
    categoryScores.visionaari -= (interests.leadership || 0) * 0.5; // Penalize leadership interest (increased)
    categoryScores.visionaari -= (interests.analytical || 0) * 0.6; // Penalize analytical to avoid jarjestaja confusion (increased)
    categoryScores.visionaari -= (workstyle.organization || 0) * 0.5; // Penalize organization to avoid jarjestaja confusion (increased)
    categoryScores.visionaari -= (interests.hands_on || 0) * 0.4; // Penalize hands-on to avoid rakentaja confusion
    categoryScores.visionaari -= (interests.people || 0) * 0.6; // Penalize people to avoid auttaja confusion (increased)
    categoryScores.visionaari -= (interests.health || 0) * 0.6; // Penalize health to avoid auttaja confusion (increased)
    categoryScores.visionaari -= (interests.creative || 0) * 0.4; // Penalize creative to avoid luova confusion
    // jarjestaja: organization, structure workstyle, precision, analytical interest
    categoryScores.jarjestaja += (workstyle.organization || 0) * 1.0; // Critical for organization
    categoryScores.jarjestaja += (workstyle.structure || 0) * 0.9; // Structure is key
    categoryScores.jarjestaja += (workstyle.precision || 0) * 0.8; // Precision matters
    categoryScores.jarjestaja += (values.stability || 0) * 0.7; // Stability preference
    categoryScores.jarjestaja += (interests.analytical || 0) * 1.0; // Analytical thinking
    // Find category with highest score
    var dominantCategory = Object.entries(categoryScores)
        .sort(function (_a, _b) {
        var a = _a[1];
        var b = _b[1];
        return b - a;
    })[0][0];
    return dominantCategory;
}
// ========== MAIN RANKING FUNCTION ==========
/**
 * Rank all careers for a user and return top matches
 * Now focuses on careers from the user's dominant category
 * Returns careers with dynamic count based on confidence levels
 */
function rankCareers(answers, cohort, limit) {
    var _a, _b;
    if (limit === void 0) { limit = 5; }
    // Step 1: Compute user vector
    var _c = computeUserVector(answers, cohort), dimensionScores = _c.dimensionScores, detailedScores = _c.detailedScores;
    // Step 2: Determine dominant category
    var dominantCategory = determineDominantCategory(detailedScores, cohort);
    console.log("[rankCareers] Dominant category: ".concat(dominantCategory));
    // Step 3: Filter careers to only those matching dominant category
    var categoryCareers = careerVectors_1.CAREER_VECTORS.filter(function (careerVector) { return careerVector.category === dominantCategory; });
    console.log("[rankCareers] Found ".concat(categoryCareers.length, " careers in category \"").concat(dominantCategory, "\""));
    // Step 4: If category has too few careers, supplement with next-best categories
    // But prioritize dominant category careers in final results
    // Only supplement if dominant category has fewer than 3 careers
    var careersToScore = __spreadArray([], categoryCareers, true);
    if (categoryCareers.length < 3) {
        console.log("[rankCareers] Category has only ".concat(categoryCareers.length, " careers, supplementing..."));
        // Recalculate category scores for supplementing
        var interests = detailedScores.interests, values = detailedScores.values, workstyle = detailedScores.workstyle, context = detailedScores.context;
        var categoryScores_1 = {};
        categoryScores_1.auttaja = (interests.people || 0) * 1.0 + (values.impact || 0) * 0.8;
        categoryScores_1.luova = (interests.creative || 0) * 1.0 + (interests.arts_culture || 0) * 0.8;
        categoryScores_1.johtaja = (workstyle.leadership || 0) * 1.0 + (workstyle.organization || 0) * 0.8;
        categoryScores_1.innovoija = (interests.technology || 0) * 1.0 + (interests.innovation || 0) * 0.8;
        categoryScores_1.rakentaja = (interests.hands_on || 0) * 1.0 + (workstyle.precision || 0) * 0.8;
        categoryScores_1['ympariston-puolustaja'] = (interests.environment || 0) * 1.0 + (interests.nature || 0) * 0.8;
        categoryScores_1.visionaari = (workstyle.planning || 0) * 0.8 + (values.global || 0) * 0.8;
        categoryScores_1.jarjestaja = (workstyle.organization || 0) * 0.9 + (workstyle.structure || 0) * 0.8;
        var allCategories = ['auttaja', 'luova', 'johtaja', 'innovoija', 'rakentaja',
            'ympariston-puolustaja', 'visionaari', 'jarjestaja'];
        var sortedCategories = allCategories.sort(function (a, b) { return categoryScores_1[b] - categoryScores_1[a]; });
        var _loop_1 = function (category) {
            if (careersToScore.length >= limit * 2)
                return "break"; // Get enough for ranking
            if (category === dominantCategory)
                return "continue"; // Already added
            var additionalCareers = careerVectors_1.CAREER_VECTORS.filter(function (cv) { return cv.category === category; });
            careersToScore = __spreadArray(__spreadArray([], careersToScore, true), additionalCareers, true);
        };
        // Add careers from next-best categories until we have enough for ranking
        for (var _i = 0, sortedCategories_1 = sortedCategories; _i < sortedCategories_1.length; _i++) {
            var category = sortedCategories_1[_i];
            var state_1 = _loop_1(category);
            if (state_1 === "break")
                break;
        }
    }
    else {
        console.log("[rankCareers] Using only ".concat(categoryCareers.length, " careers from dominant category"));
    }
    // Step 5: Score filtered careers with enhanced matching
    var scoredCareers = careersToScore.map(function (careerVector) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        var _0 = computeCareerFit(detailedScores, careerVector, cohort, dominantCategory // Pass category for category-specific weighting
        ), overallScore = _0.overallScore, dimScores = _0.dimensionScores;
        // ENHANCED MATCHING: Apply boosts BEFORE filtering
        // This ensures careers that match key interests get proper scores
        // Healthcare boost: if user has strong health interest and career is healthcare
        var userHealthScore = detailedScores.interests.health || 0;
        var careerHealthScore = ((_a = careerVector.interests) === null || _a === void 0 ? void 0 : _a.health) || 0;
        if (userHealthScore >= 0.4 && careerHealthScore >= 0.7) {
            // More aggressive boost for healthcare careers
            var healthBoost = Math.min(30, userHealthScore * 50); // Up to 30% boost
            overallScore = Math.min(100, overallScore + healthBoost);
            console.log("[rankCareers] Boosted ".concat(careerVector.title, " by ").concat(healthBoost.toFixed(1), "% (health: ").concat(userHealthScore.toFixed(2), " -> ").concat(careerHealthScore.toFixed(2), ", base: ").concat((overallScore - healthBoost).toFixed(1), "%)"));
        }
        // People boost: if user has strong people interest and career is people-oriented
        var userPeopleScore = detailedScores.interests.people || 0;
        var careerPeopleScore = ((_b = careerVector.interests) === null || _b === void 0 ? void 0 : _b.people) || 0;
        if (userPeopleScore >= 0.6 && careerPeopleScore >= 0.7 && dominantCategory === 'auttaja') {
            var peopleBoost = Math.min(15, userPeopleScore * 25); // Up to 15% boost
            overallScore = Math.min(100, overallScore + peopleBoost);
        }
        // Education boost: if user has strong education interest and career is teaching
        var userEducationScore = detailedScores.interests.education || 0;
        var careerEducationScore = ((_c = careerVector.interests) === null || _c === void 0 ? void 0 : _c.education) || 0;
        if (userEducationScore >= 0.6 && careerEducationScore >= 0.7 && dominantCategory === 'auttaja') {
            var educationBoost = Math.min(10, userEducationScore * 20); // Up to 10% boost
            overallScore = Math.min(100, overallScore + educationBoost);
        }
        // Technology boost: if user has strong tech interest and career is tech
        var userTechScoreInnovoija = detailedScores.interests.technology || 0;
        var careerTechScore = ((_d = careerVector.interests) === null || _d === void 0 ? void 0 : _d.technology) || 0;
        if (userTechScoreInnovoija >= 0.6 && careerTechScore >= 0.7 && dominantCategory === 'innovoija') {
            var techBoost = Math.min(20, userTechScoreInnovoija * 35); // Up to 20% boost
            overallScore = Math.min(100, overallScore + techBoost);
        }
        // Creative boost: if user has strong creative interest and career is creative
        var userCreativeScore = detailedScores.interests.creative || 0;
        var careerCreativeScore = ((_e = careerVector.interests) === null || _e === void 0 ? void 0 : _e.creative) || 0;
        if (userCreativeScore >= 0.6 && careerCreativeScore >= 0.7 && dominantCategory === 'luova') {
            var creativeBoost = Math.min(20, userCreativeScore * 35); // Up to 20% boost
            overallScore = Math.min(100, overallScore + creativeBoost);
        }
        // Environment boost: if user has strong environment interest and career is environment-oriented
        var userEnvironmentScore = detailedScores.interests.environment || 0;
        var careerEnvironmentScore = ((_f = careerVector.interests) === null || _f === void 0 ? void 0 : _f.environment) || 0;
        if (userEnvironmentScore >= 0.5 && careerEnvironmentScore >= 0.6 && dominantCategory === 'ympariston-puolustaja') {
            var envBoost = Math.min(25, userEnvironmentScore * 40); // Up to 25% boost
            overallScore = Math.min(100, overallScore + envBoost);
        }
        // Analytical boost: if user has strong analytical interest and career is analytical/organizational
        var userAnalyticalScore = detailedScores.interests.analytical || 0;
        var careerAnalyticalScore = ((_g = careerVector.interests) === null || _g === void 0 ? void 0 : _g.analytical) || 0;
        if (userAnalyticalScore >= 0.5 && careerAnalyticalScore >= 0.6 && dominantCategory === 'jarjestaja') {
            var analyticalBoost = Math.min(20, userAnalyticalScore * 35); // Up to 20% boost
            overallScore = Math.min(100, overallScore + analyticalBoost);
        }
        // Hands-on boost: if user has strong hands-on interest and career is hands-on/practical
        var userHandsOnScore = detailedScores.interests.hands_on || 0;
        var careerHandsOnScore = ((_h = careerVector.interests) === null || _h === void 0 ? void 0 : _h.hands_on) || 0;
        if (userHandsOnScore >= 0.5 && careerHandsOnScore >= 0.6 && dominantCategory === 'rakentaja') {
            var handsOnBoost = Math.min(25, userHandsOnScore * 40); // Up to 25% boost
            overallScore = Math.min(100, overallScore + handsOnBoost);
        }
        // Leadership boost: if user has strong leadership workstyle/interest and career is leadership-oriented
        var userLeadershipWorkstyle = ((_j = detailedScores.workstyle) === null || _j === void 0 ? void 0 : _j.leadership) || 0;
        var userLeadershipInterest = ((_k = detailedScores.interests) === null || _k === void 0 ? void 0 : _k.leadership) || 0;
        var careerLeadershipWorkstyle = ((_l = careerVector.workstyle) === null || _l === void 0 ? void 0 : _l.leadership) || 0;
        var combinedLeadership = Math.max(userLeadershipWorkstyle, userLeadershipInterest);
        if (combinedLeadership >= 0.2 && careerLeadershipWorkstyle >= 0.4 && dominantCategory === 'johtaja') {
            var leadershipBoost = Math.min(45, combinedLeadership * 80); // Up to 45% boost (increased further)
            overallScore = Math.min(100, overallScore + leadershipBoost);
        }
        // Planning boost: if user has strong career_clarity (planning) values and career is planning/vision-oriented
        var userCareerClarity = ((_m = detailedScores.values) === null || _m === void 0 ? void 0 : _m.career_clarity) || 0;
        var userGlobalValues = ((_o = detailedScores.values) === null || _o === void 0 ? void 0 : _o.global) || 0;
        var userCreativeInterest = ((_p = detailedScores.interests) === null || _p === void 0 ? void 0 : _p.creative) || 0;
        var userEntrepreneurship = ((_q = detailedScores.values) === null || _q === void 0 ? void 0 : _q.entrepreneurship) || 0;
        var userTechScore = ((_r = detailedScores.interests) === null || _r === void 0 ? void 0 : _r.technology) || 0;
        var userAdvancement = ((_s = detailedScores.values) === null || _s === void 0 ? void 0 : _s.advancement) || 0;
        var userGrowth = ((_t = detailedScores.values) === null || _t === void 0 ? void 0 : _t.growth) || 0;
        var userFlexibility = ((_u = detailedScores.workstyle) === null || _u === void 0 ? void 0 : _u.flexibility) || 0;
        if (dominantCategory === 'visionaari') {
            // Boost for career_clarity (strongest signal for YLA)
            if (userCareerClarity >= 0.3) {
                var planningBoost = Math.min(40, userCareerClarity * 80); // Up to 40% boost for career_clarity
                overallScore = Math.min(100, overallScore + planningBoost);
            }
            // Cohort-specific boosts
            if (cohort === 'TASO2') {
                // TASO2: entrepreneurship + technology
                if (userEntrepreneurship >= 0.4) {
                    var entrepreneurshipBoost = Math.min(35, userEntrepreneurship * 70); // Up to 35% boost
                    overallScore = Math.min(100, overallScore + entrepreneurshipBoost);
                }
                if (userTechScore >= 0.5) {
                    var techBoost = Math.min(25, userTechScore * 40); // Up to 25% boost
                    overallScore = Math.min(100, overallScore + techBoost);
                }
            }
            else if (cohort === 'NUORI') {
                // NUORI: global + advancement + growth + flexibility
                if (userGlobalValues >= 0.4) {
                    var globalBoost = Math.min(30, userGlobalValues * 50); // Up to 30% boost
                    overallScore = Math.min(100, overallScore + globalBoost);
                }
                if (userAdvancement >= 0.4) {
                    var advancementBoost = Math.min(30, userAdvancement * 50); // Up to 30% boost
                    overallScore = Math.min(100, overallScore + advancementBoost);
                }
                if (userGrowth >= 0.4) {
                    var growthBoost = Math.min(25, userGrowth * 45); // Up to 25% boost
                    overallScore = Math.min(100, overallScore + growthBoost);
                }
                if (userFlexibility >= 0.4) {
                    var flexibilityBoost = Math.min(20, userFlexibility * 40); // Up to 20% boost
                    overallScore = Math.min(100, overallScore + flexibilityBoost);
                }
            }
            else {
                // YLA: creative interest (innovation/vision) - but only if career_clarity is also present to avoid luova confusion
                if (userCreativeInterest >= 0.5 && userCareerClarity >= 0.2) {
                    var creativeBoost = Math.min(30, userCreativeInterest * 50); // Up to 30% boost for creative
                    overallScore = Math.min(100, overallScore + creativeBoost);
                }
                // Boost for global values (but lower to avoid johtaja confusion)
                if (userGlobalValues >= 0.4 && userCareerClarity >= 0.2) {
                    var globalBoost = Math.min(20, userGlobalValues * 30); // Up to 20% boost for global
                    overallScore = Math.min(100, overallScore + globalBoost);
                }
            }
        }
        // Get full career data
        var careerFI = careers_fi_1.careersData.find(function (c) { return c && c.id === careerVector.slug; });
        // Generate reasons (with answers for enhanced personalization)
        var reasons = generateReasons(careerVector, careerFI, detailedScores, dimScores, cohort, answers // Pass answers for enhanced reasons
        );
        // Determine confidence
        var confidence = overallScore >= 75 ? 'high' : overallScore >= 60 ? 'medium' : 'low';
        return {
            slug: careerVector.slug,
            title: careerVector.title,
            category: careerVector.category,
            overallScore: Math.round(overallScore),
            dimensionScores: dimScores,
            reasons: reasons.filter(function (r) { return r.length > 0; }),
            confidence: confidence,
            salaryRange: careerFI ? [
                ((_w = (_v = careerFI.salary_eur_month) === null || _v === void 0 ? void 0 : _v.range) === null || _w === void 0 ? void 0 : _w[0]) || 2500,
                ((_y = (_x = careerFI.salary_eur_month) === null || _x === void 0 ? void 0 : _x.range) === null || _y === void 0 ? void 0 : _y[1]) || 4000
            ] : undefined,
            outlook: (_z = careerFI === null || careerFI === void 0 ? void 0 : careerFI.job_outlook) === null || _z === void 0 ? void 0 : _z.status
        };
    })
        .filter(function (career) {
        var _a, _b, _c;
        // MINIMUM THRESHOLD: Only show careers with at least 40% match
        // This prevents showing careers that are clearly not a good fit
        var MINIMUM_MATCH_THRESHOLD = 40;
        if (career.overallScore < MINIMUM_MATCH_THRESHOLD) {
            console.log("[rankCareers] Filtered out ".concat(career.title, " (score: ").concat(career.overallScore, "% < ").concat(MINIMUM_MATCH_THRESHOLD, "%)"));
            return false;
        }
        // SUBDIMENSION MISMATCH FILTER: If user has strong interest in a specific area,
        // filter out careers with zero score in that area
        var careerVector = careersToScore.find(function (cv) { return cv.slug === career.slug; });
        if (!careerVector)
            return true;
        // Check healthcare mismatch - filter out non-healthcare careers if user has very strong health interest
        var userHealthScore = detailedScores.interests.health || 0;
        var careerHealthScore = ((_a = careerVector.interests) === null || _a === void 0 ? void 0 : _a.health) || 0;
        var userPeopleScore = detailedScores.interests.people || 0;
        // Filter out non-healthcare careers if user has very strong health interest (>=0.7)
        if (userHealthScore >= 0.7 && careerHealthScore === 0 && career.category === 'auttaja') {
            console.log("[rankCareers] Filtered out ".concat(career.title, " (user wants healthcare ").concat(userHealthScore.toFixed(2), " but career has health=0)"));
            return false;
        }
        // Check technology mismatch
        var userTechScore = detailedScores.interests.technology || 0;
        var careerTechScore = ((_b = careerVector.interests) === null || _b === void 0 ? void 0 : _b.technology) || 0;
        if (userTechScore >= 0.6 && careerTechScore === 0 && career.category === 'innovoija') {
            console.log("[rankCareers] Filtered out ".concat(career.title, " (user wants tech ").concat(userTechScore.toFixed(2), " but career has tech=0)"));
            return false;
        }
        // Check creative mismatch
        var userCreativeScore = detailedScores.interests.creative || 0;
        var careerCreativeScore = ((_c = careerVector.interests) === null || _c === void 0 ? void 0 : _c.creative) || 0;
        if (userCreativeScore >= 0.6 && careerCreativeScore === 0 && career.category === 'luova') {
            console.log("[rankCareers] Filtered out ".concat(career.title, " (user wants creative ").concat(userCreativeScore.toFixed(2), " but career has creative=0)"));
            return false;
        }
        return true;
    });
    var getMedianSalary = function (career) {
        if (!career.salaryRange)
            return 0;
        return (career.salaryRange[0] + career.salaryRange[1]) / 2;
    };
    // Step 6: Sort by dominant category, demand outlook and score
    // ENHANCED: Prioritize Finnish careers over English ones when scores are close
    var sortedCareers = scoredCareers.sort(function (a, b) {
        // First prioritize by category match
        var aIsDominant = a.category === dominantCategory;
        var bIsDominant = b.category === dominantCategory;
        if (aIsDominant && !bIsDominant)
            return -1;
        if (!aIsDominant && bIsDominant)
            return 1;
        // ENHANCED: If both are in dominant category and scores are close, prioritize Finnish careers
        var scoreDiff = b.overallScore - a.overallScore;
        var isAFinnish = !/[A-Z]/.test(a.title.charAt(0)) || a.title.includes('ä') || a.title.includes('ö') || a.title.includes('å');
        var isBFinnish = !/[A-Z]/.test(b.title.charAt(0)) || b.title.includes('ä') || b.title.includes('ö') || b.title.includes('å');
        // If scores are within 5%, prioritize Finnish careers
        if (Math.abs(scoreDiff) <= 5 && aIsDominant && bIsDominant) {
            if (isAFinnish && !isBFinnish)
                return -1;
            if (!isAFinnish && isBFinnish)
                return 1;
        }
        // Then by demand outlook
        var demandDiff = (0, rankingConfig_1.getDemandWeight)(b.outlook) - (0, rankingConfig_1.getDemandWeight)(a.outlook);
        if (demandDiff !== 0)
            return demandDiff;
        // Then by score
        if (scoreDiff !== 0)
            return scoreDiff;
        // Finally by salary potential to break ties
        var salaryDiff = getMedianSalary(b) - getMedianSalary(a);
        if (salaryDiff !== 0)
            return salaryDiff;
        return a.title.localeCompare(b.title, 'fi');
    });
    // Step 7: Deduplicate by title (case-insensitive, ignoring hyphens and spaces)
    var normalizeTitle = function (title) {
        return title.toLowerCase().replace(/[-\s]/g, '').trim();
    };
    var seenTitles = new Set();
    var deduplicatedCareers = sortedCareers.filter(function (career) {
        var normalized = normalizeTitle(career.title);
        if (seenTitles.has(normalized)) {
            console.log("[rankCareers] Removing duplicate: ".concat(career.title, " (already seen)"));
            return false;
        }
        seenTitles.add(normalized);
        return true;
    });
    // Step 8: Limit to top demand-driven matches (default max 5)
    var dynamicLimit = Math.min(limit, 5);
    var demandSortedPreferred = deduplicatedCareers
        .filter(function (c) { return c.category === dominantCategory; })
        .sort(function (a, b) {
        // ENHANCED: Prioritize Finnish careers when scores are close
        var scoreDiff = b.overallScore - a.overallScore;
        var isAFinnish = !/[A-Z]/.test(a.title.charAt(0)) || a.title.includes('ä') || a.title.includes('ö') || a.title.includes('å');
        var isBFinnish = !/[A-Z]/.test(b.title.charAt(0)) || b.title.includes('ä') || b.title.includes('ö') || b.title.includes('å');
        // If scores are within 10%, prioritize Finnish careers
        if (Math.abs(scoreDiff) <= 10) {
            if (isAFinnish && !isBFinnish)
                return -1;
            if (!isAFinnish && isBFinnish)
                return 1;
        }
        var demandDiff = (0, rankingConfig_1.getDemandWeight)(b.outlook) - (0, rankingConfig_1.getDemandWeight)(a.outlook);
        if (demandDiff !== 0)
            return demandDiff;
        if (scoreDiff !== 0)
            return scoreDiff;
        var salaryDiff = getMedianSalary(b) - getMedianSalary(a);
        if (salaryDiff !== 0)
            return salaryDiff;
        return a.title.localeCompare(b.title, 'fi');
    });
    var demandSortedFallback = deduplicatedCareers
        .filter(function (c) { return c.category !== dominantCategory; })
        .sort(function (a, b) {
        var demandDiff = (0, rankingConfig_1.getDemandWeight)(b.outlook) - (0, rankingConfig_1.getDemandWeight)(a.outlook);
        if (demandDiff !== 0)
            return demandDiff;
        var scoreDiff = b.overallScore - a.overallScore;
        if (scoreDiff !== 0)
            return scoreDiff;
        var salaryDiff = getMedianSalary(b) - getMedianSalary(a);
        if (salaryDiff !== 0)
            return salaryDiff;
        return a.title.localeCompare(b.title, 'fi');
    });
    var combinedResults = __spreadArray(__spreadArray([], demandSortedPreferred, true), demandSortedFallback, true);
    var candidateEnvelopes = combinedResults.map(function (career) {
        var key = (0, rankingConfig_1.getDiversityKey)(career.title);
        var demandWeight = (0, rankingConfig_1.getDemandWeight)(career.outlook);
        var demandBoost = demandWeight * rankingConfig_1.RANKING_WEIGHTS.demandBoost;
        var categoryBoost = career.category === dominantCategory ? rankingConfig_1.RANKING_WEIGHTS.demandBoost : 0;
        // ENHANCED: Boost Finnish careers to prioritize them over English ones
        var isFinnish = !/[A-Z]/.test(career.title.charAt(0)) || career.title.includes('ä') || career.title.includes('ö') || career.title.includes('å');
        var finnishBoost = isFinnish && career.category === dominantCategory ? 5 : 0; // Small boost for Finnish careers
        var rankScore = career.overallScore + demandBoost + categoryBoost + finnishBoost;
        return {
            career: career,
            key: key,
            demandWeight: demandWeight,
            rankScore: rankScore,
            priority: categoryBoost > 0 ? 1 : 0
        };
    });
    candidateEnvelopes.sort(function (a, b) {
        if (a.priority !== b.priority)
            return b.priority - a.priority;
        if (b.rankScore !== a.rankScore)
            return b.rankScore - a.rankScore;
        var salaryDiff = getMedianSalary(b.career) - getMedianSalary(a.career);
        if (salaryDiff !== 0)
            return salaryDiff;
        return a.career.title.localeCompare(b.career.title, 'fi');
    });
    var diversityCounts = new Map();
    var selected = [];
    var overflow = [];
    for (var _d = 0, candidateEnvelopes_1 = candidateEnvelopes; _d < candidateEnvelopes_1.length; _d++) {
        var candidate = candidateEnvelopes_1[_d];
        var count = (_a = diversityCounts.get(candidate.key)) !== null && _a !== void 0 ? _a : 0;
        if (count < rankingConfig_1.RANKING_WEIGHTS.primaryDiversityLimit) {
            diversityCounts.set(candidate.key, count + 1);
            selected.push(candidate);
        }
        else {
            overflow.push(candidate);
        }
    }
    for (var _e = 0, overflow_1 = overflow; _e < overflow_1.length; _e++) {
        var candidate = overflow_1[_e];
        if (selected.length >= dynamicLimit)
            break;
        var count = (_b = diversityCounts.get(candidate.key)) !== null && _b !== void 0 ? _b : 0;
        if (count < rankingConfig_1.RANKING_WEIGHTS.fallbackDiversityLimit) {
            diversityCounts.set(candidate.key, count + 1);
            selected.push(candidate);
        }
    }
    // If we still do not have enough results, append remaining overflow even if duplicates
    var overflowIndex = 0;
    while (selected.length < dynamicLimit && overflowIndex < overflow.length) {
        var candidate = overflow[overflowIndex++];
        selected.push(candidate);
    }
    var finalResults = selected
        .sort(function (a, b) {
        if (a.priority !== b.priority)
            return b.priority - a.priority;
        if (b.rankScore !== a.rankScore)
            return b.rankScore - a.rankScore;
        var demandDiff = b.demandWeight - a.demandWeight;
        if (demandDiff !== 0)
            return demandDiff;
        var salaryDiff = getMedianSalary(b.career) - getMedianSalary(a.career);
        if (salaryDiff !== 0)
            return salaryDiff;
        return a.career.title.localeCompare(b.career.title, 'fi');
    })
        .slice(0, dynamicLimit)
        .map(function (entry) { return entry.career; });
    var resultCategories = finalResults.map(function (c) { return c.category; });
    var growthCount = finalResults.filter(function (c) { return c.outlook === 'kasvaa'; }).length;
    console.log("[rankCareers] Returning ".concat(finalResults.length, " careers (dominant: ").concat(dominantCategory, ", kasvava ala: ").concat(growthCount, ") \u2013 categories: ").concat(resultCategories.join(', ')));
    return finalResults;
}
/**
 * Generate user profile summary
 */
function generateUserProfile(answers, cohort) {
    var _a = computeUserVector(answers, cohort), dimensionScores = _a.dimensionScores, detailedScores = _a.detailedScores;
    // Find top strengths
    var allScores = __spreadArray(__spreadArray([], Object.entries(detailedScores.interests).map(function (_a) {
        var k = _a[0], v = _a[1];
        return ({ key: k, value: v, type: 'interests' });
    }), true), Object.entries(detailedScores.workstyle).map(function (_a) {
        var k = _a[0], v = _a[1];
        return ({ key: k, value: v, type: 'workstyle' });
    }), true);
    var topStrengths = allScores
        .filter(function (s) { return s.value > 0.6; })
        .sort(function (a, b) { return b.value - a.value; })
        .slice(0, 3)
        .map(function (s) { return translateStrength(s.key, cohort); });
    var userProfile = {
        cohort: cohort,
        dimensionScores: dimensionScores,
        detailedScores: detailedScores,
        topStrengths: topStrengths
    };
    // Generate personalized analysis text
    var personalizedText = (0, personalizedAnalysis_1.generatePersonalizedAnalysis)(userProfile, cohort);
    return __assign(__assign({}, userProfile), { personalizedAnalysis: personalizedText });
}
function translateStrength(key, cohort) {
    var translations = {
        // Interests sub-dimensions
        technology: "Vahva teknologiakiinnostus",
        people: "Ihmiskeskeisyys",
        creative: "Luovuus ja innovatiivisuus",
        analytical: "Analyyttinen ajattelu",
        hands_on: "Käytännön tekeminen",
        business: "Yritystoiminta ja liiketoiminta",
        environment: "Ympäristökiinnostus",
        health: "Terveysala",
        education: "Kasvatus ja opetus",
        innovation: "Innovatiivisuus",
        arts_culture: "Taide ja kulttuuri",
        sports: "Urheilu",
        nature: "Luonto",
        writing: "Kirjoittaminen",
        // Workstyle sub-dimensions
        teamwork: "Tiimityöskentely",
        independence: "Itsenäinen työskentely",
        leadership: "Johtaminen",
        organization: "Organisointikyky",
        planning: "Suunnittelu",
        problem_solving: "Ongelmanratkaisukyky",
        precision: "Tarkkuus",
        performance: "Suorituskyky",
        teaching: "Opetus",
        motivation: "Motivaatio",
        autonomy: "Autonomia",
        social: "Sosiaalisuus",
        structure: "Rakenne",
        flexibility: "Joustavuus",
        variety: "Monipuolisuus",
        // Values sub-dimensions
        growth: "Kasvu",
        impact: "Vaikuttaminen",
        global: "Kansainvälinen",
        career_clarity: "Uran selkeys",
        financial: "Talous",
        entrepreneurship: "Yrittäjyys",
        social_impact: "Sosiaalinen vaikutus",
        stability: "Vakaus",
        advancement: "Urakehitys",
        work_life_balance: "Työ-elämä-tasapaino",
        company_size: "Yrityksen koko",
        // Context sub-dimensions
        outdoor: "Ulkotyö",
        international: "Kansainvälinen",
        work_environment: "Työympäristö"
    };
    return translations[key] || key;
}
