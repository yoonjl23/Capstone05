import { User, Lock } from 'lucide-react'
import Layout from '../components/Layout'
import SmileLogo from '../components/SmileLogo'
import { mockApi } from '../services/mockApi'

export default function LoginPage({ setView }) {
  const handleLogin = async () => {
    await mockApi.login()
    setView('menu')
  }

  return (
    <Layout showHeader={false}>
      <div className="h-full flex">
        <div className="w-1/2 bg-yellow-400 flex flex-col items-center justify-center p-12 text-yellow-900">
          <SmileLogo size="w-64 h-64" color="text-white" />
          <h2 className="text-5xl font-black mt-8 mb-4 tracking-tighter">감자놀이터</h2>
          <p className="text-xl font-bold opacity-80">내 마음이 쑥쑥 자라나는 곳</p>
        </div>

        <div className="w-1/2 flex flex-col items-center justify-center p-16 space-y-8 bg-white">
          <div className="w-full space-y-5">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-gray-800">반가워요 친구들!</h3>
              <p className="text-gray-400 font-medium">아이디와 비밀번호를 입력해줘요</p>
            </div>

            <div className="relative">
              <User className="absolute left-5 top-5 text-gray-300" size={24} />
              <input
                type="text"
                placeholder="아이디"
                className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-gray-50 focus:border-yellow-400 outline-none text-lg transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-5 text-gray-300" size={24} />
              <input
                type="password"
                placeholder="비밀번호"
                className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-gray-50 focus:border-yellow-400 outline-none text-lg transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-5 bg-yellow-400 text-yellow-900 rounded-[28px] font-black text-2xl hover:bg-yellow-500 shadow-xl shadow-yellow-200 transition active:scale-95"
          >
            놀이터 입장하기!
          </button>

          <button
            onClick={() => setView('signup')}
            className="text-gray-400 font-bold hover:text-yellow-600 transition"
          >
            처음인가요? 회원가입 하기
          </button>
        </div>
      </div>
    </Layout>
  )
}