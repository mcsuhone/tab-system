import { ChangePasswordForm } from '@/components/account/change-password-form'
import { LogoutButton } from '@/components/logout-button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ProductCategory, Transaction } from '@/db/schema'
import { auth } from '@/lib/auth'
import { categoryDisplayNames } from '@/lib/product-categories'
import { redirect } from 'next/navigation'

// Move client components to a separate file
import { RecentActivity } from './recent-activity'
import { StatsGrid } from './stats-grid'
import { PageContainer } from '@/components/containers/page-container'

export default async function ProfilePage() {
  const { user } = await auth()

  if (!user) {
    redirect('/login')
  }

  // Filter out admin transactions for calculations
  const regularTransactions = user.transactions.filter(
    (t: Transaction) => !t.product.isAdminProduct
  )

  // Calculate total spent and group transactions by category
  const totalSpent = regularTransactions.reduce(
    (sum: number, t: Transaction) => sum + t.amount,
    0
  )
  const categoryCount: Record<string, number> = {}
  regularTransactions.forEach((t: Transaction) => {
    const category = t.product.category
    categoryCount[category] = (categoryCount[category] || 0) + 1
  })

  // Find favorite category
  const favoriteCategory = Object.entries(categoryCount).sort(
    (a, b) => b[1] - a[1]
  )[0]
  const favoriteCategoryPercentage = favoriteCategory
    ? Math.round((favoriteCategory[1] / regularTransactions.length) * 100)
    : 0

  // Get recent transactions (15) - include admin transactions here
  const recentTransactions = [...user.transactions]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 15)

  // Get last order date - from regular transactions only
  const lastRegularTransaction = regularTransactions.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  )[0]
  const daysSinceLastOrder = lastRegularTransaction
    ? Math.round(
        (Date.now() - lastRegularTransaction.createdAt.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null

  const stats = {
    lastOrder: {
      value:
        daysSinceLastOrder === null
          ? 'No orders yet'
          : `${daysSinceLastOrder} day${daysSinceLastOrder !== 1 ? 's' : ''} ago`,
      subtitle: lastRegularTransaction
        ? `${lastRegularTransaction.product.name}, ${lastRegularTransaction.amount.toFixed(2)}€`
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
        regularTransactions.length > 0
          ? (totalSpent / regularTransactions.length).toFixed(2)
          : '0.00'
      }€`,
      subtitle: 'Per transaction'
    }
  }

  return (
    <PageContainer>
      <div className="grid gap-8 h-full">
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
                  {regularTransactions.length}
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
        <div className="h-full overflow-y-auto">
          <RecentActivity transactions={recentTransactions} />
        </div>
      </div>
    </PageContainer>
  )
}
