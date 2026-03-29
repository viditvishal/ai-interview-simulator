import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  QuestionType,
  GeneratedQuestion,
  ATSAnalysis,
  InterviewAnswer,
  InterviewSession,
} from '@/types'

interface InterviewState {
  // Session config
  sessionId: string | null
  jobTitle: string
  jobDescription: string
  resumeText: string
  resumeFileName: string | null

  // Interview config
  questionCount: number
  questionTypes: QuestionType[]

  // Interview data
  session: InterviewSession | null
  answers: InterviewAnswer[]
  currentQuestionIndex: number

  // UI state
  darkMode: boolean

  // Actions
  setJobDetails: (title: string, description: string) => void
  setResumeData: (text: string, fileName: string | null) => void
  setInterviewConfig: (count: number, types: QuestionType[]) => void
  startSession: (
    sessionId: string,
    questions: GeneratedQuestion[],
    atsData: ATSAnalysis
  ) => void
  addAnswer: (answer: InterviewAnswer) => void
  nextQuestion: () => void
  toggleDarkMode: () => void
  reset: () => void
}

const initialState = {
  sessionId: null,
  jobTitle: '',
  jobDescription: '',
  resumeText: '',
  resumeFileName: null,
  questionCount: 5,
  questionTypes: ['behavioral', 'technical', 'situational', 'resume'] as QuestionType[],
  session: null,
  answers: [],
  currentQuestionIndex: 0,
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      ...initialState,
      darkMode: false,

      setJobDetails: (title, description) =>
        set({ jobTitle: title, jobDescription: description }),

      setResumeData: (text, fileName) =>
        set({ resumeText: text, resumeFileName: fileName }),

      setInterviewConfig: (count, types) =>
        set({ questionCount: count, questionTypes: types }),

      startSession: (sessionId, questions, atsData) => {
        const { jobTitle, jobDescription, resumeText } = get()
        set({
          sessionId,
          session: {
            questions: questions.map((q, i) => ({ ...q, order_index: i })),
            atsData,
            jobTitle,
            jobDescription,
            resumeText,
          },
          answers: [],
          currentQuestionIndex: 0,
        })
      },

      addAnswer: (answer) =>
        set((s) => ({ answers: [...s.answers, answer] })),

      nextQuestion: () =>
        set((s) => ({ currentQuestionIndex: s.currentQuestionIndex + 1 })),

      toggleDarkMode: () =>
        set((s) => ({ darkMode: !s.darkMode })),

      reset: () => set(initialState),
    }),
    {
      name: 'interview-store',
      partialize: (state) => ({
        sessionId: state.sessionId,
        session: state.session,
        answers: state.answers,
        currentQuestionIndex: state.currentQuestionIndex,
        darkMode: state.darkMode,
      }),
    }
  )
)
