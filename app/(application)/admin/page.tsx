import { getActivityLogs } from '@/app/actions/activity-logs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default async function AdminActivityPage() {
  const { data: logs = [] } = await getActivityLogs()

  return (
    <div className="w-full max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold">Activity</h1>

      <div className="space-y-4">
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
                <TableCell>
                  {new Date(log.createdAt).toLocaleString()}
                </TableCell>
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
    </div>
  )
}
