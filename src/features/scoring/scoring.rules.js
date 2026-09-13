export const SCORE_RULES = {
    EVIDENCE_MAX: 25,
    DEDUCTION_MAX: 40,
    SUSPECT_MAX: 20,
    TIME_MAX: 15,

    EVIDENCE_DISCOVERY: {
        critical: 5,
        supporting: 3,
        'red-herring': 1
    },

    SUSPECT_CORRECT: 20,
    SUSPECT_WRONG: 0,

    TIME_LIMITS: {
        fast: 0.7,
        efficient: 1,
        normal: 1.3,
        slow: 1.6
    },

    TIME_SCORES: {
        fast: 15,
        efficient: 12,
        normal: 8,
        slow: 4,
        verySlow: 0
    }
}

export function getRank(score) {
    if (score >= 90) return 'S'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    return 'D'
}
