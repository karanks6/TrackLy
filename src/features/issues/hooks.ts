import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getIssues, getIssue, createIssue, updateIssue, deleteIssue } from "./api"
import type { CreateIssueInput, UpdateIssueInput } from "./schemas"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export const issuesKeys = {
  all: ["issues"] as const,
  lists: () => [...issuesKeys.all, "list"] as const,
  list: (filters: string) => [...issuesKeys.lists(), { filters }] as const,
  details: () => [...issuesKeys.all, "detail"] as const,
  detail: (id: string) => [...issuesKeys.details(), id] as const,
}

export function useIssues() {
  return useQuery({
    queryKey: issuesKeys.lists(),
    queryFn: getIssues,
  })
}

export function useIssue(id: string) {
  return useQuery({
    queryKey: issuesKeys.detail(id),
    queryFn: () => getIssue(id),
    enabled: !!id,
  })
}

export function useCreateIssue() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CreateIssueInput) => createIssue(data),
    onSuccess: () => {
      toast.success("Issue created")
      queryClient.invalidateQueries({ queryKey: issuesKeys.lists() })
      navigate("/issues")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create issue")
    }
  })
}

export function useUpdateIssue() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { id: string } & UpdateIssueInput) => updateIssue(data),
    // Optimistic Update
    onMutate: async (newIssue) => {
      await queryClient.cancelQueries({ queryKey: issuesKeys.lists() })
      const previousIssues = queryClient.getQueryData(issuesKeys.lists())

      queryClient.setQueryData(issuesKeys.lists(), (old: any) => {
        if (!old) return old
        return old.map((issue: any) => 
          issue.id === newIssue.id ? { ...issue, ...newIssue } : issue
        )
      })

      return { previousIssues }
    },
    onError: (err, _newIssue, context: any) => {
      toast.error(err.message || "Failed to update issue")
      if (context?.previousIssues) {
        queryClient.setQueryData(issuesKeys.lists(), context.previousIssues)
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: issuesKeys.lists() })
      queryClient.invalidateQueries({ queryKey: issuesKeys.detail(variables.id) })
    },
    onSuccess: () => {
      toast.success("Issue updated")
    }
  })
}

export function useDeleteIssue() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (id: string) => deleteIssue(id),
    onSuccess: () => {
      toast.success("Issue deleted")
      queryClient.invalidateQueries({ queryKey: issuesKeys.lists() })
      navigate("/issues")
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete issue")
    }
  })
}
