import {
  getHistoryRecords,
  saveHistoryRecord,
  clearHistoryRecords
} from './history.repository.js'

export function loadHistory() {
  return getHistoryRecords()
}

export function saveInvestigationResult(
  caseItem,
  state,
  result
) {
  const selectedSuspect = caseItem.suspects.find(
    (suspect) => suspect.id === state.selectedSuspect
  )

  const record = {
    id: `${caseItem.id}-${state.finishedAt}`,

    caseId: caseItem.id,
    caseTitle: caseItem.title,
    codename: caseItem.codename,
    category: caseItem.category,
    difficulty: caseItem.difficulty,

    score: result.score,
    rank: result.rank,
    accuracy: result.accuracy,

    evidenceFound: result.evidence.discovered,
    evidenceTotal: result.evidence.total,

    deductionsCompleted: result.deductions.completed,
    deductionsTotal: result.deductions.total,

    selectedSuspect: selectedSuspect
      ? selectedSuspect.name
      : 'Tidak dipilih',

    suspectCorrect: result.suspect.correct,

    timeSeconds: result.time.seconds,

    completedAt: state.finishedAt
  }

  return saveHistoryRecord(record)
}

export function deleteHistory() {
  clearHistoryRecords()
}