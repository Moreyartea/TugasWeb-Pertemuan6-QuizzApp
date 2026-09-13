import { STORAGE_KEYS } from '../../infrastructure/storage/storage.keys.js'
import { readJson, writeJson } from '../../infrastructure/storage/local-storage.adapter.js'

const THEMES = Object.freeze({
  DARK: 'dark',
  LIGHT: 'light'
})

export function getTheme() {
  const saved = readJson(STORAGE_KEYS.THEME, THEMES.DARK)
  return saved === THEMES.LIGHT ? THEMES.LIGHT : THEMES.DARK
}

export function applyTheme(theme = getTheme()) {
  const nextTheme = theme === THEMES.LIGHT
    ? THEMES.LIGHT
    : THEMES.DARK

  document.documentElement.dataset.theme = nextTheme

  document.querySelector('meta[name="theme-color"]').setAttribute(
    'content',
    nextTheme === 'light' ? '#efe8d8' : '#0a0c10'
  )

  document.dispatchEvent(new CustomEvent('casefile-theme-change', {
    detail: { theme: nextTheme }
  }))

  return nextTheme
}

export function toggleTheme() {
  const nextTheme = getTheme() === THEMES.DARK
    ? THEMES.LIGHT
    : THEMES.DARK

  writeJson(STORAGE_KEYS.THEME, nextTheme)
  applyTheme(nextTheme)

  return nextTheme
}

export { THEMES }
