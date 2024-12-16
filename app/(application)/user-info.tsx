import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import type { User } from '@/db/schema'
import { cn } from '@/lib/utils'
import { LogoutButton } from '@/components/logout-button'

interface UserInfoProps {
  user: User | null
  className?: string
}

export default function UserInfo({ user, className }: UserInfoProps) {
  if (!user) {
    return (
      <Card className={cn('p-3', className)}>
        <div className="text-sm font-medium">Not signed in</div>
      </Card>
    )
  }

  return (
    <Card className={cn('p-3', className)}>
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 text-xs">
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-medium truncate">{user.name}</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="text-sm font-semibold tabular-nums">
              {user.balance.toLocaleString('en-GB', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
              €
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </Card>
  )
}
