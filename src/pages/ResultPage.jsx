import { Trophy, Star, Sprout } from 'lucide-react'
import Layout from '../components/Layout'

export default function ResultPage({
  setView,
  gameScore,
  totalQuestions,
  isMuted,
  setIsMuted
}) {
  const rate = Math.round((gameScore / totalQuestions) * 100)

  const getMessage = () => {
    if (gameScore === 5) return { title: "우리 친구 최고예요!", main: "우리 친구는 진짜 마음 박사님이에요!", emoji: "🎓" }
    if (gameScore === 4) return { title: "정말 잘했어요!", main: "우와, 거의 다 맞췄어요! 정말 대단해요!", emoji: "🌟" }
    if (gameScore === 3) return { title: "잘하고 있어요!", main: "절반 이상 맞췄어요! 조금만 더 연습하면 완벽해요!", emoji: "💪" }
    if (gameScore === 2) return { title: "조금만 더 힘내요!", main: "처음보다 훨씬 잘하고 있어요! 다시 도전해봐요!", emoji: "🌈" }
    return { title: "함께 연습해봐요!", main: "괜찮아요! 연습하면 점점 잘할 수 있어요!", emoji: "🌱" }
  }

  const getIcon = () => {
    if (gameScore === 5) return { icon: <Trophy size={140} className="text-yellow-500" />, bg: "bg-yellow-100" }
    if (gameScore === 4) return { icon: <Trophy size={140} className="text-gray-400" />, bg: "bg-gray-100" }
    if (gameScore === 3) return { icon: <Trophy size={140} className="text-orange-400" />, bg: "bg-orange-100" }
    if (gameScore === 2) return { icon: <Star size={140} className="text-blue-400" />, bg: "bg-blue-100" }
    return { icon: <Sprout size={140} className="text-green-500" />, bg: "bg-green-100" }
  }

  const message = getMessage()
  const iconData = getIcon()

  return (
    <Layout setView={setView} isMuted={isMuted} setIsMuted={setIsMuted}>
      <div className="h-full flex items-center justify-center p-12 gap-12">
        <div className="w-1/3 flex flex-col items-center text-center">
          <div className={`${iconData.bg} p-10 rounded-full mb-8 shadow-inner`}>
            {iconData.icon}
          </div>
          <h2 className="text-4xl font-black text-yellow-600">{message.title}</h2>
        </div>

        <div className="w-2/3 bg-white rounded-[48px] p-12 border-4 border-yellow-50 shadow-2xl flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-gray-400 italic">성공률</span>
              <span className="text-6xl font-black text-yellow-500">{rate}%</span>
            </div>

            <div className="w-full bg-gray-100 h-10 rounded-full overflow-hidden border-4 border-white shadow-inner">
              <div
                className="bg-yellow-400 h-full transition-all duration-1000 ease-out rounded-full"
                style={{ width: `${rate}%` }}
              />
            </div>
          </div>

          <div className="text-center py-6">
            <p className="text-3xl font-bold text-gray-700 leading-snug">
              {message.main} <br />
              <span className="text-5xl">{message.emoji}</span>
            </p>
            <p className="mt-4 text-gray-400 font-medium">
              총 {totalQuestions}개 중에서 {gameScore}개를 성공했어요!
            </p>
          </div>

          <button
            onClick={() => setView('menu')}
            className="py-6 bg-yellow-400 text-yellow-900 rounded-[32px] font-black text-2xl flex items-center justify-center gap-4 hover:bg-yellow-500 transition shadow-lg"
          >
            다른 놀이 하러가기
          </button>
        </div>
      </div>
    </Layout>
  )
}