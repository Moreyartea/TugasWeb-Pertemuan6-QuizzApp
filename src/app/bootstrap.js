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
    renderInvestigation,
    teardownFloatingTimer
} from '../features/investigation/investigation.view.js'

import {
    renderResult
} from '../features/scoring/scoring.view.js'

import {
    renderHistory
} from '../features/history/history.view.js'

import {
    getAppState,
    setCurrentCase,
    setInvestigationEngine
} from './app-state.js'

import {
    createNavbar
} from '../shared/ui/navbar.js'

import {
    createFooter
} from '../shared/ui/footer.js'

import {
    loadCase
} from '../features/cases/case.service.js'

import {
    createInvestigationEngine
} from '../features/investigation/investigation.engine.js'

import {
    readInvestigationSession
} from '../infrastructure/storage/session-storage.adapter.js'

export function bootstrap() {
    const app =
        document.querySelector('#app')

    registerRoute(
        '/',
        () =>
            renderAppRoute(
                app,
                renderLanding
            )
    )

    registerRoute(
        '/cases',
        () =>
            renderAppRoute(
                app,
                renderCaseSelection
            )
    )

    registerRoute(
        '/history',
        () =>
            renderAppRoute(
                app,
                renderHistory
            )
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
        () =>
            renderNotFound(app)
    )
}

function renderAppRoute(
    app,
    renderPage
) {
    teardownFloatingTimer()

    const content =
        createAppShell(app)

    renderPage(content)
}

function createAppShell(app) {
    app.replaceChildren()

    const shell =
        document.createElement('div')

    shell.classList.add(
        'app-shell'
    )

    const navbar =
        createNavbar()

    const content =
        document.createElement('div')

    content.id = 'app-content'

    content.classList.add(
        'app-content'
    )

    const footer =
        createFooter()

    shell.append(
        navbar,
        content,
        footer
    )

    app.append(shell)

    return content
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

    renderAppRoute(
        app,
        renderBriefing
    )
}

async function renderInvestigationRoute(
    app,
    caseId
) {
    let {
        currentCase,
        investigationEngine
    } = getAppState()

    if (
        !currentCase ||
        currentCase.id !== caseId ||
        !investigationEngine
    ) {
        const savedState =
            readInvestigationSession()

        if (
            !savedState ||
            savedState.caseId !== caseId
        ) {
            navigate('/cases')
            return
        }

        try {
            currentCase =
                await loadCase(caseId)

            investigationEngine =
                createInvestigationEngine(
                    currentCase
                )

            investigationEngine.restoreState(
                savedState
            )

            setCurrentCase(
                currentCase
            )

            setInvestigationEngine(
                investigationEngine
            )
        } catch (error) {
            console.error(error)

            navigate('/cases')
            return
        }
    }

    renderAppRoute(
        app,
        renderInvestigation
    )
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

    renderAppRoute(
        app,
        renderResult
    )
}

function renderNotFound(app) {
    const content =
        createAppShell(app)

    const page =
        document.createElement('main')

    page.classList.add(
        'not-found-page'
    )

    const title =
        document.createElement('h1')

    title.textContent =
        '404'

    const description =
        document.createElement('p')

    description.textContent =
        'Halaman yang Anda cari tidak ditemukan.'

    const link =
        document.createElement('a')

    link.href = '/cases'

    link.dataset.route =
        '/cases'

    link.classList.add(
        'primary-button'
    )

    link.textContent =
        'Kembali ke Kasus'

    page.append(
        title,
        description,
        link
    )

    content.append(page)
}