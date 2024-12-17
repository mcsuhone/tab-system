import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { categoryDisplayNames } from '@/lib/product-categories'
import { ProductCategory, Transaction } from '@/db/schema'
import { LogoutButton } from '@/components/logout-button'
import { ChangePasswordForm } from '@/components/account/change-password-form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

// Move client components to a separate file
import { StatsGrid } from './stats-grid'
import { RecentActivity } from './recent-activity'

export default async function ProfilePage() {
  const { user } = await auth()

  if (!user) {
    redirect('/login')
  }

  // Calculate total spent and group transactions by category
  const totalSpent = user.transactions.reduce(
    (sum: number, t: Transaction) => sum + t.amount,
    0
  )
  const categoryCount: Record<string, number> = {}
  user.transactions.forEach((t: Transaction) => {
    const category = t.product.category
    categoryCount[category] = (categoryCount[category] || 0) + 1
  })

  // Find favorite category
  const favoriteCategory = Object.entries(categoryCount).sort(
    (a, b) => b[1] - a[1]
  )[0]
  const favoriteCategoryPercentage = favoriteCategory
    ? Math.round((favoriteCategory[1] / user.transactions.length) * 100)
    : 0

  // Get recent transactions (15)
  const recentTransactions = [...user.transactions]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 15)

  // Get last order date
  const lastOrder = recentTransactions[0]
  const daysSinceLastOrder = lastOrder
    ? Math.round(
        (Date.now() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      )
    : null

  const stats = {
    lastOrder: {
      value:
        daysSinceLastOrder === null
          ? 'No orders yet'
          : `${daysSinceLastOrder} day${daysSinceLastOrder !== 1 ? 's' : ''} ago`,
      subtitle: lastOrder
        ? `${lastOrder.product.name}, ${lastOrder.amount.toFixed(2)}€`
        : undefined
    },
    favoriteCategory: {
      value: favoriteCategory
        ? categoryDisplayNames[favoriteCategory[0] as ProductCategory]
        : 'No orders yet',
      subtitle: favoriteCategory
        ? `${favoriteCategoryPercentage}% of all orders`
        : undefined
    },
    averageOrder: {
      value: `${
        user.transactions.length > 0
          ? (totalSpent / user.transactions.length).toFixed(2)
          : '0.00'
      }€`,
      subtitle: 'Per transaction'
    }
  }

  return (
    <>
      <div className="grid gap-8">
        {/* Profile Header */}
        <div className="flex items-start flex-wrap gap-6">
          <Avatar className="h-24 w-24">
            <AvatarFallback>
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <div className="flex gap-4 text-sm text-muted-foreground pt-2">
              <div>
                <strong className="text-foreground">
                  {user.transactions.length}
                </strong>{' '}
                Orders
              </div>
              <div>
                <strong className="text-foreground">
                  {totalSpent.toFixed(2)}€
                </strong>{' '}
                Spent
              </div>
            </div>
            <div className="pt-2">
              <ChangePasswordForm userId={user.id} />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-8">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Balance</p>
              <p className="text-1xl font-bold tabular-nums">
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

        <Separator />

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Recent Activity */}
        <RecentActivity transactions={recentTransactions} />
      </div>
    </>
  )
}
