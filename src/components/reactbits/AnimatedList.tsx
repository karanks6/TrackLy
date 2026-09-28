import { motion, AnimatePresence } from "motion/react"
import type { ReactNode } from "react"

export function AnimatedList({
  children,
  className = "",
}: {
  children: ReactNode[]
  className?: string
}) {
  return (
    <ul className={`flex flex-col gap-2 ${className}`}>
      <AnimatePresence mode="popLayout">
        {children.map((child, index) => (
          <motion.li
            key={(child as any)?.key || index}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.05 }}
          >
            {child}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}
