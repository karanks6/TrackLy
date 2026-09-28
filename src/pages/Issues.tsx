import { useState } from "react"
import { useIssues } from "@/features/issues/hooks"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Search, Plus, List, LayoutGrid } from "lucide-react"

export function Issues() {
  const { data: issues, isLoading } = useIssues()
  const [view, setView] = useState<"list" | "board">("list")
  const [search, setSearch] = useState("")

  if (isLoading) {
    return <div className="p-8">Loading issues...</div>
  }

  const filteredIssues = issues?.filter(issue => 
    issue.title.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-text">Issues</h1>
        <Link to="/issues/new" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus size={20} />
          New Issue
        </Link>
      </div>

      <div className="bg-surface p-4 rounded-xl border border-border mb-6 flex items-center justify-between shadow-sm">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search issues..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-background p-1 rounded-lg border border-border">
          <button 
            onClick={() => setView("list")}
            className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-surface shadow text-text" : "text-text-muted hover:text-text"}`}
          >
            <List size={18} />
          </button>
          <button 
            onClick={() => setView("board")}
            className={`p-1.5 rounded-md transition-colors ${view === "board" ? "bg-surface shadow text-text" : "text-text-muted hover:text-text"}`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {view === "list" ? (
          <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="grid grid-cols-[100px_1fr_120px_120px_150px] gap-4 p-4 border-b border-border bg-surface-elevated font-medium text-text-muted text-sm">
              <div>Key</div>
              <div>Title</div>
              <div>Status</div>
              <div>Priority</div>
              <div>Assignee</div>
            </div>
            
            <AnimatePresence mode="popLayout">
              {filteredIssues.map((issue, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04 }}
                  key={issue.id}
                >
                  <Link 
                    to={`/issues/${issue.id}`}
                    className="grid grid-cols-[100px_1fr_120px_120px_150px] gap-4 p-4 border-b border-border hover:bg-surface-elevated transition-colors items-center group cursor-pointer"
                  >
                    <div className="text-text-muted font-mono text-sm">TRK-{issue.issue_number}</div>
                    <div className="font-medium text-text group-hover:text-primary transition-colors truncate">{issue.title}</div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        issue.status === 'open' ? 'bg-status-open/10 text-status-open border-status-open/20' : 
                        issue.status === 'in_progress' ? 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20' : 
                        'bg-status-closed/10 text-status-closed border-status-closed/20'
                      }`}>
                        {issue.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        issue.priority === 'low' ? 'bg-priority-low/10 text-priority-low border-priority-low/20' : 
                        issue.priority === 'medium' ? 'bg-priority-medium/10 text-priority-medium border-priority-medium/20' : 
                        issue.priority === 'high' ? 'bg-priority-high/10 text-priority-high border-priority-high/20' : 
                        'bg-priority-critical/10 text-priority-critical border-priority-critical/20'
                      }`}>
                        {issue.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 truncate">
                      {issue.assignee ? (
                        <>
                          <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                            {issue.assignee.full_name.charAt(0)}
                          </div>
                          <span className="text-sm text-text-muted truncate">{issue.assignee.full_name}</span>
                        </>
                      ) : (
                        <span className="text-sm text-text-muted italic">Unassigned</span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
              
              {filteredIssues.length === 0 && (
                <div className="p-12 text-center text-text-muted">
                  No issues found.
                </div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex h-full gap-6">
            {/* Kanban Board Placeholder */}
            {['open', 'in_progress', 'closed'].map(status => (
              <div key={status} className="flex-1 bg-surface-elevated rounded-xl p-4 flex flex-col h-full border border-border">
                <h3 className="font-bold text-text mb-4 uppercase text-sm tracking-wider flex justify-between items-center">
                  {status.replace('_', ' ')}
                  <span className="bg-surface text-text-muted px-2 py-0.5 rounded-md text-xs">
                    {filteredIssues.filter(i => i.status === status).length}
                  </span>
                </h3>
                <div className="flex-1 overflow-y-auto flex flex-col gap-3">
                  {filteredIssues.filter(i => i.status === status).map(issue => (
                    <Link to={`/issues/${issue.id}`} key={issue.id} className="bg-surface p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all">
                      <div className="text-xs text-text-muted font-mono mb-2">TRK-{issue.issue_number}</div>
                      <div className="font-medium text-text mb-3 leading-snug">{issue.title}</div>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          issue.priority === 'critical' ? 'text-priority-critical bg-priority-critical/10' :
                          issue.priority === 'high' ? 'text-priority-high bg-priority-high/10' :
                          issue.priority === 'medium' ? 'text-priority-medium bg-priority-medium/10' :
                          'text-priority-low bg-priority-low/10'
                        }`}>
                          {issue.priority.toUpperCase()}
                        </span>
                        {issue.assignee && (
                           <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold" title={issue.assignee.full_name}>
                             {issue.assignee.full_name.charAt(0)}
                           </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
