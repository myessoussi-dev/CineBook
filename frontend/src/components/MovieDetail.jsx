import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMovieSessions } from '../hooks/useMovies'
import { useAuth } from '../context/AuthContext'
import LoginPromptModal from './LoginPromptModal'
import Icon from './Icon'
import TrailerModal from './TrailerModal'
import Reveal from './Reveal'
import {
  formatTime, formatRuntime, formatPrice, formatReleaseDate, getYear, getRoomFormat,
  groupSessionsByDate, dayParts,
} from '../utils/format'
import './MovieDetail.css'

const TMDB = 'https://image.tmdb.org/t/p/'

export default function MovieDetail({ movie, loading, error }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { sessions, loading: sessLoading } = useMovieSessions(movie?.id)
  const [selectedDate, setSelectedDate] = useState(0)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => { setSelectedDate(0) }, [movie?.id])

  if (loading) return (
    <div className="state state-full">
      <div className="spinner spinner-lg" />
      <p>Loading movie…</p>
    </div>
  )

  if (error || !movie) return (
    <div className="state state-full">
      <div className="state-icon"><Icon name="film" size={26} /></div>
      <h2>Movie not found</h2>
      <p>{error || 'This movie does not exist or is no longer showing.'}</p>
      <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>Browse movies</button>
    </div>
  )

  const year = getYear(movie.releaseDate)
  const runtime = formatRuntime(movie.runtime)
  const groupedDates = groupSessionsByDate(sessions)
  const activeDateGroup = groupedDates[selectedDate] || groupedDates[0]

  function handleSessionClick(s) {
    if (!isAuthenticated) {
      setShowLoginModal(true)
      return
    }
    navigate(`/movies/${movie.id}/sessions/${s.id}/seats`, {
      state: { session: s, movie }
    })
  }

  const facts = [
    { label: 'Rating', value: movie.voteAverage > 0 ? `${movie.voteAverage.toFixed(1)} / 10` : 'Not rated',
      sub: movie.voteCount > 0 ? `${movie.voteCount.toLocaleString('en-GB')} votes` : null },
    { label: 'Runtime', value: runtime || 'Unknown', sub: movie.runtime ? `${movie.runtime} minutes` : null },
    { label: 'Release', value: movie.releaseDate ? formatReleaseDate(movie.releaseDate) : 'Unknown' },
    { label: 'Genres', value: movie.categories?.map(c => c.name).join(', ') || 'Unknown' },
  ]

  function scrollToShowtimes(e) {
    e.preventDefault()
    document.getElementById('showtimes')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <article className="md page-anim">
      {/* Hero */}
      <header className="md-hero">
        <div className="md-media" aria-hidden="true">
          {(movie.backdropPath || movie.posterPath) && (
            <picture>
              {movie.posterPath && <source media="(max-width: 640px)" srcSet={`${TMDB}w780${movie.posterPath}`} />}
              <img src={`${TMDB}w1280${movie.backdropPath || movie.posterPath}`} alt="" fetchpriority="high" />
            </picture>
          )}
          <div className="md-shade" />
        </div>

        <div className="md-hero-inner container">
          <button type="button" className="back-link md-back" onClick={() => navigate(-1)}>
            <Icon name="arrow-left" size={16} />
            Back
          </button>

          <div className="md-head">
            {movie.categories?.length > 0 && (
              <div className="md-genres">
                {movie.categories.slice(0, 3).map(cat => <span key={cat.id} className="tag">{cat.name}</span>)}
              </div>
            )}
            <h1 className="md-title display">{movie.title}</h1>
            <p className="md-meta">
              {movie.voteAverage > 0 && (
                <span className="rating"><Icon name="star" size={14} />{movie.voteAverage.toFixed(1)}</span>
              )}
              {year && <span>{year}</span>}
              {runtime && <span>{runtime}</span>}
            </p>
            <div className="md-actions">
              <a href="#showtimes" className="btn btn-primary btn-lg" onClick={scrollToShowtimes}>
                <Icon name="ticket" size={18} />
                Get tickets
              </a>
              {movie.videoKey && (
                <button type="button" className="btn btn-secondary btn-lg" onClick={() => setShowTrailer(true)}>
                  <Icon name="play" size={15} />
                  Trailer
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container md-body">
        {/* About */}
        <Reveal as="section" className="md-about" aria-labelledby="about-title">
          <h2 id="about-title" className="eyebrow">Storyline</h2>
          {movie.overview
            ? <p className="md-overview">{movie.overview}</p>
            : <p className="md-overview dim">No synopsis available.</p>}

          <dl className="md-facts">
            {facts.map(f => (
              <div key={f.label} className="md-fact">
                <dt>{f.label}</dt>
                <dd>{f.value}{f.sub && <span>{f.sub}</span>}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Showtimes */}
        <section className="md-show" id="showtimes" aria-labelledby="showtimes-title">
          <Reveal className="md-show-head">
            <h2 id="showtimes-title" className="section-title">Showtimes</h2>
            <p className="section-sub">
              {sessLoading ? 'Loading showtimes…'
                : sessions.length === 0 ? 'No showtimes scheduled for this movie yet.'
                  : 'Pick a day, then a time to choose your seats.'}
            </p>
          </Reveal>

          {sessLoading ? (
            <div className="slot-grid">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 112, borderRadius: 'var(--r-lg)' }} />)}
            </div>
          ) : sessions.length === 0 ? (
            <div className="md-empty">
              <Icon name="calendar" size={20} />
              <p>Check back soon, new showtimes are added every week.</p>
            </div>
          ) : (
            <Reveal delay={80}>
              <div className="date-tabs scroll-x" role="tablist" aria-label="Date">
                {groupedDates.map((g, i) => {
                  const p = dayParts(g.date)
                  const active = activeDateGroup === g
                  return (
                    <button key={g.key} type="button" role="tab" aria-selected={active}
                      className={`date-tab ${active ? 'is-active' : ''}`} onClick={() => setSelectedDate(i)}>
                      <span className="date-tab-week">{p.relative || p.weekday}</span>
                      <span className="date-tab-day num">{p.day}</span>
                      <span className="date-tab-month">{p.month}</span>
                    </button>
                  )
                })}
              </div>

              <ul className="slot-grid" key={activeDateGroup?.key}>
                {activeDateGroup?.sessions.map((s, i) => {
                  const fmt = getRoomFormat(s.room?.name)
                  const capacity = s.room?.Capacity ?? s.room?.capacity ?? 0
                  const almostFull = capacity > 0 && capacity < 20
                  return (
                    <li key={s.id} style={{ '--i': i }}>
                      <button type="button" className="slot" onClick={() => handleSessionClick(s)}>
                        <span className="slot-top">
                          <span className="slot-time num">{formatTime(s.startTime)}</span>
                          <span className={`format-badge format-${fmt}`}>{fmt}</span>
                        </span>
                        <span className="slot-room">{s.room?.name}</span>
                        <span className="slot-bottom">
                          <span className="slot-price num">{formatPrice(s.price)}</span>
                          {capacity > 0 && (
                            <span className={`slot-cap ${almostFull ? 'is-low' : ''}`}>
                              {almostFull ? `${capacity} left` : `${capacity} seats`}
                            </span>
                          )}
                        </span>
                        <Icon name="arrow-right" size={16} className="slot-go" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </Reveal>
          )}
        </section>
      </div>

      {showTrailer && movie.videoKey && (
        <TrailerModal videoKey={movie.videoKey} title={movie.title} onClose={() => setShowTrailer(false)} />
      )}

      {showLoginModal && (
        <LoginPromptModal
          onClose={() => setShowLoginModal(false)}
          from={`/movies/${movie.id}`}
        />
      )}
    </article>
  )
}
