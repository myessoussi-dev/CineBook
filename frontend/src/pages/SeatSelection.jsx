import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useSessionSeats, useSessionDetails } from '../hooks/useMovies'
import { useAuth } from '../context/AuthContext'
import LoginPromptModal from '../components/LoginPromptModal'
import Icon from '../components/Icon'
import { POSTER_THUMB, formatTime, formatDateLong, formatPrice, getRoomFormat } from '../utils/format'
import './SeatSelection.css'

export default function SeatSelection() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { clearAuth } = useAuth()

  const movieFromState = location.state?.movie

  const { session, loading: sessLoading, authError: sessAuthError } = useSessionDetails(sessionId)
  const { seats, reservedIds, loading: seatsLoading, authError: seatsAuthError } = useSessionSeats(sessionId)

  const [selectedSeats, setSelectedSeats] = useState([])
  const [showAuthModal, setShowAuthModal] = useState(false)

  const movie = movieFromState

  useEffect(() => {
    if (sessAuthError || seatsAuthError) {
      clearAuth()
      setShowAuthModal(true)
    }
  }, [sessAuthError, seatsAuthError])

  const seatsByRow = useMemo(() => {
    const map = {}
    seats.forEach(s => {
      const r = s.row
      if (!map[r]) map[r] = []
      map[r].push(s)
    })
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([row, rowSeats]) => ({
        row,
        seats: rowSeats.sort((a, b) => a.column - b.column),
      }))
  }, [seats])

  // Nombre de colonnes de la salle (positionne chaque siège selon son numéro → les allées restent visibles)
  const { maxCol, numeric } = useMemo(() => {
    const cols = seats.map(s => Number(s.column))
    const ok = cols.length > 0 && cols.every(c => Number.isInteger(c) && c > 0)
    const longestRow = Math.max(0, ...seatsByRow.map(r => r.seats.length))
    return { maxCol: ok ? Math.max(...cols) : longestRow, numeric: ok }
  }, [seats, seatsByRow])

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

  function goToCheckout() {
    if (selectedSeats.length === 0) return
    navigate('/checkout', {
      state: { movie, session, selectedSeats, totalPrice, sessionId }
    })
  }

  if (showAuthModal) return (
    <div className="seat-page">
      <LoginPromptModal onClose={() => navigate('/')} from={location.pathname} />
    </div>
  )

  const loading = sessLoading || seatsLoading
  const fmt = getRoomFormat(session?.room?.name)
  const count = selectedSeats.length

  return (
    <div className="seat-page">
      {/* En-tête */}
      <header className="seat-head">
        <div className="container seat-head-inner">
          <button type="button" className="icon-btn" onClick={() => navigate(-1)} aria-label="Retour">
            <Icon name="arrow-left" size={18} />
          </button>

          {movie?.posterPath && (
            <img className="seat-head-poster" src={`${POSTER_THUMB}${movie.posterPath}`} alt="" />
          )}

          <div className="seat-head-text">
            <h1 className="seat-head-title">{movie?.title || 'Choix des places'}</h1>
            {session && (
              <p className="seat-head-meta">
                <span className="seat-head-date">{formatDateLong(session.startTime)}, {formatTime(session.startTime)}</span>
                <span>{session.room?.name}</span>
                <span className={`format-badge format-${fmt}`}>{fmt}</span>
              </p>
            )}
          </div>

          {session && (
            <div className="seat-head-price">
              <span className="dim">Prix par place</span>
              <strong className="num">{formatPrice(session.price)}</strong>
            </div>
          )}
        </div>
      </header>

      <main className="seat-main container">
        {loading ? (
          <div className="state">
            <div className="spinner spinner-lg" />
            <p>Chargement du plan de salle…</p>
          </div>
        ) : seatsByRow.length === 0 ? (
          <div className="state">
            <div className="state-icon"><Icon name="armchair" size={24} /></div>
            <h2>Plan de salle indisponible</h2>
            <p>Les sièges de cette séance n'ont pas pu être chargés. Revenez en arrière et choisissez une autre séance.</p>
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Retour aux séances</button>
          </div>
        ) : (
          <>
            <div className="seat-scroll">
              <div className="seat-map" style={{ '--cols': maxCol }}>
                <div className="screen" aria-hidden="true">
                  <svg viewBox="0 0 400 40" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="var(--accent)" stopOpacity="0.35" />
                        <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M4 30 Q200 -4 396 30 L396 40 L4 40 Z" fill="url(#screenGlow)" />
                    <path d="M4 30 Q200 -4 396 30" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <span>Écran</span>
                </div>

                <div className="seat-rows" role="group" aria-label="Plan de salle">
                  {seatsByRow.map(({ row, seats: rowSeats }) => (
                    <div key={row} className="seat-row">
                      <span className="row-label" style={{ gridColumn: 1 }}>{row}</span>
                      {rowSeats.map((seat, i) => {
                        const isReserved = reservedIds.includes(seat.id)
                        const isSelected = !!selectedSeats.find(s => s.id === seat.id)
                        return (
                          <button
                            key={seat.id}
                            type="button"
                            className={`seat ${isSelected ? 'is-selected' : ''} ${isReserved ? 'is-reserved' : ''}`}
                            style={{ gridColumn: (numeric ? Number(seat.column) : i + 1) + 1 }}
                            onClick={() => toggleSeat(seat)}
                            disabled={isReserved}
                            aria-pressed={isSelected}
                            aria-label={`Rangée ${seat.row}, siège ${seat.column}${isReserved ? ', déjà réservé' : ''}`}
                            title={`${seat.row}${seat.column}${isReserved ? ' (réservé)' : ''}`}
                          >
                            <span className="seat-num">{seat.column}</span>
                          </button>
                        )
                      })}
                      <span className="row-label" style={{ gridColumn: maxCol + 2 }}>{row}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ul className="seat-legend" aria-label="Légende">
              <li><span className="seat seat-demo" />Disponible</li>
              <li><span className="seat seat-demo is-selected" />Votre sélection</li>
              <li><span className="seat seat-demo is-reserved" />Réservé</li>
            </ul>
          </>
        )}
      </main>

      {/* Barre récapitulative */}
      <div className="seat-bar">
        <div className="container seat-bar-inner">
          <div className="seat-bar-selection">
            <p className="seat-bar-label">
              {count === 0 ? 'Aucune place sélectionnée' : `${count} place${count > 1 ? 's' : ''}`}
            </p>
            {count > 0 && (
              <div className="seat-bar-pills scroll-x">
                {selectedSeats.map(s => (
                  <button key={s.id} type="button" className="seat-pill seat-pill-btn" onClick={() => toggleSeat(s)}
                    aria-label={`Retirer le siège ${s.row}${s.column}`}>
                    {s.row}{s.column}
                    <Icon name="x" size={12} strokeWidth={2.4} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="seat-bar-total">
            <span className="dim">Total</span>
            <strong className="num">{formatPrice(totalPrice)}</strong>
          </div>

          <button type="button" className="btn btn-primary btn-lg seat-bar-cta" onClick={goToCheckout} disabled={count === 0}>
            Continuer vers le paiement
          </button>
        </div>
      </div>
    </div>
  )
}
