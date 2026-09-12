import {
    registerRoute,
    setNotFoundHandler,
    navigate
} from './router.js'

import {
    renderLanding
} from '../features/landing/landing.view.js'

import {
    renderCaseSelection
} from '../features/cases/case.view.js'

import {
    renderBriefing,
    renderInvestigation
} from '../features/investigation/investigation.view.js'

import {
    renderResult
} from '../features/scoring/scoring.view.js'

import {
    renderHistory
} from '../features/history/history.view.js'

import {
    getAppState
} from './app-state.js'

export function bootstrap() {
    const app =
        document.querySelector('#app')

    registerRoute(
        '/',
        () => renderLanding(app)
    )

    registerRoute(
        '/cases',
        () => renderCaseSelection(app)
    )

    registerRoute(
        '/history',
        () => renderHistory(app)
    )

    registerRoute(
        '/case/:id',
        (params) =>
            renderCaseBriefingRoute(
                app,
                params.id
            )
    )

    registerRoute(
        '/case/:id/investigation',
        (params) =>
            renderInvestigationRoute(
                app,
                params.id
            )
    )

    registerRoute(
        '/case/:id/result',
        (params) =>
            renderResultRoute(
                app,
                params.id
            )
    )

    setNotFoundHandler(
        () => renderNotFound(app)
    )
}

function renderCaseBriefingRoute(
    app,
    caseId
) {
    const {
        currentCase,
        investigationEngine
    } = getAppState()

    if (
        !currentCase ||
        currentCase.id !== caseId ||
        !investigationEngine
    ) {
        navigate('/cases')
        return
    }

    renderBriefing(app)
}

function renderInvestigationRoute(
    app,
    caseId
) {
    const {
        currentCase,
        investigationEngine
    } = getAppState()

    if (
        !currentCase ||
        currentCase.id !== caseId ||
        !investigationEngine
    ) {
        navigate('/cases')
        return
    }

    renderInvestigation(app)
}

function renderResultRoute(
    app,
    caseId
) {
    const {
        currentCase,
        investigationEngine
    } = getAppState()

    if (
        !currentCase ||
        currentCase.id !== caseId ||
        !investigationEngine
    ) {
        navigate('/cases')
        return
    }

    renderResult(app)
}

function renderNotFound(app) {
    app.replaceChildren()

    const page =
        document.createElement('main')

    page.classList.add('not-found-page')

    const title =
        document.createElement('h1')

    title.textContent = '404'

    const description =
        document.createElement('p')

    description.textContent =
        'Halaman yang Anda cari tidak ditemukan.'

    const link =
        document.createElement('a')

    link.href = '/cases'
    link.dataset.route = '/cases'
    link.classList.add('primary-button')
    link.textContent = 'Kembali ke Kasus'

    page.append(
        title,
        description,
        link
    )

    app.append(page)
}