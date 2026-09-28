import { Outlet, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/app/auth-provider"
import { useTheme } from "@/app/theme-provider"
import { logout } from "@/features/auth/api"
import { toast } from "sonner"
import { LayoutDashboard, ListTodo, PlusCircle, LogOut, Sun, Moon, Monitor } from "lucide-react"

export function Layout() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/login")
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Issues", path: "/issues", icon: ListTodo },
    { name: "New Issue", path: "/issues/new", icon: PlusCircle },
  ]

  return (
    <div className="flex h-screen w-full bg-background text-text overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-elevated border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-bold text-2xl text-primary tracking-tight">TrackLy</h1>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-text-muted hover:bg-surface hover:text-text"
                }`
              }
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-text-muted hover:bg-surface hover:text-text transition-colors font-medium"
          >
            <LogOut size={20} />
            Log out
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 z-10">
          <div className="font-medium text-text-muted">
            Welcome back, {user?.user_metadata?.full_name || user?.email}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-surface-elevated rounded-lg p-1 border border-border">
              <button onClick={() => setTheme("light")} className={`p-1.5 rounded-md ${theme === "light" ? "bg-surface shadow-sm" : "text-text-muted"}`}>
                <Sun size={16} />
              </button>
              <button onClick={() => setTheme("system")} className={`p-1.5 rounded-md ${theme === "system" ? "bg-surface shadow-sm" : "text-text-muted"}`}>
                <Monitor size={16} />
              </button>
              <button onClick={() => setTheme("dark")} className={`p-1.5 rounded-md ${theme === "dark" ? "bg-surface shadow-sm" : "text-text-muted"}`}>
                <Moon size={16} />
              </button>
            </div>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto bg-background p-8 relative">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <Outlet />
        </div>
      </main>
    </div>
  )
}
