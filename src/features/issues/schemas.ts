import { z } from "zod"

export const issueStatusSchema = z.enum(["open", "in_progress", "closed"])
export const issuePrioritySchema = z.enum(["low", "medium", "high", "critical"])

export const issueSchema = z.object({
  id: z.string().uuid(),
  issue_number: z.number(),
  title: z.string().min(3).max(120),
  description: z.string().nullable(),
  status: issueStatusSchema,
  priority: issuePrioritySchema,
  reporter_id: z.string().uuid(),
  assignee_id: z.string().uuid().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  closed_at: z.string().nullable()
})

export type Issue = z.infer<typeof issueSchema>
export type IssueStatus = z.infer<typeof issueStatusSchema>
export type IssuePriority = z.infer<typeof issuePrioritySchema>

export const createIssueSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  description: z.string().optional(),
  status: issueStatusSchema.default("open"),
  priority: issuePrioritySchema.default("medium"),
  assignee_id: z.string().uuid().nullable().optional()
})

export type CreateIssueInput = z.infer<typeof createIssueSchema>

export const updateIssueSchema = createIssueSchema.partial()
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>
