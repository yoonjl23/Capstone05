import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  Eye,
  Gamepad2,
  Sparkles,
} from 'lucide-react'
import Layout from '../components/Layout'
import MenuCard from '../components/MenuCard'
import {
  buildCardAssetPath,
  COLLECTION_MAPS_BY_KEY,
} from '../data/collection'
import { buildMockUnlockCards, shouldShowMockUnlock } from '../utils/devPreview'
import { consumePendingUnlocks } from '../utils/unlockQueue'

export default function MenuPage({
  setView,
  username,
  onStartExpression,
  onStartInference,
  isMuted,
  setIsMuted,
  onLogout,
}) {
  const [unlockQueue, setUnlockQueue] = useState([])
  const [unlockIndex, setUnlockIndex] = useState(0)

  useEffect(() => {
    const pendingUnlocks = consumePendingUnlocks()
    const previewUnlocks =
      pendingUnlocks.length === 0 && shouldShowMockUnlock()
        ? buildMockUnlockCards()
        : pendingUnlocks

    if (previewUnlocks.length > 0) {
      setUnlockQueue(previewUnlocks)
      setUnlockIndex(0)
    }
  }, [])

  useEffect(() => {
    if (unlockQueue.length === 0 || unlockIndex >= unlockQueue.length) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setUnlockIndex((current) => current + 1)
    }, 3200)

    return () => window.clearTimeout(timer)
  }, [unlockQueue, unlockIndex])

  const activeUnlock =
    unlockIndex < unlockQueue.length ? unlockQueue[unlockIndex] : null
  const activeMap = useMemo(
    () => (activeUnlock ? COLLECTION_MAPS_BY_KEY[activeUnlock.themeCode] : null),
    [activeUnlock],
  )

  return (
    <Layout
      setView={setView}
      isMuted={isMuted}
      setIsMuted={setIsMuted}
      username={username}
      onLogout={onLogout}
    >
      <div className="h-full flex flex-col items-center justify-center p-12 bg-[radial-gradient(circle_at_top,_#fff8d9,_#fff7ed_45%,_#fffaf5)]">
        <h2 className="text-4xl font-black text-gray-800 mb-12">
          오늘은 어떤 모험을 떠날까요?
        </h2>

        <div className="grid grid-cols-3 gap-4 w-full max-w-6xl">
          <MenuCard
            icon={<Eye size={64} className="text-blue-500" />}
            title="마음 거울"
            desc="내 표정을 자유롭게 관찰해요"
            color="hover:border-blue-400"
            onClick={() => setView('mirror')}
          />

          <MenuCard
            icon={<Gamepad2 size={64} className="text-orange-500" />}
            title="감정 표현하기"
            desc="표정을 따라 하며 감정을 익혀요"
            color="hover:border-orange-400"
            onClick={onStartExpression}
          />

          <MenuCard
            icon={<BrainCircuit size={64} className="text-purple-500" />}
            title="상황 보고 추리하기"
            desc="상황에 맞는 마음을 골라봐요"
            color="hover:border-purple-400"
            onClick={onStartInference}
          />

          <MenuCard
            icon={<BookOpen size={64} className="text-green-500" />}
            title="감자 도감"
            desc="맵을 여행하며 카드 36장을 모아봐요"
            color="hover:border-green-400"
            onClick={() => setView('collection')}
          />

          <MenuCard
            icon={<BarChart3 size={64} className="text-slate-700" />}
            title="학습 통계"
            desc="내가 얼마나 성장했는지 확인해요"
            onClick={() => setView('stats')}
          />
        </div>
      </div>

      {activeUnlock && activeMap && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#120a23]/70 backdrop-blur-sm px-6">
          <div className="relative w-full max-w-xl rounded-[36px] overflow-hidden border border-white/20 bg-white shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(255,255,255,0))]" />

            <div className="relative px-8 pt-8 pb-10 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-800">
                <Sparkles size={18} />
                새 카드가 해금됐어요
              </div>

              <h3 className="mt-4 text-3xl font-black text-slate-900">
                {activeMap.title}
              </h3>
              <p className="mt-2 text-slate-500 font-semibold">
                레벨 {activeUnlock.requiredLevel} 보상 카드
              </p>

              <div className="mx-auto mt-6 w-64 rounded-[28px] bg-white p-3 shadow-[0_18px_40px_rgba(0,0,0,0.18)] ring-1 ring-slate-200">
                <img
                  src={buildCardAssetPath(
                    activeUnlock.themeCode,
                    activeUnlock.imageName,
                  )}
                  alt={activeUnlock.name}
                  className="w-full rounded-[22px] object-cover"
                />
              </div>

              <p className="mt-5 text-xl font-black text-slate-800">
                {activeUnlock.name}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                감자 도감에서 방금 열린 카드를 확인해 보세요.
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
