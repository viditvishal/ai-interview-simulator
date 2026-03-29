import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

export async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase()

  switch (ext) {
    case 'pdf':
      return extractFromPDF(file)
    case 'docx':
    case 'doc':
      return extractFromDOCX(file)
    case 'txt':
      return extractFromTXT(file)
    default:
      throw new Error(`Unsupported file type: .${ext}. Please upload PDF, DOCX, or TXT.`)
  }
}

async function extractFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    pages.push(text)
  }

  const result = pages.join('\n\n').trim()
  if (result.length < 30) {
    throw new Error('Could not extract meaningful text from PDF. The file may be scanned/image-based.')
  }
  return result
}

async function extractFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  const text = result.value.trim()
  if (text.length < 30) {
    throw new Error('Could not extract meaningful text from DOCX.')
  }
  return text
}

async function extractFromTXT(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = (e.target?.result as string)?.trim() || ''
      if (text.length < 30) {
        reject(new Error('File appears to be empty or too short.'))
      } else {
        resolve(text)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file.'))
    reader.readAsText(file)
  })
}
