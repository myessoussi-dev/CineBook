import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoginPromptModal from '../components/LoginPromptModal'
import Footer from '../components/Footer'
import Icon from '../components/Icon'
import {
  POSTER_SMALL, formatTime, formatDateFull, formatRuntime, getRoomFormat, groupSessionsByDate, dayParts, formatPrice,
} from '../utils/format'
import './SeancesPage.css'

function groupByMovie(sessions) {
  const map = new Map()
  sessions.forEach(s => {
    const key = s.movie?.id ?? 'unknown'
    if (!map.has(key)) map.set(key, { movie: s.movie, sessions: [] })
    map.get(key).sessions.push(s)
  })
  return [...map.values()]
}

export default function SeancesPage() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeDate, setActiveDate] = useState(null)
  const [loginFrom, setLoginFrom] = useState(null)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch(`/api/sessions/movies`)
        if (!res.ok) throw new Error('Erreur serveur')
        const data = await res.json()
        const list = Array.isArray(data) ? data : []
        setSessions(list)
      } catch (e) {
        setError('Impossible de charger les séances.')
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [])

  const grouped = useMemo(() => groupSessionsByDate(sessions), [sessions])
  const activeDay = grouped.find(g => g.key === activeDate) || grouped[0]
  const movieGroups = useMemo(() => activeDay ? groupByMovie(activeDay.sessions) : [], [activeDay])

  function openSession(s) {
    const path = `/movies/${s.movie?.id}/sessions/${s.id}/seats`
    if (!isAuthenticated) { setLoginFrom(`/movies/${s.movie?.id}`); return }
    navigate(path, { state: { session: s, movie: s.movie } })
  }

  return (
    <>
      <main className="page seances">
        <div className="container">
          <header className="page-head">
            <h1 className="display">Séances</h1>
            <p>Choisissez un jour, puis l'horaire qui vous convient.</p>
          </header>

          {loading && (
            <div className="seances-list">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="seance-row">
                  <div className="skeleton" style={{ aspectRatio: '2/3' }} />
                  <div>
                    <div className="skeleton" style={{ height: 22, width: '40%', marginBottom: 12 }} />
                    <div className="skeleton" style={{ height: 14, width: '25%', marginBottom: 20 }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div className="skeleton" style={{ height: 56, width: 110 }} />
                      <div className="skeleton" style={{ height: 56, width: 110 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="state">
              <div className="state-icon"><Icon name="wifi-off" size={24} /></div>
              <h2>{error}</h2>
              <p>Vérifiez votre connexion puis rechargez la page.</p>
              <button type="button" className="btn btn-primary" onClick={() => window.location.reload()}>Recharger la page</button>
            </div>
          )}

          {!loading && !error && sessions.length === 0 && (
            <div className="state">
              <div className="state-icon"><Icon name="calendar" size={24} /></div>
              <h2>Aucune séance programmée</h2>
              <p>Le programme de la semaine n'est pas encore disponible. En attendant, parcourez les films à l'affiche.</p>
              <Link to="/" className="btn btn-primary">Voir les films</Link>
            </div>
          )}

          {!loading && activeDay && (
            <>
              <div className="seances-dates scroll-x" role="tablist" aria-label="Jour">
                {grouped.map(g => {
                  const p = dayParts(g.date)
                  const active = g === activeDay
                  return (
                    <button key={g.key} type="button" role="tab" aria-selected={active}
                      className={`date-tab ${active ? 'is-active' : ''}`} onClick={() => setActiveDate(g.key)}>
                      <span className="date-tab-week">{p.relative || p.weekday}</span>
                      <span className="date-tab-day num">{p.day}</span>
                      <span className="date-tab-month">{p.month}</span>
                    </button>
                  )
                })}
              </div>

              <p className="seances-day">
                <span className="seances-day-date">{formatDateFull(activeDay.date)}</span>
                <span className="dim">
                  {movieGroups.length} film{movieGroups.length > 1 ? 's' : ''}, {activeDay.sessions.length} séance{activeDay.sessions.length > 1 ? 's' : ''}
                </span>
              </p>

              <div className="seances-list">
                {movieGroups.map(({ movie, sessions: ms }) => (
                  <article key={movie?.id ?? 'unknown'} className="seance-row">
                    <Link to={movie?.id ? `/movies/${movie.id}` : '#'} className="seance-poster" aria-label={movie?.title}>
                      {movie?.posterPath ? (
                        <img src={`${POSTER_SMALL}${movie.posterPath}`} alt="" loading="lazy" />
                      ) : (
                        <span className="seance-poster-empty"><Icon name="film" size={24} strokeWidth={1.4} /></span>
                      )}
                    </Link>

                    <div className="seance-main">
                      <div className="seance-info">
                        <h2 className="seance-title">
                          <Link to={movie?.id ? `/movies/${movie.id}` : '#'}>{movie?.title}</Link>
                        </h2>
                        <p className="seance-meta">
                          {[formatRuntime(movie?.runtime), ...(movie?.categories?.slice(0, 2).map(c => c.name) || [])]
                            .filter(Boolean).map((x, i) => <span key={i}>{x}</span>)}
                        </p>
                      </div>

                      <div className="seance-times">
                        {ms.map(s => {
                          const fmt = getRoomFormat(s.room?.name)
                          return (
                            <button key={s.id} type="button" className="seance-time" onClick={() => openSession(s)}
                              aria-label={`${formatTime(s.startTime)}, ${s.room?.name || ''}, ${fmt}`}>
                              <span className="seance-time-top">
                                <span className="seance-time-hour num">{formatTime(s.startTime)}</span>
                                <span className={`format-badge format-${fmt}`}>{fmt}</span>
                              </span>
                              <span className="seance-time-room">{s.room?.name}</span>
                              {s.price != null && <span className="seance-time-price num">{formatPrice(s.price)}</span>}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      {loginFrom && <LoginPromptModal onClose={() => setLoginFrom(null)} from={loginFrom} />}
    </>
  )
}
