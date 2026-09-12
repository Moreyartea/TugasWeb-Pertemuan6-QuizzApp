import { INVESTIGATION_PHASES } from './investigation.state.js'

const ALLOWED_TRANSITIONS = Object.freeze({
    [INVESTIGATION_PHASES.IDLE]: [
        INVESTIGATION_PHASES.BRIEFING
    ],

    [INVESTIGATION_PHASES.BRIEFING]: [
        INVESTIGATION_PHASES.INVESTIGATION
    ],

    [INVESTIGATION_PHASES.INVESTIGATION]: [
        INVESTIGATION_PHASES.DEDUCTION,
        INVESTIGATION_PHASES.RESULT
    ],

    [INVESTIGATION_PHASES.DEDUCTION]: [
        INVESTIGATION_PHASES.INVESTIGATION,
        INVESTIGATION_PHASES.RESULT
    ],

    [INVESTIGATION_PHASES.RESULT]: [
        INVESTIGATION_PHASES.COMPLETED
    ],

    [INVESTIGATION_PHASES.COMPLETED]: [
        INVESTIGATION_PHASES.BRIEFING
    ]
})

export function canTransition(fromPhase, toPhase) {
    return ALLOWED_TRANSITIONS[fromPhase]?.includes(toPhase) ?? false
}

export function canDiscoverEvidence(caseItem, evidenceId, state) {
    const evidence = caseItem.evidence.find(
        (item) => item.id === evidenceId
    )

    if (!evidence) {
        return false
    }

    if (state.discoveredEvidence.includes(evidenceId)) {
        return true
    }

    const condition = evidence.unlockCondition

    if (condition.type === 'always') {
        return true
    }

    if (condition.type === 'deduction-completed') {
        return state.completedDeductions.includes(
            condition.deductionId
        )
    }

    if (condition.type === 'evidence-discovered') {
        return state.discoveredEvidence.includes(
            condition.evidenceId
        )
    }

    return false
}

export function canSubmitDeduction(caseItem, deductionId, state) {
    const deduction = caseItem.deductions.find(
        (item) => item.id === deductionId
    )

    if (!deduction) {
        return false
    }

    return deduction.evidenceRequired.every(
        (evidenceId) =>
            state.discoveredEvidence.includes(evidenceId)
    )
}

export function canSelectSuspect(caseItem, suspectId) {
    return caseItem.suspects.some(
        (suspect) => suspect.id === suspectId
    )
}

export function canFinishCase(caseItem, state) {
    const requiredDeductions =
        caseItem.solution.requiredDeductions

    const deductionsComplete =
        requiredDeductions.every(
            (deductionId) =>
                state.completedDeductions.includes(deductionId)
        )

    return (
        deductionsComplete &&
        Boolean(state.selectedSuspect)
    )
}