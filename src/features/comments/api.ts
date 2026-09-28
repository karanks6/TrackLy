import { supabase } from "@/lib/supabase"
import type { CreateCommentInput } from "./schemas"

export async function getComments(issueId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      *,
      author:profiles!author_id(id, full_name, email)
    `)
    .eq("issue_id", issueId)
    .order("created_at", { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function createComment(input: CreateCommentInput) {
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error("Not authenticated")

  const { data, error } = await supabase
    .from("comments")
    .insert({
      issue_id: input.issue_id,
      body: input.body,
      author_id: user.user.id
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteComment(id: string) {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}
