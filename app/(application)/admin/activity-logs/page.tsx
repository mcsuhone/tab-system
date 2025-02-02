'use client'

import { getActivityLogs, getExportData } from '@/app/actions/activity-logs'
import { LoadingContainer } from '@/components/containers/loading-container'
import { TableRowMotion } from '@/components/containers/table-row-motion'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
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
import { exportToExcel } from '@/lib/export-utils'
import { scrollbarStyles } from '@/lib/scrollbar-styles'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Download } from 'lucide-react'
import React, { useCallback, useEffect, useState } from 'react'

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
  const [filtersModified, setFiltersModified] = useState(false)
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  const loadLogs = useCallback(
    async (start?: Date, end?: Date, member?: string) => {
      setIsLoading(true)
      try {
        const { data, error } = await getActivityLogs({
          startDate: start,
          endDate: end,
          memberNo: member || undefined
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
        setFiltersModified(false)
      } finally {
        setIsLoading(false)
      }
    },
    [toast]
  )

  const handleQuickFilter = useCallback(
    (filter: 'today' | 'week' | 'month') => {
      const now = new Date()
      const startOfDay = new Date(now)
      startOfDay.setHours(0, 0, 0, 0)

      const newStart = startOfDay
      const newEnd = now

      switch (filter) {
        case 'today':
          newEnd.setHours(23, 59, 59, 999)
          break
        case 'week':
          newStart.setDate(newStart.getDate() - 6)
          newEnd.setHours(23, 59, 59, 999)
          break
        case 'month':
          newStart.setDate(newStart.getDate() - 29)
          newEnd.setHours(23, 59, 59, 999)
          break
      }

      setStartDate(newStart)
      setEndDate(newEnd)
      setActiveFilter(filter)
      setFiltersModified(false)
      loadLogs(newStart, newEnd, memberNo)
    },
    [loadLogs, memberNo]
  )

  useEffect(() => {
    handleQuickFilter('today')
  }, [handleQuickFilter])

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

  const handleApplyFilters = useCallback(() => {
    loadLogs(startDate, endDate, memberNo)
  }, [loadLogs, startDate, endDate, memberNo])

  const handleClearFilters = useCallback(() => {
    setStartDate(undefined)
    setEndDate(undefined)
    setMemberNo('')
  }, [])

  return (
    <div className="flex flex-col h-full w-full">
      <div className="shrink-0 mb-8">
        <h1 className="ml-12 md:ml-0 text-2xl md:text-3xl font-bold">
          Activity Logs
        </h1>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <LoadingContainer isLoading={isLoading} className="h-full">
          <div className={cn('h-full w-full overflow-y-auto', scrollbarStyles)}>
            <div className="sticky top-0 bg-background z-10 pb-4 space-y-4 px-1">
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  <FilterButton
                    active={activeFilter === 'today'}
                    onClick={() => handleQuickFilter('today')}
                  >
                    Today
                  </FilterButton>
                  <FilterButton
                    active={activeFilter === 'week'}
                    onClick={() => handleQuickFilter('week')}
                  >
                    Last 7 Days
                  </FilterButton>
                  <FilterButton
                    active={activeFilter === 'month'}
                    onClick={() => handleQuickFilter('month')}
                  >
                    Last 30 Days
                  </FilterButton>
                </div>

                <div className="flex gap-2">
                  <Collapsible
                    open={isAdvancedOpen}
                    onOpenChange={setIsAdvancedOpen}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="text-muted-foreground">
                        Advanced Filters
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 ml-2 transition-transform',
                            isAdvancedOpen ? 'rotate-180' : ''
                          )}
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </Collapsible>
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

              <Collapsible
                open={isAdvancedOpen}
                onOpenChange={setIsAdvancedOpen}
              >
                <CollapsibleContent className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <DatePicker
                      date={startDate}
                      onSelect={(date) => {
                        setStartDate(date)
                        setFiltersModified(true)
                        setActiveFilter('all')
                      }}
                      placeholder="Start date"
                    />
                    <DatePicker
                      date={endDate}
                      onSelect={(date) => {
                        setEndDate(date)
                        setFiltersModified(true)
                        setActiveFilter('all')
                      }}
                      placeholder="End date"
                    />
                    <Input
                      placeholder="Member number"
                      value={memberNo}
                      onChange={(e) => {
                        setMemberNo(e.target.value)
                        setFiltersModified(true)
                      }}
                      className="max-w-[200px]"
                    />
                    <Button
                      onClick={handleApplyFilters}
                      disabled={!filtersModified || isLoading}
                    >
                      {isLoading ? 'Applying...' : 'Apply Filters'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      disabled={!filtersModified || isLoading}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
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
