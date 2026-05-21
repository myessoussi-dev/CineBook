import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isDetail = location.pathname.startsWith('/api/movies/')

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: scrolled ? '14px 40px' : '22px 40px',
      background: scrolled
        ? 'rgba(8, 10, 15, 0.92)'
        : 'linear-gradient(to bottom, rgba(8,10,15,0.85), transparent)',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        <div style={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 700,
          color: '#000',
          fontFamily: 'var(--font-display)',
          letterSpacing: '1px',
        }}>C</div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          letterSpacing: '3px',
          color: 'var(--text-primary)',
        }}>CINÉBOOK</span>
      </div>

      {/* Nav Links — desktop */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }} className="nav-links">
        {['Films', 'Séances', 'Offres', 'À propos'].map(item => (
          <span
            key={item}
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-muted)',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = 'var(--accent)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button style={{
          background: 'var(--bg-glass)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '9px 14px',
          color: 'var(--text-muted)',
          fontSize: '13px',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          Rechercher
        </button>
        <button style={{
          background: 'var(--accent)',
          border: 'none',
          borderRadius: '8px',
          padding: '9px 18px',
          color: '#000',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Connexion
        </button>
      </div>
    </nav>
  )
}
