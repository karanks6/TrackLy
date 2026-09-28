import { ThemeProvider } from "@/app/theme-provider"
import { AuthProvider } from "@/app/auth-provider"
import { MotionConfig } from "motion/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { Layout } from "@/components/layout/Layout"
import { ProtectedRoute, PublicOnlyRoute } from "@/components/layout/auth-routes"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { Issues } from "@/pages/Issues"
import { NewIssue } from "@/pages/NewIssue"
import { IssueDetail } from "@/pages/IssueDetail"
import { Dashboard } from "@/pages/Dashboard"

const NotFound = () => <div className="p-8"><h1 className="text-2xl font-bold">404 - Not Found</h1></div>

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="trackly-theme">
        <AuthProvider>
          <MotionConfig reducedMotion="user">
            <BrowserRouter>
              <Routes>
                <Route element={<PublicOnlyRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
                
                <Route element={<ProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/issues" element={<Issues />} />
                    <Route path="/issues/new" element={<NewIssue />} />
                    <Route path="/issues/:id" element={<IssueDetail />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster position="bottom-right" theme="system" />
          </MotionConfig>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
