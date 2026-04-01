import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Timer,
  Volume1
} from 'lucide-react'
import Layout from '../components/Layout'
import { expressionQuestions, inferenceQuestions } from '../data/questions'
import { mockApi } from '../services/mockApi'

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

  const [detected, setDetected] = useState({
    label: '관찰 중...',
    icon: '👀',
    color: 'bg-white',
    border: 'border-gray-100'
  })
  const [feedback, setFeedback] = useState(null)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isReading, setIsReading] = useState(false)

  const totalQuestions = 5

  const currentQuestions = useMemo(() => {
    return gameMode === 'expression' ? expressionQuestions : inferenceQuestions
  }, [gameMode])

  const currentQuestion = currentQuestions[currentQuestionIdx]
  const currentTarget = currentQuestion?.target

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

    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }

        intervalId = setInterval(async () => {
          if (!feedback) {
            const result = await mockApi.analyzeEmotion()
            setDetected(result)

            if (result.label === currentTarget) {
              setFeedback('correct')
              setGameScore(prev => prev + 1)
            }
          }
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
  }, [currentTarget, feedback, setGameScore])

  return (
    <Layout setView={setView} isMuted={isMuted} setIsMuted={setIsMuted}>
      <audio ref={audioRef} hidden />

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
                {detected.label === currentTarget && !feedback ? '찾았다!' : detected.label}
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