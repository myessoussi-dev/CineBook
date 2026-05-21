import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original'
const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

const SEANCES = [
  { id: 1, time: '10:30', salle: 'Salle 1 — IMAX', dispo: 120, format: 'IMAX' },
  { id: 2, time: '13:15', salle: 'Salle 3 — Standard', dispo: 80, format: '2D' },
  { id: 3, time: '16:00', salle: 'Salle 2 — 4DX', dispo: 45, format: '4DX' },
  { id: 4, time: '19:30', salle: 'Salle 1 — IMAX', dispo: 12, format: 'IMAX' },
  { id: 5, time: '21:45', salle: 'Salle 5 — VIP', dispo: 30, format: 'VIP' },
]

const DATES = ['Aujourd\'hui', 'Demain', 'Sam 24', 'Dim 25', 'Lun 26']

export default function MovieDetail({ movie, loading, error }) {
  const navigate = useNavigate()
  const [selectedSeance, setSelectedSeance] = useState(null)
  const [selectedDate, setSelectedDate] = useState(0)
  const [seats, setSeats] = useState(1)
  const [booked, setBooked] = useState(false)

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: 'var(--accent)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
        Chargement...
      </span>
    </div>
  )

  if (error || !movie) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <span style={{ fontSize: '48px' }}>🎬</span>
      <p style={{ color: 'var(--text-muted)' }}>{error || 'Film introuvable'}</p>
      <button onClick={() => navigate('/')} style={{
        background: 'var(--accent)', color: '#000', border: 'none',
        borderRadius: '8px', padding: '10px 20px', fontWeight: 600, cursor: 'pointer',
      }}>
        Retour à l'accueil
      </button>
    </div>
  )

  const year = movie.releaseDate?.split('-')[0]
  const hours = Math.floor(movie.runtime / 60)
  const mins = movie.runtime % 60
  const selectedSeanceData = SEANCES.find(s => s.id === selectedSeance)
  const totalPrice = selectedSeanceData ? (seats * (selectedSeanceData.format === 'IMAX' ? 14.5 : selectedSeanceData.format === '4DX' ? 16 : selectedSeanceData.format === 'VIP' ? 22 : 10.5)).toFixed(2) : null

  if (booked) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px',
      animation: 'scaleIn 0.4s ease',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(74,222,128,0.15)',
        border: '2px solid #4ade80',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '36px',
      }}>✓</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '2px', color: '#4ade80' }}>
        RÉSERVATION CONFIRMÉE
      </h2>
      <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
        {seats} place(s) — {movie.title} — {selectedSeanceData?.time}
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent)' }}>
        Total payé: {totalPrice} TND
      </p>
      <button onClick={() => navigate('/')} style={{
        marginTop: '8px',
        background: 'var(--accent)', color: '#000', border: 'none',
        borderRadius: '10px', padding: '12px 24px', fontWeight: 700, cursor: 'pointer',
        fontSize: '14px',
      }}>
        Retour à l'accueil
      </button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', animation: 'fadeIn 0.4s ease' }}>
      {/* Backdrop */}
      <div style={{ position: 'relative', height: '70vh', overflow: 'hidden' }}>
        <img
          src={`${BACKDROP_BASE}${movie.backdropPath}`}
          alt={movie.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(8,10,15,0.9) 0%, rgba(8,10,15,0.4) 60%, rgba(8,10,15,0.2) 100%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(8,10,15,1) 0%, rgba(8,10,15,0.0) 50%)',
        }} />

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute', top: '90px', left: '40px',
            background: 'rgba(8,10,15,0.7)', backdropFilter: 'blur(10px)',
            border: '1px solid var(--border)', borderRadius: '8px',
            color: 'var(--text-primary)', padding: '8px 14px',
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', cursor: 'pointer',
            transition: 'all 0.2s',
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

      {/* Main content */}
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        padding: '0 40px 80px',
        marginTop: '-220px',
        position: 'relative',
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: '48px',
        alignItems: 'start',
      }}>
        {/* Poster */}
        <div>
          <img
            src={`${POSTER_BASE}${movie.posterPath}`}
            alt={movie.title}
            style={{
              width: '100%',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
              border: '1px solid var(--border)',
            }}
          />

          {/* Trailer button */}
          {movie.videoKey && (
            <a
              href={`https://www.youtube.com/watch?v=${movie.videoKey}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                marginTop: '14px',
                background: 'rgba(255,77,28,0.15)',
                border: '1px solid rgba(255,77,28,0.3)',
                borderRadius: '10px',
                padding: '12px',
                color: '#ff4d1c',
                fontSize: '13px',
                fontWeight: 600,
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,28,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,77,28,0.15)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Voir la bande-annonce
            </a>
          )}
        </div>

        {/* Info + Booking */}
        <div>
          {/* Categories */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {movie.categories?.map(cat => (
              <span key={cat.id} style={{
                fontSize: '11px', padding: '4px 12px',
                borderRadius: '20px',
                background: 'rgba(232,160,32,0.12)',
                color: 'var(--accent)',
                border: '1px solid rgba(232,160,32,0.25)',
                letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 500,
              }}>
                {cat.name}
              </span>
            ))}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 60px)',
            letterSpacing: '2px',
            lineHeight: 1,
            color: 'var(--text-primary)',
            marginBottom: '14px',
          }}>
            {movie.title}
          </h1>

          {/* Meta row */}
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

          <p style={{
            fontSize: '15px', lineHeight: 1.75,
            color: 'var(--text-muted)',
            marginBottom: '36px',
            maxWidth: '680px',
          }}>
            {movie.overview}
          </p>

          {/* Booking section */}
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: '28px',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '22px',
              letterSpacing: '2px',
              color: 'var(--text-primary)',
              marginBottom: '20px',
            }}>
              RÉSERVER UNE PLACE
            </h3>

            {/* Date selector */}
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
              Choisir une date
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {DATES.map((d, i) => (
                <button
                  key={d}
                  onClick={() => { setSelectedDate(i); setSelectedSeance(null) }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: `1px solid ${selectedDate === i ? 'var(--accent)' : 'var(--border)'}`,
                    background: selectedDate === i ? 'rgba(232,160,32,0.12)' : 'transparent',
                    color: selectedDate === i ? 'var(--accent)' : 'var(--text-muted)',
                    fontSize: '13px',
                    fontWeight: selectedDate === i ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Séances */}
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
              Choisir une séance
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
              {SEANCES.map(s => {
                const isSel = selectedSeance === s.id
                const almostFull = s.dispo < 20
                const formatColors = {
                  'IMAX': '#60a5fa',
                  '4DX': '#a78bfa',
                  'VIP': 'var(--accent)',
                  '2D': 'var(--text-muted)',
                }
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSeance(s.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: '10px',
                      border: `1px solid ${isSel ? 'var(--accent)' : 'var(--border)'}`,
                      background: isSel ? 'rgba(232,160,32,0.07)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.borderColor = 'var(--border)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: isSel ? 'var(--accent)' : 'var(--text-primary)',
                      }}>
                        {s.time}
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.salle}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        fontSize: '11px', padding: '2px 8px',
                        borderRadius: '4px',
                        color: formatColors[s.format] || 'var(--text-muted)',
                        background: `${formatColors[s.format]}15`,
                        border: `1px solid ${formatColors[s.format]}30`,
                        fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {s.format}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: almostFull ? '#f87171' : 'var(--text-dim)',
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {almostFull ? `⚠ ${s.dispo} restants` : `${s.dispo} places`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Seats + confirm */}
            {selectedSeance && (
              <div style={{ animation: 'fadeIn 0.3s ease' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-dim)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'var(--font-mono)' }}>
                  Nombre de places
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <button
                    onClick={() => setSeats(Math.max(1, seats - 1))}
                    style={{
                      width: 36, height: 36, borderRadius: '8px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    −
                  </button>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '28px',
                    letterSpacing: '2px',
                    color: 'var(--accent)',
                    minWidth: '32px',
                    textAlign: 'center',
                  }}>
                    {seats}
                  </span>
                  <button
                    onClick={() => setSeats(Math.min(10, seats + 1))}
                    style={{
                      width: 36, height: 36, borderRadius: '8px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    +
                  </button>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>×</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-muted)' }}>
                    {selectedSeanceData?.format === 'IMAX' ? '14.50' : selectedSeanceData?.format === '4DX' ? '16.00' : selectedSeanceData?.format === 'VIP' ? '22.00' : '10.50'} TND
                  </span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--accent)', letterSpacing: '1px' }}>
                    = {totalPrice} TND
                  </span>
                </div>

                <button
                  onClick={() => setBooked(true)}
                  style={{
                    width: '100%',
                    background: 'var(--accent)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '15px',
                    fontSize: '15px',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(232,160,32,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  CONFIRMER LA RÉSERVATION — {totalPrice} TND
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
