export const COLLECTION_MAPS = [
  {
    key: 'space-expedition',
    title: '우주탐험대',
    shortTitle: '우주',
    subtitle: '별빛 항로를 따라 우주 속 친구들을 만나요.',
    accent: '#6e62ff',
    surface: 'from-[#24145f] via-[#3a237a] to-[#0a1d54]',
    glow: 'shadow-[0_24px_60px_rgba(86,74,255,0.28)]',
    levelRange: [1, 9],
  },
  {
    key: 'mushroom-village',
    title: '버섯요정마을',
    shortTitle: '버섯',
    subtitle: '따뜻한 숲의 반짝임 속 요정 친구들을 모아요.',
    accent: '#6f9b33',
    surface: 'from-[#31481c] via-[#546d2d] to-[#13240b]',
    glow: 'shadow-[0_24px_60px_rgba(111,155,51,0.24)]',
    levelRange: [10, 18],
  },
  {
    key: 'deep-sea',
    title: '깊은바닷속',
    shortTitle: '바다',
    subtitle: '푸른 물결 아래 숨은 친구들을 찾아 떠나요.',
    accent: '#2497d1',
    surface: 'from-[#0b3552] via-[#12507b] to-[#071b32]',
    glow: 'shadow-[0_24px_60px_rgba(36,151,209,0.24)]',
    levelRange: [19, 27],
  },
  {
    key: 'dragon-kingdom',
    title: '드래곤왕국',
    shortTitle: '드래곤',
    subtitle: '마지막 왕국에서 가장 전설적인 카드가 기다려요.',
    accent: '#c66038',
    surface: 'from-[#512012] via-[#8a381d] to-[#291107]',
    glow: 'shadow-[0_24px_60px_rgba(198,96,56,0.26)]',
    levelRange: [28, 36],
  },
]

export const COLLECTION_MAPS_BY_KEY = Object.fromEntries(
  COLLECTION_MAPS.map((map) => [map.key, map]),
)

export function buildCardAssetPath(themeCode, imageName) {
  return `/potato-book/${themeCode}/${imageName}`
}

export function buildLockedCardPath(themeCode) {
  return `/potato-book/${themeCode}/locked.png`
}

export function groupCharactersByMap(characters = []) {
  return COLLECTION_MAPS.map((map) => ({
    ...map,
    characters: characters.filter((character) => character.themeCode === map.key),
  }))
}
