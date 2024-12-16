import { CartProvider } from '@/components/cart/cart-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { AppSidebar } from './app-sidebar'
import { MobileMenu } from './mobile-menu'
import { PageContainer } from '@/components/containers/page-container'

export default async function ApplicationLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <SidebarProvider>
        <AppSidebar />

        <PageContainer>
          <MobileMenu />
          {children}
        </PageContainer>
      </SidebarProvider>
      <Toaster />
    </CartProvider>
  )
}
