const STORAGE_KEY = 'pendingUnlockCards'

export function appendPendingUnlocks(cards = []) {
  if (!Array.isArray(cards) || cards.length === 0) {
    return
  }

  const existing = readPendingUnlocks()
  const merged = [...existing]

  for (const card of cards) {
    if (!card?.code) {
      continue
    }

    if (!merged.some((item) => item.code === card.code)) {
      merged.push(card)
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
}

export function readPendingUnlocks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function consumePendingUnlocks() {
  const cards = readPendingUnlocks()
  localStorage.removeItem(STORAGE_KEY)
  return cards
}
