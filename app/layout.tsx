import { ThemeProvider } from '@/components/theme-provider'
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
      <head>
        <link rel="icon" href="/jalostajat_logo.svg" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
