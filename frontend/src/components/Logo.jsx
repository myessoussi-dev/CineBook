import { Link } from 'react-router-dom'
import './Logo.css'

export function LogoMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="logo-mark">
      <rect width="32" height="32" rx="8" fill="var(--brand)" />
      <rect x="9" y="9" width="5" height="14" rx="1.5" fill="var(--bg)" />
      <rect x="18" y="9" width="5" height="14" rx="1.5" fill="var(--bg)" opacity="0.45" />
    </svg>
  )
}

export default function Logo({ size = 32, onClick, className = '' }) {
  return (
    <Link to="/" onClick={onClick} className={`logo ${className}`} aria-label="CinéBook home">
      <LogoMark size={size} />
      <span className="logo-word">CinéBook</span>
    </Link>
  )
}
