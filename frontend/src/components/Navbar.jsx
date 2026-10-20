import { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import Icon from './Icon'
import { POSTER_SMALL, formatReleaseDate } from '../utils/format'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [megaMenu, setMegaMenu] = useState(null) // 'upcoming' | null
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [upcoming, setUpcoming] = useState([])
  const [loadingUpcoming, setLoadingUpcoming] = useState(false)
  const navRef = useRef(null)
  const accountRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()

  const firstName = user?.fullName?.split(' ')[0]
  const initial = user?.fullName?.charAt(0).toUpperCase() || 'U'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fermer menus au changement de page
  useEffect(() => {
    setMegaMenu(null)
    setDrawerOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  // Clic en dehors : mega menu + menu compte
  useEffect(() => {
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setMegaMenu(null)
      if (accountRef.current && !accountRef.current.contains(e.target)) setDropdownOpen(false)
    }
    function handleKey(e) {
      if (e.key === 'Escape') { setMegaMenu(null); setDropdownOpen(false); setDrawerOpen(false) }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  // Bloquer le scroll de la page quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  async function loadUpcoming() {
    setLoadingUpcoming(true)
    try {
      const res = await fetch(`/api/movies/upcoming`)
      const data = await res.json()
      setUpcoming(Array.isArray(data) ? data : [])
    } catch { setUpcoming([]) }
    finally { setLoadingUpcoming(false) }
  }

  function toggleUpcoming() {
    if (megaMenu === 'upcoming') { setMegaMenu(null); return }
    setMegaMenu('upcoming')
    loadUpcoming()
  }

  function handleLogout() {
    logout()
    setDropdownOpen(false)
    setDrawerOpen(false)
    navigate('/')
  }

  function goToMovie(id) {
    setMegaMenu(null)
    setDrawerOpen(false)
    navigate(`/movies/${id}`)
  }

  const solid = scrolled || megaMenu || drawerOpen

  const upcomingContent = loadingUpcoming ? (
    <div className="upcoming-status"><div className="spinner" />Chargement…</div>
  ) : upcoming.length === 0 ? (
    <p className="upcoming-status">Aucun film annoncé pour le moment.</p>
  ) : (
    <ul className="upcoming-list scroll-x">
      {upcoming.slice(0, 10).map(movie => (
        <li key={movie.id}>
          <button type="button" className="upcoming-item" onClick={() => goToMovie(movie.id)}>
            <div className="upcoming-poster">
              {movie.posterPath && (
                <img src={`${POSTER_SMALL}${movie.posterPath}`} alt="" loading="lazy"
                  onError={e => { e.currentTarget.style.display = 'none' }} />
              )}
            </div>
            <span className="upcoming-title">{movie.title}</span>
            {movie.releaseDate && <span className="upcoming-date">Sortie le {formatReleaseDate(movie.releaseDate)}</span>}
          </button>
        </li>
      ))}
    </ul>
  )

  return (
    <header ref={navRef} className={`nav ${solid ? 'is-solid' : ''}`}>
      <div className="nav-bar container">
        <Logo />

        <nav className="nav-links" aria-label="Navigation principale">
          <NavLink to="/" end className="nav-link">Films</NavLink>
          <button type="button" className={`nav-link ${megaMenu === 'upcoming' ? 'is-open' : ''}`}
            aria-expanded={megaMenu === 'upcoming'} onClick={toggleUpcoming}>
            Prochainement
            <Icon name="chevron-down" size={14} strokeWidth={2.2} className="nav-caret" />
          </button>
          <NavLink to="/seances" className="nav-link">Séances</NavLink>
        </nav>

        <div className="nav-right">
          {isAuthenticated ? (
            <div className="account" ref={accountRef}>
              <button type="button" className="account-btn" aria-expanded={dropdownOpen} aria-haspopup="menu"
                onClick={() => setDropdownOpen(o => !o)}>
                <span className="avatar">{initial}</span>
                <span className="account-name">{firstName}</span>
                <Icon name="chevron-down" size={14} className="nav-caret" />
              </button>

              {dropdownOpen && (
                <div className="account-menu" role="menu">
                  <div className="account-head">
                    <p className="account-fullname">{user?.fullName}</p>
                    <p className="account-email">{user?.email}</p>
                  </div>
                  <button type="button" role="menuitem" className="account-item" disabled>
                    <Icon name="ticket" size={16} />Mes réservations<span className="soon">Bientôt</span>
                  </button>
                  <button type="button" role="menuitem" className="account-item" disabled>
                    <Icon name="user" size={16} />Mon profil<span className="soon">Bientôt</span>
                  </button>
                  <div className="account-sep" />
                  <button type="button" role="menuitem" className="account-item is-danger" onClick={handleLogout}>
                    <Icon name="log-out" size={16} />Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button type="button" className="btn btn-primary btn-sm nav-login" onClick={() => navigate('/login')}>
              Se connecter
            </button>
          )}

          <button type="button" className="nav-burger" aria-label={drawerOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={drawerOpen} onClick={() => setDrawerOpen(o => !o)}>
            <Icon name={drawerOpen ? 'x' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {/* Mega menu desktop */}
      {megaMenu === 'upcoming' && (
        <div className="mega">
          <div className="container">
            <div className="mega-head">
              <h3>Prochainement en salle</h3>
              <p>Les films annoncés pour les semaines à venir.</p>
            </div>
            {upcomingContent}
          </div>
        </div>
      )}

      {/* Menu mobile */}
      {drawerOpen && (
        <div className="drawer">
          <nav className="drawer-links" aria-label="Navigation mobile">
            <NavLink to="/" end className="drawer-link">Films à l'affiche</NavLink>
            <NavLink to="/seances" className="drawer-link">Séances</NavLink>
          </nav>

          <section className="drawer-section">
            <button type="button" className="drawer-link drawer-toggle" aria-expanded={megaMenu === 'upcoming'}
              onClick={toggleUpcoming}>
              Prochainement
              <Icon name="chevron-down" size={18} className="nav-caret" />
            </button>
            {megaMenu === 'upcoming' && <div className="drawer-upcoming">{upcomingContent}</div>}
          </section>

          <div className="drawer-foot">
            {isAuthenticated ? (
              <>
                <div className="drawer-user">
                  <span className="avatar avatar-lg">{initial}</span>
                  <div>
                    <p className="account-fullname">{user?.fullName}</p>
                    <p className="account-email">{user?.email}</p>
                  </div>
                </div>
                <button type="button" className="btn btn-ghost btn-block" onClick={handleLogout}>
                  <Icon name="log-out" size={16} />Se déconnecter
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => navigate('/login')}>Se connecter</button>
                <button type="button" className="btn btn-ghost btn-lg btn-block" onClick={() => navigate('/register')}>Créer un compte</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
