import { useEffect, useRef, useState } from 'react'
import {
  CheckCircle2,
  XCircle,
  Timer,
  Volume1
} from 'lucide-react'
import Layout from '../components/Layout'
import { GAME_MODE } from '../constants/gameMode'

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
  setIsMuted,
  userId,
  username
}) {
  const videoRef = useRef(null)
  const audioRef = useRef(null)
  const canvasRef = useRef(null) 
  const startedRef = useRef(false)
  const sessionIdRef = useRef(null)
  const answeredRef = useRef(false)

  const [detected, setDetected] = useState(EMOTION_THEMES.loading)
  const [feedback, setFeedback] = useState(null)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isReading, setIsReading] = useState(false)
  const [sessionId, setSessionId] = useState(null)

  const [earnedExp, setEarnedExp] = useState(0)
  const [gameStatus, setGameStatus] = useState('IN_PROGRESS')
  
  const [isQuestionChanging, setIsQuestionChanging] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(null)

  const [quizList, setQuizList] = useState([])

  const totalQuestions = 5
  const currentTarget = currentQuestion?.target

  const stateRef = useRef({
    currentTarget: null,
    feedback: null,
    isQuestionChanging: true, 
    timeLeft: 10,
    isScored: false,
    currentQuestionIdx: 0
  })

  useEffect(() => {
    stateRef.current.currentTarget = currentTarget
  }, [currentTarget])

  // 게임 시작 시 호출하는 세션
  useEffect(() => {
    if (!userId || startedRef.current) return

    startedRef.current = true

    const startSession = async () => {
      try {
        const res = await fetch('http://localhost:8082/api/game-sessions/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: userId,
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
  }, [userId, gameMode])

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
      await fetch(`http://localhost:8082/api/game-sessions/${sessionIdRef.current}/answers`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          questionId: result.questionId,
          detectedEmotion: result.emotion,
          correct: result.correct,
          confidence: result.confidence
        })
      })
    } catch (e) {
      console.error('답 제출 실패', e)
    }
  }

  // 게임 끝
  const finishGame = async () => {
    if (!sessionIdRef.current) return
    
    try {
      await fetch(`http://localhost:8082/api/game-sessions/${sessionIdRef.current}/finish`, {
        method: 'POST'
      })
    } catch (e) {
      console.error('게임 종료 실패', e)
    }
  }

  // 매 렌더링마다 최신 값을 Ref에 동기화
  useEffect(() => {
    stateRef.current.currentTarget = currentTarget
    stateRef.current.feedback = feedback
    stateRef.current.isQuestionChanging = isQuestionChanging
    stateRef.current.timeLeft = timeLeft
    stateRef.current.currentQuestionIdx = currentQuestionIdx
  }, [currentTarget, feedback, isQuestionChanging, timeLeft, currentQuestionIdx])

  useEffect(() => {
    let ignore = false;

    const fetchAllQuestions = async () => {
      setIsQuestionChanging(true)

      try {
        const response = await fetch('http://localhost:8082/api/emotion/quiz')
        
        if (!response.ok) {
          throw new Error('Spring Boot 서버에서 퀴즈를 가져오지 못했습니다.')
        }
        
        const data = await response.json() // 5개의 문제가 담긴 배열
        
        if (!ignore && Array.isArray(data) && data.length > 0) {
          setQuizList(data) // 배열을 상태에 저장
        }
      } catch (error) {
        console.error('API 에러, 기본 데모 퀴즈 세팅:', error);
        if (!ignore) {
          // 에러 시 5개의 데모 문제 배열로 세팅
          setQuizList([
            { text: "친구들과 신나게 술래잡기를 하고 있어요!", target: "positive", type: "오류 발생 방어" },
            { text: "앗! 갑자기 천둥 번개가 쳤어요!", target: "surprise", type: "오류 발생 방어" },
            { text: "아끼던 풍선이 터져버렸어요...", target: "negative", type: "오류 발생 방어" },
            { text: "따뜻한 이불 속에서 눈을 감고 누워있어요.", target: "neutral", type: "오류 발생 방어" },
            { text: "맛있는 아이스크림을 먹고 있어요!", target: "positive", type: "오류 발생 방어" }
          ])
        }
      }
    };

    fetchAllQuestions();

    return () => {
      ignore = true; 
    }
  }, []); // 의존성 배열이 비어있으므로 처음 1회만 실행됨

  useEffect(() => {
    // 아직 문제를 못 가져왔으면 대기
    if (quizList.length === 0) return;

    setIsQuestionChanging(true)
    setFeedback(null)
    setDetected(EMOTION_THEMES.loading)
    setTimeLeft(10)
    stateRef.current.isScored = false 
    answeredRef.current = false

    // 인덱스에 맞춰 현재 문제 설정
    if (currentQuestionIdx < quizList.length) {
      setCurrentQuestion(quizList[currentQuestionIdx])
    }

    const timer = setTimeout(() => {
      setIsQuestionChanging(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [currentQuestionIdx, quizList]);


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

  const handleNext = async () => {
    setFeedback(null)
    setTimeLeft(10)
    setDetected(EMOTION_THEMES.loading)
    
    setIsQuestionChanging(true)
    stateRef.current.isQuestionChanging = true 

    if (currentQuestionIdx + 1 < totalQuestions) {
      setCurrentQuestionIdx(prev => prev + 1)
    } else {
      await finishGame()
      setView('result')
    }
  }

  useEffect(() => {
    if (currentQuestion?.text && !isQuestionChanging) {
      speakQuestion(currentQuestion.text)
    }
  }, [currentQuestion, isQuestionChanging])
  
  useEffect(() => {
    if (feedback !== 'correct') return
  
    const timeoutId = setTimeout(() => {
      handleNext()
    }, 1500)
  
    return () => clearTimeout(timeoutId)
  }, [feedback])

  useEffect(() => {
    if (feedback || isQuestionChanging) return
    if (timeLeft <= 0) return
  
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
  
    return () => clearInterval(timerId)
  }, [timeLeft, feedback, isQuestionChanging])
  
  useEffect(() => {
    if (feedback || isQuestionChanging) return
    if (timeLeft > 0) return
  
    setFeedback('timeout')
  }, [timeLeft, feedback, isQuestionChanging])
  
  useEffect(() => {
    if (feedback !== 'timeout') return

    if (answeredRef.current) return
    answeredRef.current = true

    // 틀린 경우도 저장
    submitAnswer({
      questionId: currentQuestionIdx + 1,
      emotion: detected.key,
      correct: false,
      confidence: 0
    })
  
    const timeoutId = setTimeout(() => {
      handleNext()
    }, 2000)
  
    return () => clearTimeout(timeoutId)
  }, [feedback])

  useEffect(() => {
    let stream = null;
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

  useEffect(() => {
    let intervalId
    let isAnalyzing = false

    const captureAndAnalyze = async () => {
      const state = stateRef.current

      if (isAnalyzing || state.feedback !== null || state.isQuestionChanging || state.timeLeft <= 0 || !videoRef.current || !canvasRef.current) return 

      const video = videoRef.current
      if (video.readyState !== 4) return
      
      isAnalyzing = true
      
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
          const confidenceScore = data?.confidence || 0

          if (stateRef.current.feedback !== null || stateRef.current.isQuestionChanging || stateRef.current.timeLeft <= 0) return

          const theme = EMOTION_THEMES[emotionKey] || EMOTION_THEMES.neutral
          setDetected(theme)

          if (emotionKey === stateRef.current.currentTarget) {
            if (!stateRef.current.isScored) {
              answeredRef.current = true
              stateRef.current.isScored = true 
              setFeedback('correct')
              setGameScore(prev => prev + 1)

              submitAnswer({
                questionId: currentQuestionIdx + 1,
                emotion: emotionKey,
                correct: true,
                confidence: confidenceScore
              })
            }
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
  }, [setGameScore, currentQuestionIdx]) 

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  return (
    <Layout setView={setView} isMuted={isMuted} setIsMuted={setIsMuted} username={username}>
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
                {detected.key === currentTarget && !feedback && !isQuestionChanging ? '찾았다!' : detected.label}
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
                {isQuestionChanging ? '문제 생성 중...' : currentQuestion?.type}
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