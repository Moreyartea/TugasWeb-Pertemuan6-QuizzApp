const CASES_URL = '/src/infrastructure/data/cases.json'

export async function getCases() {
    const response = await fetch(CASES_URL)

    if (!response.ok) {
        throw new Error('Gagal mengambil data kasus.')
    }

    return response.json()
}

export async function getCaseById(caseId) {
    const cases = await getCases()

    return cases.find((caseItem) => caseItem.id === caseId) ?? null
}