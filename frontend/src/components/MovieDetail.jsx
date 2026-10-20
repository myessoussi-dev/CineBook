import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMovieSessions } from '../hooks/useMovies'
import { useAuth } from '../context/AuthContext'
import LoginPromptModal from './LoginPromptModal'
import Icon from './Icon'
import {
  POSTER_BASE, formatTime, formatRuntime, formatPrice, getYear, getRoomFormat,
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
  const sessionsRef = useRef(null)

  useEffect(() => { setSelectedDate(0) }, [movie?.id])

  if (loading) return (
    <div className="state state-full">
      <div className="spinner spinner-lg" />
      <p>Chargement du film…</p>
    </div>
  )

  if (error || !movie) return (
    <div className="state state-full">
      <div className="state-icon"><Icon name="film" size={26} /></div>
      <h2>Film introuvable</h2>
      <p>{error || "Ce film n'existe pas ou n'est plus à l'affiche."}</p>
      <button type="button" className="btn btn-primary" onClick={() => navigate('/')}>Voir les films à l'affiche</button>
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

  function scrollToSessions() {
    sessionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <article className="detail fade-in">
      {/* Backdrop */}
      <div className="detail-backdrop" aria-hidden="true">
        {movie.backdropPath && (
          <img
            src={`${TMDB}w1280${movie.backdropPath}`}
            srcSet={`${TMDB}w780${movie.backdropPath} 780w, ${TMDB}w1280${movie.backdropPath} 1280w, ${TMDB}original${movie.backdropPath} 1920w`}
            sizes="100vw"
            alt=""
          />
        )}
        <div className="detail-backdrop-shade" />
      </div>

      <div className="container detail-top">
        <button type="button" className="icon-btn detail-back" onClick={() => navigate(-1)} aria-label="Retour">
          <Icon name="arrow-left" size={18} />
        </button>
      </div>

      <div className="container detail-grid">
        {/* Affiche */}
        <div className="detail-poster">
          {movie.posterPath ? (
            <img src={`${POSTER_BASE}${movie.posterPath}`} alt={`Affiche de ${movie.title}`} />
          ) : (
            <div className="detail-poster-empty"><Icon name="film" size={36} strokeWidth={1.4} /></div>
          )}
        </div>

        {/* Infos */}
        <div className="detail-info">
          <h1 className="detail-title display">{movie.title}</h1>

          <div className="detail-meta">
            {movie.voteAverage > 0 && (
              <span className="rating">
                <Icon name="star" size={16} />
                {movie.voteAverage.toFixed(1)}
                {movie.voteCount > 0 && <span className="detail-votes">({movie.voteCount.toLocaleString('fr-FR')} votes)</span>}
              </span>
            )}
            {year && <span>{year}</span>}
            {runtime && <span>{runtime}</span>}
          </div>

          {movie.categories?.length > 0 && (
            <div className="detail-genres">
              {movie.categories.map(cat => <span key={cat.id} className="tag">{cat.name}</span>)}
            </div>
          )}
        </div>

        <div className="detail-body">
          {movie.overview && <p className="detail-overview">{movie.overview}</p>}

          <div className="detail-actions">
            <button type="button" className="btn btn-primary btn-lg" onClick={scrollToSessions}>
              <Icon name="ticket" size={18} />
              Choisir une séance
            </button>
            {movie.videoKey && (
              <a className="btn btn-ghost btn-lg" href={`https://www.youtube.com/watch?v=${movie.videoKey}`}
                target="_blank" rel="noopener noreferrer">
                <Icon name="play" size={16} />
                Bande-annonce
              </a>
            )}
          </div>

          {/* Séances */}
          <section className="sessions" ref={sessionsRef} aria-labelledby="sessions-title">
            <h2 id="sessions-title" className="sessions-title">Séances</h2>

            {sessLoading ? (
              <div className="sessions-status"><div className="spinner" />Chargement des séances…</div>
            ) : sessions.length === 0 ? (
              <div className="sessions-empty">
                <Icon name="calendar" size={20} />
                <p>Aucune séance programmée pour ce film pour le moment.</p>
              </div>
            ) : (
              <>
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

                <div className="time-grid">
                  {activeDateGroup?.sessions.map(s => {
                    const fmt = getRoomFormat(s.room?.name)
                    const capacity = s.room?.Capacity ?? s.room?.capacity ?? 0
                    const almostFull = capacity > 0 && capacity < 20
                    return (
                      <button key={s.id} type="button" className="time-tile" onClick={() => handleSessionClick(s)}>
                        <span className="time-tile-row">
                          <span className="time-tile-time num">{formatTime(s.startTime)}</span>
                          <span className={`format-badge format-${fmt}`}>{fmt}</span>
                        </span>
                        <span className="time-tile-room">{s.room?.name}</span>
                        <span className="time-tile-row time-tile-foot">
                          <span className="time-tile-price num">{formatPrice(s.price)}</span>
                          {capacity > 0 && (
                            <span className={`time-tile-cap ${almostFull ? 'is-low' : ''}`}>
                              {almostFull ? `${capacity} restantes` : `${capacity} places`}
                            </span>
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      {showLoginModal && (
        <LoginPromptModal
          onClose={() => setShowLoginModal(false)}
          from={`/movies/${movie.id}`}
        />
      )}
    </article>
  )
}
