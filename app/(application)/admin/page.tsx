'use client'

import { motion } from 'framer-motion'

export default function AdminPage() {
  return (
    <div className="w-full max-w-7xl">
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-3xl font-bold"
      >
        Admin Dashboard
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.12 }}
        className="text-muted-foreground"
      >
        Select a tab above to manage different aspects of the system.
      </motion.p>
    </div>
  )
}
