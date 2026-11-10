import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchWithAuth } from '../hooks/useMovies'
import Icon from '../components/Icon'
import Steps from '../components/Steps'
import { POSTER_THUMB, formatTime, formatDateLong, formatPrice, getRoomFormat } from '../utils/format'
import './CheckoutPage.css'

function formatCardNumber(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(val) {
  const clean = val.replace(/\D/g, '').slice(0, 4)
  if (clean.length >= 3) return clean.slice(0, 2) + '/' + clean.slice(2)
  return clean
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, clearAuth } = useAuth()

  const { movie, session, selectedSeats, totalPrice, sessionId } = location.state || {}

  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Redirect if no state
  if (!session || !selectedSeats) return <Navigate to="/" replace />

  const isCardFilled = cardNumber.replace(/\s/g, '').length === 16 && cardName && expiry.length === 5 && cvv.length >= 3

  async function handlePay(e) {
    e?.preventDefault()
    if (!isCardFilled || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetchWithAuth(`/api/reservations`, {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.id,
          sessionId: Number(sessionId),
          seatIds: selectedSeats.map(s => s.id),
          price: parseFloat(totalPrice),
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || 'Booking failed. Your seats may have just been taken, please pick other seats.')
      }
      const data = await res.json().catch(() => ({}))
      navigate('/booking-confirmation', {
        state: { movie, session, selectedSeats, totalPrice, bookingId: data.id || data.bookingId },
        replace: true,
      })
    } catch (err) {
      if (err.isAuthError) {
        clearAuth()
        navigate('/login')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const fmt = getRoomFormat(session.room?.name)

  return (
    <main className="page checkout page-anim">
      <div className="container checkout-container">
        <button type="button" className="back-link" onClick={() => navigate(-1)}>
          <Icon name="arrow-left" size={16} />
          Change seats
        </button>

        <Steps current={2} />

        <header className="checkout-head">
          <h1>Payment</h1>
          <p>Check your order, then enter your card details.</p>
        </header>

        <div className="checkout-grid">
          {/* Order summary */}
          <aside className="summary" aria-label="Order summary">
            <div className="summary-movie">
              {movie?.posterPath && (
                <img src={`${POSTER_THUMB}${movie.posterPath}`} alt="" className="summary-poster" />
              )}
              <div className="summary-movie-text">
                <h2>{movie?.title}</h2>
                <p className="summary-when">{formatDateLong(session.startTime)}</p>
                <p className="summary-where">
                  <span className="num">{formatTime(session.startTime)}</span>
                  <span>{session.room?.name}</span>
                  <span className={`format-badge format-${fmt}`}>{fmt}</span>
                </p>
              </div>
            </div>

            <dl className="summary-lines">
              <div>
                <dt>Seats</dt>
                <dd className="summary-seats">
                  {selectedSeats.map(s => <span key={s.id} className="seat-pill">{s.row}{s.column}</span>)}
                </dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd className="num">{selectedSeats.length} × {formatPrice(session.price)}</dd>
              </div>
              <div className="summary-total">
                <dt>Total</dt>
                <dd className="num">{formatPrice(totalPrice)}</dd>
              </div>
            </dl>
          </aside>

          {/* Paiement */}
          <form className="pay" onSubmit={handlePay} noValidate>

            <div className="alert alert-info">
              <Icon name="info" size={16} />
              <p><strong>Demo mode.</strong> Enter any details you like: no real payment is made.</p>
            </div>

            <div className="card-preview" aria-hidden="true">
              <div className="card-preview-top">
                <span className="card-chip" />
                <span className="card-brand">CinéBook Pay</span>
              </div>
              <p className={`card-number num ${cardNumber ? '' : 'is-empty'}`}>{cardNumber || '•••• •••• •••• ••••'}</p>
              <div className="card-preview-bottom">
                <div>
                  <span>Cardholder</span>
                  <p className={cardName ? '' : 'is-empty'}>{cardName || 'FULL NAME'}</p>
                </div>
                <div>
                  <span>Expires</span>
                  <p className={`num ${expiry ? '' : 'is-empty'}`}>{expiry || 'MM/YY'}</p>
                </div>
              </div>
            </div>

            <div className="pay-fields">
              <CardField id="cc-number" label="Card number" placeholder="1234 5678 9012 3456" icon="credit-card"
                value={cardNumber} onChange={v => setCardNumber(formatCardNumber(v))}
                inputMode="numeric" autoComplete="cc-number" />
              <CardField id="cc-name" label="Name on card" placeholder="As shown on the card" icon="user"
                value={cardName} onChange={v => setCardName(v.toUpperCase())} autoComplete="cc-name" />
              <div className="pay-row">
                <CardField id="cc-exp" label="Expiry date" placeholder="MM/YY" icon="calendar"
                  value={expiry} onChange={v => setExpiry(formatExpiry(v))}
                  inputMode="numeric" autoComplete="cc-exp" />
                <CardField id="cc-csc" label="CVV" placeholder="123" icon="lock"
                  value={cvv} onChange={v => setCvv(v.replace(/\D/g, '').slice(0, 3))}
                  type="password" inputMode="numeric" autoComplete="cc-csc" />
              </div>
            </div>

            {error && (
              <div className="alert alert-error" role="alert">
                <Icon name="alert-circle" size={16} />
                <p>{error}</p>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg btn-block pay-cta" disabled={!isCardFilled || loading}>
              {loading
                ? <><span className="spinner spinner-ink" />Processing payment…</>
                : <><Icon name="lock" size={16} strokeWidth={2.2} />Pay {formatPrice(totalPrice)}</>
              }
            </button>

            <p className="pay-note">
              <Icon name="shield-check" size={14} />
              Your card details are not stored.
            </p>
          </form>
        </div>
      </div>
    </main>
  )
}

function CardField({ id, label, placeholder, value, onChange, icon, type = 'text', inputMode, autoComplete }) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>{label}</label>
      <div className="field-control">
        <Icon name={icon} size={17} />
        <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          inputMode={inputMode} autoComplete={autoComplete} className="num" />
      </div>
    </div>
  )
}
