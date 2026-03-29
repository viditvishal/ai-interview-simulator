import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useInterviewStore } from '@/store/interviewStore'

export function Nav() {
  const navigate = useNavigate()
  const { darkMode, toggleDarkMode, reset } = useInterviewStore()

  const handleHome = () => {
    reset()
    navigate('/')
  }

  return (
    <nav className="h-14 flex items-center justify-between px-5 border-b border-border/60 glass sticky top-0 z-50 no-print">
      <div
        className="flex items-center gap-2.5 text-sm font-bold cursor-pointer group"
        onClick={handleHome}
      >
        <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform">
          <Brain className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="tracking-tight">InterviewAI</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-xl"
        onClick={toggleDarkMode}
      >
        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>
    </nav>
  )
}
