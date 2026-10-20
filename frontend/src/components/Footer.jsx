import { Link } from 'react-router-dom'
import Logo from './Logo'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Logo size={28} />
          <p>Films à l'affiche, séances et réservation de places en ligne.</p>
        </div>

        <nav className="footer-links" aria-label="Pied de page">
          <Link to="/">Films</Link>
          <Link to="/seances">Séances</Link>
          <Link to="/login">Mon compte</Link>
        </nav>
      </div>

      <div className="container">
        <div className="footer-legal">
          <span>© {new Date().getFullYear()} CinéBook</span>
          <span>
            Données films fournies par{' '}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
