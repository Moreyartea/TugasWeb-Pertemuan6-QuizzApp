import {
  getHistoryRecords,
  saveHistoryRecord,
  saveHighScore,
  getHighScore,
  clearHistoryRecords
} from './history.repository.js'

export function loadHistory() {
  return getHistoryRecords()
}

export function loadHighScore() {
  return getHighScore()
}

export function saveInvestigationResult(caseItem, state, result) {
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
    evidencePoints: result.evidence.points,
    evidenceMaxPoints: result.evidence.maxPoints,
    deductionsCompleted: result.deductions.completed,
    deductionsTotal: result.deductions.total,
    deductionPoints: result.deductions.points,
    deductionMaxPoints: result.deductions.maxPoints,
    suspectPoints: result.suspect.points,
    suspectMaxPoints: result.suspect.maxPoints,
    selectedSuspect: selectedSuspect
      ? selectedSuspect.name
      : 'Tidak dipilih',
    suspectCorrect: result.suspect.correct,
    timeSeconds: result.time.seconds,
    timePoints: result.time.points,
    timeMaxPoints: result.time.maxPoints,
    completedAt: state.finishedAt
  }

  saveHistoryRecord(record)
  const bestScore = saveHighScore(result.score)

  return {
    record,
    bestScore
  }
}

export function deleteHistory() {
  clearHistoryRecords()
}
