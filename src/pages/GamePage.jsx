import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Timer,
  Volume1
} from 'lucide-react'
import Layout from '../components/Layout'

const EMOTION_THEMES = {
  positive: { key: 'positive', label: '기분이 좋아요!', icon: '😄', color: 'bg-green-50', border: 'border-green-200' },
  negative: { key: 'negative', label: '기분이 안좋아요...', icon: '😢', color: 'bg-blue-50', border: 'border-blue-200' },
  surprise: { key: 'surprise', label: '깜짝 놀랐어요!', icon: '😲', color: 'bg-yellow-50', border: 'border-yellow-200' },
  neutral: { key: 'neutral', label: '평온해요', icon: '😐', color: 'bg-gray-50', border: 'border-gray-200' },
  loading: { key: 'loading', label: '마음을 읽는 중...', icon: '👀', color: 'bg-white', border: 'border-gray-100' }
}

export default function GamePage({
  setView,
  gameMode,
  gameScore,
  setGameScore,
  currentQuestionIdx,
  setCurrentQuestionIdx,
  isMuted,
  setIsMuted
}) {
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const canvasRef = useRef(null)  // MirrorPage에서 가져온 캔버스 Ref

  const [detected, setDetected] = useState(EMOTION_THEMES.loading)
  const [feedback, setFeedback] = useState(null)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isReading, setIsReading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const totalQuestions = 5

  const currentTarget = currentQuestion?.target

  // 문제 가져오기
  const fetchQuestionFromAI = async () => {
    setIsLoading(true)
    setFeedback(null)
    try {
      const response = await fetch('http://localhost:8082/api/emotion/quiz')
      
      if (!response.ok) {
        throw new Error('Spring Boot 서버에서 퀴즈를 가져오지 못했습니다.')
      }
      
      const data = await response.json()
      setCurrentQuestion(data)
      setTimeLeft(10)
    } catch (error) {
      console.error('AI 문제 가져오기 실패:', error);
      setCurrentQuestion({
        text: "앗! AI가 문제를 만들지 못했어요. 웃는 표정을 지어볼까요?",
        target: "positive",
        type: "오류 발생"
      });
    } finally {
      setIsLoading(false)
    }
  };

  // 문제 인덱스가 바뀔 때마다 문제를 새로 가져옴
  useEffect(() => {
    fetchQuestionFromAI();
  }, [currentQuestionIdx]);

  const speakQuestion = async (text) => {
    if (isMuted || !text) return

    try {
      setIsReading(true)

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ko-KR'
      utterance.rate = 0.95
      utterance.pitch = 1

      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)

      utterance.onend = () => {
        setIsReading(false)
      }
    } catch (error) {
      console.error('음성 읽기 실패:', error)
      setIsReading(false)
    }
  }

  const handleNext = () => {
    setFeedback(null)
    setTimeLeft(10)

    if (currentQuestionIdx + 1 < totalQuestions) {
      setCurrentQuestionIdx(prev => prev + 1)
    } else {
      setView('result')
    }
  }

  useEffect(() => {
    if (currentQuestion?.text) {
      speakQuestion(currentQuestion.text)
    }
  }, [currentQuestionIdx, gameMode])
  
  useEffect(() => {
    if (feedback !== 'correct') return
  
    const timeoutId = setTimeout(() => {
      handleNext()
    }, 1500)
  
    return () => clearTimeout(timeoutId)
  }, [feedback])

  useEffect(() => {
    if (feedback) return
    if (timeLeft <= 0) return
  
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
  
    return () => clearInterval(timerId)
  }, [timeLeft, feedback])
  

  useEffect(() => {
    if (feedback) return
    if (timeLeft > 0) return
  
    setFeedback('timeout')
  }, [timeLeft, feedback])
  
 
  useEffect(() => {
    if (feedback !== 'timeout') return
  
    const timeoutId = setTimeout(() => {
      handleNext()
    }, 2000)
  
    return () => clearTimeout(timeoutId)
  }, [feedback])

  useEffect(() => {
    let stream
    let intervalId
    let isAnalyzing = false

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 }
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        intervalId = setInterval(captureAndAnalyze, 500)  
      } catch (error) {
        console.error('카메라 실행 실패:', error) 
      }
    } 

    const captureAndAnalyze = async () => {
      // 이미 분석 중이거나, 정답을 맞춘 경우, 문제 로딩 중이면 건너뜀
      if (isAnalyzing || feedback || !currentQuestion || isLoading || !videoRef.current || !canvasRef.current) return 

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

      const base64Image = canvas.toDataURL('image/jpeg', 0.5)

      try {
        const response = await fetch('http://localhost:8082/api/emotion/analyze', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ image: base64Image })
        })

        if (response.ok) {
          const data = await response.json()
          const emotionKey = data?.emotion_en || 'neutral'

          const theme = EMOTION_THEMES[emotionKey] || EMOTION_THEMES.neutral
          setDetected(theme)

          if (emotionKey === currentTarget) {
            setFeedback('correct')
            setGameScore(prev => prev + 1)
          }
        }
      } catch (error) {
        console.error('분석 실패: ', error)
      } finally {
        isAnalyzing = false
      }
    }

    startVideo() 

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop()) 
      if (intervalId) clearInterval(intervalId) 
    } 
  }, [currentTarget, feedback, setGameScore, isLoading]) 

  return (
    <Layout setView={setView} isMuted={isMuted} setIsMuted={setIsMuted}>
      <audio ref={audioRef} hidden />
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

            {feedback === 'correct' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
                <div className="flex flex-col items-center gap-6 p-12 rounded-[48px] bg-green-500 text-white shadow-2xl">
                  <CheckCircle2 size={140} />
                  <span className="text-5xl font-black tracking-tight">
                    우와! 맞았어요!
                  </span>
                </div>
              </div>
            )}

            {feedback === 'timeout' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md">
                <div className="flex flex-col items-center gap-6 p-12 rounded-[48px] bg-red-500 text-white shadow-2xl text-center">
                  <XCircle size={140} />
                  <span className="text-5xl font-black tracking-tight leading-tight">
                    시간이 다 됐어요!
                    <br />
                    <span className="text-2xl opacity-80">다음 문제로 넘어가요</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className={`flex items-center gap-6 p-6 rounded-[32px] ${detected.color} border-4 ${detected.border} shadow-xl transition-all duration-300`}>
            <div className="w-20 h-20 bg-white/40 rounded-3xl flex items-center justify-center text-5xl shadow-inner">
              {detected.icon}
            </div>

            <div className="flex-1">
              <p className="text-xs font-black text-black/30 uppercase tracking-widest mb-1">
                AI 마음 분석기
              </p>
              <h3 className="text-4xl font-black text-gray-800">
                {detected.key === currentTarget && !feedback ? '찾았다!' : detected.label}
              </h3>
            </div>
          </div>
        </div>

        <div className="w-[45%] flex flex-col gap-6">
          <div className="flex-1 bg-white rounded-[40px] border-4 border-yellow-50 shadow-xl p-10 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div className="px-5 py-2 bg-yellow-100 text-yellow-700 rounded-full font-black text-sm uppercase tracking-wide">
                놀이 {currentQuestionIdx + 1} / {totalQuestions}
              </div>

              <div className={`flex items-center gap-2 font-black ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                <Timer size={20} />
                <span className="text-2xl">{timeLeft}초</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 relative">
              <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase flex items-center gap-2 ${gameMode === 'expression' ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                {isReading && <Volume1 size={14} className="animate-pulse" />}
                {currentQuestion?.type}
              </div>

              <h2 className="text-4xl font-black leading-snug text-gray-800">
                {currentQuestion?.text}
              </h2>
            </div>

            <div className="mt-10">
                <div className="flex flex-col gap-3">
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 3 ? 'bg-red-500' : 'bg-yellow-400'}`}
                      style={{ width: `${(timeLeft / 10) * 100}%` }}
                    />
                  </div>
                  <p className="text-center text-sm font-bold text-gray-300 mt-2">
                    시간이 지나면 자동으로 넘어가요!
                  </p>
                </div>
            </div>
          </div>

          <div className="flex gap-3 px-2">
            {Array.from({ length: totalQuestions }).map((_, index) => (
              <div
                key={index}
                className={`h-4 flex-1 rounded-full shadow-inner transition-all duration-500 ${
                  index === currentQuestionIdx
                    ? 'bg-yellow-400 scale-y-125'
                    : index < currentQuestionIdx
                    ? 'bg-yellow-200'
                    : 'bg-gray-100'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}