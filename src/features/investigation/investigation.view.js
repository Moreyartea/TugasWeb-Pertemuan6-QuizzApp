import { getAppState } from '../../app/app-state.js'
import { navigate } from '../../app/router.js'

let investigationTimerInterval = null

function applyInvestigationThemeStyles() {
  const isLight = document.documentElement.dataset.theme === 'light'

  const timer = document.querySelector('.investigation-timer')
  if (timer) {
    timer.style.background = isLight
      ? 'rgba(245, 240, 228, 0.85)'
      : 'rgba(18, 21, 26, 0.55)'
    timer.style.border = isLight
      ? '1px solid rgba(122, 87, 33, 0.4)'
      : '1px solid rgba(201, 151, 74, 0.4)'
    timer.style.boxShadow = isLight
      ? '0 8px 28px rgba(65, 58, 45, 0.15)'
      : '0 8px 28px rgba(0, 0, 0, 0.22)'
  }

  const overlay = document.querySelector('.investigation-start-overlay')
  if (overlay) {
    overlay.style.background = isLight
      ? 'rgba(36, 31, 20, 0.35)'
      : 'rgba(5, 6, 8, 0.7)'
  }

  const modal = document.querySelector('.investigation-start-modal')
  if (modal) {
    modal.style.background = isLight
      ? 'rgba(245, 240, 228, 0.98)'
      : 'rgba(18, 21, 26, 0.96)'
    modal.style.border = isLight
      ? '1px solid rgba(122, 87, 33, 0.45)'
      : '1px solid rgba(201, 151, 74, 0.45)'
    modal.style.boxShadow = isLight
      ? '0 24px 80px rgba(65, 58, 45, 0.22)'
      : '0 24px 80px rgba(0, 0, 0, 0.45)'
  }
}

document.addEventListener('casefile-theme-change', applyInvestigationThemeStyles)

export function renderBriefing(container) {
  const {
    currentCase,
    investigationEngine
  } = getAppState()

  if (!currentCase || !investigationEngine) {
    navigate('/cases')
    return
  }

  stopInvestigationTimer()

  container.replaceChildren()

  const page = document.createElement('main')
  page.classList.add('briefing-page')

  const header = document.createElement('header')
  header.classList.add('briefing-header')

  const eyebrow = document.createElement('p')
  eyebrow.classList.add('eyebrow')
  eyebrow.textContent = 'CASEFILE / BRIEFING'

  const codename = document.createElement('span')
  codename.classList.add('case-codename')
  codename.textContent = currentCase.codename

  const title = document.createElement('h1')
  title.textContent = currentCase.title

  const description = document.createElement('p')
  description.classList.add('briefing-description')
  description.textContent = currentCase.description

  header.append(
    eyebrow,
    codename,
    title,
    description
  )

  const caseVisual = document.createElement('section')
  caseVisual.classList.add('case-hero-visual')
  caseVisual.style.backgroundImage =
    `url("/images/cases/${currentCase.id}.png")`

  const visualLabel = document.createElement('span')
  visualLabel.textContent = currentCase.codename

  caseVisual.append(visualLabel)
  page.append(header, caseVisual)

  const metadata = document.createElement('section')
  metadata.classList.add('briefing-meta')

  addMetadata(
    metadata,
    'CATEGORY',
    currentCase.category
  )

  addMetadata(
    metadata,
    'DIFFICULTY',
    currentCase.difficulty.toUpperCase()
  )

  addMetadata(
    metadata,
    'LOCATION',
    currentCase.location
  )

  addMetadata(
    metadata,
    'ESTIMATED TIME',
    `${currentCase.estimatedTime} MIN`
  )

  page.append(metadata)

  const briefingBox = document.createElement('section')
  briefingBox.classList.add('briefing-box')

  const briefingTitle = document.createElement('h2')
  briefingTitle.textContent = 'Briefing'

  const briefingText = document.createElement('p')
  briefingText.textContent = currentCase.briefing

  briefingBox.append(
    briefingTitle,
    briefingText
  )

  page.append(briefingBox)

  const actions = document.createElement('div')
  actions.classList.add('briefing-actions')

  const startButton = document.createElement('button')
  startButton.type = 'button'
  startButton.classList.add('primary-button')
  startButton.textContent = 'Mulai Investigasi'

  startButton.addEventListener(
    'click',
    () => {
      showStartInvestigationPopup(
        page,
        currentCase,
        investigationEngine
      )
    }
  )

  const backLink = document.createElement('a')
  backLink.href = '/cases'
  backLink.dataset.route = '/cases'
  backLink.classList.add('secondary-button')
  backLink.textContent = '← Kembali ke Database'

  actions.append(
    startButton,
    backLink
  )

  page.append(actions)

  container.append(page)
}

export function renderInvestigation(container) {
  const {
    currentCase,
    investigationEngine
  } = getAppState()

  if (!currentCase || !investigationEngine) {
    navigate('/cases')
    return
  }

  const state = investigationEngine.getState()

  stopInvestigationTimer()

  container.replaceChildren()

  const page = document.createElement('main')
  page.classList.add('investigation-page')

  page.append(createPhaseIndicator('INVESTIGATION'))

  const header = document.createElement('header')
  header.classList.add('investigation-header')

  const headerInfo = document.createElement('div')

  const eyebrow = document.createElement('p')
  eyebrow.classList.add('eyebrow')
  eyebrow.textContent = 'ACTIVE INVESTIGATION'

  const title = document.createElement('h1')
  title.textContent = currentCase.title

  headerInfo.append(
    eyebrow,
    title
  )

  const status = document.createElement('div')
  status.classList.add('investigation-status')

  const phaseLabel = document.createElement('span')
  phaseLabel.textContent =
    `PHASE: ${state.phase}`

  const evidenceLabel = document.createElement('span')
  evidenceLabel.textContent =
    `EVIDENCE: ${state.discoveredEvidence.length}/${currentCase.evidence.length}`

  status.append(
    phaseLabel,
    evidenceLabel
  )

  header.append(
    headerInfo,
    status
  )

  page.append(header)

  createFloatingTimer(
    page,
    investigationEngine
  )

  const content = document.createElement('div')
  content.classList.add('investigation-content')

  const evidenceSection = document.createElement('section')
  evidenceSection.classList.add('investigation-section')

  const evidenceHeader = document.createElement('div')
  evidenceHeader.classList.add('section-header')

  const evidenceTitle = document.createElement('h2')
  evidenceTitle.textContent = 'Evidence'

  const evidenceDescription = document.createElement('p')
  evidenceDescription.textContent =
    'Temukan dan buka evidence untuk membangun rangkaian bukti.'

  evidenceHeader.append(
    evidenceTitle,
    evidenceDescription
  )

  const evidenceGrid = document.createElement('div')
  evidenceGrid.classList.add('evidence-grid')

  renderEvidenceCards(
    evidenceGrid,
    currentCase,
    state,
    investigationEngine
  )

  evidenceSection.append(
    evidenceHeader,
    evidenceGrid
  )

  content.append(evidenceSection)

  const deductionSection = document.createElement('section')
  deductionSection.classList.add('investigation-section')

  const deductionHeader = document.createElement('div')
  deductionHeader.classList.add('section-header')

  const deductionTitle = document.createElement('h2')
  deductionTitle.textContent = 'Deduction Quiz'

  const deductionDescription = document.createElement('p')
  deductionDescription.textContent =
    'Jawab 5 pertanyaan pilihan ganda berdasarkan evidence yang telah ditemukan.'

  deductionHeader.append(
    deductionTitle,
    deductionDescription
  )

  const deductionGrid = document.createElement('div')
  deductionGrid.classList.add('deduction-grid')

  renderDeductionCards(
    deductionGrid,
    currentCase,
    state,
    investigationEngine
  )

  deductionSection.append(
    deductionHeader,
    deductionGrid
  )

  content.append(deductionSection)

  const suspectSection = document.createElement('section')
  suspectSection.classList.add('investigation-section')

  const suspectHeader = document.createElement('div')
  suspectHeader.classList.add('section-header')

  const suspectTitle = document.createElement('h2')
  suspectTitle.textContent = 'Suspect Selection'

  const suspectDescription = document.createElement('p')
  suspectDescription.textContent =
    'Pilih tersangka yang paling kuat berdasarkan seluruh evidence dan deduction.'

  suspectHeader.append(
    suspectTitle,
    suspectDescription
  )

  const suspectGrid = document.createElement('div')
  suspectGrid.classList.add('suspect-grid')

  renderSuspectCards(
    suspectGrid,
    currentCase,
    state,
    investigationEngine
  )

  suspectSection.append(
    suspectHeader,
    suspectGrid
  )

  content.append(suspectSection)

  const finishSection = document.createElement('section')
  finishSection.classList.add('finish-section')

  const finishInfo = document.createElement('p')
  finishInfo.textContent =
    getFinishMessage(
      currentCase,
      state
    )

  const finishButton = document.createElement('button')
  finishButton.type = 'button'
  finishButton.classList.add('primary-button')
  finishButton.textContent = 'Selesaikan Kasus'

  const canFinish =
    canFinishInvestigation(
      currentCase,
      state
    )

  finishButton.disabled = !canFinish

  finishButton.addEventListener(
    'click',
    () => {
      try {
        stopInvestigationTimer()

        investigationEngine.finishCase()

        navigate(
          `/case/${currentCase.id}/result`
        )
      } catch (error) {
        showInlineError(
          page,
          error.message
        )
      }
    }
  )

  finishSection.append(
    finishInfo,
    finishButton
  )

  content.append(finishSection)

  page.append(content)

  container.append(page)

  startInvestigationTimer(
    investigationEngine
  )
}

function renderEvidenceCards(
  container,
  caseItem,
  state,
  engine
) {
  caseItem.evidence.forEach(
    (evidence) => {
      const article =
        document.createElement('article')

      article.classList.add(
        'evidence-card'
      )

      const accessible =
        canAccessEvidence(
          evidence,
          state
        )

      const discovered =
        state.discoveredEvidence.includes(
          evidence.id
        )

      if (!accessible) {
        article.classList.add(
          'evidence-locked'
        )
      }

      if (discovered) {
        article.classList.add(
          'evidence-discovered'
        )
      }

      const number =
        document.createElement('span')

      number.classList.add(
        'evidence-number'
      )

      number.textContent =
        evidence.id.replace(
          'evidence-',
          '#'
        )

      const title =
        document.createElement('h3')

      title.textContent =
        accessible
          ? evidence.title
          : 'Evidence Terkunci'

      const type =
        document.createElement('span')

      type.classList.add(
        'evidence-type'
      )

      type.textContent =
        accessible
          ? evidence.type
          : 'LOCKED'

      const description =
        document.createElement('p')

      description.textContent =
        accessible
          ? evidence.description
          : 'Evidence ini akan terbuka setelah kondisi unlock terpenuhi.'

      article.append(
        number,
        type,
        title,
        description
      )

      if (accessible) {
        const button =
          document.createElement('button')

        button.type = 'button'
        button.dataset.evidenceId =
          evidence.id

        button.classList.add(
          'evidence-button'
        )

        button.textContent =
          discovered
            ? 'Evidence Terbuka'
            : 'Buka Evidence'

        if (discovered) {
          const clue =
            document.createElement('p')

          clue.classList.add(
            'evidence-clue'
          )

          clue.textContent =
            evidence.clue

          article.append(clue)
        } else {
          article.append(button)
        }
      }

      container.append(article)
    }
  )

  container.addEventListener(
    'click',
    handleEvidenceClick
  )

  function handleEvidenceClick(event) {
    const button =
      event.target.closest(
        '[data-evidence-id]'
      )

    if (
      !button ||
      !event.currentTarget.contains(
        button
      )
    ) {
      return
    }

    const evidenceId =
      button.dataset.evidenceId

    try {
      engine.openEvidence(
        evidenceId
      )

      renderInvestigation(
        document.querySelector('#app-content')
      )
    } catch (error) {
      showInlineError(
        document.querySelector('#app-content'),
        error.message
      )
    }
  }
}

function renderDeductionCards(
  container,
  caseItem,
  state,
  engine
) {
  caseItem.deductions.forEach(
    (deduction) => {
      const article =
        document.createElement('article')

      article.classList.add(
        'deduction-card'
      )

      const completed =
        state.completedDeductions.includes(
          deduction.id
        )

      const available =
        canAccessDeduction(
          deduction,
          state
        )

      if (!available && !completed) {
        article.classList.add(
          'deduction-locked'
        )
      }

      if (completed) {
        article.classList.add(
          'deduction-completed'
        )
      }

      const title =
        document.createElement('h3')

      title.textContent =
        deduction.prompt

      const status =
        document.createElement('span')

      status.classList.add(
        'deduction-status'
      )

      if (completed) {
        status.textContent =
          'COMPLETED'
      } else if (available) {
        status.textContent =
          'AVAILABLE'
      } else {
        status.textContent =
          'LOCKED'
      }

      article.append(
        status,
        title
      )

      if (
        available &&
        !completed
      ) {
        const button =
          document.createElement('button')

        button.type = 'button'
        button.dataset.deductionId =
          deduction.id

        button.classList.add(
          'secondary-button'
        )

        button.textContent =
          'Buat Deduction'

        article.append(button)
      }

      if (completed) {
        const completedText =
          document.createElement('p')

        completedText.textContent =
          'Deduction telah diselesaikan dengan benar.'

        article.append(
          completedText
        )
      }

      container.append(article)
    }
  )

  container.addEventListener(
    'click',
    handleDeductionClick
  )

  function handleDeductionClick(event) {
    const button =
      event.target.closest(
        '[data-deduction-id]'
      )

    if (
      !button ||
      !event.currentTarget.contains(
        button
      )
    ) {
      return
    }

    const deductionId =
      button.dataset.deductionId

    try {
      engine.openDeduction(
        deductionId
      )

      renderDeductionForm(
        document.querySelector('#app-content'),
        caseItem,
        deductionId,
        engine
      )
    } catch (error) {
      showInlineError(
        document.querySelector('#app-content'),
        error.message
      )
    }
  }
}

function renderSuspectCards(
  container,
  caseItem,
  state,
  engine
) {
  caseItem.suspects.forEach(
    (suspect) => {
      const button =
        document.createElement('button')

      button.type = 'button'
      button.dataset.suspectId =
        suspect.id

      button.classList.add(
        'suspect-card'
      )

      if (
        state.selectedSuspect ===
        suspect.id
      ) {
        button.classList.add(
          'suspect-selected'
        )
      }

      const name =
        document.createElement('h3')

      name.textContent =
        suspect.name

      const occupation =
        document.createElement('span')

      occupation.classList.add(
        'suspect-occupation'
      )

      occupation.textContent =
        suspect.occupation

      const description =
        document.createElement('p')

      description.textContent =
        suspect.description

      const traits =
        document.createElement('ul')

      suspect.traits.forEach(
        (trait) => {
          const item =
            document.createElement('li')

          item.textContent =
            trait

          traits.append(item)
        }
      )

      button.append(
        name,
        occupation,
        description,
        traits
      )

      container.append(button)
    }
  )

  const suspectButtons =
    container.querySelectorAll(
      '[data-suspect-id]'
    )

  suspectButtons.forEach(
    (button) => {
      button.setAttribute(
        'aria-pressed',
        String(
          button.dataset.suspectId ===
            state.selectedSuspect
        )
      )
    }
  )

  container.addEventListener(
    'click',
    handleSuspectClick
  )

  function handleSuspectClick(event) {
    const button =
      event.target.closest(
        '[data-suspect-id]'
      )

    if (
      !button ||
      !event.currentTarget.contains(
        button
      )
    ) {
      return
    }

    try {
      engine.selectSuspect(
        button.dataset.suspectId
      )

      renderInvestigation(
        document.querySelector('#app-content')
      )
    } catch (error) {
      showInlineError(
        document.querySelector('#app-content'),
        error.message
      )
    }
  }
}

function renderDeductionForm(
  container,
  caseItem,
  deductionId,
  engine
) {
  const deduction =
    caseItem.deductions.find(
      (item) =>
        item.id === deductionId
    )

  if (!deduction) {
    renderInvestigation(container)
    return
  }

  stopInvestigationTimer()

  container.replaceChildren()

  const page =
    document.createElement('main')

  page.classList.add(
    'deduction-form-page',
    'quiz-question-page'
  )

  page.append(createPhaseIndicator('DEDUCTION'))

  createFloatingTimer(
    page,
    engine
  )

  const eyebrow =
    document.createElement('p')

  eyebrow.classList.add('eyebrow')
  eyebrow.textContent =
    'CASEFILE / DEDUCTION QUIZ'

  const questionIndex = caseItem.deductions.findIndex(
    (item) => item.id === deductionId
  ) + 1

  const questionMeta = document.createElement('p')
  questionMeta.classList.add('quiz-question-meta')
  questionMeta.textContent =
    `QUESTION ${String(questionIndex).padStart(2, '0')} / ${String(caseItem.deductions.length).padStart(2, '0')}`

  const progress = document.createElement('div')
  progress.classList.add('quiz-progress')

  const progressBar = document.createElement('span')
  progressBar.style.width = `${(questionIndex / caseItem.deductions.length) * 100}%`
  progress.append(progressBar)

  const instruction = document.createElement('p')
  instruction.classList.add('quiz-instruction')
  instruction.textContent = 'SELECT ONE ANSWER'

  const title =
    document.createElement('h1')

  title.classList.add('quiz-question-title')
  title.classList.add('quiz-question-title')
  title.textContent =
    deduction.prompt

  const form =
    document.createElement('form')

  form.classList.add(
    'deduction-form'
  )

  deduction.options.forEach(
    (option) => {
      const label =
        document.createElement('label')

      label.classList.add(
        'deduction-option'
      )

      const input =
        document.createElement('input')

      input.type = 'radio'
      input.name =
        'deduction-answer'
      input.value = option.id
      input.required = true

      const text =
        document.createElement('span')

      text.textContent =
        option.text

      label.append(
        input,
        text
      )

      form.append(label)
    }
  )

  const actions =
    document.createElement('div')

  actions.classList.add(
    'form-actions'
  )

  const submitButton =
    document.createElement('button')

  submitButton.type = 'submit'
  submitButton.classList.add(
    'primary-button'
  )

  submitButton.textContent =
    'Kirim Kesimpulan'

  const backButton =
    document.createElement('button')

  backButton.type = 'button'
  backButton.classList.add(
    'secondary-button'
  )

  backButton.textContent =
    '← Kembali ke Investigasi'

  backButton.addEventListener(
    'click',
    () => {
      try {
        engine.returnToInvestigation()

        renderInvestigation(
          document.querySelector('#app-content')
        )
      } catch (error) {
        showInlineError(
          document.querySelector('#app-content'),
          error.message
        )
      }
    }
  )

  actions.append(
    submitButton,
    backButton
  )

  form.append(actions)

  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault()

      const formData =
        new FormData(form)

      const selectedOption =
        formData.get(
          'deduction-answer'
        )

      try {
        const result =
          engine.submitDeduction(
            deductionId,
            selectedOption
          )

        renderDeductionFeedback(
          document.querySelector('#app-content'),
          deduction,
          result.correct,
          engine
        )
      } catch (error) {
        showInlineError(
          document.querySelector('#app-content'),
          error.message
        )
      }
    }
  )

  page.append(
    eyebrow,
    questionMeta,
    progress,
    instruction,
    title,
    form
  )

  container.append(page)

  startInvestigationTimer(engine)
}

function renderDeductionFeedback(
  container,
  deduction,
  correct,
  engine
) {
  stopInvestigationTimer()

  container.replaceChildren()

  const page =
    document.createElement('main')

  page.classList.add(
    'deduction-feedback-page',
    'quiz-feedback-page'
  )

  page.append(createPhaseIndicator('DEDUCTION'))

  createFloatingTimer(
    page,
    engine
  )

  const eyebrow = document.createElement('p')
  eyebrow.classList.add('eyebrow')
  eyebrow.textContent = 'CASEFILE / DEDUCTION QUIZ'

  const status =
    document.createElement('span')

  status.classList.add(
    correct
      ? 'feedback-correct'
      : 'feedback-wrong'
  )

  status.textContent =
    correct
      ? '✓ DEDUCTION BENAR'
      : '✕ DEDUCTION SALAH'

  const title =
    document.createElement('h1')

  title.textContent =
    correct
      ? 'Kesimpulan diterima'
      : 'Kesimpulan belum tepat'

  const explanation =
    document.createElement('p')

  explanation.textContent =
    deduction.explanation

  const button =
    document.createElement('button')

  button.type = 'button'
  button.classList.add(
    'primary-button'
  )

  button.textContent =
    'Kembali ke Investigasi'

  button.addEventListener(
    'click',
    () => {
      try {
        engine.returnToInvestigation()

        renderInvestigation(
          document.querySelector('#app-content')
        )
      } catch (error) {
        showInlineError(
          document.querySelector('#app-content'),
          error.message
        )
      }
    }
  )

  page.append(
    eyebrow,
    status,
    title,
    explanation,
    button
  )

  container.append(page)

  startInvestigationTimer(engine)
}

function createFloatingTimer(
  page,
  engine
) {
  const existingTimer =
    document.querySelector(
      '.investigation-timer'
    )

  if (existingTimer) {
    existingTimer.remove()
  }

  const timer =
    document.createElement('div')

  timer.classList.add(
    'investigation-timer'
  )

  timer.setAttribute('aria-live', 'polite')

  timer.style.position = 'fixed'

  timer.style.top = '12px'

  timer.style.right = '24px'

  timer.style.zIndex = '1050'

  timer.style.minWidth = '112px'
  timer.style.padding = '9px 14px'

  timer.style.display = 'flex'
  timer.style.flexDirection = 'column'
  timer.style.alignItems = 'center'
  timer.style.justifyContent = 'center'

  timer.style.gap = '2px'

  const isLight = document.documentElement.dataset.theme === 'light'

  timer.style.background =
    isLight ? 'rgba(245, 240, 228, 0.85)' : 'rgba(18, 21, 26, 0.55)'

  timer.style.border =
    isLight ? '1px solid rgba(122, 87, 33, 0.4)' : '1px solid rgba(201, 151, 74, 0.4)'

  timer.style.backdropFilter =
    'blur(8px)'

  timer.style.webkitBackdropFilter =
    'blur(8px)'

  timer.style.boxShadow =
    isLight ? '0 8px 28px rgba(65, 58, 45, 0.15)' : '0 8px 28px rgba(0, 0, 0, 0.22)'

  timer.style.pointerEvents =
    'none'

  timer.style.borderRadius =
    '0'

  const timerLabel =
    document.createElement('span')

  timerLabel.textContent =
    'TIME'

  timerLabel.style.fontSize =
    '8px'

  timerLabel.style.letterSpacing =
    '0.2em'

  timerLabel.style.opacity =
    '0.6'

  const timerValue =
    document.createElement('strong')

  timerValue.textContent =
    formatInvestigationTime(
      engine.getState().startedAt
    )

  timerValue.style.fontSize =
    '16px'

  timerValue.style.fontWeight =
    '600'

  timerValue.style.fontVariantNumeric =
    'tabular-nums'

  timerValue.style.letterSpacing =
    '0.08em'

  timer.append(
    timerLabel,
    timerValue
  )

  document.body.append(timer)
  applyInvestigationThemeStyles()

  return timer
}

function startInvestigationTimer(
  engine
) {
  stopInvestigationTimer()

  const timer =
    document.querySelector(
      '.investigation-timer'
    )

  if (!timer) {
    return
  }

  const timerValue =
    timer.querySelector('strong')

  if (!timerValue) {
    return
  }

  const updateTimer = () => {
    if (!timer.isConnected) {
      stopInvestigationTimer()
      return
    }

    const state =
      engine.getState()

    timerValue.textContent =
      formatInvestigationTime(
        state.startedAt
      )
  }

  updateTimer()

  investigationTimerInterval =
    setInterval(
      updateTimer,
      1000
    )
}

function stopInvestigationTimer() {
  if (investigationTimerInterval) {
    clearInterval(
      investigationTimerInterval
    )

    investigationTimerInterval =
      null
  }
}

export function teardownFloatingTimer() {
  stopInvestigationTimer()

  const timer = document.querySelector('.investigation-timer')

  if (timer) {
    timer.remove()
  }
}

function formatInvestigationTime(
  startedAt
) {
  if (!startedAt) {
    return '00:00'
  }

  const elapsedSeconds =
    Math.max(
      0,
      Math.floor(
        (
          Date.now() -
          startedAt
        ) / 1000
      )
    )

  const minutes =
    Math.floor(
      elapsedSeconds / 60
    )

  const seconds =
    elapsedSeconds % 60

  return `${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(
    2,
    '0'
  )}`
}

function showStartInvestigationPopup(
  page,
  caseItem,
  engine
) {
  const overlay =
    document.createElement('div')

  overlay.classList.add(
    'investigation-start-overlay'
  )

  overlay.style.position = 'fixed'
  overlay.style.inset = '0'
  overlay.style.zIndex = '9999'
  overlay.style.display = 'flex'
  overlay.style.alignItems = 'center'
  overlay.style.justifyContent = 'center'
  overlay.style.padding = '24px'

  const isLight = document.documentElement.dataset.theme === 'light'

  overlay.style.background =
    isLight ? 'rgba(36, 31, 20, 0.35)' : 'rgba(5, 6, 8, 0.7)'

  overlay.style.backdropFilter =
    'blur(5px)'

  overlay.style.webkitBackdropFilter =
    'blur(5px)'

  const modal =
    document.createElement('section')

  modal.classList.add(
    'investigation-start-modal'
  )

  modal.style.width =
    'min(480px, 100%)'

  modal.style.padding =
    '32px'

  modal.style.background =
    isLight ? 'rgba(245, 240, 228, 0.98)' : 'rgba(18, 21, 26, 0.96)'

  modal.style.border =
    isLight ? '1px solid rgba(122, 87, 33, 0.45)' : '1px solid rgba(201, 151, 74, 0.45)'

  modal.style.boxShadow =
    isLight ? '0 24px 80px rgba(65, 58, 45, 0.22)' : '0 24px 80px rgba(0, 0, 0, 0.45)'

  const eyebrow =
    document.createElement('p')

  eyebrow.classList.add('eyebrow')

  eyebrow.textContent =
    'CASEFILE / CONFIRMATION'

  const title =
    document.createElement('h2')

  title.textContent =
    'Mulai Investigasi?'

  const description =
    document.createElement('p')

  description.textContent =
    `Anda akan memulai investigasi ${caseItem.codename}. Setelah dikonfirmasi, countdown 3 detik akan dimulai.`

  const warning =
    document.createElement('p')

  warning.textContent =
    'Timer investigasi belum berjalan pada tahap ini.'

  warning.style.opacity =
    '0.7'

  warning.style.fontSize =
    '13px'

  const actions =
    document.createElement('div')

  actions.style.display =
    'flex'

  actions.style.gap =
    '10px'

  actions.style.marginTop =
    '24px'

  actions.style.flexWrap =
    'wrap'

  const confirmButton =
    document.createElement('button')

  confirmButton.type =
    'button'

  confirmButton.classList.add(
    'primary-button'
  )

  confirmButton.textContent =
    'Ya, Mulai'

  const cancelButton =
    document.createElement('button')

  cancelButton.type =
    'button'

  cancelButton.classList.add(
    'secondary-button'
  )

  cancelButton.textContent =
    'Kembali'

  cancelButton.addEventListener(
    'click',
    () => {
      overlay.remove()
    }
  )

  confirmButton.addEventListener(
    'click',
    () => {
      actions.style.display =
        'none'

      description.textContent =
        'Bersiap. Investigasi akan dimulai.'

      warning.textContent =
        'Timer investigasi belum berjalan.'

      startInvestigationCountdown(
        overlay,
        modal,
        caseItem,
        engine
      )
    }
  )

  actions.append(
    confirmButton,
    cancelButton
  )

  modal.append(
    eyebrow,
    title,
    description,
    warning,
    actions
  )

  overlay.append(modal)

  overlay.addEventListener(
    'click',
    (event) => {
      if (
        event.target === overlay
      ) {
        overlay.remove()
      }
    }
  )

  page.append(overlay)
  applyInvestigationThemeStyles()

  confirmButton.focus()
}

function startInvestigationCountdown(
  overlay,
  modal,
  caseItem,
  engine
) {
  const countdown = document.createElement('div')

  countdown.classList.add('investigation-countdown')
  countdown.style.marginTop = '24px'
  countdown.style.textAlign = 'center'
  countdown.style.fontSize = '72px'
  countdown.style.fontWeight = '700'
  countdown.style.lineHeight = '1'
  countdown.style.letterSpacing = '0.08em'

  modal.append(countdown)

  let count = 3
  countdown.textContent = String(count)

  const interval = setInterval(() => {
    count -= 1

    if (count > 0) {
      countdown.textContent = String(count)
      return
    }

    clearInterval(interval)
    countdown.textContent = 'GO'

    try {
      engine.beginInvestigation()

      requestAnimationFrame(() => {
        overlay.remove()
        navigate(`/case/${caseItem.id}/investigation`)
      })
    } catch (error) {
      overlay.remove()
      showInlineError(
        document.querySelector('#app-content'),
        error.message
      )
    }
  }, 1000)
}

function createPhaseIndicator(activePhase) {
  const indicator = document.createElement('div')
  indicator.classList.add('phase-indicator')

  const phases = [
    ['01', 'INVESTIGATION'],
    ['02', 'DEDUCTION'],
    ['03', 'SUSPECT']
  ]

  phases.forEach(([number, label]) => {
    const item = document.createElement('span')
    item.classList.add('phase-indicator-item')

    if (label === activePhase) {
      item.classList.add('is-active')
    }

    const numberElement = document.createElement('strong')
    numberElement.textContent = number

    const labelElement = document.createElement('span')
    labelElement.textContent = label

    item.append(numberElement, labelElement)
    indicator.append(item)
  })

  return indicator
}

function canAccessEvidence(
  evidence,
  state
) {
  const condition =
    evidence.unlockCondition

  if (!condition) {
    return true
  }

  if (
    condition.type === 'always'
  ) {
    return true
  }

  if (
    condition.type ===
    'deduction-completed'
  ) {
    return state.completedDeductions.includes(
      condition.deductionId
    )
  }

  if (
    condition.type ===
    'evidence-discovered'
  ) {
    return state.discoveredEvidence.includes(
      condition.evidenceId
    )
  }

  return false
}

function canAccessDeduction(
  deduction,
  state
) {
  return deduction.evidenceRequired.every(
    (evidenceId) =>
      state.discoveredEvidence.includes(
        evidenceId
      )
  )
}

function canFinishInvestigation(
  caseItem,
  state
) {
  const allDeductionsCompleted =
    caseItem.deductions.every(
      (deduction) =>
        state.completedDeductions.includes(
          deduction.id
        )
    )

  return (
    allDeductionsCompleted &&
    Boolean(state.selectedSuspect)
  )
}

function getFinishMessage(
  caseItem,
  state
) {
  const allDeductionsCompleted =
    caseItem.deductions.every(
      (deduction) =>
        state.completedDeductions.includes(
          deduction.id
        )
    )

  if (!allDeductionsCompleted) {
    return 'Selesaikan seluruh deduction terlebih dahulu.'
  }

  if (!state.selectedSuspect) {
    return 'Pilih tersangka sebelum menyelesaikan kasus.'
  }

  return 'Semua komponen investigasi telah lengkap. Kasus siap dievaluasi.'
}

function addMetadata(
  container,
  label,
  value
) {
  const item =
    document.createElement('div')

  item.classList.add('meta-item')

  const labelElement =
    document.createElement('span')

  labelElement.textContent =
    label

  const valueElement =
    document.createElement('strong')

  valueElement.textContent =
    value

  item.append(
    labelElement,
    valueElement
  )

  container.append(item)
}

function showInlineError(
  container,
  message
) {
  const oldError =
    container.querySelector(
      '.inline-error'
    )

  if (oldError) {
    oldError.remove()
  }

  const error =
    document.createElement('div')

  error.classList.add(
    'inline-error'
  )

  const title =
    document.createElement('strong')

  title.textContent =
    'Terjadi kesalahan'

  const description =
    document.createElement('p')

  description.textContent =
    message

  error.append(
    title,
    description
  )

  container.prepend(error)
}