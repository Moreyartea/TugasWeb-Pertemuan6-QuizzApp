import {
    getCaseById,
    getCases
} from './case.repository.js'

import { isValidCase } from './case.model.js'

export async function loadCases() {
    const cases = await getCases()

    return cases.filter(isValidCase)
}

export async function loadCase(caseId) {
    if (!caseId) {
        throw new Error(
            'ID kasus tidak boleh kosong.'
        )
    }

    const caseItem =
        await getCaseById(caseId)

    if (
        !caseItem ||
        !isValidCase(caseItem)
    ) {
        throw new Error(
            'Kasus tidak ditemukan atau tidak valid.'
        )
    }

    return caseItem
}