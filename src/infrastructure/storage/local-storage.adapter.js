function getStorage() {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

export function readJson(key, fallbackValue = null) {
  const storage = getStorage()

  if (!storage) {
    return fallbackValue
  }

  try {
    const rawValue = storage.getItem(key)

    if (!rawValue) {
      return fallbackValue
    }

    return JSON.parse(rawValue)
  } catch {
    return fallbackValue
  }
}

export function writeJson(key, value) {
  const storage = getStorage()

  if (!storage) {
    throw new Error(
      'LocalStorage tidak tersedia pada browser ini.'
    )
  }

  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    throw new Error(
      'Data tidak dapat disimpan ke LocalStorage.'
    )
  }
}

export function removeItem(key) {
  const storage = getStorage()

  if (!storage) {
    return
  }

  try {
    storage.removeItem(key)
  } catch {
    throw new Error(
      'Data tidak dapat dihapus dari LocalStorage.'
    )
  }
}