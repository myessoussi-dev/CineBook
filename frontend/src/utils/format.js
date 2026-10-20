// Helpers partagés (formatage des dates, durées, prix, salles, images TMDB)

export const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'
export const POSTER_SMALL = 'https://image.tmdb.org/t/p/w342'
export const POSTER_THUMB = 'https://image.tmdb.org/t/p/w185'
export const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original'
export const BACKDROP_MEDIUM = 'https://image.tmdb.org/t/p/w1280'

export function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateLong(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function formatDateFull(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatReleaseDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Libellé court pour un onglet de date : « Aujourd'hui », « Demain », ou { weekday, day, month } */
export function dayParts(iso) {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const relative =
    d.toDateString() === today.toDateString() ? "Aujourd'hui"
    : d.toDateString() === tomorrow.toDateString() ? 'Demain'
    : null
  return {
    relative,
    weekday: d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', ''),
    day: d.getDate(),
    month: d.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', ''),
  }
}

export function formatRuntime(runtime) {
  if (!runtime) return null
  const h = Math.floor(runtime / 60)
  const m = runtime % 60
  if (h === 0) return `${m} min`
  return m > 0 ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`
}

export function formatPrice(value) {
  const n = parseFloat(value)
  if (Number.isNaN(n)) return '—'
  return `${n.toFixed(2).replace('.', ',')} TND`
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
