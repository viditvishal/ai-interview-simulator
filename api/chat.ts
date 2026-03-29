import type { VercelRequest, VercelResponse } from '@vercel/node'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' })
  }

  try {
    const { messages, max_tokens = 2048 } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' })
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        max_tokens,
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API error:', response.status, errorText)
      return res.status(response.status).json({ error: 'AI service error', details: errorText })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || ''

    return res.status(200).json({ content })
  } catch (error) {
    console.error('API route error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
