import Logo from './Logo'
import './Footer.css'

const GITHUB_URL = 'https://github.com/myessoussi-dev'
const AUTHOR_URL = 'https://youssefess.dev'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo size={24} />
            <p>
              Movies, showtimes and seat booking.<br />
              Built by Youssef Essoussi.
            </p>
          </div>

          <nav className="footer-col" aria-label="About">
            <p className="footer-col-title">About</p>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href={AUTHOR_URL} target="_blank" rel="noopener noreferrer">Author</a>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} CinéBook</span>
          <span>
            Movie data from{' '}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">TMDB</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
