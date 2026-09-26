import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
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

  if (!session || !selectedSeats) {
    navigate('/')
    return null
  }

  const bookingRef = bookingId
    ? String(bookingId).padStart(8, '0')
    : Math.random().toString(36).slice(2, 10).toUpperCase()

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      fontFamily: 'var(--font-body)', paddingTop: '80px', paddingBottom: '60px',
    }}>
      <style>{`
        @keyframes popIn {
          0%   { transform: scale(0.4); opacity: 0 }
          70%  { transform: scale(1.15); opacity: 1 }
          100% { transform: scale(1) }
        }
        @keyframes checkDraw {
          from { stroke-dashoffset: 40 }
          to   { stroke-dashoffset: 0 }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px) }
          to   { opacity: 1; transform: translateY(0) }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0 }
          100% { background-position: 200% 0 }
        }
      `}</style>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>

        {/* Checkmark */}
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'rgba(74,222,128,0.1)',
          border: '2px solid #4ade80',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
          animation: 'popIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
        }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"
              style={{ strokeDasharray: 40, strokeDashoffset: 40, animation: 'checkDraw 0.5s ease 0.4s forwards' }} />
          </svg>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '34px', letterSpacing: '3px',
          color: '#4ade80', marginBottom: '10px',
          animation: 'fadeUp 0.5s ease 0.5s both',
        }}>
          RÉSERVATION CONFIRMÉE
        </h1>
        <p style={{
          fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px',
          animation: 'fadeUp 0.5s ease 0.6s both',
        }}>
          Merci {user?.fullName?.split(' ')[0] || ''} ! Votre réservation a bien été enregistrée.
        </p>
        <p style={{
          fontSize: '13px', color: 'var(--text-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          animation: 'fadeUp 0.5s ease 0.65s both', marginBottom: '40px',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          Un email de confirmation a été envoyé à <span style={{ color: 'var(--accent)' }}>{maskEmail(user?.email)}</span>
        </p>

        {/* Ticket */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: '20px', overflow: 'hidden',
          animation: 'fadeUp 0.5s ease 0.7s both',
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        }}>
          {/* Ticket top */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(232,160,32,0.12) 0%, rgba(232,160,32,0.04) 100%)',
            borderBottom: '1px dashed rgba(255,255,255,0.08)',
            padding: '28px 32px',
            display: 'flex', gap: '20px', alignItems: 'flex-start',
          }}>
            {movie?.posterPath && (
              <img src={`${POSTER_BASE}${movie.posterPath}`} alt={movie?.title}
                style={{ width: 80, height: 112, objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border)', flexShrink: 0 }} />
            )}
            <div style={{ flex: 1, textAlign: 'left' }}>
              <p style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '3px', marginBottom: '8px' }}>BILLET DE CINÉMA</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '1.5px', color: 'var(--text-primary)', marginBottom: '14px', lineHeight: 1.2 }}>
                {movie?.title}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>📅</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{formatDate(session.startTime)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>🕐</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{formatTime(session.startTime)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>🎭</span>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{session.room?.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket notch */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '0 -1px' }}>
            <div style={{ width: 20, height: 20, borderRadius: '0 10px 10px 0', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderLeft: 'none' }} />
            <div style={{ flex: 1, borderTop: '2px dashed rgba(255,255,255,0.07)' }} />
            <div style={{ width: 20, height: 20, borderRadius: '10px 0 0 10px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRight: 'none' }} />
          </div>

          {/* Ticket bottom */}
          <div style={{ padding: '24px 32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <TicketInfo label="SIÈGES" value={selectedSeats.map(s => `${s.row}${s.column}`).join(', ')} />
              <TicketInfo label="PLACES" value={`${selectedSeats.length} place${selectedSeats.length > 1 ? 's' : ''}`} />
              <TicketInfo label="TOTAL" value={`${totalPrice} TND`} accent />
            </div>

            {/* Booking ref + shimmer */}
            <div style={{
              background: 'rgba(232,160,32,0.06)',
              border: '1px solid rgba(232,160,32,0.15)',
              borderRadius: '10px', padding: '12px 16px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '2px', marginBottom: '3px' }}>RÉFÉRENCE</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '3px' }}>
                  #{bookingRef}
                </p>
              </div>
              {/* Fake QR */}
              <div style={{
                width: 56, height: 56, borderRadius: '8px',
                background: 'repeating-conic-gradient(var(--text-dim) 0% 25%, transparent 0% 50%) 0 0 / 6px 6px',
                opacity: 0.4,
              }} />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '32px', animation: 'fadeUp 0.5s ease 0.85s both' }}>
          <button onClick={() => navigate('/')} style={{
            flex: 1, padding: '14px', borderRadius: '10px',
            background: 'var(--accent)', color: '#000',
            border: 'none', fontSize: '14px', fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)',
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(232,160,32,0.35)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            Retour à l'accueil
          </button>
          <button onClick={() => navigate('/seances')} style={{
            flex: 1, padding: '14px', borderRadius: '10px',
            background: 'transparent', color: 'var(--text-muted)',
            border: '1px solid var(--border)', fontSize: '14px', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            Voir les séances
          </button>
        </div>
      </div>
    </div>
  )
}

function TicketInfo({ label, value, accent }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '10px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '2px', marginBottom: '5px' }}>{label}</p>
      <p style={{ fontSize: '14px', fontWeight: 700, color: accent ? 'var(--accent)' : 'var(--text-primary)', fontFamily: accent ? 'var(--font-display)' : 'var(--font-mono)' }}>
        {value}
      </p>
    </div>
  )
}
