import { useEffect, useRef, useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Timer,
  Volume1
} from 'lucide-react'
import Layout from '../components/Layout'
import { GAME_MODE } from '../constants/gameMode'
import { appendPendingUnlocks } from '../utils/unlockQueue'

const EMOTION_THEMES = {
  positive: { key: 'positive', label: '기분이 좋아요!', icon: '😄', color: 'bg-green-50', border: 'border-green-200' },
  negative: { key: 'negative', label: '기분이 안좋아요...', icon: '😢', color: 'bg-blue-50', border: 'border-blue-200' },
  surprise: { key: 'surprise', label: '깜짝 놀랐어요!', icon: '😲', color: 'bg-yellow-50', border: 'border-yellow-200' },
  neutral: { key: 'neutral', label: '평온해요', icon: '😐', color: 'bg-gray-50', border: 'border-gray-200' },
  loading: { key: 'loading', label: '마음을 읽는 중...', icon: '👀', color: 'bg-white', border: 'border-gray-100' }
}

// fallback용으로 유지
const FIXED_QUIZ_DATASET = [
  { id: 1, text: "활짝 웃으며 기쁜 표정을 지어보세요!", target: "positive", type: "감정 표현하기" },
  { id: 2, text: "슬픈 표정을 지어볼까요?", target: "negative", type: "감정 표현하기" },
  { id: 3, text: "우와! 깜짝 놀란 토끼 눈을 만들어보세요!", target: "surprise", type: "감정 표현하기" },
  { id: 4, text: "아무 생각도 하지 않는 평온한 표정을 유지해보세요.", target: "neutral", type: "감정 표현하기" },
  { id: 5, text: "다시 한번 신나게 싱글벙글 웃어볼까요?", target: "positive", type: "감정 표현하기" }
]

export default function GamePage({
  setView,
  gameMode,
  gameScore,
  setGameScore,
  currentQuestionIdx,
  setCurrentQuestionIdx,
  isMuted,
  setIsMuted,
  loginId
}) {
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const canvasRef = useRef(null)
  const startedRef = useRef(false)
  const sessionIdRef = useRef(null)
  const answeredRef = useRef(false)
  const scoreLockRef = useRef(false)
  const analyzeLockRef = useRef(false)

  const [detected, setDetected] = useState(EMOTION_THEMES.loading)
  const [feedback, setFeedback] = useState(null)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isReading, setIsReading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [isQuestionChanging, setIsQuestionChanging] = useState(false)

  const totalQuestions = 5
  const currentTarget = currentQuestion?.target

  const stateRef = useRef({
    currentTarget: null,
    feedback: null,
    isQuestionChanging: false,
    timeLeft: 10,
    isLoading: false,
    isReading: false,
    isScored: false
  })

  useEffect(() => {
    stateRef.current = {
      ...stateRef.current,
      currentTarget,
      feedback,
      isQuestionChanging,
      timeLeft,
      isLoading,
      isReading,
      detectedKey: detected?.key,
      currentQuestionIdx
    }
  }, [currentTarget, feedback, isQuestionChanging, timeLeft, isLoading, isReading, detected, currentQuestionIdx])

  // 게임 시작 시 호출하는 세션
  useEffect(() => {
    if (!loginId || startedRef.current) return

    startedRef.current = true

    const startSession = async () => {
      try {
        const res = await fetch('/api/game-sessions/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            loginId,
            mode: gameMode
          })
        })

        const data = await res.json()
        setSessionId(data.sessionId)
      } catch (e) {
        console.error('세션 시작 실패', e)
      }
    }

    startSession()
  }, [loginId, gameMode])

  useEffect(() => {
    sessionIdRef.current = sessionId
  }, [sessionId])

  // 문제 라운드 마다 정답 저장
  const submitAnswer = async (result) => {
    if (!sessionIdRef.current || result?.questionId == null) {
      console.warn('답 제출 스킵됨', sessionIdRef.current, result)
      return
    }

    try {
      const response = await fetch(`/api/game-sessions/${sessionIdRef.current}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: result.questionId,
          detectedEmotion: result.emotion,
          correct: result.correct,
          confidence: result.confidence
        })
      })
      if (!response.ok) {
        throw new Error('답안 제출에 실패했습니다.')
      }
      const data = await response.json()
      appendPendingUnlocks(data.newlyUnlockedCharacters || [])
    } catch (e) {
      console.error('답 제출 실패', e)
    }
  }

  // 게임 끝
  const finishGame = async () => {
    if (!sessionIdRef.current) return

    try {
      await fetch(`/api/game-sessions/${sessionIdRef.current}/finish`, {
        method: 'POST'
      })
    } catch (e) {
      console.error('게임 종료 실패', e)
    }
  }

  // ✅ 백엔드 API로 문제 생성
  const loadLocalQuestion = async () => {
    setIsLoading(true)
    setFeedback(null)
    stateRef.current.isScored = false
    setIsQuestionChanging(true)

    try {
      const res = await fetch('/api/quiz/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionIndex: currentQuestionIdx,
          mode: gameMode,
          loginId
        })
      })

      if (!res.ok) throw new Error('문제 생성 실패')

      const quiz = await res.json()

      if (quiz) {
        setCurrentQuestion(quiz)
        setTimeLeft(10)
        setTimeout(() => setIsQuestionChanging(false), 1500)
      } else {
        finishGame()
        setView('result')
      }
    } catch (error) {
      console.error('문제 로드 실패, fallback 사용: ', error)
      // API 실패 시 fallback
      const quiz = FIXED_QUIZ_DATASET[currentQuestionIdx]
      if (quiz) {
        setCurrentQuestion(quiz)
        setTimeLeft(10)
        setTimeout(() => setIsQuestionChanging(false), 1500)
      } else {
        finishGame()
        setView('result')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLocalQuestion()
  }, [currentQuestionIdx])

  const speakQuestion = async (text) => {
    if (isMuted || !text) return
    try {
      setIsReading(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ko-KR'
      utterance.rate = 1.05
      utterance.pitch = 1

      if (window.speechSynthesis) window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)

      utterance.onend = () => setIsReading(false)
    } catch (error) {
      console.error('음성 읽기 실패:', error)
      setIsReading(false)
    }
  }

  const handleNext = () => {
    setFeedback(null)
    setTimeLeft(10)
    setDetected(EMOTION_THEMES.loading)
    stateRef.current.isScored = false

    if (currentQuestionIdx + 1 < totalQuestions) {
      setCurrentQuestionIdx(prev => prev + 1)
    } else {
      finishGame()
      setTimeout(() => setView('result'), 100)
    }
  }

  useEffect(() => {
    if (currentQuestion?.text) speakQuestion(currentQuestion.text)
  }, [currentQuestionIdx, gameMode, currentQuestion])

  useEffect(() => {
    if (feedback !== 'correct') return
    const timeoutId = setTimeout(() => handleNext(), 1200)
    return () => clearTimeout(timeoutId)
  }, [feedback])

  useEffect(() => {
    if (feedback || isLoading || isQuestionChanging || timeLeft <= 0) return
    const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000)
    return () => clearInterval(timerId)
  }, [timeLeft, feedback, isLoading, isQuestionChanging])

  useEffect(() => {
    if (feedback || isQuestionChanging || timeLeft > 0) return

    if (!stateRef.current.isScored) {
      stateRef.current.isScored = true

      const result = {
        questionId: currentQuestionIdx + 1,
        emotion: detected.key,
        correct: false,
        confidence: 0
      }

      submitAnswer(result)
    }
    setFeedback('timeout')
  }, [timeLeft, feedback, isQuestionChanging, detected.key])

  useEffect(() => {
    if (feedback !== 'timeout') return
    const timeoutId = setTimeout(() => handleNext(), 2000)
    return () => clearTimeout(timeoutId)
  }, [feedback])

  useEffect(() => {
    let stream = null
    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        console.error('카메라 실행 실패:', error)
      }
    }
    startVideo()

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop())
    }
  }, [])

  // 주기적으로 화면 캡처 및 분석하는 로직
  useEffect(() => {
    let intervalId
    let isAnalyzing = false

    const captureAndAnalyze = async () => {
      const state = stateRef.current

      if (isAnalyzing || state.feedback !== null || state.isQuestionChanging || !state.currentTarget || state.isLoading || state.isReading || state.timeLeft <= 0 || !videoRef.current || !canvasRef.current) return

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
        const response = await fetch('/api/emotion/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image })
        })

        if (!response.ok) throw new Error('네트워크 응답 상태 비정상')

        const resText = await response.text()
        if (!resText) return

        if (stateRef.current.feedback !== null || stateRef.current.isQuestionChanging || stateRef.current.timeLeft <= 0) return

        const data = JSON.parse(resText)
        const emotionKey = data?.emotion_en || 'neutral'
        const confidenceScore = data?.confidence || 0

        setDetected(prev => {
          if (prev.key === emotionKey) return prev
          return EMOTION_THEMES[emotionKey] || EMOTION_THEMES.neutral
        })

        if (emotionKey === stateRef.current.currentTarget && stateRef.current.feedback === null && stateRef.current.timeLeft > 0) {
          if (!stateRef.current.isScored) {
            stateRef.current.isScored = true

            const result = {
              questionId: stateRef.current.currentQuestionIdx + 1,
              emotion: emotionKey,
              correct: true,
              confidence: confidenceScore
            }

            submitAnswer(result)
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

    intervalId = setInterval(captureAndAnalyze, 1000)
    return () => clearInterval(intervalId)
  }, [setGameScore])

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
              <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase flex items-center gap-2 ${gameMode === GAME_MODE.EXPRESSION ? 'bg-orange-100 text-orange-600' : 'bg-purple-100 text-purple-600'}`}>
                {isReading && <Volume1 size={14} className="animate-pulse" />}
                {currentQuestion?.type}
              </div>

              <h2 className="text-4xl font-black leading-snug text-gray-800">
                {isQuestionChanging ? '새로운 문제를 준비하고 있어요...' : currentQuestion?.text}
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