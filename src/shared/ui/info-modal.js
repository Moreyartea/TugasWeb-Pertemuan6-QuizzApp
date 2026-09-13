import { readJson, writeJson } from '../../infrastructure/storage/local-storage.adapter.js'
import { STORAGE_KEYS } from '../../infrastructure/storage/storage.keys.js'

function createOverlay() {
  const overlay = document.createElement('div')
  overlay.classList.add('info-modal-overlay')
  overlay.setAttribute('role', 'presentation')
  return overlay
}

function createModal(titleText, eyebrowText) {
  const modal = document.createElement('section')
  modal.classList.add('info-modal')
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-modal', 'true')
  modal.setAttribute('aria-labelledby', 'info-modal-title')

  const header = document.createElement('div')
  header.classList.add('info-modal-header')

  const eyebrow = document.createElement('p')
  eyebrow.classList.add('eyebrow')
  eyebrow.textContent = eyebrowText

  const title = document.createElement('h2')
  title.id = 'info-modal-title'
  title.textContent = titleText

  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.classList.add('info-modal-close')
  closeButton.setAttribute('aria-label', 'Tutup')
  closeButton.textContent = '×'

  header.append(eyebrow, title, closeButton)
  modal.append(header)

  return { modal, closeButton }
}

function addSection(container, titleText, bodyText) {
  const section = document.createElement('section')
  section.classList.add('info-modal-section')

  const title = document.createElement('h3')
  title.textContent = titleText

  const body = document.createElement('p')
  body.textContent = bodyText

  section.append(title, body)
  container.append(section)
}

function addSteps(container, steps) {
  const list = document.createElement('ol')
  list.classList.add('info-modal-steps')

  steps.forEach((step) => {
    const item = document.createElement('li')

    const number = document.createElement('span')
    number.textContent = step.number

    const content = document.createElement('div')

    const title = document.createElement('strong')
    title.textContent = step.title

    const description = document.createElement('p')
    description.textContent = step.description

    content.append(title, description)
    item.append(number, content)
    list.append(item)
  })

  container.append(list)
}

function openModal(modal, onClose = null) {
  const overlay = createOverlay()
  overlay.append(modal)
  document.body.append(overlay)

  const close = () => {
    overlay.remove()
    if (onClose) onClose()
  }

  return { overlay, close }
}

export function showAboutModal() {
  const { modal, closeButton } = createModal(
    'About CASEFILE',
    'INTERACTIVE INVESTIGATION QUIZ'
  )

  const content = document.createElement('div')
  content.classList.add('info-modal-content')

  addSection(
    content,
    'TUJUAN APLIKASI',
    'CASEFILE adalah Interactive Quiz App untuk Tugas Rutin 6 — Pemrograman Web, dibungkus sebagai pengalaman investigasi kasus.'
  )

  addSection(
    content,
    'QUIZ FORMAT',
    '8 kasus, 40 pertanyaan pilihan ganda, 1 keputusan tersangka per kasus, skor otomatis, high score, dan history.'
  )

  addSection(
    content,
    'FITUR',
    'Timer, progress tracking, instant feedback, dark/light mode, SPA navigation, restart, dan penyimpanan hasil di browser.'
  )

  const actions = document.createElement('div')
  actions.classList.add('info-modal-actions')

  const close = document.createElement('button')
  close.type = 'button'
  close.classList.add('primary-button')
  close.textContent = 'Tutup'

  actions.append(close)
  modal.append(content, actions)

  const controller = openModal(modal)
  closeButton.addEventListener('click', controller.close)
  close.addEventListener('click', controller.close)
  controller.overlay.addEventListener('click', (event) => {
    if (event.target === controller.overlay) controller.close()
  })
}

export function showHowToPlayModal({ firstVisit = false, onContinue = null } = {}) {
  if (firstVisit && readJson(STORAGE_KEYS.HOW_TO_PLAY_SEEN, false)) {
    if (onContinue) onContinue()
    return
  }

  const { modal, closeButton } = createModal(
    'How to Play',
    'CASEFILE / QUIZ GUIDE'
  )

  const content = document.createElement('div')
  content.classList.add('info-modal-content')

  addSteps(content, [
    {
      number: '01',
      title: 'SELECT A CASE',
      description: 'Pilih satu kasus dari database untuk memulai.'
    },
    {
      number: '02',
      title: 'INVESTIGATE',
      description: 'Temukan dan buka evidence untuk membangun rangkaian bukti.'
    },
    {
      number: '03',
      title: 'DEDUCTION QUIZ',
      description: 'Jawab 5 pertanyaan pilihan ganda berdasarkan evidence yang telah ditemukan.'
    },
    {
      number: '04',
      title: 'IDENTIFY SUSPECT',
      description: 'Pilih tersangka yang paling kuat berdasarkan seluruh temuan.'
    },
    {
      number: '05',
      title: 'GET YOUR SCORE',
      description: 'Skor dihitung otomatis berdasarkan evidence, deduction, suspect, dan waktu.'
    }
  ])

  const actions = document.createElement('div')
  actions.classList.add('info-modal-actions')

  const continueButton = document.createElement('button')
  continueButton.type = 'button'
  continueButton.classList.add('primary-button')
  continueButton.textContent = onContinue
    ? 'Lanjut ke Database'
    : 'Mengerti'

  actions.append(continueButton)
  modal.append(content, actions)

  const markSeen = () => {
    if (firstVisit) writeJson(STORAGE_KEYS.HOW_TO_PLAY_SEEN, true)
  }

  const controller = openModal(modal, markSeen)

  closeButton.addEventListener('click', controller.close)
  continueButton.addEventListener('click', () => {
    controller.close()
    if (onContinue) onContinue()
  })

  controller.overlay.addEventListener('click', (event) => {
    if (event.target === controller.overlay) controller.close()
  })
}
