import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MenuPage from './pages/MenuPage'
import MirrorPage from './pages/MirrorPage.jsx'
import GamePage from './pages/GamePage'
import Game2Page from './pages/Game2Page.jsx'
import ResultPage from './pages/ResultPage'
import CollectionPage from './pages/CollectionPage'
import StatsPage from './pages/StatsPage'
import { GAME_MODE } from './constants/gameMode.js'

export default function App() {
  const [view, setView] = useState('login')
  const [isMuted, setIsMuted] = useState(false)
  const [gameMode, setGameMode] = useState(null)
  const [gameScore, setGameScore] = useState(0)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [userId, setUserId] = useState(
    localStorage.getItem("userId") || ''
  )
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ''
  )

  const startGame = (mode) => {
    setGameMode(mode)
    setGameScore(0)
    setCurrentQuestionIdx(0)
    
    // 감정 표현하기는 game2로, 상황별 표정짓기는 game으로
    if (mode === GAME_MODE.EXPRESSION) {
      setView('game2')
    } else {
      setView('game')
    }
  }

  if (view === 'login') {
    return (
      <LoginPage
        setView={setView}
        setUserId={setUserId}
        setUsername={setUsername}
      />
    )
  }

  if (view === 'signup') {
    return <SignupPage setView={setView} />
  }

  if (view === 'menu') {
    return (
      <MenuPage
        setView={setView}
        userId={userId}
        onStartExpression={() => startGame(GAME_MODE.EXPRESSION)}
        onStartInference={() => startGame(GAME_MODE.INFERENCE)}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        username={username}
      />
    )
  }

  if (view === 'mirror') {
    return (
      <MirrorPage
        setView={setView}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
    )
  }

  if (view === 'game') {
    return (
      <GamePage
        setView={setView}
        gameMode={gameMode}
        gameScore={gameScore}
        setGameScore={setGameScore}
        currentQuestionIdx={currentQuestionIdx}
        setCurrentQuestionIdx={setCurrentQuestionIdx}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        userId={userId}
      />
    )
  }

  if (view === 'game2') {
    return (
      <Game2Page
        setView={setView}
        gameMode={gameMode}
        gameScore={gameScore}
        setGameScore={setGameScore}
        currentQuestionIdx={currentQuestionIdx}
        setCurrentQuestionIdx={setCurrentQuestionIdx}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        userId={userId}
      />
    )
  }

  if (view === 'result') {
    return (
      <ResultPage
        setView={setView}
        gameScore={gameScore}
        totalQuestions={5}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
    )
  }

  if (view === 'collection') {
    return (
      <CollectionPage
        setView={setView}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
    )
  }

  if (view === 'stats') {
    return (
      <StatsPage
        setView={setView}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        userId={userId}
      />
    )
  }

  return null
}