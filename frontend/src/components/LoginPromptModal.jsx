import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon'

export default function LoginPromptModal({ onClose, from }) {
  const navigate = useNavigate()

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="login-prompt-title"
        onClick={e => e.stopPropagation()}>
        <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Close">
          <Icon name="x" size={18} />
        </button>

        <div className="modal-icon"><Icon name="ticket" size={24} /></div>

        <h2 id="login-prompt-title">Sign in to book</h2>
        <p>With an account you can pick your seats and get your tickets by email. It's free.</p>

        <div className="modal-actions">
          <button type="button" className="btn btn-primary btn-lg btn-block" autoFocus
            onClick={() => navigate('/login', { state: { from } })}>
            Sign in
          </button>
          <button type="button" className="btn btn-ghost btn-lg btn-block"
            onClick={() => navigate('/register', { state: { from } })}>
            Create an account
          </button>
        </div>
      </div>
    </div>
  )
}
