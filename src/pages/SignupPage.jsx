import Layout from '../components/Layout'

export default function SignupPage({ setView }) {
  return (
    <Layout showHeader={false}>
      <div className="h-full flex items-center justify-center bg-white p-12">
        <div className="w-full max-w-xl bg-yellow-50 rounded-[40px] p-10 text-center shadow-xl">
          <h2 className="text-3xl font-black text-yellow-700 mb-4">회원가입 화면</h2>
          <p className="text-gray-500 mb-8">
            지금은 UI 구조만 먼저 만든 상태라서,
            회원가입 기능은 나중에 붙이면 돼.
          </p>

          <button
            onClick={() => setView('login')}
            className="px-8 py-4 bg-yellow-400 text-yellow-900 rounded-2xl font-black hover:bg-yellow-500 transition"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    </Layout>
  )
}