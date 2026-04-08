import Layout from '../components/Layout'

export default function StatsPage({ setView, isMuted, setIsMuted }) {
  // 🔥 나중에 백엔드에서 받아올 데이터 (지금은 더미)
  const stats = {
    expressionCount: 5,
    inferenceCount: 3,
    emotions: [
      { name: '기쁨', icon: '😊', accuracy: 80 },
      { name: '슬픔', icon: '😢', accuracy: 60 },
      { name: '화남', icon: '😠', accuracy: 40 },
      { name: '놀람', icon: '😲', accuracy: 90 },
    ],
  }

  return (
    <Layout setView={setView} isMuted={isMuted} setIsMuted={setIsMuted}>
      <div className="h-full bg-[#FFFBF5] p-8">
        <div className="max-w-3xl mx-auto">

          {/* 제목 */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-yellow-700">
              나의 학습 통계 📊
            </h2>
            <p className="text-gray-500 font-bold mt-2">
              지금까지 얼마나 성장했을까요?
            </p>
          </div>

          {/* 게임 횟수 */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
              <p className="text-gray-400 font-bold mb-2">
                감정 표현하기
              </p>
              <p className="text-3xl font-black text-orange-500">
                {stats.expressionCount}회
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
              <p className="text-gray-400 font-bold mb-2">
                상황별 표정짓기
              </p>
              <p className="text-3xl font-black text-purple-500">
                {stats.inferenceCount}회
              </p>
            </div>
          </div>

          {/* 감정별 정답률 */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-xl font-black text-gray-700 mb-6 text-center">
              감정별 정답률
            </h3>

            <div className="space-y-5">
              {stats.emotions.map((emotion) => (
                <div key={emotion.name}>
                  <div className="flex justify-between mb-1 font-bold text-gray-600">
                    <span>
                      {emotion.icon} {emotion.name}
                    </span>
                    <span>{emotion.accuracy}%</span>
                  </div>

                  <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all"
                      style={{ width: `${emotion.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 뒤로가기 */}
          <div className="mt-10">
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