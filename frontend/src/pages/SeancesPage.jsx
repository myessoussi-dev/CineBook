import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDayLabel(dateStr) {
  const d = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  if (d.toDateString() === today.toDateString()) return "Aujourd'hui"
  if (d.toDateString() === tomorrow.toDateString()) return 'Demain'
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatFullDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function getRoomFormat(name = '') {
  const n = name.toUpperCase()
  if (n.includes('IMAX')) return 'IMAX'
  if (n.includes('4DX')) return '4DX'
  if (n.includes('VIP')) return 'VIP'
  return '2D'
}

const FORMAT_COLORS = { IMAX: '#60a5fa', '4DX': '#a78bfa', VIP: '#e8a020', '2D': '#7a8394' }

function groupSessionsByDate(sessions) {
  const map = {}
  sessions.forEach(s => {
    const key = new Date(s.startTime).toDateString()
    if (!map[key]) map[key] = { dateKey: key, sessions: [] }
    map[key].sessions.push(s)
  })
  return Object.values(map).sort((a, b) => new Date(a.dateKey) - new Date(b.dateKey))
}

export default function SeancesPage() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeDate, setActiveDate] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch(`/api/sessions/movies`)
        if (!res.ok) throw new Error('Erreur serveur')
        const data = await res.json()
        const list = Array.isArray(data) ? data : []
        setSessions(list)
        if (list.length > 0) {
          setActiveDate(new Date(list[0].startTime).toDateString())
        }
      } catch (e) {
        setError('Impossible de charger les séances.')
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [])

  const grouped = groupSessionsByDate(sessions)
  const activeDayData = grouped.find(g => g.dateKey === activeDate)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      fontFamily: 'var(--font-body)',
      paddingTop: '100px',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 48px' }}>
        <p style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Programme
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', letterSpacing: '3px', color: 'var(--text-primary)', marginBottom: '6px' }}>
          SÉANCES
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Réservez vos places pour les prochaines séances disponibles.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 80px' }}>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '14px', padding: '60px 0' }}>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--accent)', animation: 'spin 0.8s linear infinite' }} />
            Chargement des séances...
          </div>
        )}

        {error && (
          <div style={{ padding: '60px 0', color: '#f87171', fontSize: '14px' }}>⚠ {error}</div>
        )}

        {!loading && !error && sessions.length === 0 && (
          <div style={{ padding: '60px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
            Aucune séance disponible pour le moment.
          </div>
        )}

        {!loading && grouped.length > 0 && (
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

            {/* Date sidebar */}
            <div style={{
              flexShrink: 0, width: '200px',
              position: 'sticky', top: '90px',
              display: 'flex', flexDirection: 'column', gap: '6px',
            }}>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
                Dates
              </p>
              {grouped.map(({ dateKey, sessions: ds }) => {
                const isActive = activeDate === dateKey
                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => setActiveDate(dateKey)}
                    style={{
                      textAlign: 'left', padding: '12px 16px',
                      borderRadius: '10px',
                      border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                      background: isActive ? 'rgba(232,160,32,0.08)' : 'transparent',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent' } }}
                  >
                    <p style={{ fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--accent)' : 'var(--text-primary)', marginBottom: '2px', textTransform: 'capitalize' }}>
                      {formatDayLabel(dateKey)}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                      {ds.length} séance{ds.length > 1 ? 's' : ''}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Sessions list */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {activeDayData && (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '2px', color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                      {formatDayLabel(activeDate)}
                    </h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      {formatFullDate(activeDate)}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activeDayData.sessions.map(s => {
                      const fmt = getRoomFormat(s.room?.name)
                      return (
                        <div
                          key={s.id}
                          onClick={() => navigate(
                            `/movies/${s.movie?.id}/sessions/${s.id}/seats`,
                            { state: { session: s, movie: s.movie } }
                          )}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '20px',
                            padding: '16px 20px',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            borderRadius: '12px',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(232,160,32,0.03)' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-secondary)' }}
                        >
                          {s.movie?.posterPath ? (
                            <img src={`${POSTER_BASE}${s.movie.posterPath}`} alt={s.movie?.title}
                              style={{ width: 48, height: 68, objectFit: 'cover', borderRadius: '6px', flexShrink: 0, border: '1px solid var(--border)' }} />
                          ) : (
                            <div style={{ width: 48, height: 68, borderRadius: '6px', background: 'var(--bg-card)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🎬</div>
                          )}

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {s.movie?.title}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>🏛 {s.room?.name}</span>
                              <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', color: FORMAT_COLORS[fmt], background: `${FORMAT_COLORS[fmt]}18`, border: `1px solid ${FORMAT_COLORS[fmt]}30`, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                                {fmt}
                              </span>
                              {s.movie?.categories?.slice(0, 2).map(c => (
                                <span key={c.id} style={{ fontSize: '11px', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '3px', padding: '1px 6px' }}>
                                  {c.name}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div style={{ flexShrink: 0, textAlign: 'right' }}>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                              {formatTime(s.startTime)}
                            </p>
                            <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>Réserver →</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
