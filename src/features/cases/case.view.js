import {
    loadCases
} from './case.service.js'

import {
    navigate
} from '../../app/router.js'

import {
    setCurrentCase,
    setInvestigationEngine
} from '../../app/app-state.js'

import {
    createInvestigationEngine
} from '../investigation/investigation.engine.js'

import {
    writeInvestigationSession
} from '../../infrastructure/storage/session-storage.adapter.js'

export async function renderCaseSelection(
    container
) {
    container.replaceChildren()

    const page =
        document.createElement('main')

    page.classList.add(
        'case-selection-page'
    )

    const header =
        document.createElement('header')

    header.classList.add(
        'page-header'
    )

    const eyebrow =
        document.createElement('p')

    eyebrow.classList.add(
        'eyebrow'
    )

    eyebrow.textContent =
        'CASE DATABASE'

    const title =
        document.createElement('h1')

    title.textContent =
        'Pilih Kasus'

    const description =
        document.createElement('p')

    description.classList.add(
        'page-description'
    )

    description.textContent =
        'Pilih satu kasus untuk memulai investigasi. Analisis evidence sebelum menentukan siapa yang paling bertanggung jawab.'

    header.append(
        eyebrow,
        title,
        description
    )

    const status =
        document.createElement('p')

    status.classList.add(
        'loading-status'
    )

    status.textContent =
        'Memuat database kasus...'

    const caseGrid =
        document.createElement('section')

    caseGrid.classList.add(
        'case-grid'
    )

    caseGrid.setAttribute(
        'aria-label',
        'Daftar kasus'
    )

    page.append(
        header,
        status,
        caseGrid
    )

    container.append(page)

    try {
        const cases =
            await loadCases()

        status.remove()

        renderCaseCards(
            caseGrid,
            cases
        )
    } catch (error) {
        renderErrorState(
            caseGrid,
            'Database kasus gagal dimuat.',
            error.message
        )
    }
}

function renderCaseCards(
    container,
    cases
) {
    cases.forEach(
        (caseItem) => {
            const card =
                document.createElement('article')

            card.classList.add(
                'case-card'
            )

            const image =
                document.createElement('div')

            image.classList.add(
                'case-card-image'
            )

            image.style.backgroundImage =
                `url("/images/cases/${caseItem.id}.png")`

            const imageOverlay =
                document.createElement('div')

            imageOverlay.classList.add(
                'case-card-image-overlay'
            )

            const imageIndex =
                document.createElement('span')

            imageIndex.classList.add(
                'case-card-index'
            )

            imageIndex.textContent =
                caseItem.id.replace('case-', 'CASE ')

            imageOverlay.append(imageIndex)
            image.append(imageOverlay)

            const caseBody =
                document.createElement('div')

            caseBody.classList.add(
                'case-card-body'
            )

            const code =
                document.createElement('span')

            code.classList.add(
                'case-codename'
            )

            code.textContent =
                caseItem.codename

            const title =
                document.createElement('h2')

            title.textContent =
                caseItem.title

            const description =
                document.createElement('p')

            description.classList.add(
                'case-description'
            )

            description.textContent =
                caseItem.description

            const metadata =
                document.createElement('div')

            metadata.classList.add(
                'case-card-meta'
            )

            const difficulty =
                document.createElement('span')

            difficulty.textContent =
                `Kesulitan: ${formatDifficulty(
                    caseItem.difficulty
                )}`

            const category =
                document.createElement('span')

            category.textContent =
                caseItem.category

            metadata.append(
                difficulty,
                category
            )

            const location =
                document.createElement('p')

            location.textContent =
                `Lokasi: ${caseItem.location}`

            const button =
                document.createElement('button')

            button.type = 'button'

            button.classList.add(
                'primary-button'
            )

            button.dataset.caseId =
                caseItem.id

            button.textContent =
                'Buka Berkas'

            caseBody.append(
                code,
                title,
                description,
                metadata,
                location,
                button
            )

            card.append(
                image,
                caseBody
            )

            container.append(card)
        }
    )

    container.addEventListener(
        'click',
        handleCaseSelection
    )
}

function handleCaseSelection(
    event
) {
    const button =
        event.target.closest(
            '[data-case-id]'
        )

    if (!button) {
        return
    }

    const caseId =
        button.dataset.caseId

    selectCase(caseId)
}

async function selectCase(
    caseId
) {
    try {
        const cases =
            await loadCases()

        const selectedCase =
            cases.find(
                (caseItem) =>
                    caseItem.id === caseId
            )

        if (!selectedCase) {
            throw new Error(
                'Kasus tidak ditemukan.'
            )
        }

        const engine =
            createInvestigationEngine(
                selectedCase,
                {
                    onStateChange:
                        writeInvestigationSession
                }
            )

        engine.startCase()

        setCurrentCase(
            selectedCase
        )

        setInvestigationEngine(
            engine
        )

        navigate(
            `/case/${caseId}`
        )
    } catch (error) {
        console.error(error)
    }
}

function renderErrorState(
    container,
    titleText,
    message
) {
    const error =
        document.createElement('div')

    error.classList.add(
        'error-state'
    )

    const title =
        document.createElement('h2')

    title.textContent =
        titleText

    const description =
        document.createElement('p')

    description.textContent =
        message

    error.append(
        title,
        description
    )

    container.append(error)
}

function formatDifficulty(
    difficulty
) {
    const labels = {
        easy: 'Mudah',
        medium: 'Menengah',
        hard: 'Sulit'
    }

    return (
        labels[difficulty] ??
        difficulty
    )
}