import { supabase } from "@/lib/supabase"
import type { LoginInput, RegisterInput } from "./schemas"

export async function loginWithEmail(data: LoginInput) {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })
  if (error) throw new Error(error.message)
  return authData
}

export async function registerWithEmail(data: RegisterInput) {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  })
  if (error) throw new Error(error.message)
  return authData
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}
