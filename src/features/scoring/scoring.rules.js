export const SCORE_RULES = Object.freeze({
  EVIDENCE_DISCOVERY: {
    critical: 10,
    supporting: 5,
    'red-herring': 2
  },

  DEDUCTION_CORRECT: 20,
  DEDUCTION_WRONG: -5,

  SUSPECT_CORRECT: 30,
  SUSPECT_WRONG: -15,

  TIME_LIMITS: {
    fast: 180,
    efficient: 360,
    normal: 600
  },

  MAX_TIME_SCORE: 10
})

export function getRank(score) {
  if (score >= 90) return 'S'
  if (score >= 75) return 'A'
  if (score >= 60) return 'B'
  if (score >= 40) return 'C'

  return 'D'
}