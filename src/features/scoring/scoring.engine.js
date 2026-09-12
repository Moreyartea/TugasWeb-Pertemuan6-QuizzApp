import { SCORE_RULES, getRank } from './scoring.rules.js'

export function calculateEvidenceScore(caseItem, discoveredEvidence) {
  return discoveredEvidence.reduce((total, evidenceId) => {
    const evidence = caseItem.evidence.find(
      (item) => item.id === evidenceId
    )

    if (!evidence) return total

    return (
      total +
      (SCORE_RULES.EVIDENCE_DISCOVERY[evidence.relevance] ?? 0)
    )
  }, 0)
}

export function calculateDeductionScore(caseItem, decisions) {
  return decisions.reduce((total, decision) => {
    if (!caseItem.deductions.some((item) => item.id === decision.deductionId)) {
      return total
    }

    return (
      total +
      (decision.correct
        ? SCORE_RULES.DEDUCTION_CORRECT
        : SCORE_RULES.DEDUCTION_WRONG)
    )
  }, 0)
}

export function calculateSuspectScore(caseItem, selectedSuspect) {
  if (!selectedSuspect) return 0

  return selectedSuspect === caseItem.solution.suspectId
    ? SCORE_RULES.SUSPECT_CORRECT
    : SCORE_RULES.SUSPECT_WRONG
}

export function calculateTimeScore(startedAt, finishedAt) {
  if (!startedAt || !finishedAt) return 0

  const elapsedSeconds = Math.max(
    0,
    Math.floor((finishedAt - startedAt) / 1000)
  )

  if (elapsedSeconds <= SCORE_RULES.TIME_LIMITS.fast) {
    return SCORE_RULES.MAX_TIME_SCORE
  }

  if (elapsedSeconds <= SCORE_RULES.TIME_LIMITS.efficient) {
    return 7
  }

  if (elapsedSeconds <= SCORE_RULES.TIME_LIMITS.normal) {
    return 4
  }

  return 0
}

export function calculateElapsedSeconds(startedAt, finishedAt) {
  if (!startedAt || !finishedAt) return 0

  return Math.max(
    0,
    Math.floor((finishedAt - startedAt) / 1000)
  )
}

export function calculateAccuracy(decisions) {
  if (decisions.length === 0) return 100

  const correctAnswers = decisions.filter(
    (decision) => decision.correct
  ).length

  return Math.round((correctAnswers / decisions.length) * 100)
}

export function calculateScore(caseItem, state) {
  const evidenceScore = calculateEvidenceScore(
    caseItem,
    state.discoveredEvidence
  )

  const deductionScore = calculateDeductionScore(
    caseItem,
    state.decisions
  )

  const suspectScore = calculateSuspectScore(
    caseItem,
    state.selectedSuspect
  )

  const timeScore = calculateTimeScore(
    state.startedAt,
    state.finishedAt
  )

  const rawScore =
    evidenceScore +
    deductionScore +
    suspectScore +
    timeScore

  const maxEvidenceScore = caseItem.evidence.reduce(
    (total, evidence) =>
      total +
      (SCORE_RULES.EVIDENCE_DISCOVERY[evidence.relevance] ?? 0),
    0
  )

  const maxDeductionScore =
    caseItem.deductions.length * SCORE_RULES.DEDUCTION_CORRECT

  const maxScore =
    maxEvidenceScore +
    maxDeductionScore +
    SCORE_RULES.SUSPECT_CORRECT +
    SCORE_RULES.MAX_TIME_SCORE

  const normalizedScore =
    maxScore > 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round((rawScore / maxScore) * 100)
          )
        )
      : 0

  const suspectCorrect =
    state.selectedSuspect === caseItem.solution.suspectId

  return {
    score: normalizedScore,
    rank: getRank(normalizedScore),

    accuracy: calculateAccuracy(state.decisions),

    evidence: {
      discovered: state.discoveredEvidence.length,
      total: caseItem.evidence.length,
      points: evidenceScore
    },

    deductions: {
      completed: state.completedDeductions.length,
      total: caseItem.deductions.length,
      points: deductionScore
    },

    suspect: {
      selected: state.selectedSuspect,
      correct: suspectCorrect,
      points: suspectScore
    },

    time: {
      seconds: calculateElapsedSeconds(
        state.startedAt,
        state.finishedAt
      ),
      points: timeScore
    },

    rawScore,
    maxScore
  }
}