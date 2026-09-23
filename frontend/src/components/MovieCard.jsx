import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

export default function MovieCard({ movie, index = 0 }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  const ratingColor = movie.voteAverage >= 7
    ? '#4ade80'
    : movie.voteAverage >= 5
    ? 'var(--accent)'
    : '#f87171'

  const year = movie.releaseDate?.split('-')[0]

  return (
    <div
      onClick={() => navigate(`/movies/${movie.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        cursor: 'pointer',
        aspectRatio: '2/3',
        background: 'var(--bg-card)',
        border: `1px solid ${hovered ? 'var(--border-hover)' : 'var(--border)'}`,
        transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: hovered
          ? '0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px var(--border-hover)'
          : '0 8px 24px rgba(0,0,0,0.3)',
        animationDelay: `${index * 0.06}s`,
        animationFillMode: 'both',
      }}
      className="fade-in"
    >
      {/* Poster Image */}
      <img
        src={`${POSTER_BASE}${movie.posterPath}`}
        alt={movie.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.5s ease',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
        }}
        loading="lazy"
        onError={e => {
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'flex'
        }}
      />

      {/* Fallback placeholder */}
      <div style={{
        display: 'none',
        position: 'absolute',
        inset: 0,
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-card)',
        flexDirection: 'column',
        gap: '12px',
        color: 'var(--text-dim)',
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/>
        </svg>
        <span style={{ fontSize: '12px' }}>{movie.title}</span>
      </div>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(8,10,15,0.98) 0%, rgba(8,10,15,0.5) 55%, rgba(8,10,15,0.1) 100%)'
          : 'linear-gradient(to top, rgba(8,10,15,0.92) 0%, rgba(8,10,15,0.15) 60%, transparent 100%)',
        transition: 'all 0.35s ease',
      }} />

      {/* Rating badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'rgba(8,10,15,0.85)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        padding: '5px 9px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        border: `1px solid ${ratingColor}40`,
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill={ratingColor} style={{ flexShrink: 0 }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: ratingColor, fontWeight: 700 }}>
          {movie.voteAverage?.toFixed(1)}
        </span>
      </div>

      {/* Bottom info */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px',
        transform: hovered ? 'translateY(0)' : 'translateY(4px)',
        transition: 'transform 0.35s ease',
      }}>
        {/* Categories */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
          {movie.categories?.slice(0, 2).map(cat => (
            <span key={cat.id} style={{
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(232,160,32,0.15)',
              color: 'var(--accent)',
              border: '1px solid rgba(232,160,32,0.25)',
              fontWeight: 500,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              {cat.name}
            </span>
          ))}
        </div>

        <h3 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          letterSpacing: '1px',
          lineHeight: 1.1,
          color: 'var(--text-primary)',
          marginBottom: '6px',
        }}>
          {movie.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {year}
          </span>
          {movie.runtime && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-dim)', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {Math.floor(movie.runtime / 60)}h{movie.runtime % 60 > 0 ? `${movie.runtime % 60}m` : ''}
              </span>
            </>
          )}
        </div>

        {/* CTA on hover */}
        <div style={{
          marginTop: '12px',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(6px)',
          transition: 'all 0.25s ease',
          pointerEvents: hovered ? 'auto' : 'none',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--accent)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}>
            <span>Voir les séances</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
