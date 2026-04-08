import Layout from '../components/Layout'

import level1 from '../assets/collection/level1.png'
import level2 from '../assets/collection/level2.png'
import level3 from '../assets/collection/level3.png'
import level4 from '../assets/collection/level4.png'
import level5 from '../assets/collection/level5.png'
import level6 from '../assets/collection/level6.png'
import level7 from '../assets/collection/level7.png'
import level8 from '../assets/collection/level8.png'
import level9 from '../assets/collection/level9.png'
import level10 from '../assets/collection/level10.png'
import level11 from '../assets/collection/level11.png'
import level12 from '../assets/collection/level12.png'
import level13 from '../assets/collection/level13.png'
import level14 from '../assets/collection/level14.png'
import level15 from '../assets/collection/level15.png'
import level16 from '../assets/collection/level16.png'

const cardImages = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
  level12,
  level13,
  level14,
  level15,
  level16,
]

export default function CollectionPage({ setView, isMuted, setIsMuted }) {
  // 나중에는 백엔드 값으로 교체
  const unlockedLevel = 5

  return (
    <Layout setView={setView} isMuted={isMuted} setIsMuted={setIsMuted}>
      <div className="h-full bg-[#FFFBF5] p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-yellow-700 mb-3">
              감자 도감
            </h2>
            <p className="text-gray-500 font-bold">
              {unlockedLevel} / 16 장의 카드를 모았어요!
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {cardImages.map((imageSrc, index) => {
              const cardNumber = index + 1
              const isUnlocked = cardNumber <= unlockedLevel

              return (
                <div
                  key={cardNumber}
                  className={`rounded-[28px] overflow-hidden border-4 shadow-lg bg-white transition ${
                    isUnlocked
                      ? 'border-yellow-200 hover:-translate-y-1 hover:shadow-2xl'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="aspect-[3/4] relative bg-gray-100">
                    {isUnlocked ? (
                      <img
                        src={imageSrc}
                        alt={`도감 카드 ${cardNumber}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-400">
                        <div className="text-5xl mb-3">🔒</div>
                        <p className="font-black text-lg">LOCKED</p>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-3 text-center">
                    <p className="font-black text-gray-700">
                      {isUnlocked ? `LEVEL ${cardNumber}` : `LEVEL ${cardNumber}`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-8">
            <button
              onClick={() => setView('menu')}
              className="w-full py-5 bg-yellow-400 text-yellow-900 rounded-[24px] font-black text-xl hover:bg-yellow-500 transition shadow-lg"
            >
              메뉴로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}