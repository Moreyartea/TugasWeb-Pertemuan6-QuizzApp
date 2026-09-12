import {
    createInitialState,
    INVESTIGATION_PHASES
} from './investigation.state.js'

import {
    canTransition,
    canDiscoverEvidence,
    canSubmitDeduction,
    canSelectSuspect,
    canFinishCase
} from './investigation.rules.js'

export function createInvestigationEngine(caseItem) {
    if (!caseItem) {
        throw new Error('Data kasus diperlukan.')
    }

    let state = createInitialState()

    function getState() {
        return state
    }

    function transitionTo(nextPhase) {
        if (!canTransition(state.phase, nextPhase)) {
            throw new Error(
                `Transisi tidak valid: ${state.phase} → ${nextPhase}`
            )
        }

        state = {
            ...state,
            phase: nextPhase
        }

        return getState()
    }

    function startCase() {
        if (state.phase !== INVESTIGATION_PHASES.IDLE) {
            throw new Error(
                'Investigation sudah dimulai.'
            )
        }

        state = {
            ...createInitialState(),
            caseId: caseItem.id,
            phase: INVESTIGATION_PHASES.BRIEFING,
            startedAt: Date.now()
        }

        return getState()
    }

    function beginInvestigation() {
        return transitionTo(
            INVESTIGATION_PHASES.INVESTIGATION
        )
    }

    function openEvidence(evidenceId) {
        if (
            state.phase !==
            INVESTIGATION_PHASES.INVESTIGATION
        ) {
            throw new Error(
                'Evidence hanya dapat diperiksa saat investigasi.'
            )
        }

        const evidence = caseItem.evidence.find(
            (item) => item.id === evidenceId
        )

        if (!evidence) {
            throw new Error('Evidence tidak ditemukan.')
        }

        if (
            !canDiscoverEvidence(
                caseItem,
                evidenceId,
                state
            )
        ) {
            throw new Error(
                'Evidence ini belum dapat diakses.'
            )
        }

        const alreadyDiscovered =
            state.discoveredEvidence.includes(evidenceId)

        state = {
            ...state,
            currentEvidence: evidenceId,
            discoveredEvidence: alreadyDiscovered
                ? state.discoveredEvidence
                : [
                      ...state.discoveredEvidence,
                      evidenceId
                  ]
        }

        return getState()
    }

    function openDeduction(deductionId) {
        if (
            state.phase !==
            INVESTIGATION_PHASES.INVESTIGATION
        ) {
            throw new Error(
                'Deduction hanya dapat dibuka dari fase investigasi.'
            )
        }

        const deduction = caseItem.deductions.find(
            (item) => item.id === deductionId
        )

        if (!deduction) {
            throw new Error('Deduction tidak ditemukan.')
        }

        if (
            !canSubmitDeduction(
                caseItem,
                deductionId,
                state
            )
        ) {
            throw new Error(
                'Evidence yang diperlukan belum lengkap.'
            )
        }

        return transitionTo(
            INVESTIGATION_PHASES.DEDUCTION
        )
    }

    function submitDeduction(
        deductionId,
        selectedOption
    ) {
        if (
            state.phase !==
            INVESTIGATION_PHASES.DEDUCTION
        ) {
            throw new Error(
                'Tidak sedang berada pada fase deduction.'
            )
        }

        const deduction = caseItem.deductions.find(
            (item) => item.id === deductionId
        )

        if (!deduction) {
            throw new Error('Deduction tidak ditemukan.')
        }

        if (
            !canSubmitDeduction(
                caseItem,
                deductionId,
                state
            )
        ) {
            throw new Error(
                'Evidence yang diperlukan belum lengkap.'
            )
        }

        const isCorrect =
            deduction.correctOption === selectedOption

        const decision = {
            type: 'DEDUCTION',
            deductionId,
            selectedOption,
            correct: isCorrect,
            timestamp: Date.now()
        }

        state = {
            ...state,
            decisions: [
                ...state.decisions,
                decision
            ]
        }

        if (!isCorrect) {
            return {
                correct: false,
                state: getState()
            }
        }

        const alreadyCompleted =
            state.completedDeductions.includes(
                deductionId
            )

        state = {
            ...state,
            completedDeductions: alreadyCompleted
                ? state.completedDeductions
                : [
                      ...state.completedDeductions,
                      deductionId
                  ]
        }

        return {
            correct: true,
            state: getState()
        }
    }

    function returnToInvestigation() {
        if (
            state.phase !==
            INVESTIGATION_PHASES.DEDUCTION
        ) {
            throw new Error(
                'Tidak sedang berada pada fase deduction.'
            )
        }

        return transitionTo(
            INVESTIGATION_PHASES.INVESTIGATION
        )
    }

    function selectSuspect(suspectId) {
        if (
            state.phase !==
            INVESTIGATION_PHASES.INVESTIGATION
        ) {
            throw new Error(
                'Suspect hanya dapat dipilih saat investigasi.'
            )
        }

        if (
            !canSelectSuspect(
                caseItem,
                suspectId
            )
        ) {
            throw new Error(
                'Suspect tidak valid untuk kasus ini.'
            )
        }

        const decision = {
            type: 'SUSPECT_SELECTION',
            suspectId,
            timestamp: Date.now()
        }

        state = {
            ...state,
            selectedSuspect: suspectId,
            decisions: [
                ...state.decisions,
                decision
            ]
        }

        return getState()
    }

    function finishCase() {
        if (
            !canFinishCase(
                caseItem,
                state
            )
        ) {
            throw new Error(
                'Kasus belum memenuhi syarat untuk diselesaikan.'
            )
        }

        state = {
            ...state,
            phase: INVESTIGATION_PHASES.RESULT,
            finishedAt: Date.now()
        }

        return getState()
    }

    function completeCase() {
        if (
            state.phase !==
            INVESTIGATION_PHASES.RESULT
        ) {
            throw new Error(
                'Kasus belum berada pada fase result.'
            )
        }

        state = {
            ...state,
            phase: INVESTIGATION_PHASES.COMPLETED
        }

        return getState()
    }

    function reset() {
        state = createInitialState()

        return getState()
    }

    return {
        getState,
        startCase,
        beginInvestigation,
        openEvidence,
        openDeduction,
        submitDeduction,
        returnToInvestigation,
        selectSuspect,
        finishCase,
        completeCase,
        reset
    }
}