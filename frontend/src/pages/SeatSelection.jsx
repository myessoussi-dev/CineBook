import { useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useSessionSeats, useSessionDetails } from '../hooks/useMovies'
import { useAuth } from '../context/AuthContext'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function SeatSelection() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  // Get movie from navigation state (passed from MovieDetail)
  const { user, token } = useAuth()
  const movieFromState = location.state?.movie

  const { session, loading: sessLoading } = useSessionDetails(sessionId)
  const { seats, reservedIds, loading: seatsLoading } = useSessionSeats(sessionId)

  const [selectedSeats, setSelectedSeats] = useState([])
  const [booking, setBooking] = useState(false)
  const [booked, setBooked] = useState(false)
  const [bookError, setBookError] = useState(null)

  const movie = movieFromState

  // Group seats by row
  const seatsByRow = useMemo(() => {
    const map = {}
    seats.forEach(s => {
      const r = s.row
      if (!map[r]) map[r] = []
      map[r].push(s)
    })
    // Sort rows alphabetically, seats by column
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([row, rowSeats]) => ({
        row,
        seats: rowSeats.sort((a, b) => a.column - b.column),
      }))
  }, [seats])

  function toggleSeat(seat) {
    if (reservedIds.includes(seat.id)) return
    setSelectedSeats(prev =>
      prev.find(s => s.id === seat.id)
        ? prev.filter(s => s.id !== seat.id)
        : [...prev, seat]
    )
  }

  const totalPrice = session
    ? (selectedSeats.length * parseFloat(session.price)).toFixed(2)
    : '0.00'

  async function confirmBooking() {
    if (selectedSeats.length === 0) return
    setBooking(true)
    setBookError(null)
    try {
      const res = await fetch(`${BASE_URL}/api/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId: user?.id,
          sessionId: Number(sessionId),
          seatIds: selectedSeats.map(s => s.id),
          price:parseFloat(totalPrice)
        }),
      })
      if (!res.ok) throw new Error('Erreur lors de la réservation')
      setBooked(true)
    } catch (err) {
      setBookError(err.message)
    } finally {
      setBooking(false)
    }
  }

  // ── Success screen ──
  if (booked) return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.4s ease',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(74,222,128,0.12)', border: '2px solid #4ade80',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
      }}>✓</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '2px', color: '#4ade80' }}>
        RÉSERVATION CONFIRMÉE
      </h2>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '24px 36px',
        display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '340px',
      }}>
        {movie && (
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '16px' }}>{movie.title}</p>
        )}
        {session && (
          <>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              📅 {formatDate(session.startTime)} à {formatTime(session.startTime)}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              🎭 {session.room?.name}
            </p>
          </>
        )}
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          💺 Sièges : {selectedSeats.map(s => `${s.row}${s.column}`).join(', ')}
        </p>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '4px' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--accent)', letterSpacing: '1px' }}>
            Total : {totalPrice} TND
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'var(--accent)', color: '#000', border: 'none',
          borderRadius: '10px', padding: '12px 28px', fontWeight: 700,
          fontSize: '14px', cursor: 'pointer',
        }}
      >
        Retour à l'accueil
      </button>
    </div>
  )

  const loading = sessLoading || seatsLoading

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      fontFamily: 'var(--font-body)', paddingTop: '80px', paddingBottom: '120px',
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1100px', margin: '0 auto', padding: '32px 40px 0',
        display: 'flex', alignItems: 'center', gap: '20px',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '8px', color: 'var(--text-muted)', padding: '8px 14px',
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

        {/* Movie + session info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          {movie?.posterPath && (
            <img
              src={`${POSTER_BASE}${movie.posterPath}`}
              alt={movie.title}
              style={{ width: 48, height: 68, objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }}
            />
          )}
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '28px',
              letterSpacing: '2px', color: 'var(--text-primary)', marginBottom: '4px',
            }}>
              {movie?.title || 'Sélection des sièges'}
            </h1>
            {session && (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                {formatDate(session.startTime)} · {formatTime(session.startTime)} · {session.room?.name}
              </p>
            )}
          </div>
        </div>

        {/* Price per seat */}
        {session && (
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginBottom: '2px' }}>
              PRIX / SIÈGE
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--accent)', letterSpacing: '1px' }}>
              {parseFloat(session.price).toFixed(2)} TND
            </p>
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 40px 0' }}>

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>Chargement de la salle...</span>
          </div>
        ) : (
          <>
            {/* Legend */}
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '32px' }}>
              {[
                { color: 'var(--bg-card)', border: 'var(--border)', label: 'Disponible' },
                { color: 'rgba(232,160,32,0.25)', border: 'var(--accent)', label: 'Sélectionné' },
                { color: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.06)', label: 'Réservé', dim: true },
              ].map(({ color, border, label, dim }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '5px',
                    background: color, border: `1.5px solid ${border}`,
                    opacity: dim ? 0.4 : 1,
                  }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Screen indicator */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{
                display: 'inline-block',
                width: '60%', height: '6px',
                background: 'linear-gradient(to right, transparent, rgba(232,160,32,0.6), transparent)',
                borderRadius: '3px', marginBottom: '8px',
              }} />
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '3px', textTransform: 'uppercase' }}>
                ÉCRAN
              </p>
            </div>

            {/* Seat grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
              {seatsByRow.map(({ row, seats: rowSeats }) => (
                <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {/* Row label */}
                  <span style={{
                    width: 24, textAlign: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '12px',
                    color: 'var(--text-dim)', fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {row}
                  </span>

                  {/* Seats */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {rowSeats.map(seat => {
                      const isReserved = reservedIds.includes(seat.id)
                      const isSelected = selectedSeats.find(s => s.id === seat.id)

                      return (
                        <div
                          key={seat.id}
                          onClick={() => toggleSeat(seat)}
                          title={`${seat.row}${seat.column}${isReserved ? ' — Réservé' : ''}`}
                          style={{
                            width: 32, height: 30,
                            borderRadius: '5px 5px 3px 3px',
                            border: `1.5px solid ${
                              isReserved ? 'rgba(255,255,255,0.06)'
                              : isSelected ? 'var(--accent)'
                              : 'var(--border)'
                            }`,
                            background: isReserved
                              ? 'rgba(255,255,255,0.03)'
                              : isSelected
                              ? 'rgba(232,160,32,0.3)'
                              : 'var(--bg-card)',
                            cursor: isReserved ? 'not-allowed' : 'pointer',
                            transition: 'all 0.15s ease',
                            opacity: isReserved ? 0.35 : 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '9px', color: isSelected ? 'var(--accent)' : 'var(--text-dim)',
                            fontFamily: 'var(--font-mono)', fontWeight: 700,
                            boxShadow: isSelected ? '0 0 10px rgba(232,160,32,0.2)' : 'none',
                            // seat shape: slightly wider top
                            clipPath: 'polygon(5% 0%, 95% 0%, 100% 15%, 100% 100%, 0% 100%, 0% 15%)',
                          }}
                          onMouseEnter={e => { if (!isReserved && !isSelected) e.currentTarget.style.borderColor = 'rgba(232,160,32,0.5)' }}
                          onMouseLeave={e => { if (!isReserved && !isSelected) e.currentTarget.style.borderColor = 'var(--border)' }}
                        >
                          {seat.column}
                        </div>
                      )
                    })}
                  </div>

                  {/* Row label right */}
                  <span style={{
                    width: 24, textAlign: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: '12px',
                    color: 'var(--text-dim)', fontWeight: 700, flexShrink: 0,
                  }}>
                    {row}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom sticky bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(8,10,15,0.95)', backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        padding: '16px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 100,
      }}>
        {/* Selected seats info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginBottom: '2px' }}>
              SIÈGES SÉLECTIONNÉS
            </p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: '400px' }}>
              {selectedSeats.length === 0 ? (
                <span style={{ color: 'var(--text-dim)', fontSize: '13px' }}>Aucun siège sélectionné</span>
              ) : selectedSeats.map(s => (
                <span key={s.id} style={{
                  background: 'rgba(232,160,32,0.15)', border: '1px solid rgba(232,160,32,0.3)',
                  borderRadius: '5px', padding: '2px 8px',
                  fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent)',
                }}>
                  {s.row}{s.column}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Total + confirm */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {bookError && (
            <span style={{ fontSize: '12px', color: '#f87171', fontFamily: 'var(--font-mono)' }}>
              ⚠ {bookError}
            </span>
          )}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginBottom: '2px' }}>
              TOTAL
            </p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--accent)', letterSpacing: '1px' }}>
              {totalPrice} TND
            </p>
          </div>
          <button
            onClick={confirmBooking}
            disabled={selectedSeats.length === 0 || booking}
            style={{
              background: selectedSeats.length === 0 ? 'rgba(255,255,255,0.05)' : 'var(--accent)',
              color: selectedSeats.length === 0 ? 'var(--text-dim)' : '#000',
              border: 'none', borderRadius: '10px',
              padding: '14px 32px', fontSize: '14px', fontWeight: 700,
              cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', fontFamily: 'var(--font-body)',
              display: 'flex', alignItems: 'center', gap: '8px',
              opacity: booking ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (selectedSeats.length > 0 && !booking) e.currentTarget.style.boxShadow = '0 8px 28px rgba(232,160,32,0.35)' }}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            {booking ? (
              <>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', animation: 'spin 0.7s linear infinite' }} />
                Réservation...
              </>
            ) : (
              <>
                Confirmer — {selectedSeats.length} place{selectedSeats.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
