import type {
  QuestionType,
  GeneratedQuestion,
  AnswerEvaluation,
  ATSAnalysis,
  ReportGeneration,
  InterviewAnswer,
  InterviewReadiness,
} from '@/types'

// ── Configuration ────────────────────────────────────────────────────────────

const OLLAMA_BASE_URL = import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434'
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'llama3.2'

// Detect environment: use Ollama locally, Groq API route when deployed
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')

// ── JSON Parser (robust — handles markdown fences, partial JSON, etc.) ───────

function parseJSON<T>(raw: string): T {
  const s = raw.replace(/```json\n?|```\n?/g, '').trim()
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '{' && s[i] !== '[') continue
    const close = s[i] === '{' ? '}' : ']'
    let depth = 0
    let inStr = false
    let esc = false
    let j = i
    for (; j < s.length; j++) {
      const c = s[j]
      if (esc) { esc = false; continue }
      if (c === '\\' && inStr) { esc = true; continue }
      if (c === '"') inStr = !inStr
      if (inStr) continue
      if (c === s[i]) depth++
      if (c === close && --depth === 0) break
    }
    try {
      return JSON.parse(s.slice(i, j + 1)) as T
    } catch {
      // try next candidate
    }
  }
  throw new Error('No valid JSON found in response')
}

// ── Groq API Call (via Vercel serverless /api/chat) ──────────────────────────

async function groqCall<T>(
  prompt: string,
  systemPrompt: string,
  timeoutMs = 30000
): Promise<T | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2048,
      }),
    })

    clearTimeout(timer)

    if (!response.ok) return null

    const data = await response.json()
    const text: string = data.content || ''
    return parseJSON<T>(text)
  } catch {
    return null
  }
}

// ── Ollama Call (local development) ──────────────────────────────────────────

async function ollamaCall<T>(
  prompt: string,
  systemPrompt: string,
  timeoutMs = 30000
): Promise<T | null> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 2048,
        },
      }),
    })

    clearTimeout(timer)

    if (!response.ok) return null

    const data = await response.json()
    const text: string = data.message?.content || ''
    return parseJSON<T>(text)
  } catch {
    return null
  }
}

// ── Unified AI Call — Groq when deployed, Ollama when local ──────────────────

async function aiCall<T>(
  prompt: string,
  systemPrompt: string,
  timeoutMs = 30000
): Promise<T | null> {
  if (isLocalhost) {
    return ollamaCall<T>(prompt, systemPrompt, timeoutMs)
  }
  return groqCall<T>(prompt, systemPrompt, timeoutMs)
}

// ── Demo / Fallback Data ─────────────────────────────────────────────────────

const DEMO_QUESTIONS: string[] = [
  'Tell me about a project where you had to learn something completely new under time pressure.',
  'How do you approach debugging a production issue you\'ve never seen before?',
  'Describe a time you had to convince stakeholders to change direction. What was your approach?',
  'Walk me through the most technically complex system you\'ve designed or worked on.',
  'How do you balance shipping quickly vs. building the right way?',
  'Tell me about a time your team disagreed on a technical decision. How did you resolve it?',
  'Describe how you\'d design a URL shortener that handles 10 million requests per day.',
  'How do you prioritize your work when everything feels equally urgent?',
  'Tell me about a failure. What did you learn from it?',
  'How do you stay current with fast-moving technology?',
]

const TYPES: QuestionType[] = ['behavioral', 'technical', 'situational', 'resume']
const DIFFS = ['easy', 'medium', 'hard'] as const

function demoQuestions(count: number, types: QuestionType[]): GeneratedQuestion[] {
  return Array.from({ length: count }, (_, i) => ({
    type: types[i % types.length],
    question: DEMO_QUESTIONS[i % DEMO_QUESTIONS.length],
    difficulty: DIFFS[i % 3],
  }))
}

function demoEvaluation(answerLength: number): AnswerEvaluation {
  const score = answerLength > 200 ? 7 : answerLength > 80 ? 5 : 3
  return {
    score,
    feedback:
      score >= 7
        ? 'Strong answer with good structure. To push it to excellent, add a quantified result.'
        : score >= 5
        ? 'Decent start. Make it concrete: name the specific project, your exact role, and the measurable outcome.'
        : 'Too brief. Aim for 1-2 minutes of speaking time (~150-200 words). Use STAR: Situation → Task → Action → Result.',
    ideal_answer:
      'A strong answer: (1) names a specific real situation, (2) explains your exact role and decision, (3) describes concrete actions you took, (4) quantifies the outcome, (5) reflects on what you\'d do differently.',
    strengths: ['Attempted the question', 'Showed relevant awareness'],
    improvements: ['Add specific numbers/metrics', 'Be more explicit about YOUR role vs team'],
  }
}

function demoATS(): ATSAnalysis {
  return {
    ats_score: 61,
    matched_keywords: ['JavaScript', 'React', 'REST APIs', 'Git', 'Agile', 'Unit Testing'],
    missing_keywords: ['Docker', 'Kubernetes', 'CI/CD', 'TypeScript', 'AWS', 'Terraform'],
    improvement_suggestions: [
      'Add Docker/containerization — appears in 80%+ of senior eng JDs',
      "Quantify every bullet: 'improved load time' → 'reduced p95 latency from 800ms to 120ms'",
      'List specific CI/CD tools: GitHub Actions, Jenkins, CircleCI',
      'Add a cloud section: even personal projects on AWS/GCP count',
    ],
    skill_gaps: {
      required: ['Docker', 'AWS', 'TypeScript', 'CI/CD'],
      present: ['React', 'JavaScript', 'Git', 'Agile', 'Testing'],
      bonus: ['GraphQL', 'Redis', 'Figma'],
    },
    format_issues: ['No quantified achievements', 'Missing cloud/infra section'],
  }
}

function demoReport(avgPct: number, atsPct: number): ReportGeneration {
  return {
    overall_score: Math.round(avgPct * 0.65 + atsPct * 0.35),
    performance_summary:
      'You communicated clearly and drew on relevant experience throughout the interview. The main opportunity is specificity — concrete numbers and outcomes turn good answers into great ones.',
    strengths: [
      'Clear, confident communication style',
      'Drew on real professional experience',
      'Showed genuine interest in the role',
    ],
    weaknesses: [
      'Answers lack quantified outcomes (%, $, time)',
      'Technical depth could go further on implementation details',
      'STAR structure inconsistent across answers',
    ],
    recommendations: [
      {
        title: 'Add numbers to every answer',
        description:
          "Before your real interview, prepare 5 'achievement statements' with metrics. E.g. 'Led migration that cut infra costs 35%'.",
        priority: 'high',
      },
      {
        title: 'Fill the Docker/Cloud gap',
        description:
          'This role requires containerization. Spend one weekend: Docker official tutorial + deploy a personal project.',
        priority: 'high',
      },
      {
        title: 'Record yourself answering',
        description:
          "Use your phone to record 3 practice answers. Watch them back. You'll immediately notice filler words and pacing issues.",
        priority: 'medium',
      },
    ],
    interview_readiness: avgPct >= 70 ? 'almost_ready' : avgPct >= 50 ? 'needs_practice' : 'not_ready',
  }
}

// ── Public AI Service ────────────────────────────────────────────────────────

export const aiService = {
  async generateQuestions(
    resumeText: string,
    jobDescription: string,
    jobTitle: string,
    count: number,
    types: QuestionType[]
  ): Promise<{ questions: GeneratedQuestion[]; fromAI: boolean }> {
    const result = await aiCall<{ questions: GeneratedQuestion[] }>(
      `Given this resume and job description, generate exactly ${count} interview questions.

Resume:
${resumeText.slice(0, 1200)}

Job Description:
${jobDescription.slice(0, 1200)}

Question types needed: ${types.join(', ')}

Return ONLY this JSON structure with ${count} questions:
{"questions":[{"type":"${types[0]}","question":"specific question text","difficulty":"medium"}]}

Rules: type must be one of [${types.join('|')}], difficulty one of [easy|medium|hard], questions must reference actual resume content and JD requirements.`,
      'You are an expert technical interviewer. Always respond with valid JSON only, no markdown, no explanation.'
    )

    if (result?.questions?.length) {
      const qs = result.questions.slice(0, count).map((q, i) => ({
        type: types.includes(q.type) ? q.type : types[i % types.length],
        question: typeof q.question === 'string' && q.question.length > 10 ? q.question : DEMO_QUESTIONS[i % DEMO_QUESTIONS.length],
        difficulty: DIFFS.includes(q.difficulty) ? q.difficulty : DIFFS[1],
      }))
      while (qs.length < count) {
        qs.push({
          type: types[qs.length % types.length],
          question: DEMO_QUESTIONS[qs.length % DEMO_QUESTIONS.length],
          difficulty: DIFFS[1],
        })
      }
      return { questions: qs, fromAI: true }
    }
    return { questions: demoQuestions(count, types), fromAI: false }
  },

  async evaluateAnswer(
    question: string,
    type: QuestionType,
    answer: string,
    jobDescription: string
  ): Promise<{ evaluation: AnswerEvaluation; fromAI: boolean }> {
    const result = await aiCall<AnswerEvaluation>(
      `Evaluate this interview answer:

Question: ${question}
Question Type: ${type}
Candidate's Answer: ${answer.slice(0, 800)}

Job Context: ${jobDescription.slice(0, 400)}

Return ONLY this JSON:
{"score":7,"feedback":"2-3 specific sentences about this answer.","ideal_answer":"What a great answer would include.","strengths":["specific strength"],"improvements":["specific improvement"]}

score must be 0-10 integer.`,
      'You are a senior hiring manager evaluating interview answers. Always respond with valid JSON only.'
    )

    if (result && typeof result.score === 'number') {
      return {
        evaluation: {
          score: Math.max(0, Math.min(10, Math.round(result.score))),
          feedback: result.feedback || 'Good attempt.',
          ideal_answer: result.ideal_answer || '',
          strengths: Array.isArray(result.strengths) ? result.strengths : [],
          improvements: Array.isArray(result.improvements) ? result.improvements : [],
        },
        fromAI: true,
      }
    }
    return { evaluation: demoEvaluation(answer.length), fromAI: false }
  },

  async analyzeATS(
    resumeText: string,
    jobDescription: string
  ): Promise<{ analysis: ATSAnalysis; fromAI: boolean }> {
    const result = await aiCall<ATSAnalysis>(
      `Analyze this resume against the job description for ATS keyword compatibility.

Resume:
${resumeText.slice(0, 1200)}

Job Description:
${jobDescription.slice(0, 1200)}

Instructions:
1. Extract ALL required skills/keywords/tools from the JD
2. Check which ones appear (exact or close match) in the resume
3. Calculate ats_score as: (matched_keywords count / (matched_keywords count + missing_keywords count)) * 100, rounded to integer
4. Be thorough — check for tools, frameworks, methodologies, certifications, soft skills

Return ONLY this JSON:
{"ats_score":<calculated percentage>,"matched_keywords":["keyword1","keyword2"],"missing_keywords":["keyword3"],"improvement_suggestions":["specific actionable suggestion"],"skill_gaps":{"required":["skills in JD missing from resume"],"present":["skills in both"],"bonus":["skills in resume not in JD but valuable"]},"format_issues":["specific format issue"]}

IMPORTANT: ats_score MUST equal matched/(matched+missing)*100. Do not guess — count the keywords.`,
      'You are an ATS (Applicant Tracking System) expert. Always respond with valid JSON only. Be precise with keyword matching — only count a keyword as matched if it genuinely appears in the resume.'
    )

    if (result && typeof result.ats_score === 'number') {
      // Server-side validation: recalculate score from actual keyword counts
      const matched = Array.isArray(result.matched_keywords) ? result.matched_keywords.length : 0
      const missing = Array.isArray(result.missing_keywords) ? result.missing_keywords.length : 0
      const total = matched + missing
      const calculatedScore = total > 0 ? Math.round((matched / total) * 100) : 0

      // Use calculated score if AI's score deviates more than 15 points from reality
      const aiScore = Math.max(0, Math.min(100, Math.round(result.ats_score)))
      const finalScore = Math.abs(aiScore - calculatedScore) > 15 ? calculatedScore : aiScore

      return {
        analysis: {
          ...result,
          ats_score: finalScore,
          matched_keywords: Array.isArray(result.matched_keywords) ? result.matched_keywords : [],
          missing_keywords: Array.isArray(result.missing_keywords) ? result.missing_keywords : [],
          improvement_suggestions: Array.isArray(result.improvement_suggestions) ? result.improvement_suggestions : [],
          skill_gaps: result.skill_gaps || { required: [], present: [], bonus: [] },
          format_issues: Array.isArray(result.format_issues) ? result.format_issues : [],
        },
        fromAI: true,
      }
    }
    return { analysis: demoATS(), fromAI: false }
  },

  async generateReport(
    answers: InterviewAnswer[],
    atsScore: number,
    jobTitle: string
  ): Promise<{ report: ReportGeneration; fromAI: boolean }> {
    // Calculate actual scores server-side — never trust the AI for the number
    const totalScore = answers.reduce((s, a) => s + (a.evaluation?.score ?? 0), 0)
    const answeredCount = answers.filter((a) => a.answer !== '[Skipped]').length
    const avgScore = answeredCount > 0 ? totalScore / answers.length : 0 // divide by total, not answered
    const interviewPct = Math.round(avgScore * 10) // 0-100 scale
    const overallScore = Math.round(interviewPct * 0.65 + atsScore * 0.35) // weighted: 65% interview, 35% ATS

    const summary = answers
      .map((a) => {
        const skipped = a.answer === '[Skipped]'
        return `Q: ${a.question.question.slice(0, 50)} | ${skipped ? 'SKIPPED (0/10)' : `Score: ${a.evaluation?.score ?? 0}/10`}`
      })
      .join('\n')

    const readiness: InterviewReadiness =
      interviewPct >= 75 ? 'ready' :
      interviewPct >= 60 ? 'almost_ready' :
      interviewPct >= 40 ? 'needs_practice' : 'not_ready'

    const result = await aiCall<Omit<ReportGeneration, 'overall_score' | 'interview_readiness'>>(
      `Generate a performance report for this interview. Do NOT invent scores — I will calculate them separately. Focus on qualitative feedback only.

Interview for: ${jobTitle}
Answered ${answeredCount} out of ${answers.length} questions.
Actual interview score: ${interviewPct}% (average ${avgScore.toFixed(1)}/10)
ATS Score: ${atsScore}/100
Question results:
${summary}

Return ONLY this JSON (do NOT include overall_score or interview_readiness — I calculate those):
{"performance_summary":"2-3 sentence summary reflecting the actual scores above.","strengths":["genuine strength observed"],"weaknesses":["specific area to improve"],"recommendations":[{"title":"Title","description":"Actionable advice.","priority":"high"}]}

Be honest and direct. If most questions were skipped or scored 0, say so clearly. Do not sugarcoat.`,
      'You are a brutally honest career coach. Always respond with valid JSON only. Never inflate or fabricate scores.'
    )

    if (result) {
      return {
        report: {
          overall_score: overallScore,
          interview_readiness: readiness,
          performance_summary: result.performance_summary || `Scored ${interviewPct}% on interview, ${atsScore}% on ATS.`,
          strengths: Array.isArray(result.strengths) ? result.strengths : [],
          weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
          recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
        },
        fromAI: true,
      }
    }
    return { report: demoReport(interviewPct, atsScore), fromAI: false }
  },
}
