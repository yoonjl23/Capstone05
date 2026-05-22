import { COLLECTION_MAPS } from '../data/collection'

function getSearchParams() {
  if (typeof window === 'undefined') {
    return new URLSearchParams()
  }

  return new URLSearchParams(window.location.search)
}

export function getPreviewView() {
  if (!import.meta.env.DEV) {
    return null
  }

  return getSearchParams().get('view')
}

export function shouldUseMockProgress() {
  return import.meta.env.DEV && getSearchParams().get('mockProgress') === '1'
}

export function getPreviewCardCode() {
  if (!import.meta.env.DEV) {
    return null
  }

  return getSearchParams().get('card')
}

export function getPreviewLockedCode() {
  if (!import.meta.env.DEV) {
    return null
  }

  return getSearchParams().get('lockedCard')
}

export function shouldShowMockUnlock() {
  return import.meta.env.DEV && getSearchParams().get('mockUnlock') === '1'
}

export function buildMockProgress(level = 14) {
  const cards = COLLECTION_MAPS.flatMap((map) => {
    const [startLevel] = map.levelRange

    return Array.from({ length: 9 }, (_, index) => {
      const requiredLevel = startLevel + index
      const codePrefix = map.key.replace(/-/g, '_').toUpperCase()

      return {
        id: requiredLevel,
        code: `BOOK_${codePrefix}_${String(index + 1).padStart(2, '0')}`,
        name: `${map.title} 카드 ${index + 1}`,
        requiredLevel,
        themeCode: map.key,
        imageName: `card${index + 1}.png`,
        unlocked: requiredLevel <= level,
        unlockedAt:
          requiredLevel <= level ? '2026-05-22T10:00:00' : null,
      }
    })
  })

  return {
    userId: 101,
    level,
    totalExp: (level - 1) * 50,
    nextLevelExp: level * 50,
    characters: cards,
  }
}

export function buildMockUnlockCards() {
  const progress = buildMockProgress(14)
  return progress.characters.filter((card) => card.requiredLevel === 14)
}
