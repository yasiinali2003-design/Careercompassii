"use strict";
/**
 * SCORING SYSTEM - TYPE DEFINITIONS
 * Phase 1A: Question Mapping & Type System
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.COHORT_WEIGHTS = void 0;
// Cohort-specific weights (younger = more interest-focused, older = more values-focused)
exports.COHORT_WEIGHTS = {
    YLA: {
        interests: 0.50, // Younger students: focus on what excites them
        values: 0.15, // Limited values data in questions
        workstyle: 0.25, // How they like to work
        context: 0.10 // Limited context data
    },
    TASO2: {
        interests: 0.45,
        values: 0.20,
        workstyle: 0.25,
        context: 0.10
    },
    NUORI: {
        interests: 0.40, // Young adults: more balanced
        values: 0.25, // Career sustainability matters more
        workstyle: 0.25,
        context: 0.10
    }
};
