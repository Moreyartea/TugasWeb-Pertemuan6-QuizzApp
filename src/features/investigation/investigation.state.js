export const INVESTIGATION_PHASES = Object.freeze({
    IDLE: 'IDLE',
    BRIEFING: 'BRIEFING',
    INVESTIGATION: 'INVESTIGATION',
    DEDUCTION: 'DEDUCTION',
    RESULT: 'RESULT',
    COMPLETED: 'COMPLETED'
})

export function createInitialState() {
    return {
        caseId: null,
        phase: INVESTIGATION_PHASES.IDLE,
        currentEvidence: null,
        discoveredEvidence: [],
        selectedSuspect: null,
        decisions: [],
        completedDeductions: [],
        score: null,
        startedAt: null,
        finishedAt: null
    }
}