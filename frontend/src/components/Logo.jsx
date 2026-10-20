import { Link } from 'react-router-dom'
import './Logo.css'

export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-mark">
      <rect width="64" height="64" rx="15" fill="var(--accent)" />
      <path fill="var(--bg)" d="M16 19h32a4 4 0 0 1 4 4v4.5a4.5 4.5 0 0 0 0 9V41a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4v-4.5a4.5 4.5 0 0 0 0-9V23a4 4 0 0 1 4-4z" />
      <path stroke="var(--accent)" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="0.1 5.2" d="M41 23.5v17" />
      <path fill="var(--accent)" d="M21.5 26.5l11 5.5-11 5.5z" />
    </svg>
  )
}

export default function Logo({ size = 32, onClick, className = '' }) {
  return (
    <Link to="/" onClick={onClick} className={`logo ${className}`} aria-label="CinéBook, accueil">
      <LogoMark size={size} />
      <span className="logo-word">CinéBook</span>
    </Link>
  )
}
