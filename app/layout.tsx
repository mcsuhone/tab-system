import { Navbar } from '@/components/ui/navbar'
import '../styles/globals.css'

export const metadata = {
  title: 'Tab System',
  description: 'A system for managing tabs'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center p-10">
          {children}
        </main>
      </body>
    </html>
  )
}
