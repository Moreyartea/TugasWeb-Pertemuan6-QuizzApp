import { navigate } from '../../app/router.js'
import { showHowToPlayModal } from '../../shared/ui/info-modal.js'

export function renderLanding(container) {
    container.replaceChildren()

    const page = document.createElement('main')
    page.classList.add('landing-page')

    const content = document.createElement('section')
    content.classList.add('landing-content')

    const eyebrow = document.createElement('p')
    eyebrow.classList.add('landing-eyebrow')
    eyebrow.textContent =
        'CASEFILE / INTERACTIVE INVESTIGATION QUIZ'

    const title = document.createElement('h1')
    title.classList.add('landing-title')
    title.textContent =
        'Every case leaves a trace.'

    const description = document.createElement('p')
    description.classList.add('landing-description')
    description.textContent =
        'Investigate evidence, answer 5 multiple-choice questions, and determine who is most responsible.'


    const quizMeta = document.createElement('p')
    quizMeta.classList.add('landing-quiz-meta')
    quizMeta.textContent = '8 CASES · 40 QUESTIONS · MULTIPLE CHOICE'

    const actions = document.createElement('div')
    actions.classList.add('landing-actions')

    const startButton =
        document.createElement('button')

    startButton.type = 'button'

    startButton.classList.add(
        'primary-button',
        'landing-button'
    )

    startButton.textContent =
        'Mulai Investigasi'

    startButton.addEventListener(
        'click',
        () => showHowToPlayModal({
            firstVisit: true,
            onContinue: () => navigate('/cases')
        })
    )


    const howToPlayButton = document.createElement('button')
    howToPlayButton.type = 'button'
    howToPlayButton.classList.add(
        'secondary-button',
        'landing-button'
    )
    howToPlayButton.textContent = 'How to Play'
    howToPlayButton.addEventListener(
        'click',
        () => showHowToPlayModal()
    )

    const historyLink =
        document.createElement('a')

    historyLink.href = '/history'
    historyLink.dataset.route = '/history'

    historyLink.classList.add(
        'secondary-button',
        'landing-button'
    )

    historyLink.textContent =
        'Lihat History'

    actions.append(
        startButton,
        howToPlayButton,
        historyLink
    )

    const status =
        document.createElement('div')

    status.classList.add(
        'landing-status'
    )

    const statusIndicator =
        document.createElement('span')

    statusIndicator.classList.add(
        'landing-status-indicator'
    )

    const statusText =
        document.createElement('span')

    statusText.textContent =
        'SYSTEM ONLINE'

    status.append(
        statusIndicator,
        statusText
    )

    content.append(
        eyebrow,
        title,
        description,
        quizMeta,
        actions,
        status
    )

    page.append(content)
    container.append(page)
}