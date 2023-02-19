import Nav from '@/components/Nav'
import PrivateRoute from '@/components/PrivateRoute'
import AuthContextProvider from '@/context/AuthContext'
import '@/styles/globals.css'
import '@/styles/nprogress.css'

import { Dosis } from '@next/font/google'
import { Router, useRouter } from 'next/router'
import nProgress from 'nprogress'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

const dosis = Dosis({ subsets: ['latin'] })

export default function App({ Component, pageProps }) {
  // Router
  const { pathname } = useRouter()

  useEffect(() => {
    const handleStart = () => nProgress.start()
    const handleStop = () => nProgress.done()

    Router.events.on('routeChangeStart', handleStart)
    Router.events.on('routeChangeComplete', handleStop)
    Router.events.on('routeChangeError', handleStop)

    return () => {
      Router.events.off('routeChangeStart', handleStart)
      Router.events.off('routeChangeComplete', handleStop)
      Router.events.off('routeChangeError', handleStop)
    }
  }, [])

  return (
    <main className={dosis.className}>
      <AuthContextProvider>
        <Nav />
        {pathname === '/mypolls' || pathname === '/create' ? (
          <PrivateRoute>
            <Component {...pageProps} />
          </PrivateRoute>
        ) : (
          <Component {...pageProps} />
        )}
      </AuthContextProvider>
      <Toaster />
    </main>
  )
}
