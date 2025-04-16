import { Download } from 'lucide-react'
import { exportToExcel } from '@/lib/export-utils'
import { AdminUser } from '@/db/schema'
import { Button } from '@/components/ui/button'
import * as React from 'react'

interface UsersExportButtonProps {
  users: AdminUser[]
  isLoading?: boolean
}

export function UsersExportButton({
  users,
  isLoading
}: UsersExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false)

  async function handleExportExcel() {
    setIsExporting(true)
    try {
      if (users.length === 0) return
      exportToExcel(
        users.map((u) => ({
          member_no: u.member_no,
          name: u.name,
          permission: u.permission,
          balance: u.balance
        })),
        `users-${new Date().toISOString()}`
      )
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExportExcel}
      disabled={isLoading || isExporting || users.length === 0}
      variant="ghost"
      size="icon"
      title="Export to excel"
      aria-label="Export to excel"
    >
      {isExporting ? (
        <div className="animate-spin h-4 w-4 border-2 border-current rounded-full border-t-transparent" />
      ) : (
        <Download className="h-4 w-4" />
      )}
    </Button>
  )
}
