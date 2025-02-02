'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  index: number
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.3
    }
  })
}

function StatsCard({ title, value, subtitle, index }: StatsCardProps) {
  return (
    <motion.div
      custom={index}
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface StatsGridProps {
  stats: {
    lastOrder: { value: string; subtitle?: string }
    favoriteCategory: { value: string; subtitle?: string }
    averageOrder: { value: string; subtitle?: string }
  }
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 grid-cols-3">
      <StatsCard
        index={0}
        title="Last Order"
        value={stats.lastOrder.value}
        subtitle={stats.lastOrder.subtitle}
      />
      <StatsCard
        index={1}
        title="Favorite Category"
        value={stats.favoriteCategory.value}
        subtitle={stats.favoriteCategory.subtitle}
      />
      <StatsCard
        index={2}
        title="Average Order"
        value={stats.averageOrder.value}
        subtitle={stats.averageOrder.subtitle}
      />
    </div>
  )
}
