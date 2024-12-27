import { CartProvider } from '@/components/cart/cart-provider'
import { SearchProvider } from '@/components/search/search-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'
import { AppSidebar } from './app-sidebar'
import { MobileMenu } from './mobile-menu'

export default async function ApplicationLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { user } = await auth()

  return (
    <div className="overflow-x-hidden">
      <SearchProvider>
        <CartProvider>
          <SidebarProvider>
            <div className="relative flex h-full w-full">
              <AppSidebar isAdmin={user?.permission === 'admin'} />
              <MobileMenu />
              <div className="flex flex-col flex-1 w-full overflow-y-auto">
                {children}
              </div>
            </div>
          </SidebarProvider>
        </CartProvider>
      </SearchProvider>
    </div>
  )
}
