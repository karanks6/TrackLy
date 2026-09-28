import React, { useState, useEffect } from "react"
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/app/auth-provider"
import { useTheme } from "@/app/theme-provider"
import { logout } from "@/features/auth/api"
import { toast } from "sonner"
import { motion, AnimatePresence } from "motion/react"
import { 
  SquaresFour, 
  ListChecks, 
  PlusCircle, 
  SignOut, 
  Sun, 
  Moon, 
  Monitor, 
  List, 
  X, 
  CaretDown, 
  GearSix,
  Kanban
} from "@phosphor-icons/react"

export function Layout() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (e: any) {
      toast.error(e.message)
    }
  }

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: SquaresFour },
    { name: "Issues", path: "/issues", icon: ListChecks, exact: true },
    { name: "New Issue", path: "/issues/new", icon: PlusCircle },
  ]

  const pathSegments = location.pathname.split("/").filter(Boolean)
  const userInitials = user?.user_metadata?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "?"

  const SidebarContent = () => (
    <>
      <div className="p-6 h-16 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2 text-xl font-bold font-mono tracking-tight text-text">
          <Kanban size={24} className="text-primary" weight="duotone" />
          TrackLy
        </div>
        <button className="md:hidden text-text-muted hover:text-text" onClick={() => setMobileOpen(false)}>
          <X size={20} />
        </button>
      </div>
      
      <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2 px-4 mt-2">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-[10px] transition-all duration-200 font-medium ${
                isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-text-muted hover:bg-surface hover:text-text"
              }`
            }
          >
            <item.icon size={20} weight="regular" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
         <div className="flex bg-background border border-border rounded-[10px] p-1 w-full justify-between">
            <button onClick={() => setTheme("light")} className={`flex-1 flex justify-center p-2 rounded-md transition-colors ${theme === "light" ? "bg-surface shadow-sm text-text" : "text-text-muted hover:text-text"}`}>
              <Sun size={18} />
            </button>
            <button onClick={() => setTheme("system")} className={`flex-1 flex justify-center p-2 rounded-md transition-colors ${theme === "system" ? "bg-surface shadow-sm text-text" : "text-text-muted hover:text-text"}`}>
              <Monitor size={18} />
            </button>
            <button onClick={() => setTheme("dark")} className={`flex-1 flex justify-center p-2 rounded-md transition-colors ${theme === "dark" ? "bg-surface shadow-sm text-text" : "text-text-muted hover:text-text"}`}>
              <Moon size={18} />
            </button>
          </div>
      </div>
    </>
  )

  return (
    <div className="flex h-screen w-full bg-background text-text overflow-hidden font-sans">
      
      {/* Desktop Sidebar (w-60 is 240px) */}
      <aside className="w-60 bg-surface-elevated border-r border-border hidden md:flex flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay & Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-surface-elevated border-r border-border z-50 md:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Top Header */}
        <header className="h-16 shrink-0 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-8 relative z-50">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-text-muted hover:text-text" onClick={() => setMobileOpen(true)}>
              <List size={24} />
            </button>
            
            {/* Breadcrumbs */}
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-text-muted">
              <span>TrackLy</span>
              {pathSegments.map(segment => (
                <React.Fragment key={segment}>
                  <span className="text-border">/</span>
                  <span className="text-text capitalize">{segment}</span>
                </React.Fragment>
              ))}
            </div>
            {/* Mobile Breadcrumb Fallback */}
            <div className="md:hidden text-sm font-medium text-text capitalize">
              {pathSegments[pathSegments.length - 1] || "Dashboard"}
            </div>
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)} 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-surface border border-border pl-1 pr-2 py-1 rounded-full shadow-sm"
            >
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-xs">
                {userInitials}
              </div>
              <CaretDown size={14} className="text-text-muted" />
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{ backgroundColor: "color-mix(in srgb, var(--bg) 95%, transparent)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
                    className="absolute right-0 top-full mt-2 w-56 border border-border rounded-[12px] shadow-2xl p-2 z-50 flex flex-col gap-1"
                  >
                    <div className="px-3 py-2 text-xs font-medium text-text-muted mb-1 border-b border-border truncate">
                      Signed in as<br/>
                      <span className="text-text text-sm">{user?.email}</span>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="flex items-center gap-3 w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-md transition-colors font-medium"
                    >
                      <SignOut size={18} /> Log out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-background p-4 md:p-8 relative z-0">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto relative">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
