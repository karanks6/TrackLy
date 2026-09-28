import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useIssue, useUpdateIssue, useDeleteIssue } from "@/features/issues/hooks"
import { useProfiles } from "@/features/profiles/hooks"
import { useAuth } from "@/app/auth-provider"
import { CommentList } from "@/components/comments/CommentList"
import { ArrowLeft, Loader2, Trash2, Calendar, User as UserIcon } from "lucide-react"
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
    return <div className="p-8">Loading issue...</div>
  }

  const isReporter = user?.id === issue.reporter_id
  const isAssignee = user?.id === issue.assignee_id
  const canEdit = isReporter || isAssignee

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
    <div className="max-w-4xl mx-auto py-4 sm:py-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <Link to="/issues" className="inline-flex items-center text-text-muted hover:text-text transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to issues
        </Link>
        
        {isReporter && (
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this issue?")) {
                deleteIssue(issue.id)
              }
            }}
            disabled={isDeleting}
            className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
            title="Delete Issue"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Title Area */}
          <div>
            <div className="text-text-muted font-mono text-sm mb-2">TRK-{issue.issue_number}</div>
            {isEditingTitle && canEdit ? (
              <input 
                autoFocus
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
                className="w-full text-3xl font-bold bg-background border-b-2 border-primary focus:outline-none text-text py-1"
              />
            ) : (
              <h1 
                onClick={() => {
                  if (canEdit) {
                    setTitleValue(issue.title)
                    setIsEditingTitle(true)
                  }
                }}
                className={`text-3xl font-bold text-text py-1 ${canEdit ? 'cursor-text hover:bg-surface-elevated rounded' : ''}`}
              >
                {issue.title}
              </h1>
            )}
          </div>

          {/* Description Area */}
          <div className="bg-surface p-6 rounded-xl border border-border">
            <h3 className="font-semibold text-text mb-4">Description</h3>
            {isEditingDesc && canEdit ? (
              <div className="space-y-3">
                <textarea 
                  autoFocus
                  rows={6}
                  value={descValue}
                  onChange={(e) => setDescValue(e.target.value)}
                  className="w-full p-3 rounded-lg bg-background border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setIsEditingDesc(false)} className="px-3 py-1.5 text-sm text-text-muted hover:text-text">Cancel</button>
                  <button onClick={handleDescSubmit} className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-primary-hover">Save</button>
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
                className={`min-h-[100px] text-text-muted whitespace-pre-wrap ${canEdit ? 'cursor-text hover:bg-background rounded p-2 -m-2' : ''}`}
              >
                {issue.description || <span className="italic">No description provided.</span>}
              </div>
            )}
          </div>
          
          {/* Comments Section */}
          <div className="bg-surface p-6 rounded-xl border border-border">
             <CommentList issueId={issue.id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-xl border border-border space-y-6">
            
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Status</label>
              <select
                value={issue.status}
                onChange={(e) => updateIssue({ id: issue.id, status: e.target.value as any })}
                disabled={!canEdit}
                className={`w-full px-3 py-2 rounded-lg border font-medium ${
                  issue.status === 'open' ? 'bg-status-open/10 text-status-open border-status-open/20' : 
                  issue.status === 'in_progress' ? 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20' : 
                  'bg-status-closed/10 text-status-closed border-status-closed/20'
                } appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50`}
              >
                <option value="open">OPEN</option>
                <option value="in_progress">IN PROGRESS</option>
                <option value="closed">CLOSED</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Priority</label>
              <select
                value={issue.priority}
                onChange={(e) => updateIssue({ id: issue.id, priority: e.target.value as any })}
                disabled={!canEdit}
                className={`w-full px-3 py-2 rounded-lg border font-medium ${
                  issue.priority === 'low' ? 'bg-priority-low/10 text-priority-low border-priority-low/20' : 
                  issue.priority === 'medium' ? 'bg-priority-medium/10 text-priority-medium border-priority-medium/20' : 
                  issue.priority === 'high' ? 'bg-priority-high/10 text-priority-high border-priority-high/20' : 
                  'bg-priority-critical/10 text-priority-critical border-priority-critical/20'
                } appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50`}
              >
                <option value="low">LOW</option>
                <option value="medium">MEDIUM</option>
                <option value="high">HIGH</option>
                <option value="critical">CRITICAL</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Assignee</label>
              <select
                value={issue.assignee_id || ""}
                onChange={(e) => updateIssue({ id: issue.id, assignee_id: e.target.value || null })}
                disabled={!canEdit}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border text-text appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Unassigned</option>
                {profiles?.map(p => (
                  <option key={p.id} value={p.id}>{p.full_name}</option>
                ))}
              </select>
            </div>

            <hr className="border-border" />

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <UserIcon className="text-text-muted mt-0.5" size={16} />
                <div>
                  <div className="text-xs text-text-muted">Reporter</div>
                  <div className="text-sm font-medium">{issue.reporter?.full_name}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-text-muted mt-0.5" size={16} />
                <div>
                  <div className="text-xs text-text-muted">Created</div>
                  <div className="text-sm">{format(new Date(issue.created_at), "MMM d, yyyy h:mm a")}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-text-muted mt-0.5" size={16} />
                <div>
                  <div className="text-xs text-text-muted">Updated</div>
                  <div className="text-sm">{format(new Date(issue.updated_at), "MMM d, yyyy h:mm a")}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
