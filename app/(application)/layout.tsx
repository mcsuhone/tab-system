import { CartProvider } from '@/components/cart/cart-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { AppSidebar } from './app-sidebar'
import { MobileMenu } from './mobile-menu'
import { PageContainer } from '@/components/containers/page-container'
import { auth } from '@/lib/auth'

export default async function ApplicationLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { user } = await auth()

  return (
    <CartProvider>
      <SidebarProvider>
        <AppSidebar isAdmin={user?.permission === 'admin'} />
        <PageContainer>
          <div className="flex flex-col h-full">
            <MobileMenu />
            {children}
          </div>
        </PageContainer>
      </SidebarProvider>
    </CartProvider>
  )
}
