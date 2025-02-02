import { motion } from 'framer-motion'

export function TableRowMotion({
  children,
  index
}: {
  children: React.ReactNode
  index: number
}) {
  return (
    <motion.tr
      key={index}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.02,
        ease: 'easeOut'
      }}
      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
    >
      {children}
    </motion.tr>
  )
}
