import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, children, title, maxWidth = '32rem' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'relative',
              backgroundColor: '#1A1A1A',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '20px',
              maxWidth: maxWidth,
              width: '100%',
              margin: '0 16px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid rgba(201,168,76,0.12)',
            }}>
              {title && (
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.25rem', color: '#F5F5F0', margin: 0 }}>
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                style={{
                  padding: '6px', background: 'none', border: 'none',
                  color: '#888880', cursor: 'pointer', marginLeft: 'auto',
                  display: 'flex', alignItems: 'center',
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
