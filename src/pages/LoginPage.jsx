import { useState } from 'react'
import { Lock, User } from 'lucide-react'
import Layout from '../components/Layout'
import SmileLogo from '../components/SmileLogo'
import { api } from '../services/api'

export default function LoginPage({
  setView,
  setLoginId,
  setUserId,
  setUsername,
}) {
  const [form, setForm] = useState({
    userId: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async () => {
    setErrorMessage('')

    if (!form.userId.trim()) {
      setErrorMessage('아이디를 입력해 주세요.')
      return
    }

    if (!form.password.trim()) {
      setErrorMessage('비밀번호를 입력해 주세요.')
      return
    }

    try {
      setLoading(true)

      const result = await api.login({
        userId: form.userId.trim(),
        password: form.password,
      })

      if (result.accessToken) {
        localStorage.setItem('accessToken', result.accessToken)
      }

      const nextLoginId = result.user?.userId || form.userId.trim()
      const nextUserId = result.user?.id ? String(result.user.id) : ''
      const nextUsername = result.user?.username || ''

      localStorage.setItem('loginId', nextLoginId)
      setLoginId(nextLoginId)

      if (nextUserId) {
        localStorage.setItem('userPk', nextUserId)
        setUserId(nextUserId)
      }

      if (nextUsername) {
        localStorage.setItem('username', nextUsername)
        setUsername(nextUsername)
      }

      setView('menu')
    } catch (error) {
      setErrorMessage(error.message || '로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <Layout showHeader={false}>
      <div className="h-full flex">
        <div className="w-1/2 bg-yellow-400 flex flex-col items-center justify-center p-12 text-yellow-900">
          <SmileLogo size="w-64 h-64" color="text-white" />
          <h2 className="text-5xl font-black mt-8 mb-4 tracking-tighter">
            감자놀이터
          </h2>
          <p className="text-xl font-bold opacity-80">
            내 마음이 튼튼 자라나는 곳
          </p>
        </div>

        <div className="w-1/2 flex flex-col items-center justify-center p-16 space-y-8 bg-white">
          <div className="w-full space-y-5">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-gray-800">
                반가워요 친구야
              </h3>
              <p className="text-gray-400 font-medium">
                아이디와 비밀번호를 입력해 주세요
              </p>
            </div>

            <div className="relative">
              <User className="absolute left-5 top-5 text-gray-300" size={24} />
              <input
                type="text"
                name="userId"
                placeholder="아이디"
                value={form.userId}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoComplete="username"
                className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-gray-50 focus:border-yellow-400 outline-none text-lg transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-5 text-gray-300" size={24} />
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={form.password}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
                className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-gray-50 focus:border-yellow-400 outline-none text-lg transition-colors"
              />
            </div>

            {errorMessage && (
              <div className="rounded-2xl bg-red-100 text-red-600 px-5 py-4 font-bold">
                {errorMessage}
              </div>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-5 bg-yellow-400 text-yellow-900 rounded-[28px] font-black text-2xl hover:bg-yellow-500 shadow-xl shadow-yellow-200 transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? '입장 중...' : '감자놀이터 입장하기!'}
          </button>

          <button
            onClick={() => setView('signup')}
            className="text-gray-400 font-bold hover:text-yellow-600 transition"
          >
            처음인가요? 회원가입 하러 가기
          </button>
        </div>
      </div>
    </Layout>
  )
}
