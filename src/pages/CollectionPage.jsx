import { useEffect, useMemo, useState } from 'react'
import { BookOpen, Lock, Map, Sparkles, Star } from 'lucide-react'
import Layout from '../components/Layout'
import { api } from '../services/api'
import {
  buildCardAssetPath,
  buildLockedCardPath,
  COLLECTION_MAPS,
  groupCharactersByMap,
} from '../data/collection'
import {
  buildMockProgress,
  getPreviewCardCode,
  getPreviewLockedCode,
  shouldUseMockProgress,
} from '../utils/devPreview'

export default function CollectionPage({
  setView,
  isMuted,
  setIsMuted,
  userId,
  username,
}) {
  const [progress, setProgress] = useState(null)
  const [selectedMapKey, setSelectedMapKey] = useState(COLLECTION_MAPS[0].key)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeCard, setActiveCard] = useState(null)
  const [lockedNotice, setLockedNotice] = useState(null)

  useEffect(() => {
    const fetchProgress = async () => {
      if (shouldUseMockProgress()) {
        setProgress(buildMockProgress())
        setLoading(false)
        setErrorMessage('')
        return
      }

      if (!userId) {
        setLoading(false)
        setErrorMessage('로그인 후 감자 도감을 확인할 수 있어요.')
        return
      }

      try {
        setLoading(true)
        setErrorMessage('')
        const data = await api.getProgress(userId)
        setProgress(data)
      } catch (error) {
        setErrorMessage(error.message || '도감 정보를 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [userId])

  const maps = useMemo(() => {
    const currentLevel = Number(progress?.level) || 1

    return groupCharactersByMap(progress?.characters || []).map((map) => {
      const unlockedCount = map.characters.filter((card) => card.unlocked).length
      const nextCard = map.characters.find((card) => !card.unlocked) || null
      const isUnlocked = currentLevel >= map.levelRange[0]

      return {
        ...map,
        isUnlocked,
        unlockedCount,
        nextCard,
      }
    })
  }, [progress])

  const totalUnlocked = progress?.characters?.filter((card) => card.unlocked).length || 0
  const totalCards = progress?.characters?.length || 36
  const nextUnlockCard = progress?.characters?.find((card) => !card.unlocked) || null

  useEffect(() => {
    const availableMap = maps.find((map) => map.isUnlocked)
    if (!availableMap) {
      return
    }

    if (!maps.some((map) => map.key === selectedMapKey && map.isUnlocked)) {
      setSelectedMapKey(availableMap.key)
    }
  }, [maps, selectedMapKey])

  const selectedMap =
    maps.find((map) => map.key === selectedMapKey) || maps[0] || COLLECTION_MAPS[0]

  useEffect(() => {
    if (!progress) {
      return
    }

    const previewCardCode = getPreviewCardCode()
    if (previewCardCode) {
      const previewCard = progress.characters.find(
        (card) => card.code === previewCardCode,
      )

      if (previewCard?.unlocked) {
        const previewMap = maps.find((map) => map.key === previewCard.themeCode)
        if (previewMap) {
          setSelectedMapKey(previewMap.key)
          setActiveCard({
            ...previewCard,
            mapTitle: previewMap.title,
          })
        }
      }
    }

    const previewLockedCode = getPreviewLockedCode()
    if (previewLockedCode) {
      const lockedCard = progress.characters.find(
        (card) => card.code === previewLockedCode,
      )
      const lockedMap = maps.find((map) => map.key === lockedCard?.themeCode)

      if (lockedCard && lockedMap && !lockedCard.unlocked) {
        setSelectedMapKey(lockedMap.key)
        setLockedNotice({
          title: `${lockedMap.title} 카드 잠김`,
          body: `레벨 ${lockedCard.requiredLevel}에 도달하면 이 카드를 열 수 있어요.`,
        })
      }
    }
  }, [maps, progress])

  const handleSelectMap = (map) => {
    if (!map.isUnlocked) {
      setLockedNotice({
        title: `${map.title} 잠금 상태`,
        body: `레벨 ${map.levelRange[0]}부터 이 맵으로 여행할 수 있어요.`,
      })
      return
    }

    setSelectedMapKey(map.key)
  }

  const handleCardClick = (card, map) => {
    if (!card.unlocked) {
      setLockedNotice({
        title: `${map.title} 카드 잠김`,
        body: `레벨 ${card.requiredLevel}에 도달하면 이 카드를 열 수 있어요.`,
      })
      return
    }

    setActiveCard({
      ...card,
      mapTitle: map.title,
    })
  }

  return (
    <Layout
      setView={setView}
      isMuted={isMuted}
      setIsMuted={setIsMuted}
      username={username}
    >
      <div className="h-full overflow-y-auto bg-[linear-gradient(180deg,_#fffaf0_0%,_#fff6e3_100%)] p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <section className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_50px_rgba(178,138,54,0.12)] backdrop-blur">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-800">
                  <BookOpen size={16} />
                  감자 도감
                </div>
                <h2 className="mt-4 text-4xl font-black text-slate-900">
                  멋진 나라의 친구들을 모아봐요
                </h2>
                <p className="mt-3 max-w-3xl text-slate-500 font-semibold">
                  용감한 우주탐험대가 되어 우주 친구들부터 전설적인 드래곤까지 만나러가요
                </p>
              </div>

              <div className="grid min-w-[280px] grid-cols-2 gap-3">
                <div className="rounded-[24px] bg-slate-900 px-5 py-4 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-white/60">
                    현재 레벨
                  </p>
                  <p className="mt-2 text-3xl font-black">
                  LV {progress?.level || 1}
                  </p>
                </div>
                <div className="rounded-[24px] bg-yellow-100 px-5 py-4 text-yellow-900">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-700/70">
                    도감 현황
                  </p>
                  <p className="mt-2 text-3xl font-black">
                    {totalUnlocked} / {totalCards}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-[24px] bg-slate-50 px-5 py-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  우리 친구의 경험치는?
                </p>
                <p className="mt-2 text-2xl font-black text-slate-800">
                  {progress?.totalExp || 0} EXP
                </p>
              </div>
              <div className="rounded-[24px] bg-slate-50 px-5 py-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  다음 레벨 목표에요!
                </p>
                <p className="mt-2 text-2xl font-black text-slate-800">
                  LV {nextUnlockCard?.requiredLevel || progress?.level || 1}
                </p>
              </div>
              <div className="rounded-[24px] bg-slate-50 px-5 py-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  다음 레벨에서 만날 수 있는 친구에요
                </p>
                <p className="mt-2 text-lg font-black text-slate-800">
                  {nextUnlockCard?.name || '모든 카드 해금 완료'}
                </p>
              </div>
            </div>
          </section>

          {errorMessage && (
            <div className="rounded-[24px] bg-red-100 px-5 py-4 text-center font-black text-red-600">
              {errorMessage}
            </div>
          )}

          <section className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-[0_18px_50px_rgba(120,103,61,0.1)]">
            <div className="flex items-center gap-3">
              <Map size={22} className="text-slate-700" />
              <h3 className="text-2xl font-black text-slate-900">
                어디로 여행을 떠날까요?
              </h3>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {maps.map((map) => (
                <button
                  key={map.key}
                  type="button"
                  onClick={() => handleSelectMap(map)}
                  className={`relative overflow-hidden rounded-[28px] p-5 text-left transition duration-200 ${
                    selectedMapKey === map.key
                      ? 'scale-[1.01] ring-2 ring-offset-2 ring-yellow-300'
                      : 'hover:-translate-y-1'
                  } ${map.glow}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${map.surface}`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_60%)]" />

                  <div className="relative flex h-full flex-col justify-between text-white">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.24em] text-white/60">
                          Level {map.levelRange[0]} - {map.levelRange[1]}
                        </p>
                        <h4 className="mt-2 text-2xl font-black">{map.title}</h4>
                      </div>
                      {map.isUnlocked ? (
                        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black">
                          OPEN
                        </span>
                      ) : (
                        <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-black">
                          LOCKED
                        </span>
                      )}
                    </div>

                    <div className="mt-6 space-y-2">
                      <p className="text-sm font-semibold text-white/75">
                        {map.subtitle}
                      </p>
                      <div className="flex items-center justify-between text-sm font-black">
                        <span>{map.unlockedCount} / 9 cards</span>
                        <span>시작 레벨 {map.levelRange[0]}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section
            className={`overflow-hidden rounded-[36px] bg-gradient-to-br ${selectedMap.surface} ${selectedMap.glow}`}
          >
            <div className="border-b border-white/10 px-6 py-5 text-white">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-white/60">
                    Selected Map
                  </p>
                  <h3 className="mt-2 text-4xl font-black">{selectedMap.title}</h3>
                  <p className="mt-3 max-w-2xl text-white/70 font-semibold">
                    {selectedMap.subtitle}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] bg-white/12 px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-white/50">
                      Map Progress
                    </p>
                    <p className="mt-2 text-2xl font-black">
                      {selectedMap.unlockedCount} / 9
                    </p>
                  </div>
                  <div className="rounded-[22px] bg-white/12 px-4 py-3">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-white/50">
                      Next Unlock
                    </p>
                    <p className="mt-2 text-lg font-black">
                      {selectedMap.nextCard
                        ? `LV ${selectedMap.nextCard.requiredLevel}`
                        : '모두 열림'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex min-h-[420px] items-center justify-center text-2xl font-black text-white/80">
                  불러오는 중...
                </div>
              ) : (
                <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
                  {selectedMap.characters.map((card, index) => {
                    const isRaised = index % 3 === 1
                    const imageSrc = card.unlocked
                      ? buildCardAssetPath(card.themeCode, card.imageName)
                      : buildLockedCardPath(card.themeCode)

                    return (
                      <button
                        key={card.code}
                        type="button"
                        onClick={() => handleCardClick(card, selectedMap)}
                        className={`group rounded-[30px] bg-white/10 p-3 text-left backdrop-blur-sm transition ${
                          isRaised ? 'xl:-translate-y-5' : ''
                        } ${card.unlocked ? 'hover:-translate-y-1' : 'hover:scale-[1.01]'}`}
                      >
                        <div className="relative overflow-hidden rounded-[24px] bg-black/15">
                          <img
                            src={imageSrc}
                            alt={card.name}
                            className={`w-full rounded-[24px] object-cover transition duration-300 ${
                              card.unlocked
                                ? 'group-hover:scale-[1.02]'
                                : 'opacity-85 saturate-75'
                            }`}
                          />

                          {!card.unlocked && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/35 text-white">
                              <Lock size={28} />
                              <span className="mt-3 rounded-full bg-white/20 px-4 py-1 text-sm font-black">
                                LV {card.requiredLevel}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="px-2 pb-2 pt-4 text-white">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/55">
                                Card {String(index + 1).padStart(2, '0')}
                              </p>
                              <p className="mt-2 text-lg font-black">
                                {card.name}
                              </p>
                            </div>
                            {card.unlocked ? (
                              <div className="rounded-full bg-yellow-300 px-3 py-1 text-xs font-black text-yellow-950">
                                OPEN
                              </div>
                            ) : (
                              <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-black text-white/80">
                                LOCKED
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {activeCard && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#120b21]/72 backdrop-blur-sm px-6">
          <div className="w-full max-w-4xl overflow-hidden rounded-[36px] bg-white shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
              <div className="bg-slate-100 p-4">
                <img
                  src={buildCardAssetPath(activeCard.themeCode, activeCard.imageName)}
                  alt={activeCard.name}
                  className="w-full rounded-[28px] object-cover"
                />
              </div>

              <div className="flex flex-col justify-between p-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-800">
                    <Sparkles size={16} />
                    해금 완료
                  </div>
                  <h3 className="mt-4 text-4xl font-black text-slate-900">
                    {activeCard.name}
                  </h3>
                  <p className="mt-3 text-lg font-semibold text-slate-500">
                    {activeCard.mapTitle}
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[24px] bg-slate-50 px-4 py-4">
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                        Unlock Level
                      </p>
                      <p className="mt-2 text-2xl font-black text-slate-800">
                        LV {activeCard.requiredLevel}
                      </p>
                    </div>
                    <div className="rounded-[24px] bg-slate-50 px-4 py-4">
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                        Status
                      </p>
                      <p className="mt-2 text-2xl font-black text-slate-800">
                        발견 완료
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveCard(null)}
                  className="mt-8 rounded-[24px] bg-slate-900 px-6 py-4 text-lg font-black text-white transition hover:bg-slate-800"
                >
                  도감으로 돌아가기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {lockedNotice && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#170f2b]/60 backdrop-blur-sm px-6">
          <div className="w-full max-w-md rounded-[32px] bg-white px-8 py-8 text-center shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white">
              <Lock size={28} />
            </div>
            <h3 className="mt-5 text-2xl font-black text-slate-900">
              {lockedNotice.title}
            </h3>
            <p className="mt-3 text-base font-semibold leading-7 text-slate-500">
              {lockedNotice.body}
            </p>
            <button
              type="button"
              onClick={() => setLockedNotice(null)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-5 py-3 text-sm font-black text-yellow-900"
            >
              <Star size={16} />
              알겠어요
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}
