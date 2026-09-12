import { getAppState } from '../../app/app-state.js'
import { navigate } from '../../app/router.js'

export function renderBriefing(container) {
  const {
    currentCase,
    investigationEngine
  } = getAppState()

  if (!currentCase || !investigationEngine) {
    navigate('/cases')
    return
  }

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

  addMetadata(metadata, 'CATEGORY', currentCase.category)
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
      try {
        investigationEngine.beginInvestigation()

        navigate(
          `/case/${currentCase.id}/investigation`
        )
      } catch (error) {
        showInlineError(
          page,
          error.message
        )
      }
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

  container.replaceChildren()

  const page = document.createElement('main')
  page.classList.add('investigation-page')

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
  deductionTitle.textContent = 'Deduction'

  const deductionDescription = document.createElement('p')
  deductionDescription.textContent =
    'Gunakan evidence yang telah ditemukan untuk membuat kesimpulan.'

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
  finishInfo.textContent = getFinishMessage(
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
}

function renderEvidenceCards(
  container,
  caseItem,
  state,
  engine
) {
  caseItem.evidence.forEach(
    (evidence) => {
      const article = document.createElement('article')
      article.classList.add('evidence-card')

      const accessible = canAccessEvidence(
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

      const number = document.createElement('span')
      number.classList.add('evidence-number')
      number.textContent =
        evidence.id.replace('evidence-', '#')

      const title = document.createElement('h3')
      title.textContent = accessible
        ? evidence.title
        : 'Evidence Terkunci'

      const type = document.createElement('span')
      type.classList.add('evidence-type')
      type.textContent =
        accessible
          ? evidence.type
          : 'LOCKED'

      const description = document.createElement('p')
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
        const button = document.createElement('button')
        button.type = 'button'
        button.dataset.evidenceId =
          evidence.id
        button.classList.add('evidence-button')

        button.textContent = discovered
          ? 'Evidence Terbuka'
          : 'Buka Evidence'

        if (discovered) {
          const clue = document.createElement('p')
          clue.classList.add('evidence-clue')
          clue.textContent = evidence.clue

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
      !event.currentTarget.contains(button)
    ) {
      return
    }

    const evidenceId =
      button.dataset.evidenceId

    try {
      engine.openEvidence(evidenceId)

      renderInvestigation(
        document.querySelector('#app')
      )
    } catch (error) {
      showInlineError(
        document.querySelector('#app'),
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
      const article = document.createElement('article')
      article.classList.add('deduction-card')

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

      const title = document.createElement('h3')
      title.textContent = deduction.prompt

      const status = document.createElement('span')
      status.classList.add('deduction-status')

      if (completed) {
        status.textContent = 'COMPLETED'
      } else if (available) {
        status.textContent = 'AVAILABLE'
      } else {
        status.textContent = 'LOCKED'
      }

      article.append(
        status,
        title
      )

      if (available && !completed) {
        const button = document.createElement('button')
        button.type = 'button'
        button.dataset.deductionId =
          deduction.id
        button.classList.add('secondary-button')
        button.textContent = 'Buat Deduction'

        article.append(button)
      }

      if (completed) {
        const completedText = document.createElement('p')
        completedText.textContent =
          'Deduction telah diselesaikan dengan benar.'

        article.append(completedText)
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
      !event.currentTarget.contains(button)
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
        document.querySelector('#app'),
        caseItem,
        deductionId,
        engine
      )
    } catch (error) {
      showInlineError(
        document.querySelector('#app'),
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
      const button = document.createElement('button')

      button.type = 'button'
      button.dataset.suspectId = suspect.id
      button.classList.add('suspect-card')

      if (
        state.selectedSuspect === suspect.id
      ) {
        button.classList.add(
          'suspect-selected'
        )
      }

      const name = document.createElement('h3')
      name.textContent = suspect.name

      const occupation = document.createElement('span')
      occupation.classList.add(
        'suspect-occupation'
      )
      occupation.textContent =
        suspect.occupation

      const description = document.createElement('p')
      description.textContent =
        suspect.description

      const traits = document.createElement('ul')

      suspect.traits.forEach(
        (trait) => {
          const item = document.createElement('li')
          item.textContent = trait
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
      !event.currentTarget.contains(button)
    ) {
      return
    }

    try {
      engine.selectSuspect(
        button.dataset.suspectId
      )

      renderInvestigation(
        document.querySelector('#app')
      )
    } catch (error) {
      showInlineError(
        document.querySelector('#app'),
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
      (item) => item.id === deductionId
    )

  if (!deduction) {
    renderInvestigation(container)
    return
  }

  container.replaceChildren()

  const page = document.createElement('main')
  page.classList.add('deduction-form-page')

  const eyebrow = document.createElement('p')
  eyebrow.classList.add('eyebrow')
  eyebrow.textContent =
    'CASEFILE / DEDUCTION'

  const title = document.createElement('h1')
  title.textContent = deduction.prompt

  const form = document.createElement('form')
  form.classList.add('deduction-form')

  deduction.options.forEach(
    (option) => {
      const label = document.createElement('label')
      label.classList.add(
        'deduction-option'
      )

      const input = document.createElement('input')

      input.type = 'radio'
      input.name = 'deduction-answer'
      input.value = option.id
      input.required = true

      const text = document.createElement('span')
      text.textContent = option.text

      label.append(
        input,
        text
      )

      form.append(label)
    }
  )

  const actions = document.createElement('div')
  actions.classList.add('form-actions')

  const submitButton = document.createElement('button')
  submitButton.type = 'submit'
  submitButton.classList.add('primary-button')
  submitButton.textContent =
    'Kirim Kesimpulan'

  const backButton = document.createElement('button')
  backButton.type = 'button'
  backButton.classList.add('secondary-button')
  backButton.textContent =
    '← Kembali ke Investigasi'

  backButton.addEventListener(
    'click',
    () => {
      try {
        engine.returnToInvestigation()

        renderInvestigation(
          document.querySelector('#app')
        )
      } catch (error) {
        showInlineError(
          document.querySelector('#app'),
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
          document.querySelector('#app'),
          deduction,
          result.correct,
          engine
        )
      } catch (error) {
        showInlineError(
          document.querySelector('#app'),
          error.message
        )
      }
    }
  )

  page.append(
    eyebrow,
    title,
    form
  )

  container.append(page)
}

function renderDeductionFeedback(
  container,
  deduction,
  correct,
  engine
) {
  container.replaceChildren()

  const page = document.createElement('main')
  page.classList.add(
    'deduction-feedback-page'
  )

  const status = document.createElement('span')
  status.classList.add(
    correct
      ? 'feedback-correct'
      : 'feedback-wrong'
  )

  status.textContent =
    correct
      ? '✓ DEDUCTION BENAR'
      : '✕ DEDUCTION SALAH'

  const title = document.createElement('h1')
  title.textContent =
    correct
      ? 'Kesimpulan diterima'
      : 'Kesimpulan belum tepat'

  const explanation = document.createElement('p')
  explanation.textContent =
    deduction.explanation

  const button = document.createElement('button')
  button.type = 'button'
  button.classList.add('primary-button')
  button.textContent =
    'Kembali ke Investigasi'

  button.addEventListener(
    'click',
    () => {
      try {
        engine.returnToInvestigation()

        renderInvestigation(
          document.querySelector('#app')
        )
      } catch (error) {
        showInlineError(
          document.querySelector('#app'),
          error.message
        )
      }
    }
  )

  page.append(
    status,
    title,
    explanation,
    button
  )

  container.append(page)
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

  if (condition.type === 'always') {
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
  const item = document.createElement('div')
  item.classList.add('meta-item')

  const labelElement = document.createElement('span')
  labelElement.textContent = label

  const valueElement = document.createElement('strong')
  valueElement.textContent = value

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

  const error = document.createElement('div')
  error.classList.add('inline-error')

  const title = document.createElement('strong')
  title.textContent = 'Terjadi kesalahan'

  const description = document.createElement('p')
  description.textContent = message

  error.append(
    title,
    description
  )

  container.prepend(error)
}