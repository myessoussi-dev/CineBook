import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon'
import TrailerModal from './TrailerModal'
import { formatRuntime, getYear } from '../utils/format'
import './Hero.css'

const SLIDE_MS = 8000
const TMDB = 'https://image.tmdb.org/t/p/'

/** Full-width featured movie with a slow crossfade between the most popular titles */
export default function HeroSection({ movies }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [trailer, setTrailer] = useState(null)
  const touchX = useRef(null)
  const navigate = useNavigate()

  const featured = movies?.slice(0, 5) || []
  const current = featured[activeIdx]
  const n = featured.length

  // Autoplay; hovering with a mouse pauses it and keeps the remaining time
  const remaining = useRef(SLIDE_MS)
  const lastIdx = useRef(activeIdx)
  useEffect(() => {
    if (lastIdx.current !== activeIdx) { remaining.current = SLIDE_MS; lastIdx.current = activeIdx }
    if (n < 2 || paused || trailer) return
    const start = Date.now()
    const t = setTimeout(() => setActiveIdx(i => (i + 1) % n), remaining.current)
    return () => { clearTimeout(t); remaining.current = Math.max(0, remaining.current - (Date.now() - start)) }
  }, [activeIdx, n, paused, trailer])

  function go(delta) { setActiveIdx(i => (i + delta + n) % n) }
  function onTouchStart(e) { touchX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  if (!current) return null

  const meta = [
    getYear(current.releaseDate),
    formatRuntime(current.runtime),
    current.categories?.slice(0, 2).map(c => c.name).join(', '),
  ].filter(Boolean)

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured movies"
      onPointerEnter={e => { if (e.pointerType === 'mouse') setPaused(true) }}
      onPointerLeave={e => { if (e.pointerType === 'mouse') setPaused(false) }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hero-media" aria-hidden="true">
        {featured.map((m, i) => {
          // Only the visible slide, the previous one (fading out) and the next one (preloaded)
          const near = i === activeIdx || i === (activeIdx + 1) % n || i === (activeIdx - 1 + n) % n
          if (!near || !(m.backdropPath || m.posterPath)) return null
          return (
            <picture key={m.id} className={`hero-slide ${i === activeIdx ? 'is-active' : ''}`}>
              {m.posterPath && <source media="(max-width: 640px)" srcSet={`${TMDB}w780${m.posterPath}`} />}
              <img
                src={`${TMDB}w1280${m.backdropPath || m.posterPath}`}
                alt=""
                fetchpriority={i === activeIdx ? 'high' : 'low'}
              />
            </picture>
          )
        })}
        <div className="hero-shade" />
      </div>

      <div className="hero-inner container">
        <div className="hero-content" key={current.id}>
          <p className="eyebrow hero-eyebrow">Now in cinemas</p>
          <h1 className="hero-title display">{current.title}</h1>
          <p className="hero-meta">
            {current.voteAverage > 0 && (
              <span className="rating"><Icon name="star" size={14} />{current.voteAverage.toFixed(1)}</span>
            )}
            {meta.map(item => <span key={item}>{item}</span>)}
          </p>
          {current.overview && <p className="hero-overview">{current.overview}</p>}
          <div className="hero-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate(`/movies/${current.id}`)}>
              <Icon name="ticket" size={18} />
              Get tickets
            </button>
            {current.videoKey ? (
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => setTrailer(current)}>
                <Icon name="play" size={15} />
                Trailer
              </button>
            ) : (
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(`/movies/${current.id}`)}>
                More info
              </button>
            )}
          </div>
        </div>

        {n > 1 && (
          <div className="hero-progress" role="tablist" aria-label="Featured movie">
            {featured.map((m, i) => (
              <button key={m.id} type="button" role="tab" aria-selected={i === activeIdx} aria-label={m.title}
                className={`hero-bar ${i === activeIdx ? 'is-active' : ''} ${i < activeIdx ? 'is-done' : ''}`}
                onClick={() => setActiveIdx(i)}>
                <span className="hero-bar-fill"
                  style={i === activeIdx ? { animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused || trailer ? 'paused' : 'running' } : undefined} />
              </button>
            ))}
          </div>
        )}
      </div>

      {trailer && <TrailerModal videoKey={trailer.videoKey} title={trailer.title} onClose={() => setTrailer(null)} />}
    </section>
  )
}
