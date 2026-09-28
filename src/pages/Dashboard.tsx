import { useDashboardStats } from "@/features/dashboard/hooks"
import { useIssues } from "@/features/issues/hooks"
import { motion, AnimatePresence } from "motion/react"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import { SquaresFour, CheckCircle, Clock, WarningCircle } from "@phosphor-icons/react"
import { CountUp } from "@/components/reactbits/CountUp"

export function Dashboard() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useDashboardStats()
  const { data: issues, isLoading: issuesLoading, isError: issuesError } = useIssues()

  if (statsLoading || issuesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-text-muted">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (statsError || issuesError) {
    return (
      <div className="max-w-2xl mt-12 bg-red-500/10 border border-red-500/20 rounded-[16px] p-6">
        <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Dashboard</h2>
        <p className="text-text-muted mb-4">We couldn't connect to the database to fetch your stats.</p>
        <ul className="list-disc pl-5 text-sm text-text-muted space-y-2">
          <li>Check that your Supabase URL and Anon Key in <code className="bg-surface px-1 py-0.5 rounded">.env</code> are correct.</li>
          <li>Make sure you ran the SQL scripts in <code className="bg-surface px-1 py-0.5 rounded">supabase/migrations/0001_init.sql</code> inside your Supabase project's SQL editor.</li>
        </ul>
      </div>
    )
  }

  const statCards = [
    { title: "Total Issues", value: stats?.total || 0, icon: SquaresFour, color: "text-text" },
    { title: "Open", value: stats?.open || 0, icon: WarningCircle, color: "text-status-open" },
    { title: "In Progress", value: stats?.in_progress || 0, icon: Clock, color: "text-status-in-progress" },
    { title: "Closed", value: stats?.closed || 0, icon: CheckCircle, color: "text-status-closed" },
  ]

  const total = stats?.total || 1
  const openPct = ((stats?.open || 0) / total) * 100
  const ipPct = ((stats?.in_progress || 0) / total) * 100
  const closedPct = ((stats?.closed || 0) / total) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text tracking-tight">Overview</h1>
      </div>

      {/* Stats Grid - 1 col mobile, 2 col tablet, 4 col desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <AnimatePresence>
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-surface p-6 rounded-[16px] border border-border flex flex-col justify-between hover:bg-surface-elevated transition-colors group"
            >
              <div className="flex justify-between items-start mb-6">
                <p className="text-sm font-medium text-text-muted">{stat.title}</p>
                <stat.icon size={24} weight="duotone" className={`${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
              </div>
              <h3 className="text-4xl font-mono font-bold text-text tracking-tight">
                <CountUp to={stat.value} />
              </h3>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Recent Activity (2/3 width) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-surface p-6 rounded-[16px] border border-border lg:col-span-2 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold text-text">Recent Issues</h3>
            <Link to="/issues" className="text-sm font-medium text-primary hover:opacity-80 transition-opacity">View all</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            {issues?.slice(0, 5).map((issue, i) => (
              <motion.div 
                key={issue.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <Link to={`/issues/${issue.id}`} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[12px] border border-border hover:border-primary/50 bg-background hover:bg-surface-elevated transition-all">
                  <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    <span className="text-xs font-mono text-text-muted group-hover:text-primary transition-colors">TRK-{issue.issue_number}</span>
                    <h4 className="font-medium text-text text-sm">{issue.title}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${
                      issue.status === 'open' ? 'text-status-open bg-status-open/10' :
                      issue.status === 'in_progress' ? 'text-status-in-progress bg-status-in-progress/10' :
                      'text-status-closed bg-status-closed/10'
                    }`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${
                      issue.priority === 'critical' ? 'text-priority-critical bg-priority-critical/10' :
                      issue.priority === 'high' ? 'text-priority-high bg-priority-high/10' :
                      issue.priority === 'medium' ? 'text-priority-medium bg-priority-medium/10' :
                      'text-priority-low bg-priority-low/10'
                    }`}>
                      {issue.priority}
                    </span>
                    <span className="hidden sm:inline-block text-xs font-mono text-text-muted w-16 text-right">
                      {format(new Date(issue.created_at), "MMM d")}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            {(!issues || issues.length === 0) && (
              <div className="text-center text-text-muted py-8 text-sm">No recent activity</div>
            )}
          </div>
        </motion.div>

        {/* Status Distribution (1/3 width) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-surface p-6 rounded-[16px] border border-border lg:col-span-1"
        >
          <h3 className="text-base font-semibold text-text mb-6">Status Distribution</h3>
          
          <div className="flex flex-col gap-6 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm items-center">
                <span className="font-medium text-text flex items-center gap-2">
                  <WarningCircle size={16} className="text-status-open" weight="duotone" />
                  Open
                </span>
                <span className="text-text-muted font-mono">{openPct.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-background overflow-hidden border border-border/50">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${openPct}%` }} 
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                  className="h-full bg-status-open" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm items-center">
                <span className="font-medium text-text flex items-center gap-2">
                  <Clock size={16} className="text-status-in-progress" weight="duotone" />
                  In Progress
                </span>
                <span className="text-text-muted font-mono">{ipPct.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-background overflow-hidden border border-border/50">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${ipPct}%` }} 
                  transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                  className="h-full bg-status-in-progress" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm items-center">
                <span className="font-medium text-text flex items-center gap-2">
                  <CheckCircle size={16} className="text-status-closed" weight="duotone" />
                  Closed
                </span>
                <span className="text-text-muted font-mono">{closedPct.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-background overflow-hidden border border-border/50">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${closedPct}%` }} 
                  transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
                  className="h-full bg-status-closed" 
                />
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
