import { useDashboardStats } from "@/features/dashboard/hooks"
import { useIssues } from "@/features/issues/hooks"
import { motion, AnimatePresence } from "motion/react"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { LayoutDashboard, CheckCircle, Clock, AlertCircle, User, Activity } from "lucide-react"

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: issues, isLoading: issuesLoading } = useIssues()

  if (statsLoading || issuesLoading) {
    return <div className="p-8">Loading dashboard...</div>
  }

  const statCards = [
    { title: "Total Issues", value: stats?.total || 0, icon: LayoutDashboard, color: "text-primary" },
    { title: "Open", value: stats?.open || 0, icon: AlertCircle, color: "text-status-open" },
    { title: "In Progress", value: stats?.in_progress || 0, icon: Clock, color: "text-status-in-progress" },
    { title: "Closed", value: stats?.closed || 0, icon: CheckCircle, color: "text-status-closed" },
    { title: "Assigned to Me", value: stats?.assigned_to_me || 0, icon: User, color: "text-accent" },
    { title: "Created by Me", value: stats?.created_by_me || 0, icon: Activity, color: "text-text" },
  ]

  const total = stats?.total || 1
  const openPct = ((stats?.open || 0) / total) * 100
  const ipPct = ((stats?.in_progress || 0) / total) * 100
  const closedPct = ((stats?.closed || 0) / total) * 100

  // SVG Circle calculations
  const radius = 50
  const circumference = 2 * Math.PI * radius
  
  // const openOffset = 0
  const ipOffset = openPct
  const closedOffset = openPct + ipPct

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-text mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-surface p-6 rounded-2xl border border-border flex items-center justify-between hover:-translate-y-1 transition-transform shadow-sm"
            >
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">{stat.title}</p>
                <motion.h3 
                  className="text-3xl font-bold text-text"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 + i * 0.1 }}
                >
                  {stat.value}
                </motion.h3>
              </div>
              <div className={`p-4 rounded-full bg-surface-elevated ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Distribution Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center lg:col-span-1"
        >
          <h3 className="text-lg font-semibold text-text mb-8 w-full text-left">Status Distribution</h3>
          
          <div className="relative w-48 h-48">
            <svg viewBox="0 0 120 120" className="transform -rotate-90 w-full h-full">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="16"
              />
              
              {/* Closed */}
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="var(--color-status-closed)"
                strokeWidth="16"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (closedPct / 100) * circumference }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDashoffset: circumference, strokeDasharray: `${circumference} ${circumference}`, transformOrigin: "center", transform: `rotate(${closedOffset * 3.6}deg)` }}
              />
              
              {/* In Progress */}
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="var(--color-status-in-progress)"
                strokeWidth="16"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (ipPct / 100) * circumference }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDashoffset: circumference, strokeDasharray: `${circumference} ${circumference}`, transformOrigin: "center", transform: `rotate(${ipOffset * 3.6}deg)` }}
              />

              {/* Open */}
              <motion.circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="var(--color-status-open)"
                strokeWidth="16"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (openPct / 100) * circumference }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ strokeDashoffset: circumference, strokeDasharray: `${circumference} ${circumference}`, transformOrigin: "center" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-2xl font-bold text-text">{total}</span>
              <span className="text-xs text-text-muted">Issues</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-open" />
              <span className="text-sm text-text-muted">Open</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-in-progress" />
              <span className="text-sm text-text-muted">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-status-closed" />
              <span className="text-sm text-text-muted">Closed</span>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface p-6 rounded-2xl border border-border shadow-sm lg:col-span-2 flex flex-col"
        >
          <h3 className="text-lg font-semibold text-text mb-6">Recent Issues</h3>
          <div className="flex-1 overflow-auto pr-2 space-y-4">
            {issues?.slice(0, 5).map((issue, i) => (
              <motion.div 
                key={issue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <Link to={`/issues/${issue.id}`} className="block p-4 rounded-xl border border-border hover:bg-surface-elevated transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-text-muted">TRK-{issue.issue_number}</span>
                    <span className="text-xs text-text-muted">{format(new Date(issue.created_at), "MMM d, h:mm a")}</span>
                  </div>
                  <h4 className="font-medium text-text mb-2 truncate">{issue.title}</h4>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      issue.status === 'open' ? 'text-status-open bg-status-open/10' :
                      issue.status === 'in_progress' ? 'text-status-in-progress bg-status-in-progress/10' :
                      'text-status-closed bg-status-closed/10'
                    }`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      issue.priority === 'critical' ? 'text-priority-critical bg-priority-critical/10' :
                      issue.priority === 'high' ? 'text-priority-high bg-priority-high/10' :
                      issue.priority === 'medium' ? 'text-priority-medium bg-priority-medium/10' :
                      'text-priority-low bg-priority-low/10'
                    }`}>
                      {issue.priority}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            {(!issues || issues.length === 0) && (
              <div className="text-center text-text-muted py-8">No recent activity</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
