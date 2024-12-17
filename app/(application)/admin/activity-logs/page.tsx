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
  action: string
  details: any
  userId: number | null
  createdAt: Date
  memberNo: string | null
  userName: string | null
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
        'px-4 py-2 rounded-md text-sm transition-colors border',
        'hover:bg-accent hover:text-accent-foreground',
        active
          ? 'bg-accent text-accent-foreground border-accent'
          : 'bg-background border-input',
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
        now.setHours(23, 59, 59, 999) // Set to end of day
        end = now

        const startOfToday = new Date(now)
        startOfToday.setHours(0, 0, 0, 0)

        switch (filter) {
          case 'today':
            start = startOfToday
            break
          case 'week': {
            start = new Date(startOfToday)
            start.setDate(start.getDate() - 6) // -6 to include today
            break
          }
          case 'month': {
            start = new Date(startOfToday)
            start.setDate(start.getDate() - 29) // -29 to include today
            break
          }
        }
        setStartDate(undefined)
        setEndDate(undefined)
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

      <div className="mb-4 flex gap-2">
        <FilterButton
          active={activeFilter === 'all'}
          onClick={() => {
            setStartDate(undefined)
            setEndDate(undefined)
            loadLogs()
          }}
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
          date={startDate}
          onSelect={(date) => {
            setStartDate(date)
            setActiveFilter('all')
          }}
          placeholder="Start date"
        />
        <DatePicker
          date={endDate}
          onSelect={(date) => {
            setEndDate(date)
            setActiveFilter('all')
          }}
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
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Member #</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Details</TableHead>
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
                    {new Date(log.createdAt).toLocaleString('fi-FI', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.memberNo || '-'}</TableCell>
                  <TableCell>{log.userName || '-'}</TableCell>
                  <TableCell>
                    {typeof log.details === 'string'
                      ? log.details
                      : JSON.stringify(log.details, null, 2)}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
