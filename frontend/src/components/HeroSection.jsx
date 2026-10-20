import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon'
import { POSTER_THUMB, formatRuntime, getYear } from '../utils/format'
import './Hero.css'

const SLIDE_MS = 7000
const TMDB = 'https://image.tmdb.org/t/p/'

function backdropSet(path) {
  return {
    src: `${TMDB}w1280${path}`,
    srcSet: `${TMDB}w780${path} 780w, ${TMDB}w1280${path} 1280w, ${TMDB}original${path} 1920w`,
  }
}

export default function HeroSection({ movies }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const navigate = useNavigate()

  const featured = movies?.slice(0, 5) || []
  const current = featured[activeIdx]

  // Défilement auto ; la pause (survol souris) conserve le temps restant
  const remaining = useRef(SLIDE_MS)
  const lastIdx = useRef(activeIdx)
  useEffect(() => {
    if (lastIdx.current !== activeIdx) { remaining.current = SLIDE_MS; lastIdx.current = activeIdx }
    if (featured.length < 2 || paused) return
    const start = Date.now()
    const t = setTimeout(() => setActiveIdx(i => (i + 1) % featured.length), remaining.current)
    return () => { clearTimeout(t); remaining.current = Math.max(0, remaining.current - (Date.now() - start)) }
  }, [activeIdx, featured.length, paused])

  function go(delta) {
    setActiveIdx(i => (i + delta + featured.length) % featured.length)
  }

  function onTouchStart(e) { touchX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  if (!current) return null

  const year = getYear(current.releaseDate)
  const runtime = formatRuntime(current.runtime)
  const genres = current.categories?.slice(0, 3).map(c => c.name) || []

  return (
    <section
      className="hero"
      aria-roledescription="carrousel"
      aria-label="Films à l'affiche"
      onPointerEnter={e => { if (e.pointerType === 'mouse') setPaused(true) }}
      onPointerLeave={e => { if (e.pointerType === 'mouse') setPaused(false) }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Backdrops (fondu enchaîné) */}
      <div className="hero-media" aria-hidden="true">
        {featured.map((m, i) => (
          m.backdropPath && (
            <img
              key={m.id}
              {...backdropSet(m.backdropPath)}
              sizes="100vw"
              alt=""
              className={`hero-img ${i === activeIdx ? 'is-active' : ''}`}
              fetchpriority={i === 0 ? 'high' : 'low'}
            />
          )
        ))}
        <div className="hero-shade" />
      </div>

      {/* Contenu */}
      <div className="hero-inner container">
        <div className="hero-content" key={current.id}>
          <p className="hero-kicker">
            <span className="hero-live" />À l'affiche cette semaine
          </p>

          <h1 className="hero-title display">{current.title}</h1>

          <div className="hero-meta">
            {current.voteAverage > 0 && (
              <span className="rating"><Icon name="star" size={15} />{current.voteAverage.toFixed(1)}</span>
            )}
            {year && <span>{year}</span>}
            {runtime && <span>{runtime}</span>}
            {genres.length > 0 && <span className="hero-genres">{genres.join(', ')}</span>}
          </div>

          {current.overview && <p className="hero-overview">{current.overview}</p>}

          <div className="hero-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={() => navigate(`/movies/${current.id}`)}>
              <Icon name="ticket" size={18} />
              Réserver une place
            </button>
            {current.videoKey ? (
              <a className="btn btn-secondary btn-lg" href={`https://www.youtube.com/watch?v=${current.videoKey}`}
                target="_blank" rel="noopener noreferrer">
                <Icon name="play" size={16} />
                Bande-annonce
              </a>
            ) : (
              <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate(`/movies/${current.id}`)}>
                Voir le film
              </button>
            )}
          </div>
        </div>

        {/* Sélecteur + progression */}
        {featured.length > 1 && (
          <div className="hero-rail" role="tablist" aria-label="Choisir un film">
            {featured.map((m, i) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={i === activeIdx}
                aria-label={m.title}
                className={`hero-thumb ${i === activeIdx ? 'is-active' : ''}`}
                onClick={() => setActiveIdx(i)}
              >
                <span className="hero-thumb-img">
                  {m.posterPath && <img src={`${POSTER_THUMB}${m.posterPath}`} alt="" loading="lazy" />}
                </span>
                <span className="hero-bar">
                  <span
                    className="hero-bar-fill"
                    style={i === activeIdx ? { animationDuration: `${SLIDE_MS}ms`, animationPlayState: paused ? 'paused' : 'running' } : undefined}
                  />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
