import { useMemo } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Icon from '../components/Icon'
import Steps from '../components/Steps'
import { POSTER_SMALL, formatTime, formatDateFull, formatPrice, getRoomFormat } from '../utils/format'
import './BookingConfirmationPage.css'

function maskEmail(email) {
  if (!email) return '***@***.***'
  const [local, domain] = email.split('@')
  const masked = local.slice(0, 2) + '***' + (local.length > 4 ? local.slice(-1) : '')
  return `${masked}@${domain}`
}

export default function BookingConfirmationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const { movie, session, selectedSeats, totalPrice, bookingId } = location.state || {}

  const bookingRef = useMemo(() => (
    bookingId
      ? String(bookingId).padStart(8, '0')
      : Math.random().toString(36).slice(2, 10).toUpperCase()
  ), [bookingId])

  if (!session || !selectedSeats) return <Navigate to="/" replace />

  const fmt = getRoomFormat(session.room?.name)
  const firstName = user?.fullName?.split(' ')[0]

  return (
    <main className="page confirm page-anim">
      <div className="container confirm-container">
        <Steps current={3} />

        <header className="confirm-head">
          <div className="confirm-check" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" pathLength="1" className="confirm-check-path" />
            </svg>
          </div>
          <h1 className="confirm-title display">You're all set{firstName ? `, ${firstName}` : ''}!</h1>
          <p className="confirm-sub">
            A confirmation email has been sent to <strong>{maskEmail(user?.email)}</strong>.
            Show the booking reference below at the cinema entrance.
          </p>
        </header>

        <article className="ticket" aria-label="Your ticket">
          <div className="ticket-top">
            {movie?.backdropPath && (
              <div className="ticket-bg" aria-hidden="true">
                <img src={`https://image.tmdb.org/t/p/w780${movie.backdropPath}`} alt="" />
              </div>
            )}
            {movie?.posterPath && (
              <img src={`${POSTER_SMALL}${movie.posterPath}`} alt="" className="ticket-poster" />
            )}
            <div className="ticket-movie">
              <h2 className="ticket-title">{movie?.title}</h2>
              <ul className="ticket-facts">
                <li><Icon name="calendar" size={16} /><span className="ticket-date">{formatDateFull(session.startTime)}</span></li>
                <li><Icon name="clock" size={16} /><span className="num">{formatTime(session.startTime)}</span></li>
                <li><Icon name="map-pin" size={16} /><span>{session.room?.name}</span><span className={`format-badge format-${fmt}`}>{fmt}</span></li>
              </ul>
            </div>
          </div>

          <div className="ticket-tear" aria-hidden="true" />

          <div className="ticket-bottom">
            <dl className="ticket-grid">
              <div>
                <dt>Seats</dt>
                <dd className="ticket-seats">
                  {selectedSeats.map(s => <span key={s.id} className="seat-pill">{s.row}{s.column}</span>)}
                </dd>
              </div>
              <div>
                <dt>Tickets</dt>
                <dd>{selectedSeats.length}</dd>
              </div>
              <div>
                <dt>Total paid</dt>
                <dd className="num">{formatPrice(totalPrice)}</dd>
              </div>
            </dl>

            <div className="ticket-ref">
              <span>Booking reference</span>
              <strong className="num">{bookingRef}</strong>
            </div>
          </div>
        </article>

        <div className="confirm-actions">
          <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
            Back to home
          </button>
          <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate('/showtimes')}>
            See more showtimes
          </button>
        </div>
      </div>
    </main>
  )
}
