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

interface ActivityLog {
  id: number
  type: string
  userId: number
  memberNo: string
  userName: string
  createdAt: string
}

export default function ActivityLogsPage() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [memberNo, setMemberNo] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Load initial data
  useEffect(() => {
    loadLogs()
  }, [])

  async function loadLogs() {
    setIsLoading(true)
    const { data, error } = await getActivityLogs({
      startDate,
      endDate,
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
    setIsLoading(false)
  }

  async function handleFilter() {
    await loadLogs()
  }

  return (
    <div className="w-full max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold">Activity Logs</h1>

      <div className="mb-8">
        <h2 className="mb-2 text-lg font-medium">Filter Logs</h2>
        <div className="flex gap-4 mb-4">
          <DatePicker
            date={startDate}
            onSelect={setStartDate}
            placeholder="Start Date"
          />
          <DatePicker
            date={endDate}
            onSelect={setEndDate}
            placeholder="End Date"
          />
          <Input
            placeholder="Member Number"
            value={memberNo}
            onChange={(e) => setMemberNo(e.target.value)}
            className="w-[200px]"
          />
          <Button onClick={handleFilter} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Apply Filters'}
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Member #</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
              <TableCell>{log.memberNo}</TableCell>
              <TableCell>{log.userName}</TableCell>
              <TableCell>{log.type}</TableCell>
            </TableRow>
          ))}
          {logs.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No activity logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
