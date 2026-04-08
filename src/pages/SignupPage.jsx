import { useState } from 'react'
import { User, Lock, BadgeCheck } from 'lucide-react'
import Layout from '../components/Layout'
import { api } from '../services/api'

export default function SignupPage({ setView }) {
  const [form, setForm] = useState({
    userId: '',
    password: '',
    confirmPassword: '',
    username: '',
  })

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!form.userId.trim()) {
      setErrorMessage('아이디를 입력해주세요.')
      return
    }

    if (!form.username.trim()) {
      setErrorMessage('이름을 입력해주세요.')
      return
    }

    if (!form.password.trim()) {
      setErrorMessage('비밀번호를 입력해주세요.')
      return
    }

    if (!form.confirmPassword.trim()) {
      setErrorMessage('비밀번호 확인을 입력해주세요.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setErrorMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
      return
    }

    try {
      setLoading(true)

      await api.register({
        userId: form.userId,
        password: form.password,
        confirmPassword: form.confirmPassword,
        username: form.username,
      })

      setSuccessMessage('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.')

      setTimeout(() => {
        setView('login')
      }, 1200)
    } catch (error) {
      setErrorMessage(error.message || '회원가입 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout showHeader={false}>
      <div className="h-full flex items-center justify-center bg-white p-12">
        <div className="w-full max-w-2xl bg-yellow-50 rounded-[40px] p-10 shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-yellow-700 mb-2">회원가입</h2>
            <p className="text-gray-500">
              아이디와 비밀번호를 입력해서 감자놀이터에 가입해요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-5 top-5 text-gray-300" size={24} />
              <input
                type="text"
                name="userId"
                placeholder="아이디"
                value={form.userId}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-gray-100 focus:border-yellow-400 outline-none text-lg transition-colors bg-white"
              />
            </div>

            <div className="relative">
              <BadgeCheck className="absolute left-5 top-5 text-gray-300" size={24} />
              <input
                type="text"
                name="username"
                placeholder="이름"
                value={form.username}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-gray-100 focus:border-yellow-400 outline-none text-lg transition-colors bg-white"
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
                className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-gray-100 focus:border-yellow-400 outline-none text-lg transition-colors bg-white"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-5 text-gray-300" size={24} />
              <input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호 확인"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-gray-100 focus:border-yellow-400 outline-none text-lg transition-colors bg-white"
              />
            </div>

            {errorMessage && (
              <div className="rounded-2xl bg-red-100 text-red-600 px-5 py-4 font-bold">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl bg-green-100 text-green-700 px-5 py-4 font-bold">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-yellow-400 text-yellow-900 rounded-[28px] font-black text-2xl hover:bg-yellow-500 shadow-xl shadow-yellow-200 transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? '가입 중...' : '회원가입 완료하기'}
            </button>

            <button
              type="button"
              onClick={() => setView('login')}
              className="w-full py-4 bg-white text-gray-500 rounded-[24px] font-bold border-2 border-gray-100 hover:border-yellow-300 transition"
            >
              로그인으로 돌아가기
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}