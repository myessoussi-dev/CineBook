import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original'

export default function HeroSection({ movies }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const navigate = useNavigate()

  const featured = movies?.slice(0, 5) || []
  const current = featured[activeIdx]

  useEffect(() => {
    if (featured.length < 2) return
    const timer = setInterval(() => {
      switchTo((activeIdx + 1) % featured.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [activeIdx, featured.length])

  function switchTo(idx) {
    if (idx === activeIdx || transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setActiveIdx(idx)
      setTransitioning(false)
    }, 300)
  }

  if (!current) return null

  const year = current.releaseDate?.split('-')[0]
  const hours = Math.floor(current.runtime / 60)
  const mins = current.runtime % 60

  return (
    <section style={{
      position: 'relative',
      height: '100vh',
      minHeight: '600px',
      maxHeight: '900px',
      overflow: 'hidden',
    }}>
      {/* Backdrop */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: transitioning ? 0 : 1,
        transition: 'opacity 0.5s ease',
      }}>
        <img
          key={current.id}
          src={`${BACKDROP_BASE}${current.backdropPath}`}
          alt={current.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />
        {/* Overlays */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(8,10,15,0.97) 0%, rgba(8,10,15,0.6) 55%, rgba(8,10,15,0.2) 100%)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(8,10,15,1) 0%, rgba(8,10,15,0.3) 40%, transparent 70%)',
        }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 40px 60px',
        maxWidth: '680px',
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'translateY(10px)' : 'translateY(0)',
        transition: 'all 0.4s ease',
      }}>
        {/* Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: 'var(--accent-hot)',
            animation: 'pulse-glow 2s infinite',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent-hot)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>À l'affiche maintenant</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(40px, 7vw, 80px)',
          lineHeight: 0.95,
          letterSpacing: '2px',
          color: 'var(--text-primary)',
          marginBottom: '16px',
          textShadow: '0 4px 40px rgba(0,0,0,0.5)',
        }}>
          {current.title}
        </h1>

        {/* Meta */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
            color: '#4ade80',
            fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            {current.voteAverage?.toFixed(1)}
          </span>
          <span style={{ color: 'var(--text-dim)' }}>·</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{year}</span>
          <span style={{ color: 'var(--text-dim)' }}>·</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {hours}h{mins > 0 ? `${mins}m` : ''}
          </span>
          {current.categories?.slice(0, 3).map(cat => (
            <span key={cat.id} style={{
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.04)',
            }}>
              {cat.name}
            </span>
          ))}
        </div>

        {/* Overview */}
        <p style={{
          fontSize: '15px',
          lineHeight: 1.7,
          color: 'var(--text-muted)',
          marginBottom: '32px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {current.overview}
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => navigate(`/api/movies/${current.id}`)}
            style={{
              background: 'var(--accent)',
              color: '#000',
              border: 'none',
              borderRadius: '10px',
              padding: '14px 28px',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(232,160,32,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Réserver maintenant
          </button>
          <button
            onClick={() => navigate(`/api/movies/${current.id}`)}
            style={{
              background: 'rgba(255,255,255,0.07)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '14px 22px',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
          >
            Voir les détails
          </button>
        </div>
      </div>

      {/* Hero nav dots */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '40px',
        zIndex: 10,
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}>
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => switchTo(i)}
            style={{
              width: i === activeIdx ? '28px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === activeIdx ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Thumbnail strip — right side */}
      <div style={{
        position: 'absolute',
        right: '40px',
        bottom: '32px',
        zIndex: 10,
        display: 'flex',
        gap: '10px',
      }}>
        {featured.map((m, i) => i !== activeIdx && (
          <div
            key={m.id}
            onClick={() => switchTo(i)}
            style={{
              width: '60px',
              height: '80px',
              borderRadius: '8px',
              overflow: 'hidden',
              cursor: 'pointer',
              opacity: 0.55,
              border: '1px solid rgba(255,255,255,0.1)',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.border = '1px solid var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '0.55'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)' }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w200${m.posterPath}`}
              alt={m.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
