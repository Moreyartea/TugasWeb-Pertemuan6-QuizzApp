const SESSION_KEY = 'casefile-investigation-v1'

export function readInvestigationSession() {
    try {
        const raw =
            sessionStorage.getItem(SESSION_KEY)

        if (!raw) {
            return null
        }

        return JSON.parse(raw)
    } catch (error) {
        console.error(
            'Gagal membaca session investigasi.',
            error
        )

        return null
    }
}

export function writeInvestigationSession(state) {
    try {
        sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify(state)
        )
    } catch (error) {
        console.error(
            'Gagal menyimpan session investigasi.',
            error
        )
    }
}

export function clearInvestigationSession() {
    try {
        sessionStorage.removeItem(
            SESSION_KEY
        )
    } catch (error) {
        console.error(
            'Gagal menghapus session investigasi.',
            error
        )
    }
}