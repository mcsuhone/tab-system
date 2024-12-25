import { CartProvider } from '@/components/cart/cart-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { AppSidebar } from './app-sidebar'
import { MobileMenu } from './mobile-menu'
import { PageContainer } from '@/components/containers/page-container'
import { auth } from '@/lib/auth'
import { SearchProvider } from '@/components/search/search-provider'

export default async function ApplicationLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { user } = await auth()

  return (
    <div className="fixed inset-0 overflow-x-hidden">
      <SearchProvider>
        <CartProvider>
          <SidebarProvider>
            <div className="relative flex h-full">
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
