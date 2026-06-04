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
import { getPreviewView } from './utils/devPreview.js'

function getInitialView() {
  const previewView = getPreviewView()
  if (previewView) return previewView
  return localStorage.getItem('loginId') ? 'menu' : 'login'
}

export default function App() {
  const [view, setView] = useState(getInitialView)
  const [isMuted, setIsMuted] = useState(false)
  const [gameMode, setGameMode] = useState(null)
  const [gameScore, setGameScore] = useState(0)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [loginId, setLoginId] = useState(localStorage.getItem('loginId') || '')
  const [userId, setUserId] = useState(localStorage.getItem('userPk') || '')
  const [username, setUsername] = useState(localStorage.getItem('username') || '')

  // ✅ 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem('loginId')
    localStorage.removeItem('userPk')
    localStorage.removeItem('username')
    setLoginId('')
    setUserId('')
    setUsername('')
    setView('login')
  }

  const startGame = (mode) => {
    setGameMode(mode)
    setGameScore(0)
    setCurrentQuestionIdx(0)
    if (mode === GAME_MODE.EXPRESSION) {
      setView('game2')
      return
    }
    setView('game')
  }

  if (view === 'login') {
    return (
      <LoginPage
        setView={setView}
        setLoginId={setLoginId}
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
        loginId={loginId}
        userId={userId}
        username={username}
        onStartExpression={() => startGame(GAME_MODE.EXPRESSION)}
        onStartInference={() => startGame(GAME_MODE.INFERENCE)}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onLogout={handleLogout}
      />
    )
  }
  if (view === 'mirror') {
    return (
      <MirrorPage
        setView={setView}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onLogout={handleLogout}
        username={username}
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
        loginId={loginId}
        onLogout={handleLogout}
        username={username}
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
        loginId={loginId}
        onLogout={handleLogout}
        username={username}
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
        onLogout={handleLogout}
      />
    )
  }
  if (view === 'collection') {
    return (
      <CollectionPage
        setView={setView}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        userId={userId}
        username={username}
        onLogout={handleLogout}
      />
    )
  }
  if (view === 'stats') {
    return (
      <StatsPage
        setView={setView}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        loginId={loginId}
        username={username}
        onLogout={handleLogout}
      />
    )
  }
  return null
}