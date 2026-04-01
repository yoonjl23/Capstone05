import { Trophy } from 'lucide-react'
import Layout from '../components/Layout'

export default function ResultPage({
  setView,
  gameScore,
  totalQuestions,
  isMuted,
  setIsMuted
}) {
  const rate = Math.round((gameScore / totalQuestions) * 100)

  return (
    <Layout setView={setView} isMuted={isMuted} setIsMuted={setIsMuted}>
      <div className="h-full flex items-center justify-center p-12 gap-12">
        <div className="w-1/3 flex flex-col items-center text-center">
          <div className="bg-yellow-100 p-10 rounded-full mb-8 shadow-inner">
            <Trophy size={140} className="text-yellow-500" />
          </div>
          <h2 className="text-4xl font-black text-yellow-600">참 잘했어요!</h2>
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
              우리 친구는 정말 <br />
              <span className="text-yellow-500">마음 박사님</span>이군요! 🎓
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