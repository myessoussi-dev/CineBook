import { useNavigate } from 'react-router-dom'

export default function LoginPromptModal({ onClose, from }) {
  const navigate = useNavigate()

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.2s ease',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: '20px', padding: '40px 36px', maxWidth: '400px', width: '90%',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)', animation: 'scaleIn 0.25s ease',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: '26px',
        }}>🎟️</div>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '26px',
          letterSpacing: '2px', color: 'var(--text-primary)', marginBottom: '10px',
        }}>
          CONNEXION REQUISE
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
          Tu dois être connecté pour réserver des places. Crée un compte gratuitement ou connecte-toi.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => navigate('/login', { state: { from } })}
            style={{
              width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
              background: 'var(--accent)', color: '#000', fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(232,160,32,0.35)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            Se connecter
          </button>
          <button
            onClick={() => navigate('/register', { state: { from } })}
            style={{
              width: '100%', padding: '13px', borderRadius: '10px',
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-muted)', fontSize: '14px', fontWeight: 500,
              cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            Créer un compte
          </button>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--text-dim)',
            fontSize: '13px', cursor: 'pointer', marginTop: '4px',
          }}>
            Continuer sans se connecter
          </button>
        </div>
      </div>
    </div>
  )
}
