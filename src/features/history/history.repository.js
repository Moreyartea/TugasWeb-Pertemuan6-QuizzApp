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

  if (!isValidHistory(data)) {
    return []
  }

  return data.records
}

export function saveHistoryRecord(record) {
  const currentRecords = getHistoryRecords()

  const alreadyExists = currentRecords.some(
    (item) => item.id === record.id
  )

  if (alreadyExists) {
    return record
  }

  const nextData = {
    version: HISTORY_VERSION,
    records: [
      record,
      ...currentRecords
    ].slice(0, 50)
  }

  writeJson(
    STORAGE_KEYS.HISTORY,
    nextData
  )

  return record
}

export function clearHistoryRecords() {
  removeItem(STORAGE_KEYS.HISTORY)
}