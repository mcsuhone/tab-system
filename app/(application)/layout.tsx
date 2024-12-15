import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'

export default function ApplicationLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  )
}
