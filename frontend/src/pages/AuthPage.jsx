import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


// ─── OTP Screen ───────────────────────────────────────────────
function OtpScreen({ email, onSuccess }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [resendCount, setResendCount] = useState(0)

  // Countdown timer
  useState(() => {
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { setCanResend(true); clearInterval(interval); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  })

  function handleOtpChange(idx, val) {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[idx] = val.slice(-1)
    setOtp(next)
    setError(null)
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus()
    }
  }

  function handleOtpKeyDown(idx, e) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus()
    }
  }

  function handlePaste(e) {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (paste.length === 6) {
      setOtp(paste.split(''))
      document.getElementById('otp-5')?.focus()
    }
  }

  async function handleVerify() {
    const code = otp.join('')
    if (code.length < 6) { setError('Entrez les 6 chiffres du code'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode: code }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.message || 'Code incorrect'); return }
      onSuccess(data.token, data.user)
    } catch {
      setError('Impossible de contacter le serveur')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!canResend) return
    setCanResend(false)
    setResendCount(c => c + 1)
    const newCountdown = resendCount >= 1 ? 60 : 30
    setCountdown(newCountdown)
    setOtp(['', '', '', '', '', ''])
    setError(null)
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { setCanResend(true); clearInterval(interval); return 0 }
        return c - 1
      })
    }, 1000)
    try {
      await fetch(`/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {}
    document.getElementById('otp-0')?.focus()
  }

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3')
  const filled = otp.every(d => d !== '')

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Icon */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'rgba(232,160,32,0.1)', border: '1px solid rgba(232,160,32,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: '28px',
      }}>📧</div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', letterSpacing: '2px', color: 'var(--text-primary)', marginBottom: '8px' }}>
        VÉRIFICATION
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
        Un code à 6 chiffres a été envoyé à<br />
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{maskedEmail}</span>
      </p>

      {/* OTP inputs */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }} onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-${idx}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleOtpChange(idx, e.target.value)}
            onKeyDown={e => handleOtpKeyDown(idx, e)}
            style={{
              width: 46, height: 54,
              borderRadius: '10px',
              border: `2px solid ${error ? '#f87171' : digit ? 'var(--accent)' : 'var(--border)'}`,
              background: digit ? 'rgba(232,160,32,0.08)' : 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '22px', fontWeight: 700,
              textAlign: 'center',
              outline: 'none',
              transition: 'all 0.15s',
              fontFamily: 'var(--font-mono)',
            }}
            onFocus={e => { if (!error) e.target.style.borderColor = 'var(--accent)' }}
            onBlur={e => { if (!digit && !error) e.target.style.borderColor = 'var(--border)' }}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <p style={{ fontSize: '12px', color: '#f87171', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>
          ⚠ {error}
        </p>
      )}

      {/* Verify button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={loading || !filled}
        style={{
          width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
          background: filled ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
          color: filled ? '#000' : 'var(--text-dim)',
          fontSize: '14px', fontWeight: 700,
          cursor: filled && !loading ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s', fontFamily: 'var(--font-body)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          opacity: loading ? 0.8 : 1, marginBottom: '16px',
        }}
        onMouseEnter={e => { if (filled && !loading) e.currentTarget.style.boxShadow = '0 8px 28px rgba(232,160,32,0.35)' }}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
      >
        {loading ? <><Spinner />Vérification...</> : 'Confirmer le code'}
      </button>

      {/* Resend */}
      <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>
        {canResend ? (
          <span onClick={handleResend} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
            Renvoyer le code
          </span>
        ) : (
          <span>
            Renvoyer dans{' '}
            <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
              {countdown}s
            </span>
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Main AuthPage ─────────────────────────────────────────────
export default function AuthPage() {
  const [mode, setMode] = useState(() =>
    window.location.pathname === '/register' ? 'register' : 'login'
  )
  const [showOtp, setShowOtp] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [errors, setErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '', fullName: '', confirmPassword: '' })

  function update(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: null }))
    setApiError(null)
  }

  function validate() {
    const e = {}
    if (!form.email) e.email = 'Email requis'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide'
    if (!form.password) e.password = 'Mot de passe requis'
    else if (form.password.length < 6) e.password = 'Minimum 6 caractères'
    if (mode === 'register') {
      if (!form.fullName) e.fullName = 'Nom requis'
      if (form.confirmPassword !== form.password) e.confirmPassword = 'Les mots de passe ne correspondent pas'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiError(null)

    try {
      if (mode === 'register') {
        // Register → backend renvoie token+user directement ou déclenche OTP
        const res = await fetch(`/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName: form.fullName, email: form.email, password: form.password }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) { setApiError(data.message || 'Erreur lors de l\'inscription'); return }

        // Si le backend renvoie un OTP (pas de token) → afficher écran OTP
        if (!data.token) {
          setPendingEmail(form.email)
          setShowOtp(true)
          return
        }
        // Si le backend renvoie directement token+user
        login(data.token, data.user)
        navigate(from, { replace: true })

      } else {
        // Login normal
        const res = await fetch(`/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        })
        const data = await res.json()
        if (!res.ok) { setApiError(data.message || 'Email ou mot de passe incorrect'); return }
        login(data.token, data.user)
        navigate(from, { replace: true })
      }
    } catch {
      setApiError('Impossible de contacter le serveur')
    } finally {
      setLoading(false)
    }
  }

  function handleOtpSuccess(token, user) {
    login(token, user)
    navigate(from, { replace: true })
  }

  function switchMode(m) {
    setMode(m)
    setErrors({})
    setApiError(null)
    setShowOtp(false)
    setForm({ email: '', password: '', fullName: '', confirmPassword: '' })
    navigate(m === 'login' ? '/login' : '/register', { replace: true })
  }

  return (
    <div
      onClick={() => navigate(-1)}
      style={{
        minHeight: '100vh',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-body)', padding: '20px',
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
      }}
    >
      <div style={{ position: 'fixed', top: '-200px', left: '-200px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,160,32,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-150px', right: '-150px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,160,32,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '420px',
          background: 'var(--bg-secondary)',
          borderRadius: '20px', border: '1px solid var(--border)',
          padding: '40px 36px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.4s ease', cursor: 'default',
        }}
      >
        {/* Logo */}
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '32px', justifyContent: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, color: '#000' }}>C</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '3px', color: 'var(--text-primary)' }}>CINÉBOOK</span>
        </div>

        {/* OTP Screen */}
        {showOtp ? (
          <OtpScreen email={pendingEmail} onSuccess={handleOtpSuccess} />
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '10px', padding: '4px', marginBottom: '28px', border: '1px solid var(--border)' }}>
              {[['login', 'Connexion'], ['register', 'Inscription']].map(([m, label]) => (
                <button key={m} onClick={() => switchMode(m)} style={{
                  flex: 1, padding: '10px', borderRadius: '7px', border: 'none',
                  background: mode === m ? 'var(--accent)' : 'transparent',
                  color: mode === m ? '#000' : 'var(--text-muted)',
                  fontSize: '13px', fontWeight: mode === m ? 700 : 400,
                  cursor: 'pointer', transition: 'all 0.25s ease', fontFamily: 'var(--font-body)',
                }}>{label}</button>
              ))}
            </div>

            {/* Heading */}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '2px', color: 'var(--text-primary)', marginBottom: '6px' }}>
                {mode === 'login' ? 'BON RETOUR !' : 'CRÉER UN COMPTE'}
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {mode === 'login' ? 'Connecte-toi pour accéder à tes réservations.' : 'Rejoins CinéBook et réserve tes places en quelques clics.'}
              </p>
            </div>

            {/* API Error */}
            {apiError && (
              <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚠ {apiError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {mode === 'register' && (
                <Field label="Nom complet" icon={<UserIcon />} value={form.fullName}
                  onChange={v => update('fullName', v)} placeholder="Youssef Ben Ahmed" error={errors.fullName} />
              )}
              <Field label="Adresse email" icon={<MailIcon />} value={form.email}
                onChange={v => update('email', v)} placeholder="you@example.com" type="email" error={errors.email} />
              <Field label="Mot de passe" icon={<LockIcon />} value={form.password}
                onChange={v => update('password', v)} placeholder="••••••••"
                type={showPass ? 'text' : 'password'} error={errors.password}
                suffix={
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 4px' }}>
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                }
              />
              {mode === 'register' && (
                <Field label="Confirmer le mot de passe" icon={<LockIcon />} value={form.confirmPassword}
                  onChange={v => update('confirmPassword', v)} placeholder="••••••••"
                  type="password" error={errors.confirmPassword} />
              )}

              {mode === 'login' && (
                <div style={{ textAlign: 'right', marginTop: '-4px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>Mot de passe oublié ?</span>
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                marginTop: '4px', width: '100%', padding: '14px',
                borderRadius: '10px', border: 'none',
                background: 'var(--accent)', color: '#000',
                fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontFamily: 'var(--font-body)', opacity: loading ? 0.8 : 1,
              }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 28px rgba(232,160,32,0.35)' }}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                {loading ? <><Spinner />{mode === 'login' ? 'Connexion...' : 'Création...'}</> : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '2px 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>ou</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>

              <button type="button" style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)',
                color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.2s', fontFamily: 'var(--font-body)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                <GoogleIcon /> Continuer avec Google
              </button>
            </form>

            <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--text-dim)', textAlign: 'center' }}>
              {mode === 'login' ? "Pas encore de compte ? " : "Déjà membre ? "}
              <span onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>
                {mode === 'login' ? "S'inscrire" : 'Se connecter'}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Field component ───────────────────────────────────────────
function Field({ label, icon, value, onChange, placeholder, type = 'text', error, suffix }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '7px' }}>
        {label}
      </label>
      <div style={{
        display: 'flex', alignItems: 'center', background: 'var(--bg-card)',
        border: `1px solid ${error ? '#f87171' : focused ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: '9px', padding: '0 14px', transition: 'border-color 0.2s', gap: '10px',
      }}>
        <span style={{ color: error ? '#f87171' : focused ? 'var(--accent)' : 'var(--text-dim)', display: 'flex', transition: 'color 0.2s' }}>{icon}</span>
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder={placeholder}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '14px', padding: '13px 0', fontFamily: 'var(--font-body)' }}
        />
        {suffix}
      </div>
      {error && <p style={{ fontSize: '11px', color: '#f87171', marginTop: '5px', fontFamily: 'var(--font-mono)' }}>⚠ {error}</p>}
    </div>
  )
}

// ─── Icons & Spinner ───────────────────────────────────────────
const MailIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
const LockIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
const UserIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
const EyeIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeOffIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
const GoogleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
const Spinner = () => (<><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style><div style={{ width: 15, height: 15, border: '2px solid rgba(0,0,0,0.2)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /></>)
