import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMovies } from '../hooks/useMovies'
import Logo from '../components/Logo'
import Icon from '../components/Icon'
import './AuthPage.css'

const TMDB = 'https://image.tmdb.org/t/p/'

// ─── OTP Screen ───────────────────────────────────────────────
function OtpScreen({ email, onSuccess, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [resendCount, setResendCount] = useState(0)
  const canResend = countdown <= 0

  // Compte à rebours avant de pouvoir renvoyer le code
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  useEffect(() => { document.getElementById('otp-0')?.focus() }, [])

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
      e.preventDefault()
      setOtp(paste.split(''))
      document.getElementById('otp-5')?.focus()
    }
  }

  async function handleVerify(e) {
    e?.preventDefault()
    const code = otp.join('')
    if (code.length < 6) { setError('Saisissez les 6 chiffres du code.'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode: code }),
      })
      const data = await res.json()
      if (!res.ok) {
        // Code faux : afficher l'erreur, puis reset après 1.5s
        setError(data.message || 'Code incorrect. Vérifiez le dernier email reçu.')
        setLoading(false)
        setTimeout(() => {
          setError(null)
          setOtp(['', '', '', '', '', ''])
          document.getElementById('otp-0')?.focus()
        }, 1500)
        return
      }
      // Code bon : animation succès, puis redirection
      setSuccess(true)
      setTimeout(() => {
        onSuccess(data.token, data.user)
      }, 1200)
    } catch {
      setError('Le serveur ne répond pas. Réessayez dans un instant.')
      setLoading(false)
    }
  }

  async function handleResend() {
    if (!canResend) return
    setResendCount(c => c + 1)
    setCountdown(resendCount >= 1 ? 60 : 30)
    setOtp(['', '', '', '', '', ''])
    setError(null)
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

  // ── Écran succès ──
  if (success) return (
    <div className="otp-success">
      <div className="confirm-check" aria-hidden="true">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" pathLength="1" className="confirm-check-path" />
        </svg>
      </div>
      <h2>Adresse vérifiée</h2>
      <p>Connexion en cours…</p>
    </div>
  )

  return (
    <form className="auth-form" onSubmit={handleVerify}>
      <button type="button" className="back-link" onClick={onBack}>
        <Icon name="arrow-left" size={16} />
        Modifier l'adresse email
      </button>

      <div className="auth-heading">
        <h1>Vérifiez votre email</h1>
        <p>Saisissez le code à 6 chiffres envoyé à <strong>{maskedEmail}</strong>.</p>
      </div>

      <div className={`otp ${error ? 'has-error' : ''}`} onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-${idx}`}
            type="text"
            inputMode="numeric"
            autoComplete={idx === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit}
            aria-label={`Chiffre ${idx + 1}`}
            className={digit ? 'is-filled' : ''}
            onChange={e => handleOtpChange(idx, e.target.value)}
            onKeyDown={e => handleOtpKeyDown(idx, e)}
          />
        ))}
      </div>

      {error && (
        <p className="field-error otp-error" role="alert"><Icon name="alert-circle" size={14} />{error}</p>
      )}

      <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading || !filled}>
        {loading ? <><span className="spinner spinner-ink" />Vérification…</> : 'Valider le code'}
      </button>

      <p className="auth-switch">
        {canResend ? (
          <>Rien reçu ? <button type="button" className="btn-text" onClick={handleResend}>Renvoyer le code</button></>
        ) : (
          <>Vous pourrez renvoyer le code dans <strong className="num">{countdown} s</strong></>
        )}
      </p>
    </form>
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
  const { movies } = useMovies()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [form, setForm] = useState({ email: '', password: '', fullName: '', confirmPassword: '' })

  const backdrop = movies.find(m => m.backdropPath)?.backdropPath

  function update(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: null }))
    setApiError(null)
  }

  function validate() {
    const e = {}
    if (!form.email) e.email = 'Saisissez votre adresse email.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Cette adresse email n\'est pas valide.'
    if (!form.password) e.password = 'Saisissez votre mot de passe.'
    else if (form.password.length < 6) e.password = 'Le mot de passe doit contenir au moins 6 caractères.'
    if (mode === 'register') {
      if (!form.fullName) e.fullName = 'Saisissez votre nom.'
      if (form.confirmPassword !== form.password) e.confirmPassword = 'Les deux mots de passe ne correspondent pas.'
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
        const res = await fetch(`/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName: form.fullName, email: form.email, password: form.password }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) { setApiError(data.message || "L'inscription a échoué. Réessayez."); return }

        if (!data.token) {
          setPendingEmail(form.email)
          setShowOtp(true)
          return
        }
        login(data.token, data.user)
        navigate(from, { replace: true })

      } else {
        const res = await fetch(`/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        })
        const data = await res.json()
        if (!res.ok) { setApiError(data.message || 'Email ou mot de passe incorrect.'); return }
        login(data.token, data.user)
        navigate(from, { replace: true })
      }
    } catch {
      setApiError('Le serveur ne répond pas. Réessayez dans un instant.')
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
    navigate(m === 'login' ? '/login' : '/register', { replace: true, state: location.state })
  }

  function handleClose() {
    // Retour à la page précédente si elle existe dans l'app, sinon accueil
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/')
  }

  return (
    <div className="auth">
      {/* Panneau visuel (desktop) */}
      <aside className="auth-visual" aria-hidden="true">
        {backdrop && (
          <img src={`${TMDB}w1280${backdrop}`} alt="" className="auth-visual-img" />
        )}
        <div className="auth-visual-shade" />
        <div className="auth-visual-content">
          <Logo size={34} />
          <div>
            <p className="auth-visual-title display">Votre prochaine séance commence ici.</p>
            <p className="auth-visual-text">Choisissez votre film, votre horaire et vos sièges. Votre billet arrive par email.</p>
          </div>
        </div>
      </aside>

      {/* Formulaire */}
      <main className="auth-panel">
        <div className="auth-topbar">
          <Logo size={30} className="auth-logo-mobile" />
          <button type="button" className="icon-btn" onClick={handleClose} aria-label="Fermer">
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="auth-card">
          {showOtp ? (
            <OtpScreen
              email={pendingEmail}
              onSuccess={handleOtpSuccess}
              onBack={() => setShowOtp(false)}
            />
          ) : (
            <>
              <div className="auth-tabs" role="tablist">
                {[['login', 'Connexion'], ['register', 'Inscription']].map(([m, label]) => (
                  <button key={m} type="button" role="tab" aria-selected={mode === m}
                    className={`auth-tab ${mode === m ? 'is-active' : ''}`} onClick={() => switchMode(m)}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="auth-heading">
                <h1>{mode === 'login' ? 'Bon retour parmi nous' : 'Créer votre compte'}</h1>
                <p>{mode === 'login' ? 'Connectez-vous pour réserver et retrouver vos billets.' : 'Gratuit, et utile pour réserver vos places en quelques clics.'}</p>
              </div>

              {apiError && (
                <div className="alert alert-error" role="alert">
                  <Icon name="alert-circle" size={16} />
                  <p>{apiError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                {mode === 'register' && (
                  <Field id="fullName" label="Nom complet" icon="user" value={form.fullName} autoComplete="name"
                    onChange={v => update('fullName', v)} placeholder="Prénom Nom" error={errors.fullName} />
                )}
                <Field id="email" label="Adresse email" icon="mail" value={form.email} autoComplete="email"
                  onChange={v => update('email', v)} placeholder="vous@exemple.com" type="email" error={errors.email} />
                <Field id="password" label="Mot de passe" icon="lock" value={form.password}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  onChange={v => update('password', v)} placeholder={mode === 'register' ? '6 caractères minimum' : ''}
                  type={showPass ? 'text' : 'password'} error={errors.password}
                  suffix={
                    <button type="button" className="field-suffix" onClick={() => setShowPass(s => !s)}
                      aria-label={showPass ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                      <Icon name={showPass ? 'eye-off' : 'eye'} size={18} />
                    </button>
                  }
                />
                {mode === 'register' && (
                  <Field id="confirmPassword" label="Confirmer le mot de passe" icon="lock" value={form.confirmPassword}
                    autoComplete="new-password"
                    onChange={v => update('confirmPassword', v)}
                    type="password" error={errors.confirmPassword} />
                )}

                <button type="submit" className="btn btn-primary btn-lg btn-block auth-submit" disabled={loading}>
                  {loading
                    ? <><span className="spinner spinner-ink" />{mode === 'login' ? 'Connexion…' : 'Création du compte…'}</>
                    : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                </button>
              </form>

              <p className="auth-switch">
                {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà inscrit ? '}
                <button type="button" className="btn-text" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>
                  {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
                </button>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

// ─── Field component ───────────────────────────────────────────
function Field({ id, label, icon, value, onChange, placeholder, type = 'text', error, suffix, autoComplete }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label className="field-label" htmlFor={id}>{label}</label>
      <div className="field-control">
        <Icon name={icon} size={17} />
        <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} autoComplete={autoComplete}
          aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} />
        {suffix}
      </div>
      {error && <p className="field-error" id={`${id}-error`}><Icon name="alert-circle" size={13} />{error}</p>}
    </div>
  )
}
