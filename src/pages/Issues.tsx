import { useState } from "react"
import { useIssues } from "@/features/issues/hooks"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { MagnifyingGlass, Plus, List, GridFour } from "@phosphor-icons/react"

export function Issues() {
  const { data: issues, isLoading } = useIssues()
  const [view, setView] = useState<"list" | "board">("list")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const filteredIssues = issues?.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(search.toLowerCase()) || `trk-${issue.issue_number}`.includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || issue.status === statusFilter
    const matchesPriority = priorityFilter === "all" || issue.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  }) || []

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-text tracking-tight">Issues</h1>
        <Link to="/issues/new" className="bg-primary hover:bg-primary-hover text-on-primary px-4 py-2 rounded-[10px] font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md">
          <Plus weight="bold" />
          New Issue
        </Link>
      </div>

      {/* Sleek Inline Filter Row */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 w-full">
          <MagnifyingGlass weight="regular" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search issues by title or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-border rounded-[10px] pl-10 pr-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-40">
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-surface border border-border rounded-[10px] px-3 py-2.5 text-sm text-text focus:outline-none focus:border-primary/50 transition-colors cursor-pointer appearance-none"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-xs">▼</div>
          </div>
          
          <div className="relative flex-1 md:w-40">
            <select 
              value={priorityFilter} 
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full bg-surface border border-border rounded-[10px] px-3 py-2.5 text-sm text-text focus:outline-none focus:border-primary/50 transition-colors cursor-pointer appearance-none"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted text-xs">▼</div>
          </div>

          <div className="flex items-center gap-1 bg-surface p-1 rounded-[10px] border border-border shrink-0">
            <button 
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-surface-elevated shadow-sm text-text" : "text-text-muted hover:text-text"}`}
              title="List View"
            >
              <List weight="regular" size={18} />
            </button>
            <button 
              onClick={() => setView("board")}
              className={`p-1.5 rounded-md transition-colors ${view === "board" ? "bg-surface-elevated shadow-sm text-text" : "text-text-muted hover:text-text"}`}
              title="Board View"
            >
              <GridFour weight="regular" size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        {view === "list" ? (
          <div className="flex flex-col border-t border-border">
            <div className="hidden sm:grid grid-cols-[80px_1fr_100px_100px_120px] gap-4 px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider border-b border-border">
              <div>ID</div>
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
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  key={issue.id}
                >
                  <Link 
                    to={`/issues/${issue.id}`}
                    className="flex flex-col sm:grid sm:grid-cols-[80px_1fr_100px_100px_120px] gap-3 sm:gap-4 px-4 py-4 border-b border-border hover:bg-surface-elevated transition-colors items-start sm:items-center group cursor-pointer"
                  >
                    <div className="text-text-muted font-mono text-xs hidden sm:block group-hover:text-primary transition-colors">TRK-{issue.issue_number}</div>
                    
                    <div className="w-full">
                       <div className="text-text-muted font-mono text-xs sm:hidden mb-1 group-hover:text-primary transition-colors">TRK-{issue.issue_number}</div>
                       <div className="font-medium text-text truncate pr-4">{issue.title}</div>
                    </div>
                    
                    <div className="flex sm:block gap-2 w-full sm:w-auto mt-1 sm:mt-0">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${
                        issue.status === 'open' ? 'text-status-open bg-status-open/10' : 
                        issue.status === 'in_progress' ? 'text-status-in-progress bg-status-in-progress/10' : 
                        'text-status-closed bg-status-closed/10'
                      }`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="hidden sm:block">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${
                        issue.priority === 'low' ? 'text-priority-low bg-priority-low/10' : 
                        issue.priority === 'medium' ? 'text-priority-medium bg-priority-medium/10' : 
                        issue.priority === 'high' ? 'text-priority-high bg-priority-high/10' : 
                        'text-priority-critical bg-priority-critical/10'
                      }`}>
                        {issue.priority}
                      </span>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-2 truncate">
                      {issue.assignee ? (
                        <>
                          <div className="h-6 w-6 rounded-full bg-surface-elevated border border-border text-text flex items-center justify-center text-[10px] font-bold shrink-0">
                            {issue.assignee.full_name.charAt(0).toUpperCase()}
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
                <div className="py-20 text-center text-text-muted">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface mb-4">
                    <MagnifyingGlass size={24} className="text-text-muted" />
                  </div>
                  <p className="font-medium text-text">No issues found</p>
                  <p className="text-sm">Try adjusting your search or filters.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex h-[calc(100vh-250px)] min-h-[500px] gap-4 md:gap-6 pb-4 overflow-x-auto snap-x">
            {/* Kanban Board */}
            {['open', 'in_progress', 'closed'].map(status => (
              <div key={status} className="flex-none w-[320px] bg-surface rounded-[16px] p-4 flex flex-col h-full border border-border snap-center">
                <h3 className="font-bold text-text mb-4 uppercase text-xs tracking-wider flex justify-between items-center">
                  {status.replace('_', ' ')}
                  <span className="bg-background text-text-muted px-2 py-0.5 rounded-full text-[10px] border border-border">
                    {filteredIssues.filter(i => i.status === status).length}
                  </span>
                </h3>
                <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 pb-4">
                  <AnimatePresence>
                    {filteredIssues.filter(i => i.status === status).map((issue, idx) => (
                      <motion.div
                        key={issue.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                      >
                        <Link to={`/issues/${issue.id}`} className="block bg-background p-4 rounded-[12px] border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md group cursor-pointer">
                          <div className="text-[10px] text-text-muted font-mono mb-2 group-hover:text-primary transition-colors">TRK-{issue.issue_number}</div>
                          <div className="font-medium text-text mb-4 text-sm leading-snug">{issue.title}</div>
                          <div className="flex justify-between items-center mt-2">
                            <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${
                              issue.priority === 'critical' ? 'text-priority-critical bg-priority-critical/10' :
                              issue.priority === 'high' ? 'text-priority-high bg-priority-high/10' :
                              issue.priority === 'medium' ? 'text-priority-medium bg-priority-medium/10' :
                              'text-priority-low bg-priority-low/10'
                            }`}>
                              {issue.priority}
                            </span>
                            {issue.assignee && (
                              <div className="h-6 w-6 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-[10px] font-bold text-text shrink-0" title={issue.assignee.full_name}>
                                {issue.assignee.full_name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
