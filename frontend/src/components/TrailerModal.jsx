import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'
import './TrailerModal.css'

/**
 * Plays a YouTube trailer inside the site.
 * Uses youtube-nocookie.com (privacy-enhanced mode: no tracking cookies until the video is played).
 */
export default function TrailerModal({ videoKey, title, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoKey)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`

  // Rendered in <body> so no parent (tile, carousel) can clip it or catch its events
  return createPortal(
    <div className="trailer-backdrop" onClick={onClose}>
      <div className="trailer" role="dialog" aria-modal="true" aria-label={`${title} trailer`} onClick={e => e.stopPropagation()}>
        <div className="trailer-head">
          <p className="trailer-title">{title}<span>Trailer</span></p>
          <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Close trailer">
            <Icon name="x" size={18} />
          </button>
        </div>
        <div className="trailer-frame">
          <iframe
            src={src}
            title={`${title} trailer`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>,
    document.body
  )
}
