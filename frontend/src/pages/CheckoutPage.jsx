import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fetchWithAuth } from '../hooks/useMovies'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

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
  if (!session || !selectedSeats) {
    navigate('/')
    return null
  }

  const isCardFilled = cardNumber.replace(/\s/g, '').length === 16 && cardName && expiry.length === 5 && cvv.length >= 3

  async function handlePay() {
    if (!isCardFilled) return
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
        throw new Error(data.message || 'Erreur lors de la réservation')
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', fontFamily: 'var(--font-body)', paddingTop: '80px', paddingBottom: '60px' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 40px 0', animation: 'fadeIn 0.4s ease' }}>

        {/* Back */}
        <button onClick={() => navigate(-1)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-muted)', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', marginBottom: '32px', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Retour à la sélection
        </button>

        {/* Steps indicator */}
        {/* Bandeau demo */}
        <div style={{
          background: 'rgba(232,160,32,0.08)', border: '1px solid rgba(232,160,32,0.25)',
          borderRadius: '10px', padding: '10px 16px', marginBottom: '28px',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Mode démonstration</span> — Entrez n'importe quelles données, aucun paiement réel n'est effectué.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }}>
          {[['1', 'Sièges', true], ['2', 'Paiement', true], ['3', 'Confirmation', false]].map(([num, label, done], i) => (
            <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: done ? 'var(--accent)' : 'var(--bg-card)',
                  border: `2px solid ${done ? 'var(--accent)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700,
                  color: done ? '#000' : 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)',
                }}>{num}</div>
                <span style={{ fontSize: '12px', color: done ? 'var(--text-primary)' : 'var(--text-dim)', fontWeight: done ? 600 : 400, letterSpacing: '0.5px' }}>{label}</span>
              </div>
              {i < 2 && <div style={{ width: 32, height: 1, background: 'var(--border)', margin: '0 4px' }} />}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '28px', alignItems: 'start' }}>

          {/* ── LEFT: Formulaire paiement ── */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', letterSpacing: '2px', color: 'var(--text-primary)', marginBottom: '28px' }}>
              INFORMATIONS DE PAIEMENT
            </h2>

            {/* Card preview */}
            <div style={{
              background: 'linear-gradient(135deg, #1a1f2e 0%, #252b3b 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px', padding: '24px 28px',
              marginBottom: '28px', position: 'relative', overflow: 'hidden',
              minHeight: '160px',
            }}>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(232,160,32,0.06)' }} />
              <div style={{ position: 'absolute', bottom: '-60px', left: '-20px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(232,160,32,0.04)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                <div style={{ width: 40, height: 28, background: 'linear-gradient(135deg, var(--accent), #f59e0b)', borderRadius: '5px' }} />
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>VISA</span>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', letterSpacing: '3px', color: cardNumber ? 'var(--text-primary)' : 'rgba(255,255,255,0.2)', marginBottom: '16px' }}>
                {cardNumber || '•••• •••• •••• ••••'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginBottom: '3px' }}>TITULAIRE</p>
                  <p style={{ fontSize: '13px', color: cardName ? 'var(--text-primary)' : 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    {cardName || 'VOTRE NOM'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', marginBottom: '3px' }}>EXPIRATION</p>
                  <p style={{ fontSize: '13px', color: expiry ? 'var(--text-primary)' : 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)' }}>
                    {expiry || 'MM/AA'}
                  </p>
                </div>
              </div>
            </div>

            {/* Form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <CardField label="Numéro de carte" placeholder="1234 5678 9012 3456"
                value={cardNumber} onChange={v => setCardNumber(formatCardNumber(v))}
                icon={<CardIcon />} />
              <CardField label="Nom du titulaire" placeholder="Cardholder Name"
                value={cardName} onChange={v => setCardName(v.toUpperCase())}
                icon={<UserIcon />} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <CardField label="Date d'expiration" placeholder="MM/AA"
                  value={expiry} onChange={v => setExpiry(formatExpiry(v))}
                  icon={<CalIcon />} />
                <CardField label="CVV" placeholder="•••"
                  value={cvv} onChange={v => setCvv(v.replace(/\D/g, '').slice(0, 3))}
                  icon={<LockIcon />} type="password" />
              </div>
            </div>

            {error && (
              <div style={{ marginTop: '16px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚠ {error}
              </div>
            )}

            {/* Pay button */}
            <button onClick={handlePay} disabled={!isCardFilled || loading}
              style={{
                marginTop: '24px', width: '100%', padding: '16px',
                borderRadius: '12px', border: 'none',
                background: isCardFilled ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                color: isCardFilled ? '#000' : 'var(--text-dim)',
                fontSize: '15px', fontWeight: 700, letterSpacing: '0.5px',
                cursor: isCardFilled && !loading ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                opacity: loading ? 0.8 : 1,
              }}
              onMouseEnter={e => { if (isCardFilled && !loading) e.currentTarget.style.boxShadow = '0 8px 32px rgba(232,160,32,0.4)' }}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              {loading
                ? <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', animation: 'spin 0.7s linear infinite' }} />Traitement en cours...</>
                : <><LockSmIcon />Payer {totalPrice} TND</>
              }
            </button>

            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-dim)', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <ShieldIcon /> Paiement sécurisé — vos données ne sont pas stockées
            </p>
          </div>

          {/* ── RIGHT: Résumé commande ── */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>

              {/* Movie header */}
              <div style={{ display: 'flex', gap: '16px', padding: '20px', borderBottom: '1px solid var(--border)' }}>
                {movie?.posterPath && (
                  <img src={`${POSTER_BASE}${movie.posterPath}`} alt={movie?.title}
                    style={{ width: 64, height: 90, objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)', flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '2px', marginBottom: '6px' }}>RÉSUMÉ</p>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', letterSpacing: '1px', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
                    {movie?.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {session && formatDate(session.startTime)}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {session && formatTime(session.startTime)} · {session?.room?.name}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Sièges</span>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '160px' }}>
                    {selectedSeats.map(s => (
                      <span key={s.id} style={{ background: 'rgba(232,160,32,0.12)', border: '1px solid rgba(232,160,32,0.25)', borderRadius: '4px', padding: '1px 6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)' }}>
                        {s.row}{s.column}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Places</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>{selectedSeats.length} × {session && parseFloat(session.price).toFixed(2)} TND</span>
                </div>

                <div style={{ height: '1px', background: 'var(--border)' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 600 }}>Total</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--accent)', letterSpacing: '1px' }}>{totalPrice} TND</span>
                </div>
              </div>

              {/* Format badge */}
              {session?.format && (
                <div style={{ padding: '0 20px 20px' }}>
                  <span style={{ background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.2)', borderRadius: '5px', padding: '3px 10px', fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>
                    {session.format}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CardField({ label, placeholder, value, onChange, icon, type = 'text' }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '7px' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '9px', padding: '0 14px', transition: 'border-color 0.2s', gap: '10px' }}>
        <span style={{ color: focused ? 'var(--accent)' : 'var(--text-dim)', display: 'flex', transition: 'color 0.2s' }}>{icon}</span>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '14px', padding: '13px 0', fontFamily: 'var(--font-mono)' }} />
      </div>
    </div>
  )
}

const CardIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const UserIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
const CalIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
const LockIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const LockSmIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const ShieldIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
