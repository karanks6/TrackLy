import { useState } from "react"
import { useComments, useCreateComment, useDeleteComment } from "@/features/comments/hooks"
import { useAuth } from "@/app/auth-provider"
import { motion, AnimatePresence } from "motion/react"
import { format } from "date-fns"
import { Trash2, Send, Loader2 } from "lucide-react"

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
      <h3 className="font-semibold text-text border-b border-border pb-4">
        Comments ({comments?.length || 0})
      </h3>
      
      <div className="space-y-4">
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
                className="bg-background rounded-lg border border-border p-4 shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                      {comment.author?.full_name?.charAt(0)}
                    </div>
                    <span className="font-medium text-sm text-text">{comment.author?.full_name}</span>
                    <span className="text-xs text-text-muted">
                      {format(new Date(comment.created_at), "MMM d, h:mm a")}
                    </span>
                  </div>
                  
                  {isOwnComment && (
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this comment?")) {
                          deleteComment(comment.id)
                        }
                      }}
                      disabled={isDeleting}
                      className="text-text-muted hover:text-red-500 transition-colors p-1 rounded hover:bg-red-500/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="text-text text-sm whitespace-pre-wrap ml-8">
                  {comment.body}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {comments?.length === 0 && (
          <div className="text-center text-text-muted py-8 text-sm bg-background rounded-lg border border-border border-dashed">
            No comments yet. Be the first to start the conversation!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 pt-4 border-t border-border">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a comment... (Ctrl+Enter to submit)"
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y min-h-[100px] text-sm"
          />
          <div className="absolute right-3 bottom-3">
            <button
              type="submit"
              disabled={isCreating || !newComment.trim()}
              className="bg-primary hover:bg-primary-hover text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-primary"
            >
              {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
