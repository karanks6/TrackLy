import { useEffect } from "react"
import { motion, useSpring, useTransform } from "motion/react"

export function CountUp({
  to,
  className = "",
  duration = 2,
}: {
  to: number
  className?: string
  duration?: number
}) {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 })
  const display = useTransform(spring, (v) => Math.round(v))
  
  useEffect(() => {
    spring.set(to)
  }, [spring, to])

  return <motion.span className={className}>{display}</motion.span>
}
