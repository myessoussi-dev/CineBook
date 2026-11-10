import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import Icon from './Icon'
import './Navbar.css'

const isComingSoon = loc => loc.search.includes('tab=coming-soon')
const LINKS = [
  { to: '/#movies', label: 'Movies', match: loc => (loc.pathname === '/' && !isComingSoon(loc)) || loc.pathname.startsWith('/movies/') },
  { to: '/showtimes', label: 'Showtimes', match: loc => loc.pathname === '/showtimes' || loc.pathname === '/seances' },
  { to: '/?tab=coming-soon#movies', label: 'Coming soon', match: loc => loc.pathname === '/' && isComingSoon(loc) },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const accountRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()

  const firstName = user?.fullName?.split(' ')[0]
  const initial = user?.fullName?.charAt(0).toUpperCase() || 'U'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus on navigation
  useEffect(() => {
    setDrawerOpen(false)
    setDropdownOpen(false)
  }, [location.pathname, location.search, location.hash])

  useEffect(() => {
    function handleClick(e) {
      if (accountRef.current && !accountRef.current.contains(e.target)) setDropdownOpen(false)
    }
    function handleKey(e) {
      if (e.key === 'Escape') { setDropdownOpen(false); setDrawerOpen(false) }
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [])

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  function handleLogout() {
    logout()
    setDropdownOpen(false)
    setDrawerOpen(false)
    navigate('/')
  }

  function goSearch() {
    navigate({ pathname: '/', hash: '#search' })
  }

  return (
    <header className={`nav ${scrolled || drawerOpen ? 'is-solid' : ''}`}>
      <div className="nav-bar container">
        <Logo size={28} />

        <nav className="nav-links" aria-label="Main">
          {LINKS.map(l => (
            <Link key={l.label} to={l.to} className={`nav-link ${l.match(location) ? 'active' : ''}`}
              aria-current={l.match(location) ? 'page' : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="nav-right">
          <button type="button" className="icon-btn nav-search" aria-label="Search movies" onClick={goSearch}>
            <Icon name="search" size={19} />
          </button>

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
                    <Icon name="ticket" size={16} />My bookings<span className="soon">Soon</span>
                  </button>
                  <button type="button" role="menuitem" className="account-item" disabled>
                    <Icon name="user" size={16} />Profile<span className="soon">Soon</span>
                  </button>
                  <div className="account-sep" />
                  <button type="button" role="menuitem" className="account-item is-danger" onClick={handleLogout}>
                    <Icon name="log-out" size={16} />Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button type="button" className="btn btn-primary btn-sm nav-login" onClick={() => navigate('/login')}>
              Sign in
            </button>
          )}

          <button type="button" className="nav-burger" aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={drawerOpen} onClick={() => setDrawerOpen(o => !o)}>
            <Icon name={drawerOpen ? 'x' : 'menu'} size={22} />
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div className="drawer">
          <nav className="drawer-links" aria-label="Mobile">
            {LINKS.map((l, i) => (
              <Link key={l.label} to={l.to} style={{ '--i': i }} className={`drawer-link ${l.match(location) ? 'active' : ''}`}>
                {l.label}
                <Icon name="chevron-right" size={18} />
              </Link>
            ))}
          </nav>

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
                <button type="button" className="btn btn-ghost btn-lg btn-block" onClick={handleLogout}>
                  <Icon name="log-out" size={16} />Sign out
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => navigate('/login')}>Sign in</button>
                <button type="button" className="btn btn-ghost btn-lg btn-block" onClick={() => navigate('/register')}>Create an account</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
