import { SCORE_RULES, getRank } from './scoring.rules.js'

export function calculateEvidenceScore(caseItem, discoveredEvidence) {
    const discovered = new Set(discoveredEvidence)

    const rawScore = caseItem.evidence.reduce((total, evidence) => {
        if (!discovered.has(evidence.id)) return total
        return total + (SCORE_RULES.EVIDENCE_DISCOVERY[evidence.relevance] ?? 0)
    }, 0)

    const maxRawScore = caseItem.evidence.reduce((total, evidence) => {
        return total + (SCORE_RULES.EVIDENCE_DISCOVERY[evidence.relevance] ?? 0)
    }, 0)

    if (maxRawScore <= 0) return 0

    return Math.min(
        SCORE_RULES.EVIDENCE_MAX,
        Math.round((rawScore / maxRawScore) * SCORE_RULES.EVIDENCE_MAX)
    )
}

export function calculateDeductionScore(caseItem, decisions) {
    const deductionDecisions = decisions.filter(
        (decision) => decision.type === 'DEDUCTION'
    )

    if (caseItem.deductions.length === 0) return 0

    const correctAttempts = deductionDecisions.filter(
        (decision) => decision.correct
    ).length

    if (deductionDecisions.length === 0) return 0

    const accuracy = correctAttempts / deductionDecisions.length

    return Math.min(
        SCORE_RULES.DEDUCTION_MAX,
        Math.round(accuracy * SCORE_RULES.DEDUCTION_MAX)
    )
}

export function calculateSuspectScore(caseItem, selectedSuspect) {
    if (!selectedSuspect) return SCORE_RULES.SUSPECT_WRONG

    return selectedSuspect === caseItem.solution.suspectId
        ? SCORE_RULES.SUSPECT_CORRECT
        : SCORE_RULES.SUSPECT_WRONG
}

export function calculateTimeScore(startedAt, finishedAt, estimatedTime) {
    if (!startedAt || !finishedAt || !estimatedTime) return 0

    const elapsedSeconds = calculateElapsedSeconds(startedAt, finishedAt)
    const estimatedSeconds = Number(estimatedTime) * 60

    if (estimatedSeconds <= 0) return 0

    const ratio = elapsedSeconds / estimatedSeconds

    if (ratio <= SCORE_RULES.TIME_LIMITS.fast) {
        return SCORE_RULES.TIME_SCORES.fast
    }

    if (ratio <= SCORE_RULES.TIME_LIMITS.efficient) {
        return SCORE_RULES.TIME_SCORES.efficient
    }

    if (ratio <= SCORE_RULES.TIME_LIMITS.normal) {
        return SCORE_RULES.TIME_SCORES.normal
    }

    if (ratio <= SCORE_RULES.TIME_LIMITS.slow) {
        return SCORE_RULES.TIME_SCORES.slow
    }

    return SCORE_RULES.TIME_SCORES.verySlow
}

export function calculateElapsedSeconds(startedAt, finishedAt) {
    if (!startedAt || !finishedAt) return 0

    return Math.max(
        0,
        Math.floor((finishedAt - startedAt) / 1000)
    )
}

export function calculateAccuracy(decisions) {
    const deductionDecisions = decisions.filter(
        (decision) => decision.type === 'DEDUCTION'
    )

    if (deductionDecisions.length === 0) return 0

    const correctAnswers = deductionDecisions.filter(
        (decision) => decision.correct
    ).length

    return Math.round(
        (correctAnswers / deductionDecisions.length) * 100
    )
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
        state.finishedAt,
        caseItem.estimatedTime
    )

    const score = Math.max(
        0,
        Math.min(100, evidenceScore + deductionScore + suspectScore + timeScore)
    )

    const deductionDecisions = state.decisions.filter(
        (decision) => decision.type === 'DEDUCTION'
    )

    const correctDeductions = deductionDecisions.filter(
        (decision) => decision.correct
    ).length

    const accuracy = calculateAccuracy(state.decisions)

    return {
        score,
        rank: getRank(score),
        accuracy,
        evidence: {
            discovered: state.discoveredEvidence.length,
            total: caseItem.evidence.length,
            points: evidenceScore,
            maxPoints: SCORE_RULES.EVIDENCE_MAX
        },
        deductions: {
            completed: state.completedDeductions.length,
            total: caseItem.deductions.length,
            correct: correctDeductions,
            attempts: deductionDecisions.length,
            points: deductionScore,
            maxPoints: SCORE_RULES.DEDUCTION_MAX
        },
        suspect: {
            selected: state.selectedSuspect,
            correct: state.selectedSuspect === caseItem.solution.suspectId,
            points: suspectScore,
            maxPoints: SCORE_RULES.SUSPECT_MAX
        },
        time: {
            seconds: calculateElapsedSeconds(state.startedAt, state.finishedAt),
            points: timeScore,
            maxPoints: SCORE_RULES.TIME_MAX
        }
    }
}
