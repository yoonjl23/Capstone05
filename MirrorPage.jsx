import { useEffect, useRef, useState } from 'react'
import { Home } from 'lucide-react'
import Layout from '../components/Layout'
import SmileLogo from '../components/SmileLogo'
import { mockApi } from '../services/mockApi'

// 백엔드 결과(emotion_en)와 UI 테마 연결 매핑
const EMOTION_THEMES = {
  positive: { label: '기분이 좋아 보여요!', icon: '😊', color: 'bg-green-100', border: 'border-green-200' },
  negative: { label: '조금 슬프거나 화났나요?', icon: '😠', color: 'bg-red-100', border: 'border-red-200' },
  neutral: { label: '평온한 상태예요.', icon: '😐', color: 'bg-gray-100', border: 'border-gray-200' },
  surprise: { label: '깜짝 놀랐나요?!', icon: '😲', color: 'bg-yellow-100', border: 'border-yellow-200' },
  loading: { label: '마음 읽는 중...', icon: '👀', color: 'bg-white', border: 'border-gray-100' }
}

export default function MirrorPage({ setView, isMuted, setIsMuted }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)  // 이미지 캡처용 숨겨진 캔버스
  const [detected, setDetected] = useState(EMOTION_THEMES.loading)

  useEffect(() => {
    let stream
    let intervalId

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        // 1초마다 백엔드에 분석 요청
        intervalId = setInterval(captureAndAnalyze, 1000)
      } catch (error) {
        console.error('카메라 실행 실패:', error)
      }
    }

    let isAnalyzing = false

    const captureAndAnalyze = async () => {
      if (!videoRef.current || !canvasRef.current) return

      isAnalyzing = true

      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      canvas.width = 320
      canvas.height = 240

      context.save()
      context.scale(-1, 1)
      context.drawImage(video, -320, 0, 320, 240)
      context.restore()

      intervalId = setInterval(captureAndAnalyze, 500)

      const base64Image = canvas.toDataURL('image/jpeg', 0.5)

      try {
        const response = await fetch('http://localhost:8082/api/emotion/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image })
        })

        if (response.ok) {
          const data = await response.json()
          const emotionKey = data?.emotion_en || 'neutral'
          const theme = EMOTION_THEMES[emotionKey] || EMOTION_THEMES.neutral
          setDetected({
            label: theme.label,
            icon: theme.icon,
            color: theme.color,
            border: theme.border
          })
        }
      } catch (error) {
        console.error('분석 요청 실패: ', error)
      } finally {
        isAnalyzing = false
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
      <canvas ref={canvasRef} className="hidden" />
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