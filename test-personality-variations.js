"use strict";
/**
 * Comprehensive Personality Variation Test Suite
 * Tests introvert/extrovert and other personality variations across all cohorts
 * Verifies that career recommendations match the test taker's personality perfectly
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var tsconfig_paths_1 = require("tsconfig-paths");
// Register path aliases
var tsConfig = require('./tsconfig.json');
var baseUrl = tsConfig.compilerOptions.baseUrl || '.';
var paths = tsConfig.compilerOptions.paths || {};
(0, tsconfig_paths_1.register)({
    baseUrl: path_1.default.resolve(__dirname, baseUrl),
    paths: Object.keys(paths).reduce(function (acc, key) {
        acc[key] = paths[key].map(function (p) { return path_1.default.resolve(__dirname, baseUrl, p); });
        return acc;
    }, {}),
});
var scoringEngine_1 = require("./lib/scoring/scoringEngine");
// ========== PERSONALITY VARIATION BUILDERS ==========
/**
 * INTROVERT: Prefers working alone, low social interaction, analytical/technical focus
 */
function buildIntrovertAnswers(cohort) {
    var answers = [];
    if (cohort === 'YLA') {
        // YLA Introvert: Low social (Q28), high analytical (Q0, Q1), low people (Q16, Q21, Q28)
        for (var i = 0; i < 30; i++) {
            if (i === 0 || i === 1) { // Analytical (reading, math)
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 15) { // Technology
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 16 || i === 21 || i === 28) { // People/Health/Education/Social (VERY LOW for introvert)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 2 || i === 5 || i === 7 || i === 20 || i === 25) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 14 || i === 17) { // Creative (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 19) { // Leadership (low)
                answers.push({ questionIndex: i, score: 1 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    else if (cohort === 'TASO2') {
        // TASO2 Introvert: Low social/people (Q7-11), high analytical/tech (Q0, Q4, Q6, Q14)
        for (var i = 0; i < 30; i++) {
            if (i === 0 || i === 4 || i === 6 || i === 14) { // Technology/Analytical
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 7 || i === 8 || i === 9 || i === 10 || i === 11) { // Health/People/Social (VERY LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 2 || i === 15) { // Creative (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 20 || i === 21 || i === 22 || i === 23) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 1) { // Leadership (very low)
                answers.push({ questionIndex: i, score: 1 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    else { // NUORI
        // NUORI Introvert: Low social/people (Q1, Q7-11), high analytical/tech (Q0, Q4, Q6, Q7)
        for (var i = 0; i < 30; i++) {
            if (i === 0 || i === 4 || i === 6) { // Technology/Analytical
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 1 || i === 7 || i === 8 || i === 9 || i === 10 || i === 11) { // Health/People/Social (VERY LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 2 || i === 15 || i === 17) { // Creative (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 9 || i === 25) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 3 || i === 26) { // Leadership (very low)
                answers.push({ questionIndex: i, score: 1 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    return answers;
}
/**
 * EXTROVERT: Prefers working with people, high social interaction, people-oriented
 */
function buildExtrovertAnswers(cohort) {
    var answers = [];
    if (cohort === 'YLA') {
        // YLA Extrovert: High social (Q28), high people (Q16, Q21, Q28), low analytical/tech
        for (var i = 0; i < 30; i++) {
            if (i === 16 || i === 21) { // Health/Education (people-oriented)
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 28) { // Social interaction (HIGH for extrovert)
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 19) { // Leadership (extroverts often have leadership)
                answers.push({ questionIndex: i, score: 4 });
            }
            else if (i === 0 || i === 1 || i === 15) { // Analytical/Technology (LOW for extrovert)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 2 || i === 5 || i === 7 || i === 20 || i === 25) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 14 || i === 17) { // Creative (medium)
                answers.push({ questionIndex: i, score: 3 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    else if (cohort === 'TASO2') {
        // TASO2 Extrovert: High people/social (Q7-11), low analytical/tech
        for (var i = 0; i < 30; i++) {
            if (i === 7 || i === 8 || i === 9 || i === 10 || i === 11) { // Health/People/Social (HIGH)
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 1) { // Leadership (extroverts often have leadership)
                answers.push({ questionIndex: i, score: 4 });
            }
            else if (i === 0 || i === 4 || i === 6 || i === 14) { // Technology/Analytical (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 20 || i === 21 || i === 22 || i === 23) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 2 || i === 15) { // Creative (medium)
                answers.push({ questionIndex: i, score: 3 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    else { // NUORI
        // NUORI Extrovert: High people/social (Q1, Q7-11), low analytical/tech
        for (var i = 0; i < 30; i++) {
            if (i === 1 || i === 7 || i === 8 || i === 9 || i === 10 || i === 11) { // Health/People/Social (HIGH)
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 3 || i === 26) { // Leadership (extroverts often have leadership)
                answers.push({ questionIndex: i, score: 4 });
            }
            else if (i === 0 || i === 4 || i === 6) { // Technology/Analytical (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 9 || i === 25) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 2 || i === 15 || i === 17) { // Creative (medium)
                answers.push({ questionIndex: i, score: 3 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    return answers;
}
/**
 * ANALYTICAL THINKER: High analytical, low creative/social, prefers structured work
 */
function buildAnalyticalThinkerAnswers(cohort) {
    var answers = [];
    if (cohort === 'YLA') {
        // YLA Analytical: High analytical (Q0, Q1), high structure/organization, low creative/social
        for (var i = 0; i < 30; i++) {
            if (i === 0 || i === 1) { // Analytical (reading, math)
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 15) { // Technology
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 14 || i === 17) { // Creative (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 16 || i === 21 || i === 28) { // People/Social (LOW)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 2 || i === 5 || i === 7 || i === 20 || i === 25) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    else if (cohort === 'TASO2') {
        // TASO2 Analytical: High analytical/tech, low creative/people
        for (var i = 0; i < 30; i++) {
            if (i === 0 || i === 4 || i === 6 || i === 14) { // Technology/Analytical
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 2 || i === 15) { // Creative (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 7 || i === 8 || i === 9 || i === 10 || i === 11) { // People/Social (LOW)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 20 || i === 21 || i === 22 || i === 23) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    else { // NUORI
        // NUORI Analytical: High analytical/tech, low creative/people
        for (var i = 0; i < 30; i++) {
            if (i === 0 || i === 4 || i === 6) { // Technology/Analytical
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 2 || i === 15 || i === 17) { // Creative (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 1 || i === 7 || i === 8 || i === 9 || i === 10 || i === 11) { // People/Social (LOW)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 9 || i === 25) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    return answers;
}
/**
 * CREATIVE ARTIST: High creative, low analytical/technical, expressive
 */
function buildCreativeArtistAnswers(cohort) {
    var answers = [];
    if (cohort === 'YLA') {
        // YLA Creative: High creative (Q14, Q17), low analytical/tech
        for (var i = 0; i < 30; i++) {
            if (i === 14 || i === 17) { // Creative (arts/music)
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 0 || i === 1 || i === 15) { // Analytical/Technology (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 13 || i === 27) { // Career clarity/Global (low to avoid visionaari)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 16 || i === 21 || i === 28) { // People/Social (medium)
                answers.push({ questionIndex: i, score: 3 });
            }
            else if (i === 2 || i === 5 || i === 7 || i === 20 || i === 25) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    else if (cohort === 'TASO2') {
        // TASO2 Creative: High creative, low analytical/tech
        for (var i = 0; i < 30; i++) {
            if (i === 2 || i === 15 || i === 17) { // Creative
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 0 || i === 4 || i === 6 || i === 14) { // Technology/Analytical (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 7 || i === 8 || i === 9 || i === 10 || i === 11) { // People/Social (medium)
                answers.push({ questionIndex: i, score: 3 });
            }
            else if (i === 20 || i === 21 || i === 22 || i === 23) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    else { // NUORI
        // NUORI Creative: High creative, low analytical/tech
        for (var i = 0; i < 30; i++) {
            if (i === 2 || i === 8 || i === 14 || i === 15 || i === 16 || i === 17 || i === 18) { // Creative
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 0 || i === 4 || i === 6) { // Technology/Analytical (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 1 || i === 7 || i === 8 || i === 9 || i === 10 || i === 11) { // People/Social (medium)
                answers.push({ questionIndex: i, score: 3 });
            }
            else if (i === 9 || i === 25) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    return answers;
}
/**
 * HANDS-ON MAKER: High hands-on, low analytical/creative, practical
 */
function buildHandsOnMakerAnswers(cohort) {
    var answers = [];
    if (cohort === 'YLA') {
        // YLA Hands-on: High hands-on (Q2, Q5, Q7, Q20, Q25), low analytical/creative
        for (var i = 0; i < 30; i++) {
            if (i === 2 || i === 5 || i === 7 || i === 20 || i === 25) { // Hands-on (practical work)
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 0 || i === 1 || i === 15) { // Analytical/Technology (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 14 || i === 17) { // Creative (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 16 || i === 21 || i === 28) { // People/Social (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else if (i === 13 || i === 27) { // Career clarity/Global (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    else if (cohort === 'TASO2') {
        // TASO2 Hands-on: High hands-on, low analytical/creative
        for (var i = 0; i < 30; i++) {
            if (i === 20 || i === 21 || i === 22 || i === 23) { // Hands-on
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 0 || i === 4 || i === 6 || i === 14) { // Technology/Analytical (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 2 || i === 15) { // Creative (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 7 || i === 8 || i === 9 || i === 10 || i === 11) { // People/Social (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    else { // NUORI
        // NUORI Hands-on: High hands-on, low analytical/creative
        for (var i = 0; i < 30; i++) {
            if (i === 9 || i === 25) { // Hands-on (hospitality/physical work)
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 0 || i === 4 || i === 6) { // Technology/Analytical (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 2 || i === 15 || i === 17) { // Creative (LOW)
                answers.push({ questionIndex: i, score: 1 });
            }
            else if (i === 1 || i === 7 || i === 8 || i === 9 || i === 10 || i === 11) { // People/Social (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    return answers;
}
/**
 * LEADER: High leadership, high people, strategic thinking
 */
function buildLeaderAnswers(cohort) {
    var answers = [];
    if (cohort === 'YLA') {
        // YLA Leader: High leadership (Q19), high people, planning
        for (var i = 0; i < 30; i++) {
            if (i === 19) { // Leadership
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 16 || i === 21 || i === 28) { // People/Social (high for leaders)
                answers.push({ questionIndex: i, score: 4 });
            }
            else if (i === 13 || i === 27) { // Career clarity/Global (planning/vision)
                answers.push({ questionIndex: i, score: 4 });
            }
            else if (i === 0 || i === 1 || i === 15) { // Analytical/Technology (medium)
                answers.push({ questionIndex: i, score: 3 });
            }
            else if (i === 14 || i === 17) { // Creative (medium)
                answers.push({ questionIndex: i, score: 3 });
            }
            else if (i === 2 || i === 5 || i === 7 || i === 20 || i === 25) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    else if (cohort === 'TASO2') {
        // TASO2 Leader: High leadership, high people, planning
        for (var i = 0; i < 30; i++) {
            if (i === 1) { // Leadership
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 7 || i === 8 || i === 9 || i === 10 || i === 11) { // People/Social (high)
                answers.push({ questionIndex: i, score: 4 });
            }
            else if (i === 19) { // Entrepreneurship (planning/vision)
                answers.push({ questionIndex: i, score: 4 });
            }
            else if (i === 0 || i === 4 || i === 6 || i === 14) { // Technology/Analytical (medium)
                answers.push({ questionIndex: i, score: 3 });
            }
            else if (i === 2 || i === 15) { // Creative (medium)
                answers.push({ questionIndex: i, score: 3 });
            }
            else if (i === 20 || i === 21 || i === 22 || i === 23) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    else { // NUORI
        // NUORI Leader: High leadership, high people, planning
        for (var i = 0; i < 30; i++) {
            if (i === 3 || i === 26) { // Leadership
                answers.push({ questionIndex: i, score: 5 });
            }
            else if (i === 1 || i === 7 || i === 8 || i === 9 || i === 10 || i === 11) { // People/Social (high)
                answers.push({ questionIndex: i, score: 4 });
            }
            else if (i === 13 || i === 15 || i === 24) { // Advancement/Global (planning/vision)
                answers.push({ questionIndex: i, score: 4 });
            }
            else if (i === 0 || i === 4 || i === 6) { // Technology/Analytical (medium)
                answers.push({ questionIndex: i, score: 3 });
            }
            else if (i === 2 || i === 15 || i === 17) { // Creative (medium)
                answers.push({ questionIndex: i, score: 3 });
            }
            else if (i === 9 || i === 25) { // Hands-on (low)
                answers.push({ questionIndex: i, score: 2 });
            }
            else {
                answers.push({ questionIndex: i, score: 3 });
            }
        }
    }
    return answers;
}
/**
 * BALANCED: Medium scores across all dimensions
 */
function buildBalancedAnswers(cohort) {
    var answers = [];
    // All questions get medium score (3)
    for (var i = 0; i < 30; i++) {
        answers.push({ questionIndex: i, score: 3 });
    }
    return answers;
}
// ========== TEST SCENARIOS ==========
var testScenarios = [
    // INTROVERT SCENARIOS
    {
        name: 'Introvert - YLA',
        cohort: 'YLA',
        personalityDescription: 'Prefers working alone, low social interaction, analytical/technical focus',
        answers: buildIntrovertAnswers('YLA'),
        expectedCategory: 'jarjestaja', // Analytical thinkers often match jarjestaja
        expectedTraits: {
            social: 'low',
            people: 'low',
            introvert: true,
            extrovert: false,
            analytical: 'high',
            creative: 'low',
            handsOn: 'low',
            leadership: 'low'
        }
    },
    {
        name: 'Introvert - TASO2',
        cohort: 'TASO2',
        personalityDescription: 'Prefers working alone, low social interaction, analytical/technical focus',
        answers: buildIntrovertAnswers('TASO2'),
        expectedCategory: 'innovoija', // Tech-focused introverts match innovoija
        expectedTraits: {
            social: 'low',
            people: 'low',
            introvert: true,
            extrovert: false,
            analytical: 'high',
            creative: 'low',
            handsOn: 'low',
            leadership: 'low'
        }
    },
    {
        name: 'Introvert - NUORI',
        cohort: 'NUORI',
        personalityDescription: 'Prefers working alone, low social interaction, analytical/technical focus',
        answers: buildIntrovertAnswers('NUORI'),
        expectedCategory: 'innovoija', // Tech-focused introverts match innovoija
        expectedTraits: {
            social: 'low',
            people: 'low',
            introvert: true,
            extrovert: false,
            analytical: 'high',
            creative: 'low',
            handsOn: 'low',
            leadership: 'low'
        }
    },
    // EXTROVERT SCENARIOS
    {
        name: 'Extrovert - YLA',
        cohort: 'YLA',
        personalityDescription: 'Prefers working with people, high social interaction, people-oriented',
        answers: buildExtrovertAnswers('YLA'),
        expectedCategory: 'auttaja', // People-oriented extroverts match auttaja
        expectedTraits: {
            social: 'high',
            people: 'high',
            introvert: false,
            extrovert: true,
            analytical: 'low',
            creative: 'medium',
            handsOn: 'low',
            leadership: 'high'
        }
    },
    {
        name: 'Extrovert - TASO2',
        cohort: 'TASO2',
        personalityDescription: 'Prefers working with people, high social interaction, people-oriented',
        answers: buildExtrovertAnswers('TASO2'),
        expectedCategory: 'auttaja', // People-oriented extroverts match auttaja
        expectedTraits: {
            social: 'high',
            people: 'high',
            introvert: false,
            extrovert: true,
            analytical: 'low',
            creative: 'medium',
            handsOn: 'low',
            leadership: 'high'
        }
    },
    {
        name: 'Extrovert - NUORI',
        cohort: 'NUORI',
        personalityDescription: 'Prefers working with people, high social interaction, people-oriented',
        answers: buildExtrovertAnswers('NUORI'),
        expectedCategory: 'auttaja', // People-oriented extroverts match auttaja
        expectedTraits: {
            social: 'high',
            people: 'high',
            introvert: false,
            extrovert: true,
            analytical: 'low',
            creative: 'medium',
            handsOn: 'low',
            leadership: 'high'
        }
    },
    // ANALYTICAL THINKER SCENARIOS
    {
        name: 'Analytical Thinker - YLA',
        cohort: 'YLA',
        personalityDescription: 'High analytical, low creative/social, prefers structured work',
        answers: buildAnalyticalThinkerAnswers('YLA'),
        expectedCategory: 'jarjestaja', // Analytical thinkers match jarjestaja
        expectedTraits: {
            social: 'low',
            people: 'low',
            introvert: true,
            extrovert: false,
            analytical: 'high',
            creative: 'low',
            handsOn: 'low',
            leadership: 'low'
        }
    },
    {
        name: 'Analytical Thinker - TASO2',
        cohort: 'TASO2',
        personalityDescription: 'High analytical, low creative/social, prefers structured work',
        answers: buildAnalyticalThinkerAnswers('TASO2'),
        expectedCategory: 'innovoija', // Tech-focused analytical thinkers match innovoija
        expectedTraits: {
            social: 'low',
            people: 'low',
            introvert: true,
            extrovert: false,
            analytical: 'high',
            creative: 'low',
            handsOn: 'low',
            leadership: 'low'
        }
    },
    {
        name: 'Analytical Thinker - NUORI',
        cohort: 'NUORI',
        personalityDescription: 'High analytical, low creative/social, prefers structured work',
        answers: buildAnalyticalThinkerAnswers('NUORI'),
        expectedCategory: 'innovoija', // Tech-focused analytical thinkers match innovoija
        expectedTraits: {
            social: 'low',
            people: 'low',
            introvert: true,
            extrovert: false,
            analytical: 'high',
            creative: 'low',
            handsOn: 'low',
            leadership: 'low'
        }
    },
    // CREATIVE ARTIST SCENARIOS
    {
        name: 'Creative Artist - YLA',
        cohort: 'YLA',
        personalityDescription: 'High creative, low analytical/technical, expressive',
        answers: buildCreativeArtistAnswers('YLA'),
        expectedCategory: 'luova', // Creative artists match luova
        expectedTraits: {
            social: 'medium',
            people: 'medium',
            introvert: false,
            extrovert: false,
            analytical: 'low',
            creative: 'high',
            handsOn: 'low',
            leadership: 'low'
        }
    },
    {
        name: 'Creative Artist - TASO2',
        cohort: 'TASO2',
        personalityDescription: 'High creative, low analytical/technical, expressive',
        answers: buildCreativeArtistAnswers('TASO2'),
        expectedCategory: 'luova', // Creative artists match luova
        expectedTraits: {
            social: 'medium',
            people: 'medium',
            introvert: false,
            extrovert: false,
            analytical: 'low',
            creative: 'high',
            handsOn: 'low',
            leadership: 'low'
        }
    },
    {
        name: 'Creative Artist - NUORI',
        cohort: 'NUORI',
        personalityDescription: 'High creative, low analytical/technical, expressive',
        answers: buildCreativeArtistAnswers('NUORI'),
        expectedCategory: 'luova', // Creative artists match luova
        expectedTraits: {
            social: 'medium',
            people: 'medium',
            introvert: false,
            extrovert: false,
            analytical: 'low',
            creative: 'high',
            handsOn: 'low',
            leadership: 'low'
        }
    },
    // HANDS-ON MAKER SCENARIOS
    {
        name: 'Hands-On Maker - YLA',
        cohort: 'YLA',
        personalityDescription: 'High hands-on, low analytical/creative, practical',
        answers: buildHandsOnMakerAnswers('YLA'),
        expectedCategory: 'rakentaja', // Hands-on makers match rakentaja
        expectedTraits: {
            social: 'low',
            people: 'low',
            introvert: false,
            extrovert: false,
            analytical: 'low',
            creative: 'low',
            handsOn: 'high',
            leadership: 'low'
        }
    },
    {
        name: 'Hands-On Maker - TASO2',
        cohort: 'TASO2',
        personalityDescription: 'High hands-on, low analytical/creative, practical',
        answers: buildHandsOnMakerAnswers('TASO2'),
        expectedCategory: 'rakentaja', // Hands-on makers match rakentaja
        expectedTraits: {
            social: 'low',
            people: 'low',
            introvert: false,
            extrovert: false,
            analytical: 'low',
            creative: 'low',
            handsOn: 'high',
            leadership: 'low'
        }
    },
    {
        name: 'Hands-On Maker - NUORI',
        cohort: 'NUORI',
        personalityDescription: 'High hands-on, low analytical/creative, practical',
        answers: buildHandsOnMakerAnswers('NUORI'),
        expectedCategory: 'rakentaja', // Hands-on makers match rakentaja
        expectedTraits: {
            social: 'low',
            people: 'low',
            introvert: false,
            extrovert: false,
            analytical: 'low',
            creative: 'low',
            handsOn: 'high',
            leadership: 'low'
        }
    },
    // LEADER SCENARIOS
    {
        name: 'Leader - YLA',
        cohort: 'YLA',
        personalityDescription: 'High leadership, high people, strategic thinking',
        answers: buildLeaderAnswers('YLA'),
        expectedCategory: 'johtaja', // Leaders match johtaja
        expectedTraits: {
            social: 'high',
            people: 'high',
            introvert: false,
            extrovert: true,
            analytical: 'medium',
            creative: 'medium',
            handsOn: 'low',
            leadership: 'high'
        }
    },
    {
        name: 'Leader - TASO2',
        cohort: 'TASO2',
        personalityDescription: 'High leadership, high people, strategic thinking',
        answers: buildLeaderAnswers('TASO2'),
        expectedCategory: 'johtaja', // Leaders match johtaja
        expectedTraits: {
            social: 'high',
            people: 'high',
            introvert: false,
            extrovert: true,
            analytical: 'medium',
            creative: 'medium',
            handsOn: 'low',
            leadership: 'high'
        }
    },
    {
        name: 'Leader - NUORI',
        cohort: 'NUORI',
        personalityDescription: 'High leadership, high people, strategic thinking',
        answers: buildLeaderAnswers('NUORI'),
        expectedCategory: 'johtaja', // Leaders match johtaja
        expectedTraits: {
            social: 'high',
            people: 'high',
            introvert: false,
            extrovert: true,
            analytical: 'medium',
            creative: 'medium',
            handsOn: 'low',
            leadership: 'high'
        }
    },
    // BALANCED SCENARIOS
    {
        name: 'Balanced - YLA',
        cohort: 'YLA',
        personalityDescription: 'Medium scores across all dimensions',
        answers: buildBalancedAnswers('YLA'),
        expectedCategory: 'jarjestaja', // Balanced often defaults to jarjestaja
        expectedTraits: {
            social: 'medium',
            people: 'medium',
            introvert: false,
            extrovert: false,
            analytical: 'medium',
            creative: 'medium',
            handsOn: 'medium',
            leadership: 'medium'
        }
    },
    {
        name: 'Balanced - TASO2',
        cohort: 'TASO2',
        personalityDescription: 'Medium scores across all dimensions',
        answers: buildBalancedAnswers('TASO2'),
        expectedCategory: 'jarjestaja', // Balanced often defaults to jarjestaja
        expectedTraits: {
            social: 'medium',
            people: 'medium',
            introvert: false,
            extrovert: false,
            analytical: 'medium',
            creative: 'medium',
            handsOn: 'medium',
            leadership: 'medium'
        }
    },
    {
        name: 'Balanced - NUORI',
        cohort: 'NUORI',
        personalityDescription: 'Medium scores across all dimensions',
        answers: buildBalancedAnswers('NUORI'),
        expectedCategory: 'jarjestaja', // Balanced often defaults to jarjestaja
        expectedTraits: {
            social: 'medium',
            people: 'medium',
            introvert: false,
            extrovert: false,
            analytical: 'medium',
            creative: 'medium',
            handsOn: 'medium',
            leadership: 'medium'
        }
    }
];
// ========== ANALYSIS FUNCTIONS ==========
function analyzePersonalityMatch(userProfile, expectedTraits) {
    var details = {};
    var allMatch = true;
    if (!userProfile.detailedScores) {
        return { matches: false, details: details };
    }
    var _a = userProfile.detailedScores, interests = _a.interests, workstyle = _a.workstyle, values = _a.values, context = _a.context;
    // Check social/people traits
    if (expectedTraits.social) {
        var socialScore = (context === null || context === void 0 ? void 0 : context.social) || 0;
        var expectedLevel = expectedTraits.social === 'high' ? 0.6 : expectedTraits.social === 'low' ? 0.3 : 0.45;
        var match = expectedTraits.social === 'high' ? socialScore >= 0.5 :
            expectedTraits.social === 'low' ? socialScore <= 0.4 :
                socialScore >= 0.35 && socialScore <= 0.55;
        details.social = { expected: expectedTraits.social, actual: socialScore, match: match };
        if (!match)
            allMatch = false;
    }
    if (expectedTraits.people) {
        var peopleScore = interests.people || 0;
        var expectedLevel = expectedTraits.people === 'high' ? 0.6 : expectedTraits.people === 'low' ? 0.3 : 0.45;
        var match = expectedTraits.people === 'high' ? peopleScore >= 0.5 :
            expectedTraits.people === 'low' ? peopleScore <= 0.4 :
                peopleScore >= 0.35 && peopleScore <= 0.55;
        details.people = { expected: expectedTraits.people, actual: peopleScore, match: match };
        if (!match)
            allMatch = false;
    }
    // Check introvert/extrovert
    if (expectedTraits.introvert !== undefined) {
        var socialScore = (context === null || context === void 0 ? void 0 : context.social) || 0;
        var peopleScore = interests.people || 0;
        var avgSocial = (socialScore + peopleScore) / 2;
        var isIntrovert = avgSocial <= 0.4;
        var match = expectedTraits.introvert === isIntrovert;
        details.introvert = { expected: expectedTraits.introvert ? 'true' : 'false', actual: avgSocial, match: match };
        if (!match)
            allMatch = false;
    }
    if (expectedTraits.extrovert !== undefined) {
        var socialScore = (context === null || context === void 0 ? void 0 : context.social) || 0;
        var peopleScore = interests.people || 0;
        var avgSocial = (socialScore + peopleScore) / 2;
        var isExtrovert = avgSocial >= 0.5;
        var match = expectedTraits.extrovert === isExtrovert;
        details.extrovert = { expected: expectedTraits.extrovert ? 'true' : 'false', actual: avgSocial, match: match };
        if (!match)
            allMatch = false;
    }
    // Check analytical
    if (expectedTraits.analytical) {
        var analyticalScore = interests.analytical || 0;
        var match = expectedTraits.analytical === 'high' ? analyticalScore >= 0.5 :
            expectedTraits.analytical === 'low' ? analyticalScore <= 0.4 :
                analyticalScore >= 0.35 && analyticalScore <= 0.55;
        details.analytical = { expected: expectedTraits.analytical, actual: analyticalScore, match: match };
        if (!match)
            allMatch = false;
    }
    // Check creative
    if (expectedTraits.creative) {
        var creativeScore = interests.creative || 0;
        var match = expectedTraits.creative === 'high' ? creativeScore >= 0.5 :
            expectedTraits.creative === 'low' ? creativeScore <= 0.4 :
                creativeScore >= 0.35 && creativeScore <= 0.55;
        details.creative = { expected: expectedTraits.creative, actual: creativeScore, match: match };
        if (!match)
            allMatch = false;
    }
    // Check hands-on
    if (expectedTraits.handsOn) {
        var handsOnScore = interests.hands_on || 0;
        var match = expectedTraits.handsOn === 'high' ? handsOnScore >= 0.5 :
            expectedTraits.handsOn === 'low' ? handsOnScore <= 0.4 :
                handsOnScore >= 0.35 && handsOnScore <= 0.55;
        details.handsOn = { expected: expectedTraits.handsOn, actual: handsOnScore, match: match };
        if (!match)
            allMatch = false;
    }
    // Check leadership
    if (expectedTraits.leadership) {
        var leadershipScore = (workstyle === null || workstyle === void 0 ? void 0 : workstyle.leadership) || interests.leadership || 0;
        var match = expectedTraits.leadership === 'high' ? leadershipScore >= 0.5 :
            expectedTraits.leadership === 'low' ? leadershipScore <= 0.4 :
                leadershipScore >= 0.35 && leadershipScore <= 0.55;
        details.leadership = { expected: expectedTraits.leadership, actual: leadershipScore, match: match };
        if (!match)
            allMatch = false;
    }
    return { matches: allMatch, details: details };
}
// ========== TEST RUNNER ==========
function runTests() {
    var _a;
    console.log('🧪 PERSONALITY VARIATION TEST SUITE\n');
    console.log('='.repeat(80));
    console.log('Testing introvert/extrovert and other personality variations');
    console.log('='.repeat(80) + '\n');
    var totalTests = 0;
    var passedTests = 0;
    var failedTests = 0;
    var failures = [];
    for (var _i = 0, testScenarios_1 = testScenarios; _i < testScenarios_1.length; _i++) {
        var scenario = testScenarios_1[_i];
        totalTests++;
        console.log("\n[".concat(totalTests, "/").concat(testScenarios.length, "] Testing: ").concat(scenario.name));
        console.log("Description: ".concat(scenario.personalityDescription));
        console.log("Expected Category: ".concat(scenario.expectedCategory));
        console.log('-'.repeat(80));
        try {
            // Generate user profile
            var userProfile = (0, scoringEngine_1.generateUserProfile)(scenario.answers, scenario.cohort);
            if (!userProfile.detailedScores) {
                console.error('❌ Failed to generate user profile');
                failedTests++;
                failures.push({ scenario: scenario.name, reason: 'Failed to generate user profile' });
                continue;
            }
            // Rank careers to get dominant category
            var recommendations = (0, scoringEngine_1.rankCareers)(scenario.answers, scenario.cohort, 5);
            if (recommendations.length === 0) {
                console.error('❌ No recommendations returned');
                failedTests++;
                failures.push({ scenario: scenario.name, reason: 'No recommendations returned' });
                continue;
            }
            // Get dominant category from top recommendation
            var dominantCategory = ((_a = recommendations[0]) === null || _a === void 0 ? void 0 : _a.category) || 'unknown';
            console.log("\u2713 Dominant Category: ".concat(dominantCategory));
            // Analyze personality match
            var personalityMatch = analyzePersonalityMatch(userProfile, scenario.expectedTraits);
            // Display personality analysis
            console.log('\n📊 Personality Analysis:');
            for (var _b = 0, _c = Object.entries(personalityMatch.details); _b < _c.length; _b++) {
                var _d = _c[_b], trait = _d[0], data = _d[1];
                var status_1 = data.match ? '✓' : '✗';
                console.log("  ".concat(status_1, " ").concat(trait, ": expected ").concat(data.expected, ", got ").concat(data.actual.toFixed(3)));
            }
            // Get top interests
            var topInterests = Object.entries(userProfile.detailedScores.interests)
                .sort(function (_a, _b) {
                var a = _a[1];
                var b = _b[1];
                return (b || 0) - (a || 0);
            })
                .slice(0, 5)
                .map(function (_a) {
                var key = _a[0], value = _a[1];
                return "".concat(key, ": ").concat(((value || 0) * 100).toFixed(1), "%");
            })
                .join(', ');
            console.log("\n\uD83D\uDD1D Top Interests: ".concat(topInterests));
            console.log("\n\uD83D\uDCBC Top 5 Career Recommendations:");
            recommendations.forEach(function (career, idx) {
                console.log("  ".concat(idx + 1, ". ").concat(career.title, " (").concat(career.overallScore, "% match, ").concat(career.category, ")"));
            });
            // Check category match
            var categoryMatch = dominantCategory === scenario.expectedCategory;
            if (!categoryMatch) {
                console.warn("\n\u26A0\uFE0F  Category mismatch: Expected ".concat(scenario.expectedCategory, ", got ").concat(dominantCategory));
            }
            // Check personality match
            var personalityMatches = personalityMatch.matches;
            if (!personalityMatches) {
                console.warn("\n\u26A0\uFE0F  Personality traits don't match perfectly");
            }
            // Determine if test passed
            var testPassed = categoryMatch && personalityMatches && recommendations.length > 0;
            if (testPassed) {
                console.log("\n\u2705 TEST PASSED");
                passedTests++;
            }
            else {
                console.log("\n\u274C TEST FAILED");
                failedTests++;
                var reason = '';
                if (!categoryMatch)
                    reason += "Category mismatch (expected ".concat(scenario.expectedCategory, ", got ").concat(dominantCategory, "). ");
                if (!personalityMatches)
                    reason += 'Personality traits mismatch. ';
                if (recommendations.length === 0)
                    reason += 'No recommendations. ';
                failures.push({ scenario: scenario.name, reason: reason.trim() });
            }
        }
        catch (error) {
            console.error("\n\u274C ERROR: ".concat(error));
            failedTests++;
            failures.push({ scenario: scenario.name, reason: "Error: ".concat(error) });
        }
    }
    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(80));
    console.log("Total Tests: ".concat(totalTests));
    console.log("\u2705 Passed: ".concat(passedTests));
    console.log("\u274C Failed: ".concat(failedTests));
    console.log("Success Rate: ".concat(((passedTests / totalTests) * 100).toFixed(1), "%"));
    if (failures.length > 0) {
        console.log('\n❌ FAILED TESTS:');
        failures.forEach(function (failure, idx) {
            console.log("  ".concat(idx + 1, ". ").concat(failure.scenario));
            console.log("     Reason: ".concat(failure.reason));
        });
    }
    console.log('\n' + '='.repeat(80));
    // Exit with error code if any tests failed
    if (failedTests > 0) {
        process.exit(1);
    }
}
// Run tests
runTests();
