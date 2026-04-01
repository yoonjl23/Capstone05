import { useEffect, useRef, useState } from 'react'
import { Home } from 'lucide-react'
import Layout from '../components/Layout'
import SmileLogo from '../components/SmileLogo'
import { mockApi } from '../services/mockApi'

export default function MirrorPage({ setView, isMuted, setIsMuted }) {
  const videoRef = useRef(null)
  const [detected, setDetected] = useState({
    label: '관찰 중...',
    icon: '👀',
    color: 'bg-white',
    border: 'border-gray-100'
  })

  useEffect(() => {
    let stream
    let intervalId

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        intervalId = setInterval(async () => {
          const result = await mockApi.analyzeEmotion()
          setDetected(result)
        }, 1000)
      } catch (error) {
        console.error('카메라 실행 실패:', error)
      }
    }

    startVideo()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [])

  return (
    <Layout setView={setView} isMuted={isMuted} setIsMuted={setIsMuted}>
      <div className="h-full flex p-8 gap-8">
        <div className="w-[55%] flex flex-col gap-6">
          <div className="flex-1 relative bg-gray-100 rounded-[40px] overflow-hidden border-[8px] border-white shadow-xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover scale-x-[-1]"
            />
          </div>

          <div className={`flex items-center gap-6 p-6 rounded-[32px] ${detected.color} border-4 ${detected.border} shadow-xl transition-all duration-300`}>
            <div className="w-20 h-20 bg-white/40 rounded-3xl flex items-center justify-center text-5xl shadow-inner">
              {detected.icon}
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-black/30 uppercase tracking-widest mb-1">
                AI 마음 분석기
              </p>
              <h3 className="text-4xl font-black text-gray-800">{detected.label}</h3>
            </div>
          </div>
        </div>

        <div className="w-[45%] flex flex-col gap-6">
          <div className="flex-1 bg-white rounded-[40px] border-4 border-yellow-50 shadow-xl p-10 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="px-5 py-2 bg-yellow-100 text-yellow-700 rounded-full font-black text-sm uppercase tracking-wide">
                마음 보기
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
              <SmileLogo size="w-32 h-32" color="text-yellow-200" />
              <h2 className="text-3xl font-black leading-tight text-gray-800">
                마음 거울을 보고 <br />
                <span className="text-yellow-500">나의 표정</span>을 관찰해봐요!
              </h2>
            </div>

            <div className="mt-10">
              <button
                onClick={() => setView('menu')}
                className="w-full py-6 bg-yellow-400 text-yellow-900 rounded-[28px] font-black text-2xl flex items-center justify-center gap-4 shadow-xl hover:bg-yellow-500 transition"
              >
                <Home fill="currentColor" size={28} />
                메뉴로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}