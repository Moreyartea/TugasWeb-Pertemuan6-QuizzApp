import { getAppState } from '../../app/app-state.js'
import { navigate } from '../../app/router.js'
import { calculateScore } from './scoring.engine.js'
import {
  saveInvestigationResult,
  loadHighScore
} from '../history/history.service.js'

export function renderResult(container) {
  const { currentCase, investigationEngine } = getAppState()

  if (!currentCase || !investigationEngine) {
    navigate('/cases')
    return
  }

  const state = investigationEngine.getState()

  if (state.phase !== 'RESULT') {
    navigate(`/case/${currentCase.id}/investigation`)
    return
  }

  const result = calculateScore(currentCase, state)
  const bestScore = Math.max(loadHighScore(), result.score)

  container.replaceChildren()

  const page = document.createElement('main')
  page.classList.add('result-page')

  const header = document.createElement('header')
  header.classList.add('result-header')

  const eyebrow = document.createElement('p')
  eyebrow.classList.add('eyebrow')
  eyebrow.textContent = 'CASEFILE / EVALUATION'

  const title = document.createElement('h1')
  title.textContent = 'Quiz Result'

  const description = document.createElement('p')
  description.classList.add('page-description')
  description.textContent =
    'Investigasi telah selesai. Berikut hasil quiz berdasarkan seluruh keputusan yang dibuat.'

  header.append(eyebrow, title, description)
  page.append(header)

  const scorePanel = document.createElement('section')
  scorePanel.classList.add('score-panel')

  const scoreLabel = document.createElement('span')
  scoreLabel.classList.add('score-label')
  scoreLabel.textContent = 'FINAL SCORE'

  const scoreValue = document.createElement('strong')
  scoreValue.classList.add('score-value')
  scoreValue.textContent = result.score

  const scoreMax = document.createElement('span')
  scoreMax.classList.add('score-max')
  scoreMax.textContent = '/ 100'

  const rank = document.createElement('div')
  rank.classList.add('result-rank')
  rank.textContent = `RANK ${result.rank}`

  const best = document.createElement('p')
  best.classList.add('result-best-score')
  best.textContent = `BEST SCORE: ${bestScore}/100`

  scorePanel.append(scoreLabel, scoreValue, scoreMax, rank, best)
  page.append(scorePanel)

  const breakdown = document.createElement('section')
  breakdown.classList.add('result-breakdown')

  const breakdownTitle = document.createElement('h2')
  breakdownTitle.textContent = 'Perincian Nilai'

  const breakdownGrid = document.createElement('div')
  breakdownGrid.classList.add('result-breakdown-grid')

  addBreakdownItem(
    breakdownGrid,
    'EVIDENCE',
    result.evidence.points,
    result.evidence.maxPoints,
    `${result.evidence.discovered}/${result.evidence.total} ditemukan`
  )

  addBreakdownItem(
    breakdownGrid,
    'DEDUCTION',
    result.deductions.points,
    result.deductions.maxPoints,
    `${result.accuracy}% akurasi`
  )

  addBreakdownItem(
    breakdownGrid,
    'SUSPECT',
    result.suspect.points,
    result.suspect.maxPoints,
    result.suspect.correct ? 'Pilihan benar' : 'Pilihan tidak tepat'
  )

  addBreakdownItem(
    breakdownGrid,
    'TIME',
    result.time.points,
    result.time.maxPoints,
    formatTime(result.time.seconds)
  )

  breakdown.append(breakdownTitle, breakdownGrid)
  page.append(breakdown)

  const summary = document.createElement('section')
  summary.classList.add('result-summary')

  const summaryTitle = document.createElement('h2')
  summaryTitle.textContent = 'Ringkasan Investigasi'

  const summaryGrid = document.createElement('div')
  summaryGrid.classList.add('result-grid')

  addResultItem(summaryGrid, 'AKURASI', `${result.accuracy}%`)
  addResultItem(summaryGrid, 'EVIDENCE', `${result.evidence.discovered}/${result.evidence.total}`)
  addResultItem(summaryGrid, 'DEDUCTION', `${result.deductions.completed}/${result.deductions.total}`)
  addResultItem(summaryGrid, 'WAKTU', formatTime(result.time.seconds))

  summary.append(summaryTitle, summaryGrid)
  page.append(summary)

  const suspectPanel = document.createElement('section')
  suspectPanel.classList.add('result-suspect')

  const suspectTitle = document.createElement('h2')
  suspectTitle.textContent = 'Evaluasi Tersangka'

  const suspect = currentCase.suspects.find(
    (item) => item.id === state.selectedSuspect
  )

  const suspectName = document.createElement('p')
  suspectName.classList.add('result-suspect-name')
  suspectName.textContent = suspect?.name ?? 'Tidak diketahui'

  const suspectStatus = document.createElement('p')
  suspectStatus.classList.add(
    result.suspect.correct ? 'result-correct' : 'result-wrong'
  )
  suspectStatus.textContent = result.suspect.correct
    ? '✓ Pilihan tersangka benar.'
    : `✕ Pilihan tersangka tidak tepat. Tersangka yang paling kuat adalah ${getCorrectSuspect(currentCase)?.name ?? '-'}.`

  suspectPanel.append(suspectTitle, suspectName, suspectStatus)
  page.append(suspectPanel)

  const explanation = document.createElement('section')
  explanation.classList.add('result-explanation')

  const explanationTitle = document.createElement('h2')
  explanationTitle.textContent = 'Kesimpulan Kasus'

  const explanationText = document.createElement('p')
  explanationText.textContent = currentCase.solution.explanation

  explanation.append(explanationTitle, explanationText)
  page.append(explanation)

  const actions = document.createElement('div')
  actions.classList.add('result-actions')

  const restartButton = document.createElement('button')
  restartButton.type = 'button'
  restartButton.classList.add('secondary-button')
  restartButton.textContent = '↻ Ulangi Investigasi'

  restartButton.addEventListener('click', () => {
    try {
      investigationEngine.reset()
      investigationEngine.startCase()
      navigate(`/case/${currentCase.id}`)
    } catch (error) {
      showSaveError(page, error.message)
    }
  })

  const historyButton = document.createElement('button')
  historyButton.type = 'button'
  historyButton.classList.add('primary-button')
  historyButton.textContent = 'Simpan & Lihat History'

  historyButton.addEventListener('click', () => {
    try {
      saveInvestigationResult(currentCase, state, result)
      investigationEngine.completeCase()
      navigate('/history')
    } catch (error) {
      showSaveError(page, error.message)
    }
  })

  actions.append(restartButton, historyButton)
  page.append(actions)

  container.append(page)
}

function addBreakdownItem(container, label, points, maxPoints, detail) {
  const item = document.createElement('article')
  item.classList.add('result-breakdown-item')

  const labelElement = document.createElement('span')
  labelElement.textContent = label

  const value = document.createElement('strong')
  value.textContent = `${points}/${maxPoints}`

  const detailElement = document.createElement('small')
  detailElement.textContent = detail

  item.append(labelElement, value, detailElement)
  container.append(item)
}

function addResultItem(container, label, value) {
  const item = document.createElement('div')
  item.classList.add('result-item')

  const labelElement = document.createElement('span')
  labelElement.textContent = label

  const valueElement = document.createElement('strong')
  valueElement.textContent = value

  item.append(labelElement, valueElement)
  container.append(item)
}

function getCorrectSuspect(caseItem) {
  return caseItem.suspects.find(
    (suspect) => suspect.id === caseItem.solution.suspectId
  )
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function showSaveError(container, message) {
  const oldError = container.querySelector('.result-save-error')
  if (oldError) oldError.remove()

  const error = document.createElement('p')
  error.classList.add('result-save-error')
  error.textContent = message
  container.append(error)
}
