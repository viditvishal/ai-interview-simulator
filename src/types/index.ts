// ── Database / Domain Types ──────────────────────────────────────────────────

export type SessionStatus = 'setup' | 'in_progress' | 'completed'
export type QuestionType = 'behavioral' | 'technical' | 'situational' | 'resume'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type InterviewReadiness = 'not_ready' | 'needs_practice' | 'almost_ready' | 'ready'
export type Priority = 'high' | 'medium' | 'low'

export interface Session {
  id: string
  user_id?: string
  job_title: string
  job_description: string
  resume_url?: string
  resume_text: string
  status: SessionStatus
  created_at: string
}

export interface Question {
  id: string
  session_id: string
  type: QuestionType
  question: string
  difficulty: Difficulty
  order_index: number
}

export interface Answer {
  id: string
  question_id: string
  session_id: string
  user_answer: string
  ai_score: number
  ai_feedback: string
  ideal_answer: string
  strengths: string[]
  improvements: string[]
  evaluated_at: string
}

export interface Report {
  id: string
  session_id: string
  overall_score: number
  ats_score: number
  strengths: string[]
  weaknesses: string[]
  recommendations: Recommendation[]
  missing_keywords: string[]
  skill_gaps: SkillGaps
  performance_summary: string
  interview_readiness: InterviewReadiness
  generated_at: string
}

// ── AI Response Types ────────────────────────────────────────────────────────

export interface GeneratedQuestion {
  type: QuestionType
  question: string
  difficulty: Difficulty
}

export interface QuestionGenerationResponse {
  questions: GeneratedQuestion[]
}

export interface AnswerEvaluation {
  score: number
  feedback: string
  ideal_answer: string
  strengths: string[]
  improvements: string[]
}

export interface ATSAnalysis {
  ats_score: number
  matched_keywords: string[]
  missing_keywords: string[]
  improvement_suggestions: string[]
  skill_gaps: SkillGaps
  format_issues: string[]
}

export interface SkillGaps {
  required: string[]
  present: string[]
  bonus: string[]
}

export interface Recommendation {
  title: string
  description: string
  priority: Priority
}

export interface ReportGeneration {
  overall_score: number
  performance_summary: string
  strengths: string[]
  weaknesses: string[]
  recommendations: Recommendation[]
  interview_readiness: InterviewReadiness
}

// ── UI State Types ───────────────────────────────────────────────────────────

export interface InterviewAnswer {
  question: GeneratedQuestion & { order_index: number }
  answer: string
  evaluation: AnswerEvaluation | null
}

export interface InterviewSession {
  questions: (GeneratedQuestion & { order_index: number })[]
  atsData: ATSAnalysis
  jobTitle: string
  jobDescription: string
  resumeText: string
}
