import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMovieSessions } from '../hooks/useMovies'

const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original'
const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

function formatTime(isoString) {
  const d = new Date(isoString)
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(isoString) {
  const d = new Date(isoString)
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

function groupByDate(sessions) {
  const map = {}
  sessions.forEach(s => {
    const key = new Date(s.startTime).toDateString()
    if (!map[key]) map[key] = []
    map[key].push(s)
  })
  return Object.entries(map).map(([key, items]) => ({
    label: formatDate(items[0].startTime),
    sessions: items,
  }))
}

function getRoomFormat(roomName = '') {
  const n = roomName.toUpperCase()
  if (n.includes('IMAX')) return 'IMAX'
  if (n.includes('4DX')) return '4DX'
  if (n.includes('VIP')) return 'VIP'
  return '2D'
}

const FORMAT_COLORS = {
  'IMAX': '#60a5fa',
  '4DX': '#a78bfa',
  'VIP': '#e8a020',
  '2D': '#7a8394',
}

export default function MovieDetail({ movie, loading, error }) {
  const navigate = useNavigate()
  const { sessions, loading: sessLoading } = useMovieSessions(movie?.id)
  const [selectedDate, setSelectedDate] = useState(0)

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>Chargement...</span>
    </div>
  )

  if (error || !movie) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
      <span style={{ fontSize: '48px' }}>🎬</span>
      <p style={{ color: 'var(--text-muted)' }}>{error || 'Film introuvable'}</p>
      <button onClick={() => navigate('/')} style={{ background: 'var(--accent)', color: '#000', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer' }}>
        Retour à l'accueil
      </button>
    </div>
  )

  const year = movie.releaseDate?.split('-')[0]
  const hours = Math.floor(movie.runtime / 60)
  const mins = movie.runtime % 60
  const groupedDates = groupByDate(sessions)
  const activeDateGroup = groupedDates[selectedDate]

  return (
    <div style={{ minHeight: '100vh', animation: 'fadeIn 0.4s ease' }}>

      {/* Backdrop */}
      <div style={{ position: 'relative', height: '70vh', overflow: 'hidden' }}>
        <img
          src={`${BACKDROP_BASE}${movie.backdropPath}`}
          alt={movie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(8,10,15,0.9) 0%, rgba(8,10,15,0.4) 60%, rgba(8,10,15,0.2) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,10,15,1) 0%, rgba(8,10,15,0.0) 50%)' }} />

        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute', top: '90px', left: '40px',
            background: 'rgba(8,10,15,0.7)', backdropFilter: 'blur(10px)',
            border: '1px solid var(--border)', borderRadius: '8px',
            color: 'var(--text-primary)', padding: '8px 14px',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Retour
        </button>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1300px', margin: '0 auto', padding: '0 40px 80px',
        marginTop: '-220px', position: 'relative', zIndex: 10,
        display: 'grid', gridTemplateColumns: '260px 1fr', gap: '48px', alignItems: 'start',
      }}>

        {/* Poster */}
        <div>
          <img
            src={`${POSTER_BASE}${movie.posterPath}`}
            alt={movie.title}
            style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: '0 30px 80px rgba(0,0,0,0.7)', border: '1px solid var(--border)' }}
          />
          {movie.videoKey && (
            <a
              href={`https://www.youtube.com/watch?v=${movie.videoKey}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                marginTop: '14px', background: 'rgba(255,77,28,0.15)',
                border: '1px solid rgba(255,77,28,0.3)', borderRadius: '10px',
                padding: '12px', color: '#ff4d1c', fontSize: '13px', fontWeight: 600,
                transition: 'all 0.2s', textDecoration: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,28,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,77,28,0.15)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Voir la bande-annonce
            </a>
          )}
        </div>

        {/* Info + Sessions */}
        <div>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {movie.categories?.map(cat => (
              <span key={cat.id} style={{
                fontSize: '11px', padding: '4px 12px', borderRadius: '20px',
                background: 'rgba(232,160,32,0.12)', color: 'var(--accent)',
                border: '1px solid rgba(232,160,32,0.25)', letterSpacing: '0.5px',
                textTransform: 'uppercase', fontWeight: 500,
              }}>{cat.name}</span>
            ))}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 60px)',
            letterSpacing: '2px', lineHeight: 1, color: 'var(--text-primary)', marginBottom: '14px',
          }}>{movie.title}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="14" height="14" viewBox="0 0 24 24"
                  fill={s <= Math.round(movie.voteAverage / 2) ? '#fbbf24' : 'rgba(255,255,255,0.15)'}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#fbbf24', marginLeft: '4px', fontWeight: 700 }}>
                {movie.voteAverage?.toFixed(1)}
              </span>
              <span style={{ color: 'var(--text-dim)', fontSize: '12px', marginLeft: '2px' }}>
                ({movie.voteCount?.toLocaleString()} votes)
              </span>
            </div>
            <span style={{ color: 'var(--text-dim)' }}>·</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>{year}</span>
            <span style={{ color: 'var(--text-dim)' }}>·</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
              {hours}h{mins > 0 ? `${mins}m` : ''}
            </span>
          </div>

          <p style={{ fontSize: '15px', lineHeight: 1.75, color: 'var(--text-muted)', marginBottom: '36px', maxWidth: '680px' }}>
            {movie.overview}
          </p>

          {/* Sessions section */}
          <div style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)', padding: '28px',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: '22px',
              letterSpacing: '2px', color: 'var(--text-primary)', marginBottom: '20px',
            }}>CHOISIR UNE SÉANCE</h3>

            {sessLoading ? (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
                Chargement des séances...
              </div>
            ) : sessions.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Aucune séance disponible pour ce film.</p>
            ) : (
              <>
                {/* Date tabs */}
                <p style={{ fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
                  Choisir une date
                </p>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  {groupedDates.map((g, i) => (
                    <button
                      key={g.label}
                      onClick={() => setSelectedDate(i)}
                      style={{
                        padding: '8px 18px', borderRadius: '8px',
                        border: `1px solid ${selectedDate === i ? 'var(--accent)' : 'var(--border)'}`,
                        background: selectedDate === i ? 'rgba(232,160,32,0.12)' : 'transparent',
                        color: selectedDate === i ? 'var(--accent)' : 'var(--text-muted)',
                        fontSize: '13px', fontWeight: selectedDate === i ? 600 : 400,
                        cursor: 'pointer', transition: 'all 0.2s',
                        textTransform: 'capitalize',
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>

                {/* Session list */}
                <p style={{ fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
                  Séances disponibles
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeDateGroup?.sessions.map(s => {
                    const fmt = getRoomFormat(s.room?.name)
                    const fmtColor = FORMAT_COLORS[fmt]
                    const capacity = s.room?.capacity ?? 0
                    const almostFull = capacity > 0 && capacity < 20

                    return (
                      <div
                        key={s.id}
                        onClick={() => navigate(`/api/movies/${movie.id}/sessions/${s.id}/seats`, {
                          state: { session: s, movie }
                        })}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '16px 20px', borderRadius: '10px',
                          border: '1px solid var(--border)',
                          background: 'rgba(255,255,255,0.02)',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'var(--accent)'
                          e.currentTarget.style.background = 'rgba(232,160,32,0.05)'
                          e.currentTarget.style.transform = 'translateX(4px)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--border)'
                          e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                          e.currentTarget.style.transform = 'translateX(0)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '18px',
                            fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '1px',
                          }}>
                            {formatTime(s.startTime)}
                          </span>
                          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            {s.room?.name}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '14px',
                            color: 'var(--accent)', fontWeight: 700,
                          }}>
                            {parseFloat(s.price).toFixed(2)} TND
                          </span>
                          <span style={{
                            fontSize: '11px', padding: '3px 9px', borderRadius: '4px',
                            color: fmtColor, background: `${fmtColor}18`,
                            border: `1px solid ${fmtColor}35`,
                            fontWeight: 600, fontFamily: 'var(--font-mono)',
                          }}>
                            {fmt}
                          </span>
                          <span style={{
                            fontSize: '12px', fontFamily: 'var(--font-mono)',
                            color: almostFull ? '#f87171' : 'var(--text-dim)',
                          }}>
                            {almostFull ? `⚠ ${capacity} restants` : `${capacity} places`}
                          </span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
