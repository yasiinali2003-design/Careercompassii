"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RANKING_WEIGHTS = exports.DEMAND_WEIGHTS = void 0;
exports.getDemandWeight = getDemandWeight;
exports.getDiversityKey = getDiversityKey;
exports.DEMAND_WEIGHTS = {
    kasvaa: 3,
    vakaa: 2,
    vaihtelee: 1,
    supistuu: 0,
    laskee: 0
};
exports.RANKING_WEIGHTS = {
    demandBoost: 45,
    similarTitlePenalty: 12,
    primaryDiversityLimit: 1,
    fallbackDiversityLimit: 2
};
var GENERIC_TITLE_SUFFIXES = ['asiantuntija', 'insinööri', 'suunnittelija', 'koordinaattori'];
function getDemandWeight(status) {
    var _a;
    if (!status)
        return exports.DEMAND_WEIGHTS.vakaa;
    return (_a = exports.DEMAND_WEIGHTS[status]) !== null && _a !== void 0 ? _a : exports.DEMAND_WEIGHTS.vakaa;
}
function getDiversityKey(title) {
    var normalized = title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^a-z\-\säöå]/g, '')
        .replace(/[-\s]+/g, ' ')
        .trim();
    if (!normalized) {
        return 'unknown';
    }
    var parts = normalized.split(' ');
    var candidate = parts[parts.length - 1];
    if (GENERIC_TITLE_SUFFIXES.includes(candidate) && parts.length > 1) {
        candidate = candidate;
    }
    else {
        for (var _i = 0, GENERIC_TITLE_SUFFIXES_1 = GENERIC_TITLE_SUFFIXES; _i < GENERIC_TITLE_SUFFIXES_1.length; _i++) {
            var suffix = GENERIC_TITLE_SUFFIXES_1[_i];
            if (candidate.endsWith(suffix)) {
                candidate = suffix;
                break;
            }
        }
    }
    return candidate;
}
