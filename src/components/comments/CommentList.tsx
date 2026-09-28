import { useState } from "react"
import { useComments, useCreateComment, useDeleteComment } from "@/features/comments/hooks"
import { useAuth } from "@/app/auth-provider"
import { motion, AnimatePresence } from "motion/react"
import { format } from "date-fns"
import { Trash, PaperPlaneRight, Spinner } from "@phosphor-icons/react"

export function CommentList({ issueId }: { issueId: string }) {
  const { data: comments, isLoading } = useComments(issueId)
  const { mutate: createComment, isPending: isCreating } = useCreateComment()
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(issueId)
  const { user } = useAuth()
  
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!newComment.trim()) return
    
    createComment({ issue_id: issueId, body: newComment }, {
      onSuccess: () => setNewComment("")
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  if (isLoading) {
    return <div className="text-text-muted text-sm">Loading comments...</div>
  }

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-text mb-6">
        Comments <span className="text-text-muted font-normal text-sm ml-1">({comments?.length || 0})</span>
      </h3>
      
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {comments?.map((comment) => {
            const isOwnComment = user?.id === comment.author_id
            
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                key={comment.id}
                className="flex gap-4 items-start group"
              >
                <div className="h-8 w-8 rounded-full bg-surface-elevated border border-border text-text flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                  {comment.author?.full_name?.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm text-text">{comment.author?.full_name}</span>
                    <span className="text-xs text-text-muted">
                      {format(new Date(comment.created_at), "MMM d, h:mm a")}
                    </span>
                  </div>
                  
                  <div className="text-text text-sm whitespace-pre-wrap leading-relaxed">
                    {comment.body}
                  </div>
                </div>

                {isOwnComment && (
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this comment?")) {
                        deleteComment(comment.id)
                      }
                    }}
                    disabled={isDeleting}
                    className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-500 transition-all p-1.5 rounded-md hover:bg-red-500/10"
                    title="Delete Comment"
                  >
                    <Trash size={16} />
                  </button>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {comments?.length === 0 && (
          <div className="text-text-muted py-4 text-sm italic">
            No comments yet. Be the first to start the conversation!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 pt-6 border-t border-border">
        <div className="flex gap-4 items-start">
          <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-1">
             {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a comment... (Ctrl+Enter to submit)"
              className="w-full bg-background border border-border rounded-[10px] px-4 py-3 text-text text-sm focus:outline-none focus:border-primary/50 transition-colors resize-y min-h-[100px]"
            />
            <div className="absolute right-3 bottom-3">
              <button
                type="submit"
                disabled={isCreating || !newComment.trim()}
                className="bg-primary hover:bg-primary-hover text-on-primary p-2 rounded-[8px] transition-colors disabled:opacity-50 shadow-sm"
              >
                {isCreating ? <Spinner className="animate-spin" size={16} /> : <PaperPlaneRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
