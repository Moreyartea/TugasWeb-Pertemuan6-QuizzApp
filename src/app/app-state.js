let appState = {
    currentCase: null,
    investigationEngine: null
}

export function getAppState() {
    return appState
}

export function setCurrentCase(caseItem) {
    appState = {
        ...appState,
        currentCase: caseItem
    }
}

export function setInvestigationEngine(engine) {
    appState = {
        ...appState,
        investigationEngine: engine
    }
}

export function clearInvestigation() {
    appState = {
        ...appState,
        currentCase: null,
        investigationEngine: null
    }
}