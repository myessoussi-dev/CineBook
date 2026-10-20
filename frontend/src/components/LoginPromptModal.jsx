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
        <button type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Fermer">
          <Icon name="x" size={18} />
        </button>

        <div className="modal-icon"><Icon name="ticket" size={24} /></div>

        <h2 id="login-prompt-title">Connectez-vous pour réserver</h2>
        <p>Un compte vous permet de choisir vos sièges et de recevoir vos billets par email. L'inscription est gratuite.</p>

        <div className="modal-actions">
          <button type="button" className="btn btn-primary btn-lg btn-block" autoFocus
            onClick={() => navigate('/login', { state: { from } })}>
            Se connecter
          </button>
          <button type="button" className="btn btn-ghost btn-lg btn-block"
            onClick={() => navigate('/register', { state: { from } })}>
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  )
}
