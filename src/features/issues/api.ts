import { supabase } from "@/lib/supabase"
import type { CreateIssueInput, UpdateIssueInput } from "./schemas"

export async function getIssues() {
  const { data, error } = await supabase
    .from("issues")
    .select(`
      *,
      reporter:profiles!reporter_id(id, full_name, email),
      assignee:profiles!assignee_id(id, full_name, email)
    `)
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getIssue(id: string) {
  const { data, error } = await supabase
    .from("issues")
    .select(`
      *,
      reporter:profiles!reporter_id(id, full_name, email),
      assignee:profiles!assignee_id(id, full_name, email)
    `)
    .eq("id", id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createIssue(input: CreateIssueInput) {
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("issues")
    .insert({
      title: input.title,
      description: input.description,
      status: input.status,
      priority: input.priority,
      assignee_id: input.assignee_id,
      reporter_id: user.user.id
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function updateIssue({ id, ...input }: { id: string } & UpdateIssueInput) {
  const { data, error } = await supabase
    .from("issues")
    .update(input)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteIssue(id: string) {
  const { error } = await supabase
    .from("issues")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}
