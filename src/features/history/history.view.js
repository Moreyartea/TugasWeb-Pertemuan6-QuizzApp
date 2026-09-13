import { loadHistory, loadHighScore } from './history.service.js'
import { navigate } from '../../app/router.js'

export function renderHistory(container) {
  container.replaceChildren()

  const page = document.createElement('main')
  page.classList.add('history-page')

  const header = document.createElement('header')
  header.classList.add('page-header')

  const eyebrow = document.createElement('p')
  eyebrow.classList.add('eyebrow')
  eyebrow.textContent = 'CASEFILE / ARCHIVE'

  const title = document.createElement('h1')
  title.textContent = 'Quiz History'

  const description = document.createElement('p')
  description.classList.add('page-description')
  description.textContent = 'Daftar hasil quiz investigasi yang tersimpan pada browser ini.'

  const backLink = document.createElement('a')
  backLink.href = '/cases'
  backLink.dataset.route = '/cases'
  backLink.classList.add('secondary-button')
  backLink.textContent = '← Kembali ke Kasus'

  header.append(eyebrow, title, description, backLink)
  page.append(header)

  const content = document.createElement('section')
  content.classList.add('history-content')

  try {
    const history = loadHistory()
    const highScore = loadHighScore()

    const highScorePanel = document.createElement('section')
    highScorePanel.classList.add('history-high-score')

    const highScoreLabel = document.createElement('span')
    highScoreLabel.textContent = 'BEST SCORE'

    const highScoreValue = document.createElement('strong')
    highScoreValue.textContent = `${highScore}/100`

    highScorePanel.append(highScoreLabel, highScoreValue)
    content.append(highScorePanel)

    if (history.length === 0) {
      renderEmptyHistory(content)
    } else {
      renderHistoryRecords(content, history)
    }
  } catch (error) {
    renderHistoryError(content, error.message)
  }

  page.append(content)
  container.append(page)
}

function renderEmptyHistory(container) {
  const empty = document.createElement('section')
  empty.classList.add('empty-state')

  const icon = document.createElement('div')
  icon.classList.add('empty-state-icon')
  icon.textContent = '∅'

  const title = document.createElement('h2')
  title.textContent = 'Belum Ada Riwayat'

  const description = document.createElement('p')
  description.textContent = 'Selesaikan minimal satu kasus untuk melihat hasil investigasi di sini.'

  const link = document.createElement('a')
  link.href = '/cases'
  link.dataset.route = '/cases'
  link.classList.add('primary-button')
  link.textContent = 'Mulai Investigasi'

  empty.append(icon, title, description, link)
  container.append(empty)
}

function renderHistoryRecords(container, records) {
  const sectionTitle = document.createElement('h2')
  sectionTitle.textContent = 'Arsip Hasil'

  const grid = document.createElement('div')
  grid.classList.add('history-grid')

  records.forEach((record) => {
    const article = document.createElement('article')
    article.classList.add('history-card')

    const top = document.createElement('div')
    top.classList.add('history-card-top')

    const codename = document.createElement('span')
    codename.classList.add('history-codename')
    codename.textContent = record.codename

    const rank = document.createElement('span')
    rank.classList.add('rank-badge')
    rank.textContent = `RANK ${record.rank}`

    top.append(codename, rank)

    const title = document.createElement('h3')
    title.textContent = record.caseTitle

    const category = document.createElement('p')
    category.classList.add('history-category')
    category.textContent = `${record.category} • ${record.difficulty.toUpperCase()}`

    const stats = document.createElement('div')
    stats.classList.add('history-stats')

    addHistoryStat(stats, 'SCORE', `${record.score}/100`)
    addHistoryStat(stats, 'AKURASI', `${record.accuracy}%`)
    addHistoryStat(stats, 'EVIDENCE', `${record.evidenceFound}/${record.evidenceTotal}`)
    addHistoryStat(stats, 'DEDUCTION', `${record.deductionsCompleted}/${record.deductionsTotal}`)
    addHistoryStat(stats, 'WAKTU', formatTime(record.timeSeconds))

    const points = document.createElement('p')
    points.classList.add('history-points')
    points.textContent = `Nilai: Evidence ${record.evidencePoints ?? 0}/25 • Deduction ${record.deductionPoints ?? 0}/40 • Suspect ${record.suspectPoints ?? 0}/20 • Time ${record.timePoints ?? 0}/15`

    const suspect = document.createElement('p')
    suspect.classList.add('history-suspect')

    const suspectLabel = document.createElement('strong')
    suspectLabel.textContent = 'Tersangka: '

    const suspectValue = document.createElement('span')
    suspectValue.textContent = record.selectedSuspect

    const suspectStatus = document.createElement('span')
    suspectStatus.classList.add(record.suspectCorrect ? 'status-correct' : 'status-wrong')
    suspectStatus.textContent = record.suspectCorrect ? ' BENAR' : ' TIDAK TEPAT'

    suspect.append(suspectLabel, suspectValue, suspectStatus)

    const date = document.createElement('p')
    date.classList.add('history-date')
    date.textContent = `Diselesaikan: ${formatDate(record.completedAt)}`

    article.append(top, title, category, stats, points, suspect, date)
    grid.append(article)
  })

  container.append(sectionTitle, grid)
}

function addHistoryStat(container, label, value) {
  const item = document.createElement('div')
  item.classList.add('history-stat')

  const labelElement = document.createElement('span')
  labelElement.textContent = label

  const valueElement = document.createElement('strong')
  valueElement.textContent = value

  item.append(labelElement, valueElement)
  container.append(item)
}

function renderHistoryError(container, message) {
  const errorBox = document.createElement('section')
  errorBox.classList.add('error-state')

  const title = document.createElement('h2')
  title.textContent = 'Riwayat Tidak Dapat Dibuka'

  const description = document.createElement('p')
  description.textContent = message

  errorBox.append(title, description)
  container.append(errorBox)
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function formatDate(timestamp) {
  if (!timestamp) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(timestamp))
}
