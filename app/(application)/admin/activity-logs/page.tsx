'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { DatePicker } from '@/components/ui/date-picker'
import { useToast } from '@/components/ui/use-toast'
import { getActivityLogs } from '@/app/actions/activity-logs'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ActivityLog {
  id: number
  type: string
  userId: number
  memberNo: string | null
  userName: string | null
  createdAt: Date
}

interface FilterButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  children: React.ReactNode
}

function FilterButton({
  className,
  active,
  children,
  ...props
}: FilterButtonProps) {
  return (
    <button
      className={cn(
        'w-full text-left block p-2 rounded-md text-sm transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        active && 'bg-accent text-accent-foreground',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02
    }
  }
}

const item = {
  hidden: {
    opacity: 0,
    y: -10,
    marginTop: 0
  },
  show: {
    opacity: 1,
    y: 0,
    marginTop: 16,
    transition: {
      type: 'spring',
      stiffness: 700,
      damping: 35,
      mass: 0.35
    }
  }
}

export default function ActivityLogsPage() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [memberNo, setMemberNo] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'today' | 'week' | 'month'
  >('all')

  useEffect(() => {
    loadLogs()
  }, [])

  async function loadLogs(filter?: 'today' | 'week' | 'month') {
    setIsLoading(true)
    try {
      let start = startDate
      let end = endDate

      if (filter) {
        const now = new Date()
        end = now
        switch (filter) {
          case 'today':
            start = new Date(now.setHours(0, 0, 0, 0))
            break
          case 'week':
            start = new Date(now.setDate(now.getDate() - 7))
            break
          case 'month':
            start = new Date(now.setMonth(now.getMonth() - 1))
            break
        }
        setStartDate(start)
        setEndDate(end)
        setActiveFilter(filter)
      } else {
        setActiveFilter('all')
      }

      const { data, error } = await getActivityLogs({
        startDate: start,
        endDate: end,
        memberNo: memberNo || undefined
      })

      if (error) {
        toast({
          variant: 'destructive',
          title: error.title,
          description: error.description
        })
      } else if (data) {
        setLogs(data)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold">Activity Logs</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterButton
          active={activeFilter === 'all'}
          onClick={() => loadLogs()}
        >
          All Time
        </FilterButton>
        <FilterButton
          active={activeFilter === 'today'}
          onClick={() => loadLogs('today')}
        >
          Today
        </FilterButton>
        <FilterButton
          active={activeFilter === 'week'}
          onClick={() => loadLogs('week')}
        >
          Last 7 Days
        </FilterButton>
        <FilterButton
          active={activeFilter === 'month'}
          onClick={() => loadLogs('month')}
        >
          Last 30 Days
        </FilterButton>
      </div>

      <div className="mb-8 flex flex-wrap gap-4">
        <DatePicker
          value={startDate}
          onChange={setStartDate}
          placeholder="Start date"
        />
        <DatePicker
          value={endDate}
          onChange={setEndDate}
          placeholder="End date"
        />
        <Input
          placeholder="Member number"
          value={memberNo}
          onChange={(e) => setMemberNo(e.target.value)}
          className="max-w-[200px]"
        />
        <Button onClick={() => loadLogs()} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Filter'}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-0"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Member #</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <motion.tr
                  key={log.id}
                  variants={item}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell>
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.type}</TableCell>
                  <TableCell>{log.memberNo}</TableCell>
                  <TableCell>{log.userName}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
