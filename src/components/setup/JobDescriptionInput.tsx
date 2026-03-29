import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface JobDescriptionInputProps {
  jobTitle: string
  jobDescription: string
  onJobTitleChange: (v: string) => void
  onJobDescriptionChange: (v: string) => void
}

export function JobDescriptionInput({
  jobTitle,
  jobDescription,
  onJobTitleChange,
  onJobDescriptionChange,
}: JobDescriptionInputProps) {
  return (
    <div>
      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">
        Job Details
      </div>
      <div className="mb-3">
        <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
          Job Title *
        </label>
        <Input
          placeholder="e.g. Senior Software Engineer"
          value={jobTitle}
          onChange={(e) => onJobTitleChange(e.target.value)}
        />
      </div>
      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Job Description *
          </label>
          <span className="text-[11px] text-muted-foreground">{jobDescription.length} chars</span>
        </div>
        <Textarea
          rows={7}
          placeholder="Paste the full job description for the best questions…"
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          className="min-h-[140px] leading-relaxed"
        />
      </div>
    </div>
  )
}
