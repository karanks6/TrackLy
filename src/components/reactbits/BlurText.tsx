import { motion, useInView } from "motion/react"
import { useRef } from "react"

export function BlurText({
  text,
  delay = 0,
  className = "",
}: {
  text: string
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const words = text.split(" ")

  return (
    <div ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0, y: 10 }}
          animate={isInView ? { filter: "blur(0px)", opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: delay + i * 0.05,
          }}
          className="mr-2 last:mr-0 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}
