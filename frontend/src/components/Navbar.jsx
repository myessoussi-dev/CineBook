import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
function formatDay(iso) {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === today.toDateString()) return "Aujourd'hui"
  if (d.toDateString() === tomorrow.toDateString()) return 'Demain'
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })
}
function formatReleaseDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
function groupByDay(sessions) {
  const map = {}
  sessions.forEach(s => {
    const key = new Date(s.startTime).toDateString()
    if (!map[key]) map[key] = []
    map[key].push(s)
  })
  return Object.entries(map)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .slice(0, 3)
    .map(([, items]) => ({ label: formatDay(items[0].startTime), sessions: items }))
}

function getRoomFormat(name = '') {
  const n = name.toUpperCase()
  if (n.includes('IMAX')) return 'IMAX'
  if (n.includes('4DX')) return '4DX'
  if (n.includes('VIP')) return 'VIP'
  return '2D'
}

const FORMAT_COLORS = { IMAX: '#60a5fa', '4DX': '#a78bfa', VIP: '#e8a020', '2D': '#7a8394' }

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [megaMenu, setMegaMenu] = useState(null) // 'seances' | 'films' | null
  const [sessions, setSessions] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(false)
  const [loadingUpcoming, setLoadingUpcoming] = useState(false)
  const megaRef = useRef(null)
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fermer le mega menu si clic en dehors
  useEffect(() => {
    function handleClick(e) {
      if (megaRef.current && !megaRef.current.contains(e.target)) {
        setMegaMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function openSeances() {
    if (megaMenu === 'seances') { setMegaMenu(null); return }
    setMegaMenu('seances')
    setLoadingSessions(true)
    try {
      const res = await fetch(`/api/sessions/movies`)
      const data = await res.json()
      setSessions(Array.isArray(data) ? data : [])
    } catch { setSessions([]) }
    finally { setLoadingSessions(false) }
  }

  async function openFilms() {
    if (megaMenu === 'films') { setMegaMenu(null); return }
    setMegaMenu('films')
    setLoadingUpcoming(true)
    try {
      const res = await fetch(`/api/movies/upcoming`)
      const data = await res.json()
      setUpcoming(Array.isArray(data) ? data : [])
    } catch { setUpcoming([]) }
    finally { setLoadingUpcoming(false) }
  }

  function handleLogout() {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  const groupedSessions = groupByDay(sessions)

  return (
    <nav ref={megaRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      padding: scrolled ? '14px 40px' : '22px 40px',
      background: scrolled ? 'rgba(8,10,15,0.95)' : 'linear-gradient(to bottom, rgba(8,10,15,0.85), transparent)',
      backdropFilter: scrolled || megaMenu ? 'blur(16px)' : 'none',
      borderBottom: scrolled || megaMenu ? '1px solid rgba(255,255,255,0.05)' : 'none',
      transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
    }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <div onClick={() => { navigate('/'); setMegaMenu(null) }}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700, color: '#000', fontFamily: 'var(--font-display)' }}>C</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '3px', color: 'var(--text-primary)' }}>CINÉBOOK</span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
          {/* Films */}
          <span
            onClick={openFilms}
            style={{
              fontSize: '13px', fontWeight: 500,
              color: megaMenu === 'films' ? 'var(--accent)' : 'var(--text-muted)',
              letterSpacing: '1px', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'color 0.2s',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => { if (megaMenu !== 'films') e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            Films
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ transform: megaMenu === 'films' ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </span>

          {/* Séances */}
          <span
            onClick={openSeances}
            style={{
              fontSize: '13px', fontWeight: 500,
              color: megaMenu === 'seances' ? 'var(--accent)' : 'var(--text-muted)',
              letterSpacing: '1px', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'color 0.2s',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => { if (megaMenu !== 'seances') e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            Séances
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ transform: megaMenu === 'seances' ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </span>

          {['Offres', 'À propos'].map(item => (
            <span key={item} style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >{item}</span>
          ))}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button style={{ background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 14px', color: 'var(--text-muted)', fontSize: '13px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Rechercher
          </button>

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropdownOpen(o => !o)} style={{
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
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '6px', minWidth: '180px', boxShadow: '0 16px 40px rgba(0,0,0,0.4)', animation: 'slideDown 0.2s ease', zIndex: 100 }}>
                  <div style={{ padding: '10px 12px 8px', borderBottom: '1px solid var(--border)', marginBottom: '6px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>{user?.fullName}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>{user?.email}</p>
                  </div>
                  {[{ label: 'Mes réservations', icon: '🎟️' }, { label: 'Mon profil', icon: '👤' }].map(({ label, icon }) => (
                    <button key={label} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '7px', border: 'none', background: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
                    ><span>{icon}</span>{label}</button>
                  ))}
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: '6px', paddingTop: '6px' }}>
                    <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 12px', borderRadius: '7px', border: 'none', background: 'none', color: '#f87171', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    ><span>🚪</span>Se déconnecter</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/login')} style={{ background: 'var(--accent)', border: 'none', borderRadius: '8px', padding: '9px 18px', color: '#000', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >Connexion</button>
          )}
        </div>
      </div>

      {/* ── Mega menu ── */}
      {megaMenu && (
        <div style={{
          marginTop: '16px',
          background: 'rgba(13,17,23,0.98)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          padding: '28px 32px',
          animation: 'slideDown 0.2s ease',
          maxHeight: '480px',
          overflow: 'hidden',
        }}>

          {/* ── SÉANCES ── */}
          {megaMenu === 'seances' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>Disponibles maintenant</p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px', color: 'var(--text-primary)' }}>SÉANCES DU MOMENT</h3>
                </div>
              </div>

              {loadingSessions ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  Chargement...
                </div>
              ) : sessions.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Aucune séance disponible pour le moment.</p>
              ) : (
                <div style={{ display: 'flex', gap: '32px', overflowX: 'auto' }}>
                  {groupedSessions.map(({ label, sessions: daySessions }) => (
                    <div key={label} style={{ minWidth: '220px', flex: '0 0 auto' }}>
                      <p style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px', textTransform: 'capitalize' }}>
                        {label}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {daySessions.slice(0, 5).map(s => {
                          const fmt = getRoomFormat(s.room?.name)
                          return (
                            <div
                              key={s.id}
                              onClick={() => {
                                setMegaMenu(null)
                                navigate(`/movies/${s.movie?.id}/sessions/${s.id}/seats`, {
                                  state: { session: s, movie: s.movie }
                                })
                              }}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 14px', borderRadius: '8px',
                                border: '1px solid var(--border)',
                                background: 'rgba(255,255,255,0.02)',
                                cursor: 'pointer', transition: 'all 0.15s',
                                gap: '10px',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(232,160,32,0.05)' }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {s.movie?.posterPath && (
                                  <img src={`${POSTER_BASE}${s.movie.posterPath}`} alt={s.movie?.title}
                                    style={{ width: 28, height: 40, objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                                )}
                                <div>
                                  <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                                    {s.movie?.title}
                                  </p>
                                  <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{s.room?.name}</p>
                                </div>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                  {formatTime(s.startTime)}
                                </span>
                                <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '3px', color: FORMAT_COLORS[fmt], background: `${FORMAT_COLORS[fmt]}18`, border: `1px solid ${FORMAT_COLORS[fmt]}30`, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                                  {fmt}
                                </span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── FILMS À VENIR ── */}
          {megaMenu === 'films' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>Prochainement</p>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '2px', color: 'var(--text-primary)' }}>FILMS À VENIR</h3>
              </div>

              {loadingUpcoming ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
                  Chargement...
                </div>
              ) : upcoming.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Aucun film à venir pour le moment.</p>
              ) : (
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {upcoming.slice(0, 8).map(movie => (
                    <div
                      key={movie.id}
                      onClick={() => { setMegaMenu(null); navigate(`/movies/${movie.id}`) }}
                      style={{
                        flex: '0 0 140px', cursor: 'pointer',
                        transition: 'transform 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ position: 'relative', marginBottom: '10px' }}>
                        <img
                          src={`${POSTER_BASE}${movie.posterPath}`}
                          alt={movie.title}
                          style={{ width: '100%', aspectRatio: '2/3', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)', display: 'block' }}
                          onError={e => e.target.style.display = 'none'}
                        />
                        {/* Release date badge */}
                        <div style={{
                          position: 'absolute', bottom: '6px', left: '6px', right: '6px',
                          background: 'rgba(8,10,15,0.85)', backdropFilter: 'blur(8px)',
                          borderRadius: '5px', padding: '3px 6px', textAlign: 'center',
                        }}>
                          <p style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                            {formatReleaseDate(movie.releaseDate)}
                          </p>
                        </div>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.3, marginBottom: '4px' }}>
                        {movie.title}
                      </p>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {movie.categories?.slice(0, 2).map(c => (
                          <span key={c.id} style={{ fontSize: '10px', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '3px', padding: '1px 5px' }}>
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </nav>
  )
}
