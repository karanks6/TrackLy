import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { loginSchema } from "@/features/auth/schemas"
import type { LoginInput } from "@/features/auth/schemas"
import { loginWithEmail } from "@/features/auth/api"
import { toast } from "sonner"
import { motion } from "motion/react"
import { Eye, EyeClosed, Spinner, ArrowLeft } from "@phosphor-icons/react"

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      await loginWithEmail(data)
      toast.success("Successfully logged in")
      navigate("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Failed to login")
    }
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      <Link to="/" className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm font-medium text-text-muted hover:text-text transition-colors bg-surface-elevated/50 p-2 rounded-full backdrop-blur-md">
        <ArrowLeft size={20} /> <span className="hidden md:inline">Back</span>
      </Link>
      {/* Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative overflow-hidden bg-surface-elevated">
        <div className="absolute inset-0 bg-surface z-0 border-r border-border" />
        <div className="z-10 max-w-lg mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold mb-6 text-text"
          >
            Welcome to TrackLy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-text-muted mb-12"
          >
            The modern issue tracker for high-performing teams.
          </motion.p>
          <ul className="space-y-6">
            {[
              "Organize issues with intuitive Kanban boards",
              "Collaborate seamlessly with real-time updates",
              "Track your team's velocity and progress"
            ].map((feature, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center text-text-muted"
              >
                <div className="h-2 w-2 rounded-full bg-primary mr-4" />
                <span className="text-lg">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex flex-col justify-center p-8 sm:p-12 lg:p-24 relative z-10 bg-background">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-text">Sign in</h2>
            <p className="text-text-muted mt-2">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary transition-shadow pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-text-muted hover:text-text"
                >
                  {showPassword ? <Eye weight="regular" /> : <EyeClosed weight="regular" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary-hover text-on-primary font-medium py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isSubmitting ? <Spinner weight="regular" /> : null}
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-text-muted">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
