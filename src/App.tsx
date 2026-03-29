import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Nav } from '@/components/Nav'
import { useInterviewStore } from '@/store/interviewStore'
import IndexPage from '@/pages/Index'
import SetupPage from '@/pages/Setup'
import InterviewPage from '@/pages/Interview'
import ReportPage from '@/pages/Report'

const queryClient = new QueryClient()

function AppShell() {
  const darkMode = useInterviewStore((s) => s.darkMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Nav />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/interview/:sessionId" element={<InterviewPage />} />
        <Route path="/report/:sessionId" element={<ReportPage />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
