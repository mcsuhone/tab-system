'use client'

import React from 'react'
import { useState } from 'react'
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

interface ActivityLog {
  id: number
  user_id: number
  member_nro: string
  action: string
  timestamp: string
}

export default function ActivityLogsPage() {
  const { toast } = useToast()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [memberNo, setMemberNo] = useState('')

  async function handleFilter() {
    // TODO: Implement filtering logic
    toast({
      title: 'Not implemented',
      description: 'Filtering functionality will be added soon.',
      variant: 'destructive'
    })
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
          <Button onClick={handleFilter}>Apply Filters</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Member #</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              <TableCell>{log.member_nro}</TableCell>
              <TableCell>{log.action}</TableCell>
            </TableRow>
          ))}
          {logs.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                No activity logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
