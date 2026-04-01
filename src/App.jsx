import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MenuPage from './pages/MenuPage'
import MirrorPage from './pages/MirrorPage.jsx'
import GamePage from './pages/GamePage'
import ResultPage from './pages/ResultPage'

export default function App() {
  const [view, setView] = useState('login')
  const [isMuted, setIsMuted] = useState(false)
  const [gameMode, setGameMode] = useState(null)
  const [gameScore, setGameScore] = useState(0)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)

  const startGame = (mode) => {
    setGameMode(mode)
    setGameScore(0)
    setCurrentQuestionIdx(0)
    setView('game')
  }

  if (view === 'login') {
    return <LoginPage setView={setView} />
  }

  if (view === 'signup') {
    return <SignupPage setView={setView} />
  }

  if (view === 'menu') {
    return (
      <MenuPage
        setView={setView}
        onStartExpression={() => startGame('expression')}
        onStartInference={() => startGame('inference')}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
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

  return null
}