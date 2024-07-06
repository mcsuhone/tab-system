// pages/_app.js
import { useEffect, PropsWithChildren } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'
import { AppProps } from 'next/app'
import { Navbar } from '@/components/ui/navbar'

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    const localStorageValue = localStorage.getItem('user')

    if (!localStorageValue) {
      router.push('/')
    }
  }, [router])

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center p-10">
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default App
