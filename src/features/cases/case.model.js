export function isValidCase(caseItem) {
    return Boolean(
        caseItem &&
        typeof caseItem.id === 'string' &&
        typeof caseItem.title === 'string' &&
        typeof caseItem.description === 'string' &&
        Array.isArray(caseItem.suspects) &&
        Array.isArray(caseItem.evidence) &&
        Array.isArray(caseItem.deductions) &&
        caseItem.solution &&
        typeof caseItem.solution.suspectId === 'string'
    )
}