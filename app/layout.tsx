import { Providers } from './providers'
import '../styles/globals.css'
import { Manrope } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { Metadata } from 'next/types'

// Initialize the font
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Tab System',
  description: 'Keep track of organization member balances',
  icons: {
    icon: '/favicon-32x32.svg'
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={manrope.className} suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
