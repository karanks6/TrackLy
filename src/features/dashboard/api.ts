import { supabase } from "@/lib/supabase"

export type DashboardStats = {
  total: number
  open: number
  in_progress: number
  closed: number
  assigned_to_me: number
  created_by_me: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data, error } = await supabase.rpc("get_dashboard_stats")
  
  if (error) throw new Error(error.message)
  return data as DashboardStats
}
