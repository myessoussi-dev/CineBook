import { useState, useEffect } from 'react'

function getToken() {
  return localStorage.getItem('cinebook_token')
}

function authHeaders() {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

// Fetch centralisé qui gère les 403 → clear auth
async function fetchWithAuth(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  })

  if (res.status === 403 || res.status === 401) {
    // Token expiré ou invalide → vider le localStorage
    localStorage.removeItem('cinebook_token')
    localStorage.removeItem('cinebook_user')
    const error = new Error('AUTH_ERROR')
    error.isAuthError = true
    throw error
  }

  return res
}

export function useMovies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchWithAuth(`/api/movies`)
      .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json() })
      .then(data => {
        const list = Array.isArray(data) ? data : data.content ?? data.data ?? []
        setMovies(list)
        setLoading(false)
      })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  return { movies, loading, error }
}

export function useMovieById(id) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setMovie(null)
    fetchWithAuth(`/api/movies/${id}`)
      .then(res => { if (!res.ok) throw new Error('Film non trouvé'); return res.json() })
      .then(data => { setMovie(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [id])

  return { movie, loading, error }
}

export function useMovieSessions(movieId) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!movieId) return
    setLoading(true)
    fetchWithAuth(`/api/movies/${movieId}/sessions`)
      .then(res => { if (!res.ok) throw new Error('Sessions introuvables'); return res.json() })
      .then(data => { setSessions(Array.isArray(data) ? data : data.content ?? []); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [movieId])

  return { sessions, loading, error }
}

export function useSessionDetails(sessionId) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [authError, setAuthError] = useState(false)

  useEffect(() => {
    if (!sessionId) return
    setLoading(true)
    fetchWithAuth(`/api/sessions/${sessionId}`)
      .then(res => { if (!res.ok) throw new Error('Session introuvable'); return res.json() })
      .then(data => { setSession(data); setLoading(false) })
      .catch(err => {
        if (err.isAuthError) setAuthError(true)
        setError(err.message)
        setLoading(false)
      })
  }, [sessionId])

  return { session, loading, error, authError }
}

export function useSessionSeats(sessionId) {
  const [seats, setSeats] = useState([])
  const [reservedIds, setReservedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(false)

  useEffect(() => {
    if (!sessionId) return
    setLoading(true)
    Promise.all([
      fetchWithAuth(`/api/sessions/${sessionId}/seats`).then(r => r.json()),
      fetchWithAuth(`/api/sessions/${sessionId}/reserved-seats`).then(r => r.json()),
    ])
      .then(([allSeats, reserved]) => {
        setSeats(Array.isArray(allSeats) ? allSeats : [])
        const ids = Array.isArray(reserved) ? reserved.map(s => typeof s === 'object' ? s.id : s) : []
        setReservedIds(ids)
        setLoading(false)
      })
      .catch(err => {
        if (err.isAuthError) setAuthError(true)
        setLoading(false)
      })
  }, [sessionId])

  return { seats, reservedIds, loading, authError }
}

export { fetchWithAuth};
