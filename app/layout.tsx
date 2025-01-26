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
  description: 'Keep track of organization member balances'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={manrope.className} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon-32x32.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
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
