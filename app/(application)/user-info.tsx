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
      <Card className={cn('p-6 space-y-4', className)}>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Not signed in
          </h2>
        </div>
      </Card>
    )
  }

  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-center flex-wrap gap-6">
        <Avatar className="h-12 w-12">
          <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
        </div>
        <div className="ml-auto flex items-center gap-8">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Balance</p>
            <p className="text-2xl font-bold tabular-nums">
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
