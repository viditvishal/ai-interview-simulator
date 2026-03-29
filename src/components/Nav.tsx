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
    <nav className="h-[50px] flex items-center justify-between px-4 border-b border-border bg-card sticky top-0 z-50 no-print">
      <div
        className="flex items-center gap-2 text-sm font-bold cursor-pointer"
        onClick={handleHome}
      >
        <div className="w-6 h-6 rounded-[7px] bg-primary text-primary-foreground flex items-center justify-center">
          <Brain className="w-3 h-3" />
        </div>
        InterviewAI
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleDarkMode}>
        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>
    </nav>
  )
}
