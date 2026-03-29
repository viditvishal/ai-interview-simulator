import { useState, useCallback } from 'react'
import { Upload, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { extractTextFromFile } from '@/services/resumeParser'

interface ResumeUploaderProps {
  file: File | null
  onFileChange: (file: File | null, text: string) => void
  onError: (msg: string) => void
  onSuccess: (msg: string) => void
}

export function ResumeUploader({ file, onFileChange, onError, onSuccess }: ResumeUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const [parsing, setParsing] = useState(false)

  const handleFile = useCallback(
    async (f: File | null) => {
      if (!f) return
      if (f.size > 5 * 1024 * 1024) {
        onError('Max file size is 5MB')
        return
      }
      if (!/\.(pdf|docx|doc|txt)$/i.test(f.name)) {
        onError('Upload PDF, DOCX, or TXT')
        return
      }

      setParsing(true)
      try {
        const text = await extractTextFromFile(f)
        onFileChange(f, text)
        onSuccess('Resume parsed successfully!')
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Failed to parse resume')
        onFileChange(null, '')
      } finally {
        setParsing(false)
      }
    },
    [onFileChange, onError, onSuccess]
  )

  return (
    <div>
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
        Upload Your Resume
      </div>
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${dragging ? 'border-primary bg-primary/5' : 'border-border bg-muted/50 hover:border-primary/40 hover:bg-primary/5'}`}
        onClick={() => document.getElementById('resume-input')?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFile(e.dataTransfer.files[0])
        }}
      >
        <input
          id="resume-input"
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        <div className="w-10 h-10 rounded-lg bg-primary/7 border border-primary/18 flex items-center justify-center text-primary mx-auto mb-3">
          <Upload className="w-5 h-5" />
        </div>
        {parsing ? (
          <>
            <h3 className="text-sm font-semibold mb-1">Parsing resume...</h3>
            <p className="text-xs text-muted-foreground">Extracting text content</p>
          </>
        ) : (
          <>
            <h3 className="text-sm font-semibold mb-1">Drop your resume here</h3>
            <p className="text-xs text-muted-foreground">PDF, DOCX, TXT · Max 5MB</p>
          </>
        )}
      </div>

      {file && (
        <div className="flex items-center gap-2 p-2.5 px-3 bg-success/7 border border-success/20 rounded-lg mt-2.5 animate-fade-in">
          <FileText className="w-4 h-4 text-success flex-shrink-0" />
          <span className="flex-1 text-[13px] font-medium truncate text-success">{file.name}</span>
          <span className="text-[11px] text-muted-foreground">{(file.size / 1024).toFixed(0)}KB</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              onFileChange(null, '')
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      {!file && !parsing && (
        <div className="mt-2.5 p-2.5 px-3 bg-primary/5 border border-primary/15 rounded-lg text-xs text-primary">
          The AI reads your resume to generate questions specifically tailored to <em>your</em> experience.
        </div>
      )}
    </div>
  )
}
