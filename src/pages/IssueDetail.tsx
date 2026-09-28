import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useIssue, useUpdateIssue, useDeleteIssue } from "@/features/issues/hooks"
import { useProfiles } from "@/features/profiles/hooks"
import { useAuth } from "@/app/auth-provider"
import { CommentList } from "@/components/comments/CommentList"
import { ArrowLeft, Spinner, Trash, Calendar, User as UserIcon, CaretDown } from "@phosphor-icons/react"
import { format } from "date-fns"

export function IssueDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { data: issue, isLoading } = useIssue(id!)
  const { mutate: updateIssue } = useUpdateIssue()
  const { mutate: deleteIssue, isPending: isDeleting } = useDeleteIssue()
  const { data: profiles } = useProfiles()

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState("")

  const [isEditingDesc, setIsEditingDesc] = useState(false)
  const [descValue, setDescValue] = useState("")

  if (isLoading || !issue) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const isReporter = user?.id === issue.reporter_id
  const canEdit = !!user

  const handleTitleSubmit = () => {
    if (titleValue.trim() && titleValue !== issue.title) {
      updateIssue({ id: issue.id, title: titleValue })
    }
    setIsEditingTitle(false)
  }

  const handleDescSubmit = () => {
    if (descValue !== issue.description) {
      updateIssue({ id: issue.id, description: descValue })
    }
    setIsEditingDesc(false)
  }

  return (
    <div className="max-w-6xl mx-auto py-4 sm:py-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <Link to="/issues" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={16} /> Back to issues
        </Link>
        
        {isReporter && (
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this issue?")) {
                deleteIssue(issue.id)
              }
            }}
            disabled={isDeleting}
            className="text-text-muted hover:text-red-500 hover:bg-red-500/10 p-2 rounded-[10px] transition-colors shadow-sm bg-surface border border-border"
            title="Delete Issue"
          >
            {isDeleting ? <Spinner className="animate-spin" size={16} /> : <Trash size={16} />}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Title Area */}
          <div>
            <div className="text-text-muted font-mono text-sm mb-3">TRK-{issue.issue_number}</div>
            {isEditingTitle && canEdit ? (
              <input 
                autoFocus
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                className="w-full text-3xl md:text-4xl font-bold bg-transparent border-b border-primary focus:outline-none text-text py-1 tracking-tight"
              />
            ) : (
              <h1 
                onClick={() => {
                  if (canEdit) {
                    setTitleValue(issue.title)
                    setIsEditingTitle(true)
                  }
                }}
                className={`text-3xl md:text-4xl font-bold text-text py-1 tracking-tight ${canEdit ? 'cursor-text hover:bg-surface-elevated rounded-lg -ml-2 px-2 transition-colors' : ''}`}
              >
                {issue.title}
              </h1>
            )}
          </div>

          {/* Description Area */}
          <div className="bg-surface p-6 md:p-8 rounded-[16px] border border-border">
            <h3 className="text-base font-semibold text-text mb-4">Description</h3>
            {isEditingDesc && canEdit ? (
              <div className="space-y-4">
                <textarea 
                  autoFocus
                  rows={6}
                  value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  className="w-full p-4 rounded-[10px] bg-background border border-border text-text text-sm focus:outline-none focus:border-primary/50 transition-colors resize-y leading-relaxed"
                />
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setIsEditingDesc(false)} className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text transition-colors">Cancel</button>
                  <button onClick={handleDescSubmit} className="px-4 py-2 text-sm font-medium bg-primary text-on-primary rounded-[10px] shadow-sm hover:shadow-md transition-all">Save</button>
                </div>
              </div>
            ) : (
              <div 
                onClick={() => {
                  if (canEdit) {
                    setDescValue(issue.description || "")
                    setIsEditingDesc(true)
                  }
                }}
                className={`min-h-[100px] text-text text-sm leading-relaxed whitespace-pre-wrap ${canEdit ? 'cursor-text hover:bg-surface-elevated rounded-lg -m-2 p-2 transition-colors' : ''}`}
              >
                {issue.description || <span className="italic text-text-muted">No description provided.</span>}
              </div>
            )}
          </div>
          
          {/* Comments Section */}
          <div className="bg-surface p-6 md:p-8 rounded-[16px] border border-border">
             <CommentList issueId={issue.id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-surface p-6 md:p-8 rounded-[16px] border border-border space-y-6 sticky top-24">
            
            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 block">Status</label>
              <div className="relative">
                <select
                  value={issue.status}
                  onChange={(e) => updateIssue({ id: issue.id, status: e.target.value as any })}
                  disabled={!canEdit}
                  className={`w-full px-3 py-2.5 rounded-[10px] font-bold text-xs uppercase tracking-wider appearance-none cursor-pointer focus:outline-none transition-colors border ${
                    issue.status === 'open' ? 'bg-status-open/10 text-status-open border-status-open/20 focus:border-status-open' : 
                    issue.status === 'in_progress' ? 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20 focus:border-status-in-progress' : 
                    'bg-status-closed/10 text-status-closed border-status-closed/20 focus:border-status-closed'
                  }`}
                >
                  <option value="open" className="bg-surface text-text">OPEN</option>
                  <option value="in_progress" className="bg-surface text-text">IN PROGRESS</option>
                  <option value="closed" className="bg-surface text-text">CLOSED</option>
                </select>
                <CaretDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                    issue.status === 'open' ? 'text-status-open' : 
                    issue.status === 'in_progress' ? 'text-status-in-progress' : 
                    'text-status-closed'
                }`} size={14} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 block">Priority</label>
              <div className="relative">
                <select
                  value={issue.priority}
                  onChange={(e) => updateIssue({ id: issue.id, priority: e.target.value as any })}
                  disabled={!canEdit}
                  className={`w-full px-3 py-2.5 rounded-[10px] font-bold text-xs uppercase tracking-wider appearance-none cursor-pointer focus:outline-none transition-colors border ${
                    issue.priority === 'low' ? 'bg-priority-low/10 text-priority-low border-priority-low/20 focus:border-priority-low' : 
                    issue.priority === 'medium' ? 'bg-priority-medium/10 text-priority-medium border-priority-medium/20 focus:border-priority-medium' : 
                    issue.priority === 'high' ? 'bg-priority-high/10 text-priority-high border-priority-high/20 focus:border-priority-high' : 
                    'bg-priority-critical/10 text-priority-critical border-priority-critical/20 focus:border-priority-critical'
                  }`}
                >
                  <option value="low" className="bg-surface text-text">LOW</option>
                  <option value="medium" className="bg-surface text-text">MEDIUM</option>
                  <option value="high" className="bg-surface text-text">HIGH</option>
                  <option value="critical" className="bg-surface text-text">CRITICAL</option>
                </select>
                <CaretDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                    issue.priority === 'low' ? 'text-priority-low' : 
                    issue.priority === 'medium' ? 'text-priority-medium' : 
                    issue.priority === 'high' ? 'text-priority-high' : 
                    'text-priority-critical'
                }`} size={14} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2 block">Assignee</label>
              <div className="relative">
                <select
                  value={issue.assignee_id || ""}
                  onChange={(e) => updateIssue({ id: issue.id, assignee_id: e.target.value || null })}
                  disabled={!canEdit}
                  className="w-full px-3 py-2.5 rounded-[10px] bg-background border border-border text-sm font-medium text-text appearance-none cursor-pointer focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="" className="bg-surface text-text">Unassigned</option>
                  {profiles?.map(p => (
                    <option key={p.id} value={p.id} className="bg-surface text-text">{p.full_name}</option>
                  ))}
                </select>
                <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" size={14} />
              </div>
            </div>

            <hr className="border-border" />

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <UserIcon className="text-text-muted mt-0.5" size={18} />
                <div>
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Reporter</div>
                  <div className="text-sm font-medium text-text">{issue.reporter?.full_name}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="text-text-muted mt-0.5" size={18} />
                <div>
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Created</div>
                  <div className="text-sm text-text">{format(new Date(issue.created_at), "MMM d, yyyy")}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="text-text-muted mt-0.5" size={18} />
                <div>
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Updated</div>
                  <div className="text-sm text-text">{format(new Date(issue.updated_at), "MMM d, yyyy")}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
