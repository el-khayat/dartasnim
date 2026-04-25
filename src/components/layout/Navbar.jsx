import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import logoNav from '../../assets/logo_nav_64.png'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Search, Menu, X, Globe } from 'lucide-react'
import useCartStore from '../../store/useCartStore'
import useProductStore, { searchProducts } from '../../store/useProductStore'
import useUIStore from '../../store/useUIStore'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const searchRef = useRef(null)
  const langRef = useRef(null)
  const debounceRef = useRef(null)

  const totalItems = useCartStore(s => s.getTotalItems())
  const products = useProductStore(s => s.products)
  const isMobileMenuOpen = useUIStore(s => s.isMobileMenuOpen)
  const toggleMobileMenu = useUIStore(s => s.toggleMobileMenu)
  const closeMobileMenu = useUIStore(s => s.closeMobileMenu)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    closeMobileMenu()
    setSearchOpen(false)
  }, [location.pathname, closeMobileMenu])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false)
        setSearchResults([])
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (value) => {
    setSearchQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        const results = searchProducts(products, value, i18n.language)
        setSearchResults(results.slice(0, 5))
      } else {
        setSearchResults([])
      }
    }, 200)
  }

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    setLangMenuOpen(false)
  }

  const langLabels = { en: '🇬🇧 EN', fr: '🇫🇷 FR', ar: '🇸🇦 AR' }

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/cart', label: t('nav.cart') },
  ]

  const isHomePage = location.pathname === '/'

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled || !isHomePage ? 'rgba(13,13,13,0.95)' : 'rgba(13,13,13,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(201,168,76,0.2)' : '1px solid rgba(201,168,76,0.08)',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img src={logoNav} alt="Dar Tasnim" style={{ height: '48px', width: 'auto' }} />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '2.5rem' }}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: location.pathname === link.to ? '#C9A84C' : '#F5F5F0',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = '#C9A84C'}
                onMouseLeave={e => { if (location.pathname !== link.to) e.target.style.color = '#F5F5F0' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {/* Search */}
            <div ref={searchRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                style={{
                  padding: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#F5F5F0',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Search size={20} />
              </button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      width: '300px',
                      backgroundColor: '#1A1A1A',
                      border: '1px solid rgba(201,168,76,0.2)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    }}
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => handleSearch(e.target.value)}
                      placeholder={t('nav.search_placeholder')}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: '#F5F5F0',
                        fontSize: '0.875rem',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    />
                    {searchResults.length > 0 && (
                      <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', maxHeight: '280px', overflowY: 'auto' }}>
                        {searchResults.map(product => (
                          <button
                            key={product.id}
                            onClick={() => {
                              navigate(`/product/${product.id}`)
                              setSearchOpen(false)
                              setSearchQuery('')
                              setSearchResults([])
                            }}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px 16px',
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1E1E1E'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <img src={product.images[0]} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                            <div>
                              <p style={{ fontSize: '0.875rem', color: '#F5F5F0', margin: 0 }}>
                                {product[`name_${i18n.language}`] || product.name_en}
                              </p>
                              <p style={{ fontSize: '0.75rem', color: '#C9A84C', margin: 0 }}>{product.price} MAD</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language */}
            <div ref={langRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                style={{
                  padding: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#F5F5F0',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Globe size={20} />
              </button>
              <AnimatePresence>
                {langMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      backgroundColor: '#1A1A1A',
                      border: '1px solid rgba(201,168,76,0.2)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      minWidth: '130px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    }}
                  >
                    {Object.entries(langLabels).map(([code, label]) => (
                      <button
                        key={code}
                        onClick={() => changeLanguage(code)}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '10px 16px',
                          fontSize: '0.875rem',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: i18n.language === code ? '#C9A84C' : '#F5F5F0',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1E1E1E'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              style={{
                position: 'relative',
                padding: '10px',
                color: '#F5F5F0',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#C9A84C',
                    color: '#0D0D0D',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden"
              style={{
                padding: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#F5F5F0',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
            style={{
              backgroundColor: '#1A1A1A',
              borderTop: '1px solid rgba(201,168,76,0.2)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '24px' }}>
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    display: 'block',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    padding: '12px 0',
                    textDecoration: 'none',
                    color: location.pathname === link.to ? '#C9A84C' : '#F5F5F0',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
