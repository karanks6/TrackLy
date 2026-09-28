import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getComments, createComment, deleteComment } from "./api"
import type { CreateCommentInput } from "./schemas"
import { toast } from "sonner"

export const commentsKeys = {
  all: ["comments"] as const,
  issue: (issueId: string) => [...commentsKeys.all, issueId] as const,
}

export function useComments(issueId: string) {
  return useQuery({
    queryKey: commentsKeys.issue(issueId),
    queryFn: () => getComments(issueId),
    enabled: !!issueId,
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCommentInput) => createComment(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: commentsKeys.issue(variables.issue_id) })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to post comment")
    }
  })
}

export function useDeleteComment(issueId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteComment(id),
    onSuccess: () => {
      toast.success("Comment deleted")
      queryClient.invalidateQueries({ queryKey: commentsKeys.issue(issueId) })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete comment")
    }
  })
}
