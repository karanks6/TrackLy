import { z } from "zod"

export const commentSchema = z.object({
  id: z.string().uuid(),
  issue_id: z.string().uuid(),
  author_id: z.string().uuid(),
  body: z.string().min(1).max(2000),
  created_at: z.string(),
})

export type Comment = z.infer<typeof commentSchema>

export const createCommentSchema = z.object({
  issue_id: z.string().uuid(),
  body: z.string().min(1, "Comment cannot be empty").max(2000, "Comment is too long")
})

export type CreateCommentInput = z.infer<typeof createCommentSchema>
