import { supabase } from "@/lib/supabase"

export async function getProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .order("full_name")

  if (error) throw new Error(error.message)
  return data
}
