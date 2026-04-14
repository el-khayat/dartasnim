import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const location = useLocation()
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const isAdmin = location.pathname.startsWith('/admin')
  const isHome = location.pathname === '/'

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0D0D0D', color: '#F5F5F0' }}>
      {!isAdmin && <Navbar />}
      <main style={{ flex: 1, paddingTop: !isAdmin ? (isHome ? '0px' : '72px') : '0px' }}>
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
    </div>
  )
}
