import {
  readJson,
  writeJson,
  removeItem
} from '../../infrastructure/storage/local-storage.adapter.js'

import { STORAGE_KEYS } from '../../infrastructure/storage/storage.keys.js'

const HISTORY_VERSION = 1

function createEmptyHistory() {
  return {
    version: HISTORY_VERSION,
    records: []
  }
}

function isValidHistory(data) {
  return (
    data &&
    data.version === HISTORY_VERSION &&
    Array.isArray(data.records)
  )
}

export function getHistoryRecords() {
  const data = readJson(
    STORAGE_KEYS.HISTORY,
    createEmptyHistory()
  )

  if (!isValidHistory(data)) return []

  return data.records
}

export function saveHistoryRecord(record) {
  const currentRecords = getHistoryRecords()

  const alreadyExists = currentRecords.some(
    (item) => item.id === record.id
  )

  if (alreadyExists) return record

  const nextData = {
    version: HISTORY_VERSION,
    records: [record, ...currentRecords].slice(0, 50)
  }

  writeJson(STORAGE_KEYS.HISTORY, nextData)

  return record
}

export function getHighScore() {
  const value = readJson(STORAGE_KEYS.HIGH_SCORE, 0)
  return Number.isFinite(Number(value)) ? Number(value) : 0
}

export function saveHighScore(score) {
  const numericScore = Math.max(0, Math.min(100, Number(score) || 0))
  const currentBest = getHighScore()
  const bestScore = Math.max(currentBest, numericScore)

  writeJson(STORAGE_KEYS.HIGH_SCORE, bestScore)

  return bestScore
}

export function clearHistoryRecords() {
  removeItem(STORAGE_KEYS.HISTORY)
  removeItem(STORAGE_KEYS.HIGH_SCORE)
}
