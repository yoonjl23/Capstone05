import { Stars, Volume2, VolumeX } from 'lucide-react'
import SmileLogo from './SmileLogo'

export default function Layout({
  children,
  showHeader = true,
  setView,
  isMuted,
  setIsMuted
}) {
  return (
    <div className="min-h-screen bg-[#FFFBF5] flex items-center justify-center p-6 font-sans text-gray-800">
      <div className="w-full max-w-6xl aspect-[4/3] max-h-[90vh] bg-white rounded-[48px] shadow-2xl overflow-hidden border-[12px] border-yellow-100 flex flex-col">
        {showHeader && (
          <header className="bg-yellow-400 px-8 py-5 flex justify-between items-center text-white shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView('menu')}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-sm hover:scale-105 transition"
              >
                <SmileLogo size="w-full h-full" color="text-yellow-500" />
              </button>
              <h1
                className="text-2xl font-black tracking-tight text-yellow-900 cursor-pointer"
                onClick={() => setView('menu')}
              >
                감자놀이터
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-yellow-500/30 px-4 py-1.5 rounded-full">
                <Stars size={18} className="text-yellow-100" />
                <span className="text-sm font-bold">우리친구님 안녕!</span>
              </div>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 hover:bg-yellow-500 rounded-full transition"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-hidden relative">
          {children}
        </main>
      </div>
    </div>
  )
}