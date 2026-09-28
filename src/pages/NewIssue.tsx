import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createIssueSchema } from "@/features/issues/schemas"

import { useCreateIssue } from "@/features/issues/hooks"
import { useProfiles } from "@/features/profiles/hooks"
import { Link } from "react-router-dom"
import { Loader2, ArrowLeft } from "lucide-react"

export function NewIssue() {
  const { mutate: createIssue, isPending } = useCreateIssue()
  const { data: profiles, isLoading: isLoadingProfiles } = useProfiles()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(createIssueSchema),
    defaultValues: {
      status: "open",
      priority: "medium",
    }
  })

  const onSubmit = (data: any) => {
    createIssue(data)
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link to="/issues" className="inline-flex items-center text-text-muted hover:text-text mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        Back to issues
      </Link>
      
      <h1 className="text-3xl font-bold text-text mb-8">Create New Issue</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface p-6 sm:p-8 rounded-xl border border-border space-y-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-text mb-2">Title</label>
          <input
            {...register("title")}
            type="text"
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
            placeholder="E.g., Fix login page styling"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Description</label>
          <textarea
            {...register("description")}
            rows={5}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary transition-shadow resize-y"
            placeholder="Add details, steps to reproduce, or requirements..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">Status</label>
            <select
              {...register("status")}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">Priority</label>
            <select
              {...register("priority")}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text mb-2">Assignee</label>
          <select
            {...register("assignee_id")}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-text focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
            disabled={isLoadingProfiles}
          >
            <option value="">Unassigned</option>
            {profiles?.map(profile => (
              <option key={profile.id} value={profile.id}>
                {profile.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium flex items-center transition-colors disabled:opacity-70"
          >
            {isPending ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
            Create Issue
          </button>
        </div>
      </form>
    </div>
  )
}
