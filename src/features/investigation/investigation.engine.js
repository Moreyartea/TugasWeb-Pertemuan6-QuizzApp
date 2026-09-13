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

export function createInvestigationEngine(
    caseItem,
    options = {}
) {
    if (!caseItem) {
        throw new Error(
            'Data kasus diperlukan.'
        )
    }

    const {
        onStateChange = null
    } = options

    let state =
        createInitialState()

    function getState() {
        return state
    }

    function updateState(nextState) {
        state = nextState

        if (onStateChange) {
            onStateChange(state)
        }

        return getState()
    }

    function transitionTo(nextPhase) {
        if (
            !canTransition(
                state.phase,
                nextPhase
            )
        ) {
            throw new Error(
                `Transisi tidak valid: ${state.phase} → ${nextPhase}`
            )
        }

        return updateState({
            ...state,
            phase: nextPhase
        })
    }

    function startCase() {
        if (
            state.phase !==
            INVESTIGATION_PHASES.IDLE
        ) {
            throw new Error(
                'Investigation sudah dimulai.'
            )
        }

        return updateState({
            ...createInitialState(),
            caseId: caseItem.id,
            phase:
                INVESTIGATION_PHASES.BRIEFING,
            startedAt: null,
            finishedAt: null
        })
    }

    function restoreState(savedState) {
        if (!isValidRestorableState(savedState)) {
            throw new Error(
                'State investigasi tidak valid.'
            )
        }

        if (
            savedState.caseId !==
            caseItem.id
        ) {
            throw new Error(
                'State bukan milik kasus ini.'
            )
        }

        state = {
            ...createInitialState(),
            ...savedState,
            caseId: caseItem.id
        }

        return getState()
    }

    function beginInvestigation() {
        if (
            state.phase !==
            INVESTIGATION_PHASES.BRIEFING
        ) {
            throw new Error(
                'Investigasi belum berada pada tahap briefing.'
            )
        }

        return updateState({
            ...state,
            phase:
                INVESTIGATION_PHASES.INVESTIGATION,
            startedAt: Date.now(),
            finishedAt: null
        })
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

        const evidence =
            caseItem.evidence.find(
                (item) =>
                    item.id === evidenceId
            )

        if (!evidence) {
            throw new Error(
                'Evidence tidak ditemukan.'
            )
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
            state.discoveredEvidence.includes(
                evidenceId
            )

        return updateState({
            ...state,
            currentEvidence:
                evidenceId,
            discoveredEvidence:
                alreadyDiscovered
                    ? state.discoveredEvidence
                    : [
                        ...state.discoveredEvidence,
                        evidenceId
                    ]
        })
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

        const deduction =
            caseItem.deductions.find(
                (item) =>
                    item.id === deductionId
            )

        if (!deduction) {
            throw new Error(
                'Deduction tidak ditemukan.'
            )
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

        const deduction =
            caseItem.deductions.find(
                (item) =>
                    item.id === deductionId
            )

        if (!deduction) {
            throw new Error(
                'Deduction tidak ditemukan.'
            )
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
            deduction.correctOption ===
            selectedOption

        const decision = {
            type: 'DEDUCTION',
            deductionId,
            selectedOption,
            correct: isCorrect,
            timestamp: Date.now()
        }

        const nextState = {
            ...state,
            decisions: [
                ...state.decisions,
                decision
            ]
        }

        if (!isCorrect) {
            updateState(nextState)

            return {
                correct: false,
                state: getState()
            }
        }

        const alreadyCompleted =
            state.completedDeductions.includes(
                deductionId
            )

        const completedDeductions =
            alreadyCompleted
                ? state.completedDeductions
                : [
                    ...state.completedDeductions,
                    deductionId
                ]

        updateState({
            ...nextState,
            completedDeductions
        })

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

        return updateState({
            ...state,
            selectedSuspect: suspectId,
            decisions: [
                ...state.decisions,
                decision
            ]
        })
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

        return updateState({
            ...state,
            phase:
                INVESTIGATION_PHASES.RESULT,
            finishedAt: Date.now()
        })
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

        return updateState({
            ...state,
            phase:
                INVESTIGATION_PHASES.COMPLETED
        })
    }

    function reset() {
        return updateState(
            createInitialState()
        )
    }

    return {
        getState,
        startCase,
        restoreState,
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

function isValidRestorableState(
    savedState
) {
    if (
        !savedState ||
        typeof savedState !== 'object'
    ) {
        return false
    }

    const validPhases =
        Object.values(
            INVESTIGATION_PHASES
        )

    if (
        !validPhases.includes(
            savedState.phase
        )
    ) {
        return false
    }

    if (
        !Array.isArray(
            savedState.discoveredEvidence
        )
    ) {
        return false
    }

    if (
        !Array.isArray(
            savedState.decisions
        )
    ) {
        return false
    }

    if (
        !Array.isArray(
            savedState.completedDeductions
        )
    ) {
        return false
    }

    return true
}