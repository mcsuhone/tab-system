import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getCurrentUser } from '@/lib/get-current-user'
import { redirect } from 'next/navigation'
import { categoryDisplayNames } from '@/lib/product-categories'
import { ProductCategory, Transaction } from '@/db/schema'
import { LogoutButton } from '@/components/logout-button'

export default async function ProfilePage() {
  const user = await getCurrentUser()

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

  // Get recent transactions
  const recentTransactions = [...user.transactions]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3)

  // Get last order date
  const lastOrder = recentTransactions[0]
  const daysSinceLastOrder = lastOrder
    ? Math.round(
        (Date.now() - lastOrder.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      )
    : null

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
                  €{totalSpent.toFixed(2)}
                </strong>{' '}
                Spent
              </div>
            </div>
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

        <Separator />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Order</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {daysSinceLastOrder === null
                  ? 'No orders yet'
                  : `${daysSinceLastOrder} day${daysSinceLastOrder !== 1 ? 's' : ''} ago`}
              </div>
              {lastOrder && (
                <p className="text-xs text-muted-foreground">
                  {lastOrder.product.name}, €{lastOrder.amount.toFixed(2)}
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Favorite Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {favoriteCategory
                  ? categoryDisplayNames[favoriteCategory[0] as ProductCategory]
                  : 'No orders yet'}
              </div>
              {favoriteCategory && (
                <p className="text-xs text-muted-foreground">
                  {favoriteCategoryPercentage}% of all orders
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Jotain tähän?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€€€€</div>
              <p className="text-xs text-muted-foreground">Rahaa</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => {
                const daysSince = Math.round(
                  (Date.now() - transaction.createdAt.getTime()) /
                    (1000 * 60 * 60 * 24)
                )

                return (
                  <div key={transaction.id} className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      🛒
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Ordered {transaction.product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {daysSince === 0
                          ? 'today'
                          : `${daysSince} day${daysSince !== 1 ? 's' : ''} ago`}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      €{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                )
              })}

              {recentTransactions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
