'use client'

import {
  getActivityLogs,
  exportActivityLogs,
  getExportData
} from '@/app/actions/activity-logs'
import { LoadingContainer } from '@/components/containers/loading-container'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useEffect, useState } from 'react'
import { scrollbarStyles } from '@/lib/scrollbar-styles'
import { TableRowMotion } from '@/components/containers/table-row-motion'
import { exportToExcel } from '@/lib/export-utils'
import { Download } from 'lucide-react'

interface ActivityLog {
  id: number
  action: string
  details: Record<string, unknown>
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
  const [isExporting, setIsExporting] = useState(false)
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'today' | 'week' | 'month'
  >('today')

  const loadLogs = useCallback(
    async (filter?: 'today' | 'week' | 'month') => {
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
          setLogs(data as ActivityLog[])
        }
      } finally {
        setIsLoading(false)
      }
    },
    [startDate, endDate, memberNo, toast]
  )

  const handleExportExcel = useCallback(async () => {
    setIsExporting(true)
    try {
      const data = await getExportData({
        startDate,
        endDate,
        memberNo: memberNo || undefined
      })

      if (data) {
        exportToExcel(
          data.map((item) => ({
            ...item,
            timestamp: new Date(item.timestamp).toLocaleString('fi-FI', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })
          })),
          `activity-logs-${new Date().toISOString()}`
        )
      }
    } finally {
      setIsExporting(false)
    }
  }, [startDate, endDate, memberNo])

  useEffect(() => {
    loadLogs('today')
  }, [loadLogs])

  return (
    <div className="flex flex-col h-full w-full">
      <div className="shrink-0 mb-8">
        <h1 className="text-3xl font-bold">Activity Logs</h1>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <LoadingContainer isLoading={isLoading} className="h-full">
          <div className={cn('h-full overflow-y-auto', scrollbarStyles)}>
            <div className="sticky top-0 bg-background z-10 pb-4 space-y-4">
              <div className="flex gap-2">
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
              </div>

              <div className="flex flex-wrap gap-4 bg-background">
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
                <Button
                  onClick={handleExportExcel}
                  disabled={isLoading || isExporting}
                  variant="outline"
                >
                  {isExporting ? (
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-current rounded-full border-t-transparent" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isExporting ? 'Exporting...' : 'Export Excel'}
                </Button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key="activity-logs"
                variants={container}
                initial="hidden"
                animate="show"
                exit="hidden"
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
                    {logs.map((log, index) => (
                      <TableRowMotion key={log.id} index={index}>
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
                      </TableRowMotion>
                    ))}
                  </TableBody>
                </Table>

                {logs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No activity logs found
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </LoadingContainer>
      </div>
    </div>
  )
}
