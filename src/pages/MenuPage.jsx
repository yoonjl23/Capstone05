import { Eye, Gamepad2, BrainCircuit } from 'lucide-react'
import Layout from '../components/Layout'
import MenuCard from '../components/MenuCard'

export default function MenuPage({
  setView,
  onStartExpression,
  onStartInference,
  isMuted,
  setIsMuted
}) {
  return (
    <Layout setView={setView} isMuted={isMuted} setIsMuted={setIsMuted}>
      <div className="h-full flex flex-col items-center justify-center p-12">
        <h2 className="text-4xl font-black text-gray-800 mb-12">
          오늘은 어떤 놀이를 할까요?
        </h2>

        <div className="grid grid-cols-3 gap-8 w-full max-w-5xl">
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
            desc="제시된 감정을 표정으로 지어봐요"
            color="hover:border-orange-400"
            onClick={onStartExpression}
          />

          <MenuCard
            icon={<BrainCircuit size={64} className="text-purple-500" />}
            title="상황별 표정짓기"
            desc="상황에 맞는 마음을 추측해봐요"
            color="hover:border-purple-400"
            onClick={onStartInference}
          />
        </div>
      </div>
    </Layout>
  )
}