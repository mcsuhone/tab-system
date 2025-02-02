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
import { BalanceText } from '@/components/balance-text'
import { scrollbarStyles } from '@/lib/scrollbar-styles'
import { cn } from '@/lib/utils'

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

  // Get last 50 transactions - include admin transactions here
  const recentTransactions = [...user.transactions]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 50)

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
          : daysSinceLastOrder === 0
            ? 'Today'
            : daysSinceLastOrder === 1
              ? 'Yesterday'
              : `${daysSinceLastOrder} days ago`,
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
              <BalanceText balance={user.balance} />
            </div>
            <LogoutButton />
          </div>
        </div>

        <Separator />

        {/* Mobile Layout */}
        <div
          className={cn(
            'md:hidden flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden',
            scrollbarStyles
          )}
        >
          <div className="w-full py-4">
            <StatsGrid stats={stats} />
          </div>
          <RecentActivity transactions={recentTransactions} />
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex md:flex-col md:flex-1 md:gap-8 md:min-h-0">
          <StatsGrid stats={stats} />
          <div
            className={cn(
              'flex-1 min-h-0 overflow-x-hidden overflow-y-auto',
              scrollbarStyles
            )}
          >
            <RecentActivity transactions={recentTransactions} />
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
