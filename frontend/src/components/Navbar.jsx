import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleLogout() {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: scrolled ? '14px 40px' : '22px 40px',
      background: scrolled ? 'rgba(8,10,15,0.92)' : 'linear-gradient(to bottom, rgba(8,10,15,0.85), transparent)',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
    }}>
      {/* Logo */}
      <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#000', fontFamily: 'var(--font-display)' }}>C</div>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '3px', color: 'var(--text-primary)' }}>CINÉBOOK</span>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        {['Films', 'Séances', 'Offres', 'À propos'].map(item => (
          <span key={item} style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--accent)'}
            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
          >{item}</span>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* <button style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 14px', color: 'var(--text-muted)', fontSize: '13px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          Rechercher
        </button> */}

        {isAuthenticated ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '7px 14px',
                color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#000' }}>
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </div>
              {user?.fullName?.split(' ')[0]}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '6px', minWidth: '180px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                animation: 'slideDown 0.2s ease', zIndex: 100,
              }}>
                <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>{user?.fullName}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{user?.email}</p>
                </div>
                {[
                  { label: 'Mes réservations', icon: '🎟️' },
                  { label: 'Mon profil', icon: '👤' },
                ].map(({ label, icon }) => (
                  <button key={label} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '9px 12px', borderRadius: '7px', border: 'none',
                    background: 'none', color: 'var(--text-muted)', fontSize: '13px',
                    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
                  >
                    <span>{icon}</span> {label}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', marginTop: '6px', paddingTop: '6px' }}>
                  <button onClick={handleLogout} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '9px 12px', borderRadius: '7px', border: 'none',
                    background: 'none', color: '#f87171', fontSize: '13px',
                    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <span>🚪</span> Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => navigate('/login')} style={{
            background: 'var(--accent)', border: 'none', borderRadius: '8px',
            padding: '9px 18px', color: '#000', fontSize: '13px', fontWeight: 600,
            letterSpacing: '0.5px', cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Connexion
          </button>
        )}
      </div>
    </nav>
  )
}
