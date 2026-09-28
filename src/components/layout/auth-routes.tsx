import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/app/auth-provider"

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-text">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-text">Loading...</div>
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
