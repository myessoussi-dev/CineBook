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

  // Countdown before the code can be resent
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
    if (code.length < 6) { setError('Enter all 6 digits of the code.'); return }
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
        // Wrong code: show the error, then reset after 1.5s
        setError(data.message || 'Incorrect code. Check the latest email we sent you.')
        setLoading(false)
        setTimeout(() => {
          setError(null)
          setOtp(['', '', '', '', '', ''])
          document.getElementById('otp-0')?.focus()
        }, 1500)
        return
      }
      // Correct code: success animation, then redirect
      setSuccess(true)
      setTimeout(() => {
        onSuccess(data.token, data.user)
      }, 1200)
    } catch {
      setError('The server is not responding. Please try again in a moment.')
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

  // ── Success screen ──
  if (success) return (
    <div className="otp-success">
      <div className="confirm-check" aria-hidden="true">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" pathLength="1" className="confirm-check-path" />
        </svg>
      </div>
      <h2>Email verified</h2>
      <p>Signing you in…</p>
    </div>
  )

  return (
    <form className="auth-form" onSubmit={handleVerify}>
      <button type="button" className="back-link" onClick={onBack}>
        <Icon name="arrow-left" size={16} />
        Change email address
      </button>

      <div className="auth-heading">
        <h1>Check your email</h1>
        <p>Enter the 6-digit code we sent to <strong>{maskedEmail}</strong>.</p>
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
            aria-label={`Digit ${idx + 1}`}
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
        {loading ? <><span className="spinner spinner-ink" />Verifying…</> : 'Verify code'}
      </button>

      <p className="auth-switch">
        {canResend ? (
          <>Didn't get it? <button type="button" className="btn-text" onClick={handleResend}>Resend code</button></>
        ) : (
          <>You can resend the code in <strong className="num">{countdown} s</strong></>
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

  const featured = movies.find(m => m.backdropPath)
  const backdrop = featured?.backdropPath

  function update(field, val) {
    setForm(f => ({ ...f, [field]: val }))
    setErrors(e => ({ ...e, [field]: null }))
    setApiError(null)
  }

  function validate() {
    const e = {}
    if (!form.email) e.email = 'Enter your email address.'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'This email address is not valid.'
    if (!form.password) e.password = 'Enter your password.'
    else if (form.password.length < 6) e.password = 'Your password must be at least 6 characters.'
    if (mode === 'register') {
      if (!form.fullName) e.fullName = 'Enter your name.'
      if (form.confirmPassword !== form.password) e.confirmPassword = 'The passwords do not match.'
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
        if (!res.ok) { setApiError(data.message || 'Sign-up failed. Please try again.'); return }

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
        if (!res.ok) { setApiError(data.message || 'Incorrect email or password.'); return }
        login(data.token, data.user)
        navigate(from, { replace: true })
      }
    } catch {
      setApiError('The server is not responding. Please try again in a moment.')
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
    // Go back if there is an in-app previous page, otherwise home
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/')
  }

  return (
    <div className="auth">
      {/* Blurred movie backdrop */}
      <div className="auth-bg" aria-hidden="true">
        {backdrop && <img src={`${TMDB}w1280${backdrop}`} alt="" />}
      </div>

      <header className="auth-topbar container">
        <Logo size={28} />
        <button type="button" className="icon-btn" onClick={handleClose} aria-label="Close">
          <Icon name="x" size={20} />
        </button>
      </header>

      <main className="auth-panel">
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
                {[['login', 'Sign in'], ['register', 'Sign up']].map(([m, label]) => (
                  <button key={m} type="button" role="tab" aria-selected={mode === m}
                    className={`auth-tab ${mode === m ? 'is-active' : ''}`} onClick={() => switchMode(m)}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="auth-heading">
                <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
                <p>{mode === 'login' ? 'Sign in to book tickets and find your bookings.' : 'It\'s free and lets you book seats in a few clicks.'}</p>
              </div>

              {apiError && (
                <div className="alert alert-error" role="alert">
                  <Icon name="alert-circle" size={16} />
                  <p>{apiError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form" noValidate>
                {mode === 'register' && (
                  <Field id="fullName" label="Full name" icon="user" value={form.fullName} autoComplete="name"
                    onChange={v => update('fullName', v)} placeholder="First and last name" error={errors.fullName} />
                )}
                <Field id="email" label="Email address" icon="mail" value={form.email} autoComplete="email"
                  onChange={v => update('email', v)} placeholder="you@example.com" type="email" error={errors.email} />
                <Field id="password" label="Password" icon="lock" value={form.password}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  onChange={v => update('password', v)} placeholder={mode === 'register' ? 'At least 6 characters' : ''}
                  type={showPass ? 'text' : 'password'} error={errors.password}
                  suffix={
                    <button type="button" className="field-suffix" onClick={() => setShowPass(s => !s)}
                      aria-label={showPass ? 'Hide password' : 'Show password'}>
                      <Icon name={showPass ? 'eye-off' : 'eye'} size={18} />
                    </button>
                  }
                />
                {mode === 'register' && (
                  <Field id="confirmPassword" label="Confirm password" icon="lock" value={form.confirmPassword}
                    autoComplete="new-password"
                    onChange={v => update('confirmPassword', v)}
                    type="password" error={errors.confirmPassword} />
                )}

                <button type="submit" className="btn btn-primary btn-lg btn-block auth-submit" disabled={loading}>
                  {loading
                    ? <><span className="spinner spinner-ink" />{mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
                    : mode === 'login' ? 'Sign in' : 'Create account'}
                </button>
              </form>

              <p className="auth-switch">
                {mode === 'login' ? 'New to CinéBook? ' : 'Already have an account? '}
                <button type="button" className="btn-text" onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>
                  {mode === 'login' ? 'Create an account' : 'Sign in'}
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
