import { CartProvider } from '@/components/cart/cart-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/toaster'
import { AppSidebar } from './app-sidebar'
import { MobileMenu } from './mobile-menu'

export default async function ApplicationLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <SidebarProvider>
        <AppSidebar />

        <main className="flex-1 overflow-y-auto p-8 mt-6 space-y-4">
          <MobileMenu />
          {children}
        </main>
      </SidebarProvider>
      <Toaster />
    </CartProvider>
  )
}
