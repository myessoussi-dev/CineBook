// Shared helpers: dates, durations, prices, rooms, TMDB image URLs

const LOCALE = 'en-GB'

export const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'
export const POSTER_SMALL = 'https://image.tmdb.org/t/p/w342'
export const POSTER_THUMB = 'https://image.tmdb.org/t/p/w185'
export const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original'
export const BACKDROP_MEDIUM = 'https://image.tmdb.org/t/p/w1280'

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' })
}

/** "Tuesday 20 October" */
export function formatDateLong(iso) {
  return new Date(iso).toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' })
}

/** "Tuesday 20 October 2026" */
export function formatDateFull(iso) {
  return new Date(iso).toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

/** "20 October 2026" */
export function formatReleaseDate(iso) {
  return new Date(iso).toLocaleDateString(LOCALE, { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Parts for a date tab: relative label ("Today", "Tomorrow") or weekday, day, month */
export function dayParts(iso) {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const relative =
    d.toDateString() === today.toDateString() ? 'Today'
    : d.toDateString() === tomorrow.toDateString() ? 'Tomorrow'
    : null
  return {
    relative,
    weekday: d.toLocaleDateString(LOCALE, { weekday: 'short' }),
    day: d.getDate(),
    month: d.toLocaleDateString(LOCALE, { month: 'short' }),
  }
}

/** 155 → "2h 35m" */
export function formatRuntime(runtime) {
  if (!runtime) return null
  const h = Math.floor(runtime / 60)
  const m = runtime % 60
  if (h === 0) return `${m}m`
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

/** 12.5 → "12.50 TND" */
export function formatPrice(value) {
  const n = parseFloat(value)
  if (Number.isNaN(n)) return '—'
  return `${n.toFixed(2)} TND`
}

export function getYear(releaseDate) {
  return releaseDate?.split('-')[0]
}

export function getRoomFormat(roomName = '') {
  const n = (roomName || '').toUpperCase()
  if (n.includes('IMAX')) return 'IMAX'
  if (n.includes('4DX')) return '4DX'
  if (n.includes('VIP')) return 'VIP'
  return '2D'
}

export function groupSessionsByDate(sessions) {
  const map = new Map()
  sessions.forEach(s => {
    const key = new Date(s.startTime).toDateString()
    if (!map.has(key)) map.set(key, { key, date: s.startTime, sessions: [] })
    map.get(key).sessions.push(s)
  })
  return [...map.values()]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(g => ({ ...g, sessions: g.sessions.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)) }))
}
