import { Providers } from './providers'
import '../styles/globals.css'
import { Manrope } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'

// Initialize the font
const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap'
})

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
    <html lang="en" className={manrope.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/jalostajat_logo.svg" />
      </head>
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
